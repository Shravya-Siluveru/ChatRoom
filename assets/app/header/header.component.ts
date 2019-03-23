import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{

    headerOptions = [ { key: 'JOIN', url: '/signup'}, 
    { key: 'ENTER', url: '/signin' } ];

    @Input('isAdmin') isAdmin:boolean = false;
    @Input('isLoggedIn') isLoggedIn:boolean = false;

    constructor(private authService: AuthService){}

    ngOnInit(){        
        this.generateNavLinks();
    }

    ngOnChanges() {
        this.generateNavLinks();
    }

    generateNavLinks() {
                
        if(this.isLoggedIn) {
            if(this.isAdmin) {
                this.headerOptions = [{ key: 'EXIT', url: '/logout' }];
            }
            else{
                this.headerOptions = [ { key: 'PROFILE', url: '/user' }, 
                                    { key: 'EXIT', url: '/logout' } ];
            }
        }else{
            this.headerOptions = [ { key: 'JOIN', url: '/signup'}, 
                                    { key: 'ENTER', url: '/signin' } ];
        }        
         
    }
}