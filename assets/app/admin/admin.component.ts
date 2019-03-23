import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Http, Headers, Response } from "@angular/http";
import { AuthService } from '../auth/auth.service';
import { UserProfile } from '../home/users-list/user-profile.model';
import { UsersService } from '../home/users.service';
import { User } from "../auth/user.model";
import { Router } from "@angular/router";


@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html'
})

export class AdminComponent implements OnInit{

    allUsers: UserProfile[];
    display = 'none';
    clickedUser: UserProfile;
    action: string;
    adminForm : FormGroup;
    errorMessage: string;
    alertMessage: string;
    public authIsAdmin:boolean = false;
    public authLoggedIn:boolean = false;

    constructor(private authService: AuthService, private usersService: UsersService,
                private http: Http, private router: Router){
                //    if(this.authService.isLoggedIn() || !this.authService.isAdmin){
                 //       this.router.navigateByUrl('/logout');
                  //  }
                }

    ngOnInit(){
        this.authIsAdmin = this.authService.isUserAnAdmin();
        this.authLoggedIn = this.authService.isLoggedIn();
        this.getAllUsers();
        this.adminForm = new FormGroup({
            fullname: new FormControl(null, [Validators.required, Validators.minLength(4)] ),
            username: new FormControl(null, [Validators.required, Validators.minLength(4)] ),
            dob: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            phone: new FormControl(null, Validators.required),
            gender: new FormControl('male', Validators.required),
            password: new FormControl(null)
        });
    }

    viewUserDetails(user){
        this.action = 'view';
        this.clickedUser = user;
        this.display = 'block';
    }

    addUser(){
        this.action = 'add';
        this.display = 'block';
    }

    editUser(user){
        this.action = 'edit';
        this.clickedUser = user;
        if(user){
        this.adminForm = new FormGroup({
            fullname: new FormControl(user.fullName, [Validators.required, Validators.minLength(4)] ),
            username: new FormControl(user.userName, [Validators.required, Validators.minLength(4)] ),
            dob: new FormControl(user.dateOfBirth, Validators.required),
            email: new FormControl(user.email, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            phone: new FormControl(user.phone, Validators.required),
            gender: new FormControl(user.gender, Validators.required),
            password: new FormControl(null)
        });
    }
    }

    deleteUser(user){
        this.action = 'delete';
        this.clickedUser = user;
        if(confirm("Are you sure to delete user "+user.fullName + " ?")) {
                const headers = new Headers({'Content-Type': 'application/json'});
                this.http.delete('http://localhost:3000/users/delete/'+this.clickedUser.userName, 
                {headers: headers})
                .subscribe(
                        response => {
                        this.alertMessage = response.json().message;
                },
                        error => console.error(error)
                );
                this.clearDisplay();
        }
    }

    onSubmit(){
        if(this.adminForm.valid){
            if(this.action == "add")
                this.addUserAction();
            else if(this.action == "edit" ){
                this.editUserAction();
            
            }else{
                console.log("error in form");
                this.errorMessage = "Entered values are not valid";
            }}
            this.adminForm = null;
    }

    private clearDisplay(){
        this.display = "none";
        this.clickedUser = null;
        this.errorMessage = null;
        this.alertMessage = null;
        this.action = null;
        this.adminForm = null;
        this.getAllUsers();
    }

    private addUserAction(){
        const user = new User(
            this.adminForm.value.username,
            this.adminForm.value.password,
            this.adminForm.value.fullname,
            this.adminForm.value.email,
            this.adminForm.value.dob,
            this.adminForm.value.phone,
            this.adminForm.value.gender
        );
        this.authService.signup(user)
            .subscribe(
                data => {
                    this.alertMessage = data.message;
                },
                error => {
                    this.errorMessage = error.error.title;
                }
            );
            this.clearDisplay();
    }

    private editUserAction(){
        const body = JSON.stringify({ fullName: this.adminForm.value.fullname, 
                                        userName: this.adminForm.value.userName, 
                                        email: this.adminForm.value.email, 
                                        phone: this.adminForm.value.phone, 
                                        gender: this.adminForm.value.gender,
                                        dateOfBirth: this.adminForm.value.dob });
        const headers = new Headers({'Content-Type': 'application/json'});
        this.http.post('http://localhost:3000/users/update/'+this.clickedUser.userName, body, 
                    {headers: headers})
        .subscribe(
            response => {
                this.alertMessage = response.json().message;
            },
            error => console.error(error)
        );
        this.clearDisplay();
    }

    private getAllUsers(){
        this.usersService.getUsersList()
        .subscribe(
            (userProfiles: UserProfile[]) => {
                this.allUsers = userProfiles;
            },
            error => console.error(error)
        );
    }
}