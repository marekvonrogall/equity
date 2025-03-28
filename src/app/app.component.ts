import { Component } from '@angular/core';
import { InventoryComponent } from './components/inventory/inventory.component';
import { TradeBoxComponent } from './components/trade-box/trade-box.component';
import { RouterOutlet, Router } from '@angular/router';
import { SnipingComponent } from './sniping/sniping.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [InventoryComponent, TradeBoxComponent, RouterOutlet]
})
export class AppComponent {
  title = 'equity';
  tradeItems: { name: string; icon: string }[] = [];

  constructor(private router: Router) { }

  goToPage(page: string): void {
    console.log(`Navigating to ${page}`);
    this.router.navigate([`/${page.toLowerCase()}`]);
  }
}
