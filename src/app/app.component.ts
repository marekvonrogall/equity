import { Component } from '@angular/core';
import { InventoryComponent } from './components/inventory/inventory.component';
import { TradeBoxComponent } from './components/trade-box/trade-box.component';
import { TradeActionsComponent } from './components/trade-actions/trade-actions.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [InventoryComponent, TradeBoxComponent, TradeActionsComponent, RouterOutlet]
})
export class AppComponent {
  title = 'Equity';
  tradeItems: any[] = [];

  onSkinAddedToTrade(skin: any) {
    this.tradeItems.push(skin);
  }

  onItemRemoved(item: any) {
    this.tradeItems = this.tradeItems.filter(i => i !== item);
  }

  onAcceptTrade() {
    // Logik muss noch implementiert werden.
    console.log('Trade accepted', this.tradeItems);
  }

  onDeclineTrade() {
    // Logik muss noch implementiert werden.
    console.log('Trade declined');
  }
}
