import { Component } from '@angular/core';
import { InventoryComponent } from './components/inventory/inventory.component';
import { TradeBoxComponent } from './components/trade-box/trade-box.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [InventoryComponent, TradeBoxComponent, RouterOutlet] // ✅ Import components here
})
export class AppComponent {
  tradeItems: { name: string; icon: string }[] = [];
}
