import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

 
  @Output() skinAddedToTrade = new EventEmitter<{ side: 'your' | 'other', skin: Skin }>();
  @Output() partnerSteamIdChange = new EventEmitter<string>();

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
   
    this.yourSkins = [];
    this.otherSkins = [];
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
          : [];
        if (type === 'your') {
          this.yourSkins = skins;
        } else {
          this.otherSkins = skins;
        }
      },
      (error) => {
        console.error(`Error loading ${type} inventory:`, error);
        if (type === 'your') {
          this.yourSkins = [];
        } else {
          this.otherSkins = [];
        }
      }
    );
  }

  addToTrade(skin: Skin, side: 'your' | 'other') {
    if (skin.isAdded) return;
    skin.isAdded = true;
    this.skinAddedToTrade.emit({ side, skin });
  }

  openInspectLink(url: string): void {
    window.open(url, '_blank');
  }

  onPartnerSteamIdChange(newId: string) {
    this.otherSteamId = newId;
    console.log('Updated partner Steam ID:', this.otherSteamId);
  }
}