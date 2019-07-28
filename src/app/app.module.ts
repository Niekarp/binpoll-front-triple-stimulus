import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
import { PollPageComponent } from './pages/poll-page/poll-page.component';
import { FinishPageComponent } from './pages/finish-page/finish-page.component';
import { PolicyPageComponent } from './pages/policy-page/policy-page.component';
import { FurtherHelpDialogComponent } from './pages/headphones-test-page/further-help-dialog/further-help-dialog.component';
import { ReportProblemPageComponent } from './pages/report-problem-page/report-problem-page.component';
import { PlayAudioButtonComponent } from './common/ui-elements/play-audio-button/play-audio-button.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NavigationButtonComponent } from './common/ui-elements/navigation-button/navigation-button.component';
import { CreditsPageComponent } from './pages/credits-page/credits-page.component';
import { PollExamplePageComponent } from './pages/poll-example-page/poll-example-page.component';
import { AdditionalInformationPageComponent } from './pages/additional-information-page/additional-information-page.component';
import { AcousticScenesPageComponent } from './pages/acoustic-scenes-page/acoustic-scenes-page.component';
import { HeadphonesTestPageComponent } from './pages/headphones-test-page/headphones-test-page.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    QuestionnairePageComponent,
    PollDescriptionPageComponent,
    PollPageComponent,
    FinishPageComponent,
    PolicyPageComponent,
    FurtherHelpDialogComponent,
    ReportProblemPageComponent,
    PlayAudioButtonComponent,
    NavigationButtonComponent,
    CreditsPageComponent,
    PollExamplePageComponent,
    AdditionalInformationPageComponent,
    AcousticScenesPageComponent,
    HeadphonesTestPageComponent
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
    NgxSpinnerModule,
    DragDropModule
  ],
  providers: [],
  entryComponents: [
    FurtherHelpDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
