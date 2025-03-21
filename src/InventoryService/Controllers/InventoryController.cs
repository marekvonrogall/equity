using Microsoft.AspNetCore.Mvc;

namespace InventoryService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public InventoryController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            string message = "works! (inventoryService)";
            return Ok(message);
        }

        [HttpPost("raw")]
        public async Task<IActionResult> GetRawInventory([FromBody] InventoryRequest inventoryRequest)
        {
            string url = $"https://steamcommunity.com/inventory/{inventoryRequest.SteamId}/730/2?l={inventoryRequest.Language}&count={inventoryRequest.Count}";

            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            else
            {
                return BadRequest(new
                {
                    message = "Failed to fetch data from the external service.",
                    statusCode = response.StatusCode
                });
            }
        }
    }
}