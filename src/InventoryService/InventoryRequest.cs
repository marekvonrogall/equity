using System.Text.Json.Serialization;

namespace InventoryService
{
    public class InventoryRequest
    {
        [JsonPropertyName("steamId")]
        public string SteamId { get; set; }

        [JsonPropertyName("language")]
        public string Language { get; set; }

        [JsonPropertyName("count")]
        public int Count { get; set; }
    }
}
