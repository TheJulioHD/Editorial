import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';

const routes: Routes = [
  {path:'', redirectTo:'Home', pathMatch:'full'},
  {path:'Home', component: HomeComponent, data:HomeComponent},
  {path:'registro', component: RegistroComponent, data:RegistroComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
