import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() itemRemoved = new EventEmitter<any>();

  removeFromTrade(item: any) {
    item.isAdded = false;
    this.itemRemoved.emit(item);
  }
}