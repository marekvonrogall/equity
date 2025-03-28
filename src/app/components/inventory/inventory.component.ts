import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For ngModel

interface Asset {
  market_hash_name: string;
  icon_url: string;
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
  yourSkins: { name: string; icon: string }[] = [];
  otherSkins: { name: string; icon: string }[] = [];

  @Output() skinAddedToTrade = new EventEmitter<{ name: string; icon: string }>();

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    // Show placeholder skins by default
    this.yourSkins = this.getPlaceholderSkins();
    this.otherSkins = this.getPlaceholderSkins();
  }

  loadInventory(type: 'your' | 'other'): void {
    const steamId = type === 'your' ? this.yourSteamId : this.otherSteamId;

    if (!steamId) return;

    this.tradeService.getInventory(steamId).subscribe(
      (data) => {
        const skins = data?.assets?.map((asset: Asset) => ({
          name: asset.market_hash_name,
          icon: `https://steamcommunity-a.akamaihd.net/economy/image/${asset.icon_url}`
        })) ?? this.getPlaceholderSkins();

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

  getPlaceholderSkins(): { name: string; icon: string }[] {
    return [
      {
        name: 'AK-47 | Redline (Placeholder)',
        icon: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJz_bciZ0C5dI9xDRDbtUN5XufDFgA6WfNqWZ4N-KMj72TsiZ2ZtYmInMNnKlG6mJ0HpDO6QqNTTmeHqrxEf0ZK_zLYWcZQU3YgbYqjCOoY7nQ6jtxNXRlN6zSzjNzJcYo37mVptCl2FqFZ3OeVOtZ3zScAI_YVrYqVC4jw'
      },
      {
        name: 'AWP | Asiimov (Placeholder)',
        icon: 'https://steamcommunity-a.akamaihd.net/economy/image/Izvj6Z5vMjlsA2v43k3JrUHO-YvQX3gaIXDbnpIXUb_izbsjsv9aXxM_1kO8C0zP8ROXYDwfnMY4jDFFZP29pGHuA_Rfh9Zo6UxRoEKZ1FbA'
      }
    ];
  }

  addToTrade(skin: { name: string; icon: string }) {
    this.skinAddedToTrade.emit(skin);
  }
}