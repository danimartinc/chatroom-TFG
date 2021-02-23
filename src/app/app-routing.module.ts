import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';


import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ChatComponent } from './pages/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';
//import { ProfileComponent } from './pages/profile/profile.component';
//import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
//import { IsOwnerGuard } from './guards/is-owner.guard';



const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chat', canActivate: [AuthGuard],
     children:[
       {path: '', component: ChatComponent},
       {path: ':chatroomID', component: ChatComponent}
     ]},
  //{ path: 'profile/:userID', component: ProfileComponent, canActivate: [AuthGuard]},
  //{ path: 'profile/:userID/edit', component: EditProfileComponent, canActivate: [AuthGuard, IsOwnerGuard]},
  { path: '**', redirectTo: '/login' },
  
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
