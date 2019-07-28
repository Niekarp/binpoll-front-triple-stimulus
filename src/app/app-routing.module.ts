import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { QuestionnairePageComponent } from './pages/questionnaire-page/questionnaire-page.component'
import { PollDescriptionPageComponent } from './pages/poll-description-page/poll-description-page.component';
import { HeadphonesTestComponent } from './pages/headphones-test/headphones-test.component';
import { PollPageComponent } from './pages/poll-page/poll-page.component';
import { FinishPageComponent } from './pages/finish-page/finish-page.component';
import { PolicyPageComponent } from './pages/policy-page/policy-page.component';
import { ReportProblemPageComponent } from './pages/report-problem-page/report-problem-page.component';
import { CreditsPageComponent } from './pages/credits-page/credits-page.component';
import { PollExamplePageComponent } from './pages/poll-example-page/poll-example-page.component';
import { AdditionalInformationPageComponent } from './pages/additional-information-page/additional-information-page.component';
import { AcousticScenesPageComponent } from './pages/acoustic-scenes-page/acoustic-scenes-page.component';

const routes: Routes = [
  { path: 'credits', component: CreditsPageComponent },
  { path: '', component: WelcomePageComponent },
  { path: 'questionnaire', component: QuestionnairePageComponent },
  { path: 'poll-description', component: PollDescriptionPageComponent },
  { path: 'acoustic-scenes', component: AcousticScenesPageComponent },
  { path: 'poll-example', component: PollExamplePageComponent },
  { path: 'additional-information', component: AdditionalInformationPageComponent },
  { path: 'headphones-test', component: HeadphonesTestComponent },
  { path: 'poll', component: PollPageComponent },
  { path: 'finish', component: FinishPageComponent },
  { path: 'policy', component: PolicyPageComponent },
  { path: 'report-problem', component: ReportProblemPageComponent },
  { path: '**', component: WelcomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
