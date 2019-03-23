import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../users.service';
import { UserProfile } from './user-profile.model';
import { User } from '../../auth/user.model';
import { Router } from "@angular/router";
import { MessageService } from '../chat-window/message.service';
import { AuthService } from '../../auth/auth.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit{

    usersList = [];
    onlineUsers = [];
    clickedUser : UserProfile = null;
    display='none';

    constructor( private usersService: UsersService, private authService: AuthService,
                 private messageService: MessageService, private router: Router){
         if(!this.authService.isLoggedIn()){
             this.router.navigateByUrl('/logout');
        }   
     }

    ngOnInit(){
        this.usersService.getUsersList()
        .subscribe(
            (userProfiles: UserProfile[]) => {
                this.usersList = userProfiles;
            },
            error => console.error(error)
        );
        
        this.messageService.requestOnlineUsers();

        this.messageService.getOnlineUsers()
        .subscribe(
            (users) => {
               for(let i=0; i< users['onlineUsers'].length; i++){
                   if(!this.onlineUsers.includes(users['onlineUsers'][i].username)){
                        this.onlineUsers.push(users['onlineUsers'][i].username );
                   }
               }
            },
            error => console.error(error)
        ); 
    }

    openProfileAsModal(user: UserProfile){
        this.clickedUser = user;
        this.display="block";
    }
    
    onClose(){
        this.display='none'; 
        this.clickedUser = null;
    }
 
    }
