import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Asset {
  market_hash_name: string;
  icon_url: string;
}

export interface Skin {
  name: string;
  icon: string;
  exterior?: string;
  rarity?: string;
  color?: string;
  inspectLink?: string;
  isAdded?: boolean;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class InventoryComponent implements OnInit {
  yourSteamId: string = '';
  otherSteamId: string = '';
  yourSkins: Skin[] = [];
  otherSkins: Skin[] = [];

  @Output() skinAddedToTrade = new EventEmitter<Skin>();

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    
    this.yourSkins = this.getPlaceholderSkins();
    this.otherSkins = this.getPlaceholderSkins();
  }

  loadInventory(type: 'your' | 'other'): void {
    const steamId = type === 'your' ? this.yourSteamId : this.otherSteamId;
    if (!steamId) return;

    this.tradeService.getInventory(steamId).subscribe(
      (data) => {
        const skins: Skin[] = Array.isArray(data)
          ? data.map((item: any) => ({
              name: item.name,
              icon: item.iconUrl,
              exterior: item.exterior,
              rarity: item.rarity,
              color: item.color,
              inspectLink: item.inspectLink,
              isAdded: false
            }))
          : this.getPlaceholderSkins();

        if (type === 'your') {
          this.yourSkins = skins;
        } else {
          this.otherSkins = skins;
        }
      },
      (error) => {
        console.error(`Error loading ${type} inventory:`, error);
        if (type === 'your') {
          this.yourSkins = this.getPlaceholderSkins();
        } else {
          this.otherSkins = this.getPlaceholderSkins();
        }
      }
    );
  }

  getPlaceholderSkins(): Skin[] {
    return [
      {
        name: 'PP-Bizon | Candy Apple',
        exterior: 'Minimal Wear',
        rarity: 'Industrial Grade',
        color: '5e98d9',
        inspectLink: 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198964829211A42691556360D14035694936916972728',
        icon: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlfwPz3YzhG09C_k4if2a73Me2CxW5Sup1wj7HEptun31G280U6MWHydobBJA8-ZlnQ_QPryb_xxcjrlO1CYf0',
        isAdded: false
      },
      {
        name: 'Negev | Wall Bang',
        exterior: 'Field-Tested',
        rarity: 'Industrial Grade',
        color: '5e98d9',
        inspectLink: 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198964829211A42458760663D9541019220686385640',
        icon: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFf0Ob3fitH_sy3h5O0kOX1NYTfk2xU_vp8j-3I4IG73wHj-0s4ZGvyLdeWd1U2NVGB_gLvxujqhsC8vM_MzXBksyUm5nbVygv33081dXAwZw',
        isAdded: false
      }
    ];
  }
  
  addToTrade(skin: Skin) {
    if (skin.isAdded) return;
    skin.isAdded = true;
    this.skinAddedToTrade.emit(skin);
  }

  openInspectLink(url: string): void {
    window.open(url, '_blank');
  }
}