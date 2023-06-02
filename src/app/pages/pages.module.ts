import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertService } from '../core/services/misc/alert.service';
import { GithubClient } from '../core/services/misc/github-client.service';
import { LocalizationService } from '../core/services/misc/localization.service';
import { LocalScheduleService } from '../core/services/schedule/local-schedule.service';
import { ScheduleFactoryService } from '../core/services/schedule/schedule-factory.service';
import { ScheduleGeneratorService } from '../core/services/schedule/schedule-generator.service';
import { ScheduleService } from '../core/services/schedule/schedule.service';
import { StorageService } from '../core/services/storage/storage.service';
import { PipesModule } from '../shared/pipes/pipes.module';
import { TranslatePipe } from '../shared/pipes/translate/translate';
import { QuestionsModule } from './questions/questions.module';

@NgModule({
  imports: [PipesModule, CommonModule, QuestionsModule],
  providers: [
    AlertService,
    DatePipe,
    LocalizationService,
    LocalScheduleService,
    ScheduleGeneratorService,
    StorageService,
    TranslatePipe,
    GithubClient,
  ],
})
export class PagesModule {}
