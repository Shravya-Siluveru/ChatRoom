import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { LogoutComponent } from "./auth/logout/logout.component";
import { RegistrationComponent } from "./auth/registration/registration.component";
import { HomeComponent } from "./home/home.component";
import { ChatWindowComponent } from "./home/chat-window/chat-window.component";
import { UsersListComponent } from "./home/users-list/users-list.component";
import { UserComponent } from "./user/user.component";
import { AdminComponent } from "./admin/admin.component";

export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signup', component: RegistrationComponent },
    { path: 'signin', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'home', component: HomeComponent },
    { path: 'user', component: UserComponent },
    { path: 'admin', component: AdminComponent },
    { path: '**', redirectTo: 'signin' }
];

export const routing = RouterModule.forRoot(AUTH_ROUTES );
