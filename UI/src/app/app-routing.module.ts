import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { PlayComponent } from './play/play.component';
import { AuthorizationGuard } from './shared/guards/authorization.guard';
import { LoginComponent } from './account/login/login.component';

const routes: Routes = [

  {path: '', component:LoginComponent},
   {
     path:'',
     runGuardsAndResolvers: 'always',
     canActivate: [AuthorizationGuard],
     children:[
       {path:'play', component:PlayComponent}
     ]
   },
  {path:'account', loadChildren:()=> import('./account/account.module').then(module => module.AccountModule)},
  {path: 'not-found', component:NotFoundComponent},
 // {path: 'play', component:PlayComponent},
  {path: '**', component:NotFoundComponent, pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
