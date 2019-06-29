import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private configUrl = 'assets/config.json';

  constructor(private http: HttpClient) { }

  public getConfig() : Observable<any> {
    return this.http.get(this.configUrl).pipe(
      catchError((err:HttpErrorResponse) => {
        console.error(err);
        console.error("config.json not found");
        return of({});
    }));
  }
}
