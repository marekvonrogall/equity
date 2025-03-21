import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { CommonModule } from '@angular/common';

interface Asset {
  market_hash_name: string;
  icon_url: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  imports: [CommonModule]
})
export class InventoryComponent implements OnInit {
  skins: { name: string; icon: string }[] = [];

  @Output() skinAddedToTrade = new EventEmitter<{ name: string; icon: string }>();

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    const steamId = '76561198964829211'; 

    this.tradeService.getInventory(steamId).subscribe((data) => {
      if (data && data.assets) {
        this.skins = data.assets.map((asset: Asset) => ({
          name: asset.market_hash_name,
          icon: `https://steamcommunity-a.akamaihd.net/economy/image/${asset.icon_url}`
        }));
      } else {
        console.error('Invalid API response:', data);
      }
    }, error => {
      console.error('Error fetching inventory:', error);
    });
  }


  addToTrade(skin: { name: string; icon: string }) {
    console.log('Adding skin to trade:', skin);
    this.skinAddedToTrade.emit(skin); 
  }
}

