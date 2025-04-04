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

        private async Task<JsonElement> FetchHighestDiscount()
        {
            string url = "https://csfloat.com/api/v1/listings?sort_by=highest_discount&type=buy_now";
            HttpResponseMessage response = await httpClient2.GetAsync(url);
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
