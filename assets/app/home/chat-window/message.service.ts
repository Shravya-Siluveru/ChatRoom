
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import * as io from 'socket.io-client';
import { Observable } from "rxjs";

import { Message } from './message.model';

@Injectable()
export class MessageService {

    private socket = io("http://localhost:3000");

    joinChat(data){
        this.socket.emit("JoinChat", data);
    }

    newUserJoined(){
        let observable = new Observable<Message>(observer=>{
            this.socket.on('NewUserJoinedNotification', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });
        return observable;
    }

    sendMessage(message: Message){
        this.socket.emit("Message", { sender: message.sender, message: message.message , time: message.time});
    }

    receiveMessage(){
        let observable = new Observable<Message>(observer=>{
            this.socket.on('NewMessage', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });
        return observable;
    }

    requestOnlineUsers(){
        this.socket.emit("GetOnlineUsers");
    }

    getOnlineUsers(){
        let observable = new Observable<{}>(observer=>{
            this.socket.on('SendOnlineUsers', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });
        return observable;
    }

    onUserLeavesChat(){
        let observable = new Observable<Message>(observer=>{
            this.socket.on('UserDisconnected', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });
        return observable;
    }
}