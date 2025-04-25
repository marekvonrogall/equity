using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.IO.Compression;
using System.Net;

namespace FloatService.Controllers 
{
    [ApiController]
    [Route("[controller]")]
    public class FloatController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private JsonElement _cachedSkinportData;
        private DateTime _lastFetched;
        private Timer _timer;

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
        public IActionResult GetSkinportItems()
        {
            if (_lastFetched == DateTime.MinValue)
            {
                return BadRequest(new { message = "The connection is being rate limited." });
            }

            return Ok(_cachedSkinportData);
        }

        private async Task<JsonElement> FetchSkinportItems()
        {
            var url = "https://api.skinport.com/v1/items?app_id=730&currency=CHF&tradable=0";

            using (var requestMessage = new HttpRequestMessage(HttpMethod.Get, url))
            {
                requestMessage.Headers.Add("Accept-Encoding", "br");

                HttpResponseMessage response = await _httpClient.SendAsync(requestMessage);

                if (response.StatusCode == HttpStatusCode.TooManyRequests)
                {
                    _cachedSkinportData = JsonDocument.Parse("{\"rate_limit_exceeded\": true}").RootElement;
                    _lastFetched = DateTime.MinValue;
                    return _cachedSkinportData;
                }

                if (response.IsSuccessStatusCode)
                {
                    string content;
                    if (response.Content.Headers.ContentEncoding.Contains("br"))
                    {
                        using (var compressedStream = await response.Content.ReadAsStreamAsync())
                        using (var brotliStream = new BrotliStream(compressedStream, CompressionMode.Decompress))
                        using (var reader = new StreamReader(brotliStream))
                        {
                            content = await reader.ReadToEndAsync();
                        }
                    }
                    else
                    {
                        content = await response.Content.ReadAsStringAsync();
                    }

                    _cachedSkinportData = JsonDocument.Parse(content).RootElement;
                    _lastFetched = DateTime.Now;

                    return _cachedSkinportData;
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

        public void StartFetchingData()
        {
            _timer = new Timer(async _ =>
            {
                try
                {
                    await FetchSkinportItems();
                }
                catch {}
            }, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
        }
    }
}
