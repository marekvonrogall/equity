namespace FloatService
{
    public class SkinportItem
    {
        [System.Text.Json.Serialization.JsonPropertyName("market_hash_name")]
        public string MarketHashName { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("currency")]
        public string Currency { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("suggested_price")]
        public decimal? SuggestedPrice { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("item_page")]
        public string ItemPage { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("market_page")]
        public string MarketPage { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("min_price")]
        public decimal? MinPrice { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("max_price")]
        public decimal? MaxPrice { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("mean_price")]
        public decimal? MeanPrice { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("median_price")]
        public decimal? MedianPrice { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("quantity")]
        public int Quantity { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("created_at")]
        public long CreatedAt { get; set; }
    
        [System.Text.Json.Serialization.JsonPropertyName("updated_at")]
        public long UpdatedAt { get; set; }
    
        public decimal? Discount { get; set; }
    }
}
