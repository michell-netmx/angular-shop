import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/auth.interface';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

  private userCache: User | null = null;
  private userCacheTime: number | null = null;

  checkStatusResource = rxResource({
    loader: () => this.checkStatus()
  });

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  authStatus = computed<AuthStatus>( () => {
    if(this._authStatus() === 'checking'){
      return 'checking'
    }

    if(this._user()){
      return 'authenticated'
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email,
      password
    }).pipe(
      delay(3000),
      tap(resp => console.log({resp})),
      map(resp => this.handleAuthSuccess(resp) ),
      catchError( (error: any) => {
        throw this.handleAuthError(error);
      })
    );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if( !token ){
      this.logout();
      return of(false);
    }

    if(this.userCache && this.userCacheTime){
      const timeValidity = new Date();
      timeValidity.setHours(timeValidity.getHours() - 12);

      if(this.userCacheTime > timeValidity.getTime()){
        return of(true);
      }
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`,{
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).pipe(
      map(resp => {
        return this.handleAuthSuccess(resp);
      }),
      catchError( (error: any) => {
        throw this.handleAuthError(error);
      })
    );
  }

  logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);

    localStorage.clear();
  }

  private handleAuthSuccess( {token, user}: AuthResponse ){
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    this.userCache = user;
    this.userCacheTime = Date.now();
    localStorage.setItem('token', token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    throw new Error();
  }

  register(fullName: string ,email: string, password: string): Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      fullName,
      email,
      password
    }).pipe(
      delay(2000),
      tap(resp => console.log({resp})),
      map(resp => this.handleAuthSuccess(resp) ),
      catchError( (error: any) => {
        throw this.handleAuthError(error);
      })
    );
  }
}
