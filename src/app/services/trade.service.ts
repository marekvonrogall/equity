import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  

  constructor(private http: HttpClient) {}

  getInventory(steamId: string): Observable<any> {
    const url = 'https://equity.vrmarek.me/inv/raw';
    return this.http.get(url);
  }
}

