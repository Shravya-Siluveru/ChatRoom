import { Injectable, Output, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from "./user.model";

@Injectable()
export class AuthService {

    user: User = null;
    isAdmin = false;
    // @Output() resetHeaderOnLogIn: EventEmitter<any> = new EventEmitter();

    constructor(private http: Http) {}

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/auth/signup', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/auth/signin', body, {headers: headers})
            .map((response: Response) => 
            { 
                if(response.json().isAdmin){
                    this.isAdmin = true;
                   // this.resetHeaderOnLogIn.emit({isLoggedIn: true, isAdmin: true});
                }else{
                    this.isAdmin = false;
                  //  this.resetHeaderOnLogIn.emit({isLoggedIn: true, isAdmin: false});
                }
                return response.json()
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
 
    logout() {
        console.log("in logout");
     //   this.resetHeaderOnLogIn.emit({isLoggedIn: false, isAdmin: false});
        return localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    } 

    getCurrentUser(){
        return localStorage.getItem('userName') ;
    }

    isUserAnAdmin() {
        return this.isAdmin;
    }
}