import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'edit', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
