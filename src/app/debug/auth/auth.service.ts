import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { timeout, tap, delay } from 'rxjs/operators';

import md5 from 'js-md5';
import { ConfigService } from 'src/app/services/config/config.service';
// const md5 = require('js-md5');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = false;

  constructor(public http: HttpClient, public config: ConfigService) { }

  public login(password: string): Observable<boolean> {
    // return of(true).pipe(delay(3000), tap(val => this.isLoggedIn = true));
    const md5Password = md5(password);
    return this.http.post<boolean>(`${this.config.urlConfig.apiUrl}/debug/`, { key: md5Password }).pipe(
      tap(success => this.isLoggedIn = true)
    );
  }
}
