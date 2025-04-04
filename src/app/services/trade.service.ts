import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private readonly tradeOfferUrl = '/api/sendTradeOffer'; 

  constructor(private http: HttpClient) {}

  sendTradeOffer(payload: any): Observable<any> {
    return this.http.post<any>(this.tradeOfferUrl, payload);
  }
  

  getInventory(steamId: string): Observable<any> {
    const body = {
      steamId: steamId,
      language: 'english',
      count: 1000
    };
    
    return this.http.post<any>('https://equity.vrmarek.me/inv/pretty', body);
  }
}