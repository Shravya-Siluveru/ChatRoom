import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-register',
    templateUrl: './registration.component.html'
})

export class RegistrationComponent implements OnInit{
    registrationForm : FormGroup;
    loadedFirst = true;
    alertMessage: string;
    errorMessage: string;
    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(){
        this.registrationForm = new FormGroup({
            fullname: new FormControl(null, [Validators.required, Validators.minLength(4)] ),
            username: new FormControl(null, [Validators.required, Validators.minLength(4)] ),
            dob: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            phone: new FormControl(null, Validators.required),
            gender: new FormControl('male', Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }

    onSubmit(){
        this.loadedFirst = false;
        if(this.registrationForm.valid){
        const user = new User(
            this.registrationForm.value.username,
            this.registrationForm.value.password,
            this.registrationForm.value.fullname,
            this.registrationForm.value.email,
                this.registrationForm.value.dob,
                this.registrationForm.value.phone,
                this.registrationForm.value.gender
        );
        this.authService.signup(user)
            .subscribe(
                data => {
                    if(data.message == "User created"){
                        this.router.navigate(['/signin', { message: 'Succesfully registered' }]);
                    }
                },
                error => {
                    this.errorMessage = error.error.message;
                }
            );
        }else{
            console.log("error in form");
            this.errorMessage = "Entered values are not valid";
        }
    }
}