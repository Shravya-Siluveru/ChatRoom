import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../user.model";
import { AuthService } from "../auth.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit{
    loginForm : FormGroup;
    alertMessage: string;
    errorMessage: string;
    loadedFirst = true;
    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(){
        
        this.loginForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }

    onSubmit() {
        this.loadedFirst = false;
        if(this.loginForm.valid){
            const user = new User(this.loginForm.value.username, this.loginForm.value.password);
            this.authService.signin(user)
                .subscribe(
                    user => {
                        console.log(user);
                        if(user.isAdmin){
                            localStorage.setItem("isAdmin", user.isAdmin);
                            localStorage.setItem('token', user.token);
                            localStorage.setItem('userName', user.userName);                            
                            setTimeout(() => {
                                this.router.navigateByUrl('/admin');
                            }, 300);
                            
                        }else{
                            localStorage.setItem('isAdmin', user.isAdmin); 
                            localStorage.setItem('token', user.token);
                            localStorage.setItem('userName', user.userName);                            
                            setTimeout(() => {
                                this.router.navigateByUrl('/home');
                            }, 300);
                            
                        }
                    },
                    error => {
                        console.log(error);
                        this.errorMessage = error.error.message;
                    }
                );
        }else{
            this.loginForm.reset();
            console.log("error in form");
        }
    }
    
}