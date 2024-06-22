import { Inject, Injectable, inject } from '@angular/core';
import { userModel } from './userModel';
import { DataBaseService } from './data-base.service';
import { BehaviorSubject, Observable,  distinctUntilChanged, map, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private dbService: DataBaseService = inject(DataBaseService);
  private userSource = new BehaviorSubject<string>('');
  currentUser = this.userSource.asObservable();

  constructor() {
   }


  setUser(user: userModel) {
    this.userSource.next(user.username);
  }

  logout() {
    this.userSource.next('');
  }

  public createUser(user: userModel): Observable<boolean> {
    user.password = this.encodePassword(user.password); // simulate save password encoded for security 
    return this.dbService.createUser(user).pipe(map(x => {
      if (x)
        this.setUser(user);

      return x;
    }));
  }

  public isUserNameTaken(user: userModel): Observable<boolean> {
    return this.dbService.getUser(user.username).pipe(map(user => {
      return user != undefined;
    }));
  }

  public login(user: userModel): Observable<boolean> {
    return this.isUserExists(user).pipe(map(res => {
      if (res)
        this.setUser(user);

      return res;
    }));
  }

  public isUserExists(user: userModel): Observable<boolean> {
    return this.dbService.getUser(user.username).pipe(map(existing => {
      if (!existing)
        return false;

      return (existing.password == this.encodePassword(user.password))
    }));
  }





  // mock service to save password encrypted
  private encodePassword(password: string): string {
    return btoa(password);
  }

  private decodePassword(password: string): string {
    return atob(password);
  }

}
