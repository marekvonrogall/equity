import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface SkinportItem {
  market_hash_name: string;
  currency: string;
  suggested_price: number;
  min_price: number;
  max_price: number;
  mean_price: number;
  median_price: number;
  quantity: number;
  item_page: string;
  market_page: string;
  created_at: number;
  updated_at: number;
}

interface DisplayItem {
  name: string;
  skinportPrice: number;
  suggestedPrice: number;
  quantity: number;
}

@Component({
  selector: 'app-sniping',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sniping.component.html',
  styleUrls: ['./sniping.component.scss']
})
export class SnipingComponent implements OnInit {
  itemType: 'all' | 'knife' | 'pistol' | 'rifle' | 'smg' | 'heavy' | 'glove' = 'all';
  itemName: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  comparisonResults: DisplayItem[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // Skinport API endpoint
  private skinportApiEndpoint = 'https://equity.vrmarek.me/float/skinport';

  constructor(private http: HttpClient) {
    console.log('Sniping component initialized');
  }

  ngOnInit() {
    // Initialize component without loading data
  }

  compareMarkets() {
    this.isLoading = true;
    this.errorMessage = '';
    this.comparisonResults = [];

    console.log(`Searching for: ${this.itemName} (${this.itemType})`);
    console.log(`Price range: $${this.minPrice || 0} - $${this.maxPrice || 'max'}`);

    // Fetch data from Skinport API
    this.fetchSkinportItems();
  }

  fetchSkinportItems() {
    this.http.get<SkinportItem[]>(this.skinportApiEndpoint)
      .pipe(
        catchError(error => {
          console.error('Error fetching Skinport data:', error);
          this.errorMessage = 'Failed to fetch data from Skinport. Please try again later.';
          return of([] as SkinportItem[]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(items => {
        if (items && items.length > 0) {
          console.log(`Received ${items.length} items from Skinport`);
          this.processSkinportData(items);
        } else {
          console.log('No Skinport data received or empty array returned');
          this.errorMessage = 'No items found from Skinport.';
        }
      });
  }

  processSkinportData(skinportItems: SkinportItem[]) {
    // Filter items based on user criteria
    const filteredItems = skinportItems.filter(item => {
      // Apply name filter if provided
      if (this.itemName && !item.market_hash_name.toLowerCase().includes(this.itemName.toLowerCase())) {
        return false;
      }

      // Apply price filters if provided
      if (this.minPrice !== null && item.suggested_price < this.minPrice) {
        return false;
      }

      if (this.maxPrice !== null && item.suggested_price > this.maxPrice) {
        return false;
      }

      // Apply item type filter
      if (this.itemType !== 'all') {
        const typeMatches: Record<string, string[]> = {
          'knife': ['knife', 'bayonet', 'karambit', 'butterfly', 'huntsman', 'falchion', 'bowie', 'daggers', 'flip', 'gut', 'navaja', 'stiletto', 'talon', 'ursus', 'classic', 'paracord', 'skeleton', 'nomad', 'survival'],
          'pistol': ['pistol', 'deagle', 'desert eagle', 'p250', 'glock', 'usp-s', 'p2000', 'five-seven', 'tec-9', 'cz75', 'r8', 'dual berettas'],
          'rifle': ['ak-47', 'm4a4', 'm4a1-s', 'awp', 'ssg', 'aug', 'sg 553', 'scar-20', 'g3sg1', 'famas', 'galil'],
          'smg': ['mp7', 'mp9', 'p90', 'ump-45', 'mp5-sd', 'mac-10', 'pp-bizon'],
          'heavy': ['nova', 'mag-7', 'm249', 'negev', 'xm1014', 'sawed-off'],
          'glove': ['gloves', 'hand wraps', 'driver gloves', 'moto gloves', 'specialist gloves', 'sport gloves', 'bloodhound gloves', 'hydra gloves']
        };

        const matchTerms = typeMatches[this.itemType] || [];
        const itemNameLower = item.market_hash_name.toLowerCase();
        return matchTerms.some(term => itemNameLower.includes(term.toLowerCase()));
      }

      return true;
    });

    // Convert to simple DisplayItem format and limit to top 50 items
    this.comparisonResults = filteredItems.slice(0, 50).map(item => {
      return {
        name: item.market_hash_name,
        skinportPrice: item.min_price, // Use min_price as the actual price
        suggestedPrice: item.suggested_price,
        quantity: item.quantity
      };
    });

    // Sort by price (ascending)
    this.comparisonResults.sort((a, b) => a.skinportPrice - b.skinportPrice);

    if (this.comparisonResults.length === 0) {
      this.errorMessage = 'No items found matching your criteria. Try adjusting your filters.';
    }
  }
}
