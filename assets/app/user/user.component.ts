import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html'
})

export class UserComponent implements OnInit {

    user: User ;
    loadedFirst = true;
    currentUser: string;
    display: string = 'none';
    editUserForm : FormGroup;
    public authIsAdmin:boolean = false;
    public authLoggedIn: boolean = false;

    constructor(private authService: AuthService, private http: Http, private router: Router){
        if(!this.authService.isLoggedIn()){
            this.router.navigateByUrl('/logout');
       } 
    }

    ngOnInit(){ 
        this.authIsAdmin = this.authService.isUserAnAdmin();
        this.authLoggedIn = this.authService.isLoggedIn();
        this.currentUser = this.authService.getCurrentUser();
        const headers = new Headers({'Content-Type': 'application/json'});
        this.http.get('http://localhost:3000/users/profile/'+this.currentUser, 
                      {headers: headers})
            .subscribe(
            (response: Response) =>  {
                const obj = response.json().obj;
                this.user = new User(obj.userName, '', obj.fullName, obj.email, 
                                     obj.dateOfBirth, obj.phone, obj.gender );
                let dob = new Date(obj.dateOfBirth).toISOString;
                this.editUserForm = new FormGroup({
                    fullname: new FormControl(this.user.fullName, Validators.required),
                    dob: new FormControl(obj.dateOfBirth.substring(0,10), Validators.required),
                    email: new FormControl(this.user.email, [
                        Validators.required,
                        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
                    ]),
                    phone: new FormControl(this.user.phone),
                    gender: new FormControl(this.user.gender),
                    password: new FormControl(this.user.password)
                });
            },error => {
                console.log(error.json());
                return Observable.throw(error.json());
            });
    }

    editUser(){
        this.display="block";
    }

    onClose(){
        this.display='none'; 
    }

    onSubmit(){
        this.loadedFirst = false;
        if(this.editUserForm.valid){
            var fullName = this.editUserForm.value.fullname;
            var email = this.editUserForm.value.email;
            var dateOfBirth =  this.editUserForm.value.dob;
            var phone =  this.editUserForm.value.phone;
            var gender =  this.editUserForm.value.gender;
            if(this.editUserForm.value.password.length > 0 )
                var password = this.editUserForm.value.password;
            this.updateUserDetails(fullName, email, dateOfBirth, gender, phone, password);
        }
        this.onClose();
    }

    private updateUserDetails(fullname, email, dateOfBirth, gender, phone, password){
        const body = JSON.stringify({ fullName: fullname, email: email, phone: phone, gender: gender,
                                    dateOfBirth: dateOfBirth, password: password });
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/users/update/'+this.currentUser, body, {headers: headers})
        .subscribe(
            response => {
                let user = response.json().obj;
                this.user.fullName = user.fullName;
                this.user.dateOfBirth = user.dateOfBirth;
                this.user.email = user.email;
                this.user.phone = user.phone;
                this.user.gender = user.gender;
                console.log(response.json());
            },
            error => console.error(error)
        );
    }
}