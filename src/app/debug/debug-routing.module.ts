import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebugComponent } from './debug/debug.component';
import { AudioSetsComponent } from './audio-sets/audio-sets.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DebugComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '' , canActivateChild: [AuthGuard],
        children: [ { path: 'audio-sets', component: AudioSetsComponent } ]
      },
      { path: '**', component: LoginComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebugRoutingModule { }
