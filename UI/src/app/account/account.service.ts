import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { Login } from '../shared/models/login';
import { User } from '../shared/models/user';
import { environment } from 'src/environments/environment.development';
import { map, of, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSource = new ReplaySubject<User | null>(1);

  user$ = this.userSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  refreshUser(jwt: string | null){
    if(jwt === null){
      this.userSource.next(null);

      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this.http.get<User>(`${environment.apiUrl}/api/account/refresh-token`, {headers}).pipe(
      map((user: User) => {
        if(user){
          this.setUser(user);
        }
      })
    );
  }
  register(model: Register){
    return this.http.post(`${environment.apiUrl}/api/account/register`, model);
  }

  getJWT(){
    const key = localStorage.getItem(environment.userKey);
    if(key){
      const user : User = JSON.parse(key);
      return user.jwt;
    }
    else{
      return null;
    }
  }

  login(model: Login){
    return this.http.post<User>(`${environment.apiUrl}/api/account/login`, model).pipe(
    map((user : User) =>{
      if(user){
        this.setUser(user);
       // return user;
      }
    //  return null;
    })
  );
  }
  logout(){
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');
    }
  private setUser(user : User){
    localStorage.setItem(environment.userKey, JSON.stringify(user));

    this.userSource.next(user);

    this.user$.subscribe({
      next:(respones : any) => console.log(respones)
      
    })

  }
}
