import { Routes } from '@angular/router';
import { DiscListComponent } from './disc/list/list.component';
import { DetailsComponent } from './disc/details/details.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { LoginComponent } from './login/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: '/disks', pathMatch: 'full' }, // Redirect to /list by default
    { path: 'disks', component: DiscListComponent, data: { title: 'Album Details' } }, // also possible to set via subject/subscriber
    { path: 'disks/:id', component: DetailsComponent , data: { title: 'Disk Details' } },
    { path: 'register', component: RegistrationComponent , data: { title: 'New registration' } },
    { path: 'login', component: LoginComponent , data: { title: 'Login' } },
    { path: '**', redirectTo: '/disks' } // Redirect to /list for any unknown routes

];
