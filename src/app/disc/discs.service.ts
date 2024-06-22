import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, distinctUntilChanged, map, of } from 'rxjs';
import { discModel } from './disc.model';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DiscsService {

  private apiBaseUrl = environment.apiBaseUrl; //'https://musicbrainz.org/ws/2/recording/';
  // for faster fetch on single album
  private list: discModel[] = [];
  private title: string = 'Book store';
  // todo: we can change the title using subject instead of route data
  private titleSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(this.title)
  private searchHistory: string[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {
    const history = sessionStorage.getItem('history');
    if (history)
      this.searchHistory = JSON.parse(history);
  }

  public getTitle(): Observable<string> {
    return this.titleSubject$.asObservable();
  }

  public setTitle(title: string) {
    this.title = title;
    this.titleSubject$.next(title);
  }

  public getMyTopDiscs(): Observable<discModel[]> {
    // https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return this.http.get<any>(`${this.apiBaseUrl}/me/top/tracks?time_range=long_term&limit=5`).pipe(map(data => {
      this.list = data.recordings.map((release: any) => ({
        id: release.id,
        title: release.title,
        artist: release['artist-credit'][0].name,
        date: release['date'],
        // image: this.getImageUrl(release) // Extract image URL
      }));

      return this.list;
    }))
  }

  public getDisc(id: string): Observable<discModel> {
    // if (this.list.length) {
    //   const disc = this.list.find((x) => x.id == id);
    //   if (disc)
    //     return of(disc)
    // }

    return this.http.get<any>(`${this.apiBaseUrl}/albums/${id}`, { headers: this.getHeaders() }).pipe(map(data => {
      if (!data)
        throw new Error('An error ocuurred');
      else
        return {
          description: 'Some description',
          id: data.id,
          title: data.name,
          artist: data['artists'][0].name,
          date: data['release_date'],
          image: data.images.length > 0 ? data.images[0].url : null // Extract image URL
        }
    }))
  }

  public searchDisc(query: string): Observable<discModel[]> {
    return this.http.get<any>(`${this.apiBaseUrl}/search?q=${query}&type=album`, { headers: this.getHeaders() }).pipe(map(data => {
      this.list = data.albums.items.map((album: any) => ({
        id: album.id,
        title: album.name,
        artist: album.artists[0].name,
        date: album.release_date,
        image: album.images.length > 0 ? album.images[0].url : null
      }));
      this.addHistory(query);
      // for faster fetch on single
      return this.list;
    }))
  }

  private addHistory(query: string): void {
    if (this.searchHistory.length >= 5) {
      this.searchHistory.pop();
    }
    this.searchHistory.unshift(query);

    sessionStorage.setItem('history', JSON.stringify(this.searchHistory));
  }

  getHistory(): string[] {
    return this.searchHistory;
  }
  private getHeaders() {
    return {
      Authorization: `Bearer ${this.auth.getToken()}`
    }
  }
}