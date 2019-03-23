
import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from "../auth/user.model";
import { UserProfile } from "./users-list/user-profile.model";

@Injectable()
export class UsersService {

    userProfiles : UserProfile[];

    constructor(private http: Http) {}

    getUsersList() {
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3000/users', {headers: headers})
            .map((response: Response) =>  {
                    const allUsers = response.json().obj;
                    let keys = Object.keys(allUsers);
                    let profiles: UserProfile[] = [];
                    for(let key of keys){
                        profiles.push(new UserProfile(allUsers[key].userName,allUsers[key].fullName, 
                                        allUsers[key].dateOfBirth, allUsers[key].email,
                                        allUsers[key].gender, allUsers[key].phone));
                    }
                    this.userProfiles = profiles;
                    return profiles;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
/*
    setUserAsOnline(username){
        this.findProfileByUserName(username).setUserOnline();
        console.log(username + " online");
        console.log(this.userProfiles);
    }

    setUserAsOffline(username){
    //    this.findProfileByUserName(username).setUserOffline();
     //   console.log(username + " left");
      //  console.log(this.userProfiles);
    }

    findProfileByUserName(username: string){
        console.log(this.userProfiles);
        for(let i=0; i< this.userProfiles.length; i++){
            if(this.userProfiles[i].userName == username){
                return this.userProfiles[i];
            }
        }
    }*/
}