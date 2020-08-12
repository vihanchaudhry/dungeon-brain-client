import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AuthenticationGuard } from './authentication/authentication.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'characters',
    loadChildren: () =>
      import('./characters/characters.module').then(m => m.CharactersModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        m => m.AuthenticationModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
