import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DebugRoutingModule } from './debug-routing.module';
import { DebugComponent } from './debug/debug.component';
import { AudioSetsComponent } from './audio-sets/audio-sets.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [DebugComponent, AudioSetsComponent, LoginComponent],
  imports: [
    CommonModule,
    DebugRoutingModule,
    FormsModule
  ]
})
export class DebugModule { }
