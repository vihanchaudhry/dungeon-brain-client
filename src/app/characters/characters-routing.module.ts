import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharactersComponent } from './characters.component';
import { CreateComponent } from './create/create.component';
import { AuthenticationGuard } from '../authentication/authentication.guard';

const routes: Routes = [
  { path: '', component: CharactersComponent },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'edit/:charId',
    component: CreateComponent,
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharactersRoutingModule {}
