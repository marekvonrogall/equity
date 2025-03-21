import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trade-box',
  standalone: true,
  templateUrl: './trade-box.component.html',
  styleUrls: ['./trade-box.component.scss'],
  imports: [CommonModule]

})
export class TradeBoxComponent {
  @Input() tradeItems: any[] = [];

  removeFromTrade(item: any){
    this.tradeItems = this.tradeItems.filter(i => i !== item);
  }
}
