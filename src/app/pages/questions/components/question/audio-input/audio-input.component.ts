import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { DefaultMaxAudioAttemptsAllowed } from '../../../../../../assets/data/defaultConfig';
import { AlertService } from '../../../../../core/services/misc/alert.service';
import { UsageEventType } from '../../../../../shared/enums/events';
import { LocKeys } from '../../../../../shared/enums/localisations';
import { Section } from '../../../../../shared/models/question';
import { TranslatePipe } from '../../../../../shared/pipes/translate/translate';

@Component({
  selector: 'audio-input',
  templateUrl: 'audio-input.component.html',
  styleUrls: ['audio-input.component.scss'],
})
export class AudioInputComponent implements OnDestroy, OnInit {
  @Output()
  valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  onRecordStart: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  text: string;
  @Input()
  currentlyShown: boolean;

  recordAttempts = 0;
  buttonShown = true;
  pauseListener: Subscription;
  showInfoCard: boolean;
  textLengthThreshold = 400;
  backButtonListener: Subscription;

  constructor(
    public navCtrl: NavController,
    public alertService: AlertService,
    private platform: Platform,
    private translate: TranslatePipe
  ) {}

  ngOnInit() {
    // NOTE: Stop audio recording when application is on pause / backbutton is pressed
    this.pauseListener = this.platform.pause.subscribe(() => {
      if (this.isRecording()) {
        this.stopRecording();
        this.showTaskInterruptedAlert();
      }
    });

    this.backButtonListener = this.platform.backButton.subscribe(() => {
      this.stopRecording();
      navigator['app'].exitApp();
      // this.platform.exitApp();
    });

    this.showInfoCard = this.text.length > this.textLengthThreshold;
  }

  ngOnDestroy() {
    this.pauseListener.unsubscribe();
    this.backButtonListener.unsubscribe();
  }

  handleRecording() {
    if (!this.isRecording()) {
      this.recordAttempts++;
    } else {
      this.stopRecording();
      this.onRecordStart.emit(false);
    }
  }

  finishRecording() {
    this.buttonShown = false;
  }

  startRecording() {
    return;
  }

  stopRecording() {}

  isRecording() {
    return false;
  }

  getRecordingButtonText() {
    return this.translate.transform(
      this.isRecording()
        ? LocKeys.BTN_STOP.toString()
        : LocKeys.BTN_START.toString()
    );
  }

  showTaskInterruptedAlert() {
    this.alertService.showAlert({
      header: this.translate.transform(LocKeys.AUDIO_TASK_ALERT.toString()),
      message: this.translate.transform(
        LocKeys.AUDIO_TASK_ALERT_DESC.toString()
      ),
      buttons: [
        {
          text: this.translate.transform(LocKeys.BTN_OKAY.toString()),
          handler: () => {
            this.navCtrl.navigateRoot('');
          },
        },
      ],
      backdropDismiss: false,
    });
  }

  showAfterAttemptAlert() {
    const attemptsLeft = DefaultMaxAudioAttemptsAllowed - this.recordAttempts;
    this.alertService.showAlert({
      header: this.translate.transform(
        LocKeys.AUDIO_TASK_HAPPY_ALERT.toString()
      ),
      message:
        this.translate.transform(LocKeys.AUDIO_TASK_ATTEMPT_ALERT.toString()) +
        ': ' +
        attemptsLeft,
      buttons: [
        {
          text: this.translate.transform(LocKeys.BTN_YES.toString()),
          handler: () => {
            this.finishRecording();
          },
        },
        {
          text:
            this.translate.transform(LocKeys.BTN_NO.toString()) +
            ', ' +
            this.translate.transform(LocKeys.BTN_TRY_AGAIN.toString()),
          handler: () => {},
        },
      ],
      backdropDismiss: false,
    });
  }
}
