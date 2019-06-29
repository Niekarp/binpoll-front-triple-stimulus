import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { 
  MatIconModule,
  MatButtonModule,
  MatGridListModule,
  MatFormFieldModule,
  MatSelectModule,
  MatRadioModule,
  MatInputModule,
  MatCardModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatDialogModule,
  MatListModule,
  MatCheckboxModule,
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { QuestionnairePageComponent } from './pages/questionnaire-page/questionnaire-page.component';
import { PollDescriptionPageComponent } from './pages/poll-description-page/poll-description-page.component';
import { TermsSoundsPageComponent } from './pages/terms-sounds-page/terms-sounds-page.component';
import { TermsFrontScenePageComponent } from './pages/terms-front-scene-page/terms-front-scene-page.component';
import { TermsBackScenePageComponent } from './pages/terms-back-scene-page/terms-back-scene-page.component';
import { TermsAllAroundScenePageComponent } from './pages/terms-all-around-scene-page/terms-all-around-scene-page.component';
import { HeadphonesTestComponent } from './pages/headphones-test/headphones-test.component';
import { PollPageComponent } from './pages/poll-page/poll-page.component';
import { FinishPageComponent } from './pages/finish-page/finish-page.component';
import { PolicyPageComponent } from './pages/policy-page/policy-page.component';
import { FurtherHelpDialogComponent } from './pages/headphones-test/further-help-dialog/further-help-dialog.component';
import { ReportProblemPageComponent } from './pages/report-problem-page/report-problem-page.component';
import { PlayAudioButtonComponent } from './common/ui-elements/play-audio-button/play-audio-button.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NavigationButtonComponent } from './common/ui-elements/navigation-button/navigation-button.component';
import { CreditsPageComponent } from './pages/credits-page/credits-page.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    QuestionnairePageComponent,
    PollDescriptionPageComponent,
    TermsSoundsPageComponent,
    TermsFrontScenePageComponent,
    TermsBackScenePageComponent,
    TermsAllAroundScenePageComponent,
    HeadphonesTestComponent,
    PollPageComponent,
    FinishPageComponent,
    PolicyPageComponent,
    FurtherHelpDialogComponent,
    ReportProblemPageComponent,
    PlayAudioButtonComponent,
    NavigationButtonComponent,
    CreditsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatCheckboxModule,
    HttpClientModule,
    NgxSpinnerModule
  ],
  providers: [],
  entryComponents: [
    FurtherHelpDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
