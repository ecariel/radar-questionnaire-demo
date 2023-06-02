import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './core/containers/app.component';
import { AlertService } from './core/services/misc/alert.service';
import { GithubClient } from './core/services/misc/github-client.service';
import { LocalizationService } from './core/services/misc/localization.service';
import { LogService } from './core/services/misc/log.service';
import { LocalScheduleService } from './core/services/schedule/local-schedule.service';
import { ScheduleFactoryService } from './core/services/schedule/schedule-factory.service';
import { ScheduleGeneratorService } from './core/services/schedule/schedule-generator.service';
import { ScheduleService } from './core/services/schedule/schedule.service';
import { StorageService } from './core/services/storage/storage.service';
import { PagesModule } from './pages/pages.module';
import { TranslatePipe } from './shared/pipes/translate/translate';
import { jwtOptionsFactory } from './shared/utilities/jwtOptionsFactory';
import { Utility } from './shared/utilities/util';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IonicModule.forRoot({
      mode: 'md',
      scrollAssist: false,
      scrollPadding: false,
    }),
    RouterModule.forRoot([]),
    IonicStorageModule.forRoot({
      name: '__appdb',
      driverOrder: ['indexeddb', 'websql'],
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    PagesModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    Utility,
    LogService,
    LocalScheduleService,
    { provide: ScheduleService, useClass: ScheduleFactoryService },
    AlertService,
    DatePipe,
    LocalizationService,
    ScheduleGeneratorService,
    StorageService,
    TranslatePipe,
    GithubClient,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
