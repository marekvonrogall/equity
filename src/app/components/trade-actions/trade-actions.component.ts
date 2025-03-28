import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trade-actions',
  standalone: true,
  templateUrl: './trade-actions.component.html',
  styleUrls: ['./trade-actions.component.scss'],
  imports: [CommonModule]
})
export class TradeActionsComponent {
  @Output() acceptTrade = new EventEmitter<void>();
  @Output() declineTrade = new EventEmitter<void>();
}