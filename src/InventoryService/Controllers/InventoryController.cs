using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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
            var data = await FetchInventoryData(inventoryRequest);
            return Ok(data);
        }

        [HttpPost("pretty")]
        public async Task<IActionResult> GetPrettyInventory([FromBody] InventoryRequest inventoryRequest)
        {
            var data = await FetchInventoryData(inventoryRequest);
            var prettyData = GeneratePrettyData(data, inventoryRequest);
            return Ok(prettyData);
        }

        private async Task<JsonElement> FetchInventoryData(InventoryRequest inventoryRequest)
        {
            string url = $"https://steamcommunity.com/inventory/{inventoryRequest.SteamId}/730/2?l={inventoryRequest.Language}&count={inventoryRequest.Count}";

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

        private object GeneratePrettyData(JsonElement data, InventoryRequest inventoryRequest)
        {
            var assetMap = new Dictionary<string, object>();

            // RAW JSON besteht aus zwei Teilen: assets & descriptions
            // Assets enthält wichtige infos für die items in descriptions, wir müssen sie also mappen

            foreach (var asset in data.GetProperty("assets").EnumerateArray())
            {
                string classid = asset.GetProperty("classid").ToString();
                assetMap[classid] = new
                {
                    assetid = asset.GetProperty("assetid").ToString(),
                    contextid = asset.GetProperty("contextid").ToString()
                };
            }

            var prettyItems = new List<object>();

            foreach (var item in data.GetProperty("descriptions").EnumerateArray())
            {
                string classid = item.GetProperty("classid").ToString();
                var assetData = assetMap.ContainsKey(classid) ? assetMap[classid] : new { assetid = "UNKNOWN_ASSET_ID", contextid = "UNKNOWN_CONTEXT_ID" };
                string assetId = assetData.GetType().GetProperty("assetid").GetValue(assetData).ToString();
                string contextId = assetData.GetType().GetProperty("contextid").GetValue(assetData).ToString();

                var exteriorFull = "N/A";
                if (item.TryGetProperty("tags", out JsonElement tagsElement))
                {
                    var exteriorTag = tagsElement.EnumerateArray()
                        .FirstOrDefault(tag => tag.GetProperty("category").ToString() == "Exterior");
                    if (exteriorTag.ValueKind != JsonValueKind.Undefined)
                    {
                        exteriorFull = exteriorTag.GetProperty("localized_tag_name").ToString();
                    }
                }

                var rarity = "N/A";
                var color = "#cccccc";
                if (item.TryGetProperty("tags", out JsonElement tagsRarityElement))
                {
                    var rarityTag = tagsRarityElement.EnumerateArray()
                        .FirstOrDefault(tag => tag.GetProperty("category").ToString() == "Rarity");
                    if (rarityTag.ValueKind != JsonValueKind.Undefined)
                    {
                        rarity = rarityTag.GetProperty("localized_tag_name").ToString();
                        color = rarityTag.GetProperty("color").ToString();
                    }
                }

                string marketLink = "";
                if (item.TryGetProperty("market_actions", out JsonElement marketActionsElement))
                {
                    var marketAction = marketActionsElement.EnumerateArray().FirstOrDefault();
                    if (marketAction.ValueKind != JsonValueKind.Undefined)
                    {
                        marketLink = marketAction.GetProperty("link").ToString();
                    }
                }

                var contextMatch = System.Text.RegularExpressions.Regex.Match(marketLink, @"D(\d+)$");
                string contextMatchId = contextMatch.Success ? contextMatch.Groups[1].Value : "UNKNOWN_CONTEXT_ID";

                string inspectLink = $"steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S{inventoryRequest.SteamId}A{assetId}D{contextMatchId}";

                prettyItems.Add(new
                {
                    name = item.GetProperty("name").ToString(),
                    exterior = exteriorFull,
                    rarity = rarity,
                    color = color,
                    inspectLink = inspectLink,
                    iconUrl = $"https://steamcommunity-a.akamaihd.net/economy/image/{item.GetProperty("icon_url").ToString()}"
                });
            }

            return prettyItems;
        }
    }
}