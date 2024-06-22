import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';
  private baseUrl: string = 'https://accounts.spotify.com/api/token'; // todo: get from environment

  constructor(private http: HttpClient) {
    this.token = this.getSpotifyKey();
  }

  ensureToken(): Observable<boolean> {
    if (!this.token)
      this.token = this.getSpotifyKey();

    if (this.token) {
      return of(true);
    }

    var client_id = '07eda191481f485ba20978399f10f826';
    var client_secret = '1e212e68cf0242a0acc59a8a799f798f';

    const headers = {
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
      'Content-Type': 'application/x-www-form-urlencoded;'
    };
    const body = 'grant_type=client_credentials';
    return this.http.post<spotifyKey>(this.baseUrl, body, { headers: headers }).pipe(map(data => {
      this.token = data.access_token;
      data.issued = new Date().getMilliseconds();
      localStorage.setItem('spotifyKey', JSON.stringify(data));
      return !!this.token;
    }))

  }

  getToken(): string {
    return this.token;
  }

  clearAuth() {
    localStorage.removeItem('spotifyKey');
    this.token = '';
  }

  private getSpotifyKey(): string {
    const d = localStorage.getItem('spotifyKey') || '';
    if (!d)
      return '';

    var data = JSON.parse(d) as spotifyKey;
    if (!data.access_token || !data.expires_in || !data.issued)
      return '';

    return this.isKeyExpired(data) ? '' : data.access_token;
  }

  private isKeyExpired(spotifyData: spotifyKey): boolean {
    if (!spotifyData.expires_in || !spotifyData.issued)
      return true;

    const d = new Date(spotifyData.issued);
    // add expiry time and add 1 minuet extra
    d.setDate(d.getSeconds() + spotifyData.expires_in + 60);
    return d > new Date();
  }
}

export interface spotifyKey {
  access_token: string //	An access token that can be provided in subsequent calls, for example to Spotify Web API services.
  token_type: string; //	How the access token may be used: always "Bearer".
  expires_in: number; //	The time period (in seconds) for which the access token is valid.
  issued: number;
}