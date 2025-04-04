import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface MarketItem {
  name: string;
  steamPrice?: number;
  csfloatPrice?: number;
  skinbaronPrice?: number;
  skinportPrice?: number;
  buffPrice?: number;
  bestDeal: string;
  dealSavings?: number;
}

@Component({
  selector: 'app-sniping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sniping.component.html',
  styleUrls: ['./sniping.component.scss']
})
export class SnipingComponent implements OnInit {
  itemType: 'all' | 'knife' | 'pistol' | 'rifle' | 'smg' | 'heavy' = 'all';
  itemName: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedMarketplaces: { [key: string]: boolean } = {
    steam: true,
    csfloat: true,
    skinbaron: true,
    skinport: true,
    buff: false
  };

  comparisonResults: MarketItem[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // WARNING: For testing only! These are placeholder keys and won't work
  private apiKeys = {
    // Replace these with actual test API keys if you have them
    steam: 'TEST_STEAM_KEY',
    csfloat: 'TEST_CSFLOAT_KEY',
    skinbaron: 'TEST_SKINBARON_KEY',
    skinport: 'TEST_SKINPORT_KEY',
    buff: 'TEST_BUFF_KEY'
  };

  // API endpoint URLs - these are placeholders and would need to be replaced with actual endpoints
  private apiEndpoints = {
    steam: 'https://steamcommunity.com/market/priceoverview',
    csfloat: 'https://csfloat.com/api/v1/listings',
    skinbaron: 'https://api.skinbaron.com/v2/get_items',
    skinport: 'https://api.skinport.com/v1/items',
    buff: 'https://api.buff.163.com/api/market/goods'
  };

  constructor(private http: HttpClient) {
    console.log('Sniping component initialized');
  }

  ngOnInit() {
    // Load some demo data on initialization for testing
    setTimeout(() => {
      this.comparisonResults = this.getDemoData();
    }, 500);
  }

  compareMarkets() {
    this.isLoading = true;
    this.errorMessage = '';

    console.log(`Searching for: ${this.itemName} (${this.itemType})`);
    console.log(`Price range: $${this.minPrice || 0} - $${this.maxPrice || 'max'}`);
    console.log('Selected marketplaces:',
      Object.entries(this.selectedMarketplaces)
        .filter(([_, selected]) => selected)
        .map(([name]) => name)
    );

    // For testing, we'll simulate API calls with timeouts
    setTimeout(() => {
      try {
        // In a real implementation, you'd make actual API calls here
        // For now, we'll just use demo data
        this.comparisonResults = this.getDemoData().filter(item => {
          // Apply filters
          if (this.itemName && !item.name.toLowerCase().includes(this.itemName.toLowerCase())) {
            return false;
          }

          if (this.minPrice !== null && this.getBestPrice(item) < this.minPrice) {
            return false;
          }

          if (this.maxPrice !== null && this.getBestPrice(item) > this.maxPrice) {
            return false;
          }

          if (this.itemType !== 'all') {
            // Simple type filtering - in a real app this would be more sophisticated
            const typeMatches: Record<string, string[]> = {
              'knife': ['knife', 'bayonet', 'karambit', 'butterfly'],
              'pistol': ['pistol', 'deagle', 'p250', 'glock', 'usp-s'],
              'rifle': ['ak-47', 'm4a4', 'm4a1-s', 'awp', 'ssg'],
              'smg': ['mp7', 'mp9', 'p90', 'ump-45'],
              'heavy': ['nova', 'mag-7', 'm249', 'negev'],
            };

            const matchTerms = typeMatches[this.itemType] || [];
            return matchTerms.some(term =>
              item.name.toLowerCase().includes(term.toLowerCase())
            );
          }

          return true;
        });

        this.isLoading = false;

        if (this.comparisonResults.length === 0) {
          this.errorMessage = 'No items found matching your criteria. Try adjusting your filters.';
        }
      } catch (error) {
        console.error('Error during search:', error);
        this.errorMessage = 'An error occurred while processing your search.';
        this.isLoading = false;
      }
    }, 1500); // Simulate API delay
  }

  getBestPrice(item: MarketItem): number {
    const prices = [
      item.steamPrice,
      item.csfloatPrice,
      item.skinbaronPrice,
      item.skinportPrice,
      item.buffPrice
    ].filter(price => price !== undefined) as number[];

    return Math.min(...prices);
  }

  // This simulates API responses for testing
  getDemoData(): MarketItem[] {
    return [
      {
        name: 'AWP | Asiimov (Field-Tested)',
        steamPrice: 95.23,
        csfloatPrice: 92.50,
        skinbaronPrice: 89.99,
        skinportPrice: 94.00,
        buffPrice: 84.50,
        bestDeal: 'buff',
        dealSavings: 5.49
      },
      {
        name: 'AK-47 | Redline (Field-Tested)',
        steamPrice: 15.23,
        csfloatPrice: 14.80,
        skinbaronPrice: 15.99,
        skinportPrice: 14.50,
        buffPrice: 13.75,
        bestDeal: 'buff',
        dealSavings: 1.48
      },
      {
        name: 'Butterfly Knife | Doppler (Factory New)',
        steamPrice: 1250.00,
        csfloatPrice: 1195.00,
        skinbaronPrice: 1210.00,
        skinportPrice: 1180.00,
        buffPrice: 1150.00,
        bestDeal: 'buff',
        dealSavings: 100.00
      },
      {
        name: 'M4A4 | The Emperor (Minimal Wear)',
        steamPrice: 47.50,
        csfloatPrice: 44.99,
        skinbaronPrice: 45.75,
        skinportPrice: 43.50,
        buffPrice: 45.00,
        bestDeal: 'skinport',
        dealSavings: 4.00
      },
      {
        name: 'Glock-18 | Water Elemental (Factory New)',
        steamPrice: 18.75,
        csfloatPrice: 17.25,
        skinbaronPrice: 17.50,
        skinportPrice: 17.99,
        buffPrice: 16.80,
        bestDeal: 'buff',
        dealSavings: 1.95
      },
      {
        name: 'Karambit | Fade (Factory New)',
        steamPrice: 1800.00,
        csfloatPrice: 1750.00,
        skinbaronPrice: 1705.00,
        skinportPrice: 1725.00,
        buffPrice: 1680.00,
        bestDeal: 'buff',
        dealSavings: 120.00
      },
      {
        name: 'USP-S | Kill Confirmed (Field-Tested)',
        steamPrice: 120.50,
        csfloatPrice: 115.75,
        skinbaronPrice: 110.25,
        skinportPrice: 112.00,
        buffPrice: 108.50,
        bestDeal: 'buff',
        dealSavings: 12.00
      }
    ];
  }

  // In a real implementation, these would actually call the APIs
  // For testing, we're providing these methods to show what real implementation would look like

  private fetchSteamPrices() {
    // Steam Market API doesn't have a direct API with authentication
    // In a real app, you'd need to use a proxy server to fetch data
    const params = {
      appid: '730', // CS2 (formerly CS:GO)
      currency: '1', // USD
      market_hash_name: this.itemName
    };

    console.log('Fetching Steam prices:', params);
    // In reality: return this.http.get(this.apiEndpoints.steam, { params });
  }

  private fetchCSFloatPrices() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKeys.csfloat}`
    });

    const params = {
      limit: '20',
      category: this.itemType !== 'all' ? this.itemType : undefined,
      name: this.itemName || undefined,
      min_price: this.minPrice?.toString(),
      max_price: this.maxPrice?.toString()
    };

    console.log('Fetching CSFloat prices:', params);
    // In reality: return this.http.get(this.apiEndpoints.csfloat, { headers, params });
  }

  private fetchSkinbaronPrices() {
    const params = {
      apikey: this.apiKeys.skinbaron,
      appid: '730',
      search_item: this.itemName || '',
      min_price: this.minPrice ? this.minPrice * 100 : undefined, // Some APIs use cents
      max_price: this.maxPrice ? this.maxPrice * 100 : undefined
    };

    console.log('Fetching Skinbaron prices:', params);
    // In reality: return this.http.get(this.apiEndpoints.skinbaron, { params });
  }

  private fetchSkinportPrices() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKeys.skinport}`
    });

    const params = {
      game: 'csgo',
      currency: 'USD',
      limit: '50'
    };

    console.log('Fetching Skinport prices:', params);
    // In reality: return this.http.get(this.apiEndpoints.skinport, { headers, params });
  }

  private fetchBuffPrices() {
    // BUFF requires special handling, often through a proxy
    console.log('BUFF API requires special handling, often not directly accessible from frontend');
    // In reality: You'd use a backend service to access BUFF
  }
}
