import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector:'app-trade-actions',
  templateUrl: './trade-actions.component.html',
  styleUrls: ['./trade-actions.component.scss']
})
export class TradeActionsComponent {
  @Output() acceptTrade = new EventEmitter<void>();
  @Output() declineTrade = new EventEmitter<void>();
}