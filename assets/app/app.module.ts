import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { routing } from "./app.routing";
import { AppComponent } from "./app.component";
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AuthService } from './auth/auth.service';
import { HomeComponent } from './home/home.component';
import { UsersListComponent } from './home/users-list/users-list.component';
import { ChatWindowComponent } from './home/chat-window/chat-window.component';
import { UsersService } from './home/users.service';
import { MessageService } from './home/chat-window/message.service';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { LogoutComponent } from './auth/logout/logout.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        LoginComponent,
        LogoutComponent,
        RegistrationComponent,
        HomeComponent,
        UsersListComponent,
        ChatWindowComponent,
        UserComponent,
        AdminComponent
    ],
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, routing],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AuthService, UsersService, MessageService],
    bootstrap: [AppComponent]
})

export class AppModule {

}