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
        private List<SkinportItem> _sortedSkinportItems;
        private Timer _timer;

        public FloatController(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _sortedSkinportItems = new List<SkinportItem>();
        }

        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            string message = "works! (floatService)";
            return Ok(message);
        }

        [HttpGet("highest_discount")]
        public IActionResult GetHighestDiscounted()
        {
            if (_sortedSkinportItems == null)
            {
                return BadRequest(new { message = "No data available." });
            }

            return Ok(_sortedSkinportItems.Take(50));
        }

        [HttpGet("skinport")]
        public IActionResult GetSkinportItems()
        {
            if (_sortedSkinportItems == null)
            {
                return Ok(_cachedSkinportData);
            }
            return BadRequest(new { message = "The connection is being rate limited." });
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

                    ProcessAndSortSkinportData(_cachedSkinportData);

                    return _cachedSkinportData;
                }
                else
                {
                    throw new HttpRequestException("Failed to fetch data from Skinport.");
                }
            }
        }

        private void ProcessAndSortSkinportData(JsonElement data)
        {
            var items = JsonSerializer.Deserialize<List<SkinportItem>>(data.ToString());

            foreach (var item in items)
            {
                item.Discount = CalculateDiscount(item.SuggestedPrice, item.MinPrice);
            }

            _sortedSkinportItems = items
                .Where(i => i.Discount.HasValue)
                .OrderByDescending(i => i.Discount)
                .ToList();
        }

        private decimal? CalculateDiscount(decimal? suggestedPrice, decimal? minPrice)
        {
            if (suggestedPrice.HasValue && minPrice.HasValue && minPrice.Value < suggestedPrice.Value)
            {
                return ((suggestedPrice.Value - minPrice.Value) / suggestedPrice.Value) * 100;
            }
            return null;
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
