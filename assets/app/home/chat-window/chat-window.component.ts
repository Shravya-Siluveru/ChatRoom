import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { AuthService } from '../../auth/auth.service';
import { Message } from './message.model';
import { UsersService } from '../users.service';
import { UsersListComponent } from '../users-list/users-list.component';
import { Router } from "@angular/router";

@Component({
    selector: 'app-chat-window',
    templateUrl: './chat-window.component.html',
    styleUrls: ['./chat-window.component.css']
})

export class ChatWindowComponent implements OnInit {

    currentUser: string ;
    allMessages: Message[] = [];
    newMessage: string;
    
    constructor(private messageService: MessageService, private authService: AuthService,
                private usersService: UsersService, private router: Router){

        if(!this.authService.isLoggedIn()){
            this.router.navigateByUrl('/logout');
        }
        this.currentUser = this.authService.getCurrentUser();
                    
        this.messageService.newUserJoined()
        .subscribe( data => {
            this.allMessages.push(
                new Message( data.user, data.message, data.time, true )
            );
        },
        error => {
            console.log(error);
        });

        this.messageService.receiveMessage()
        .subscribe( data => {
            this.allMessages.push(
                new Message( data.sender, data.message, data.time, false )
            );
        },
        error => {
            console.log(error);
        });

        this.messageService.onUserLeavesChat()
        .subscribe( data => {
            this.allMessages.push(
             //   new Message( data.user, data.message, data.time, true )
            );
        },
        error => {
            console.log(error);
        });
    }

    ngOnInit(){
        this.messageService.joinChat(this.currentUser);
    }

    sendMessage(){
        this.messageService.sendMessage(new Message(this.currentUser, this.newMessage, new Date()));
        this.newMessage = '';
    }
}