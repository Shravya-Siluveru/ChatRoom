import { Component, Output, EventEmitter } from '@angular/core';
import { UserProfile } from './users-list/user-profile.model';
import { AuthService } from '../auth/auth.service';
import { Router } from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    
    public authIsAdmin:boolean = false;
    public authLoggedIn:boolean = false;
    
    constructor(private authService: AuthService, private router: Router){
        if(!this.authService.isLoggedIn()){
            this.router.navigateByUrl('/logout');
        }
    }

    ngOnInit() {
        this.authIsAdmin = this.authService.isUserAnAdmin();
        this.authLoggedIn = this.authService.isLoggedIn();
    }
}