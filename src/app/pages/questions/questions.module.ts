import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../shared/pipes/pipes.module';
import { FinishComponent } from './components/finish/finish.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { QuestionModule } from './components/question/question.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { QuestionsPageComponent } from './containers/questions-page.component';
import { AnswerService } from './services/answer.service';
import { AppLauncherService } from './services/app-launcher.service';
import { QuestionsService } from './services/questions.service';
import { TimestampService } from './services/timestamp.service';

const routes: Routes = [
  {
    path: '',
    component: QuestionsPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    QuestionModule,
    PipesModule,
    FormsModule,
    IonicModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  declarations: [
    IntroductionComponent,
    QuestionsPageComponent,
    FinishComponent,
    ToolbarComponent,
  ],
  providers: [
    AnswerService,
    TimestampService,
    QuestionsService,
    AppLauncherService,
  ],
})
export class QuestionsModule {}
