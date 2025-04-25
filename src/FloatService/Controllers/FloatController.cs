using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FloatService.Controllers 
{
    [ApiController]
    [Route("[controller]")]
    public class FloatController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public FloatController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            string message = "works! (floatService)";
            return Ok(message);
        }

        [HttpGet("highest_discount")]
        public async Task<IActionResult> GetHighestDiscounted()
        {
            var data = await FetchHighestDiscount();
            return Ok(data);
        }

        [HttpGet("skinport")]
        public async Task<IActionResult> GetSkinportItems()
        {
            var data = await FetchSkinportItems();
            return Ok(data);
        }

        private async Task<JsonElement> FetchSkinportItems()
        {
            var url = "https://api.skinport.com/v1/items?app_id=730&currency=CHF&tradable=0";
            
            using (var requestMessage = new HttpRequestMessage(HttpMethod.Get, url))
            {
                requestMessage.Headers.Add("Accept-Encoding", "br");

                HttpResponseMessage response = await _httpClient.SendAsync(requestMessage);

                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    return JsonDocument.Parse(content).RootElement;
                }
                else
                {
                    throw new HttpRequestException("Failed to fetch data from Skinport.");
                }
            }
        }

        private async Task<JsonElement> FetchHighestDiscount()
        {
            string url = "https://csfloat.com/api/v1/listings?sort_by=highest_discount&type=buy_now";
            HttpResponseMessage response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                return JsonDocument.Parse(content).RootElement;
            }
            else
            {
                throw new HttpRequestException("Failed to fetch data from the external service.");
            }
        }
    }
}
