import { Routes } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';
import { TradeBoxComponent } from './components/trade-box/trade-box.component';

export const routes: Routes = [
  { path: '', component: InventoryComponent },
  { path: 'trade', component: TradeBoxComponent }
];