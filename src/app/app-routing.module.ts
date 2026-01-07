import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { NoFoundComponent } from './pages/no-found/no-found.component';
import { HelpComponent } from './pages/help/help.component';

const routes: Routes = [
  {path:'', redirectTo:'Home', pathMatch:'full'},
  {path:'Home', component: HomeComponent, data:HomeComponent},
  {path:'registro', component: RegistroComponent, data:RegistroComponent},
  {path:'add-user', component: AddUserComponent, data:AddUserComponent},
  {path:'help', component: HelpComponent, data:HelpComponent},
  {path:'**', component:NoFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
