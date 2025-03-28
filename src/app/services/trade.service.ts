import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private readonly url = 'https://equity.vrmarek.me/inv/pretty';

  constructor(private http: HttpClient) {}

  getInventory(steamId: string): Observable<any> {
    const body = {
      steamId: steamId,
      language: 'english',
      count: 1000
    };
    return this.http.post<any>(this.url, body);
  }
}