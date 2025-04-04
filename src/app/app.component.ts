import { Component } from '@angular/core';
import { InventoryComponent } from './components/inventory/inventory.component';
import { TradeBoxComponent } from './components/trade-box/trade-box.component';
import { TradeActionsComponent } from './components/trade-actions/trade-actions.component';
import { RouterOutlet } from '@angular/router';
import { Skin } from './components/inventory/inventory.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [InventoryComponent, TradeBoxComponent, TradeActionsComponent, RouterOutlet]
})
export class AppComponent {
  title = 'Equity';
  yourOffer: Skin[] = [];
  otherOffer: Skin[] = [];
  otherSteamId: string = '';

  onSkinAddedToTrade(event: { side: 'your' | 'other'; skin: Skin }) {
    if (event.side === 'your') {
      this.yourOffer.push(event.skin);    
    } else {
      this.otherOffer.push(event.skin);  
    }
  }

  onItemRemoved(item: Skin, side: 'your' | 'other') {
    if (side === 'your') {
      this.yourOffer = this.yourOffer.filter(i => i !== item);
    } else {
      this.otherOffer = this.otherOffer.filter(i => i !== item);
    }
  }

  onPartnerSteamIdChange(id: string) {
    this.otherSteamId = id;
  }

  onSendOffer() {
    const payload = {
      partnerSteamId: this.otherSteamId, 
      yourOffer: this.yourOffer,     
      otherOffer: this.otherOffer     
    };
    //Has to be fixed
    /*
    this.http.post('/api/sendTradeOffer', payload).subscribe(
      (response) => {
        console.log('Trade offer sent successfully:', response);
      },
      (error) => {
        console.error('Error sending trade offer:', error);
      }
    );
    */
  }

 
}