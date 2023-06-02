import { Injectable } from '@angular/core';

import {
  DefaultAutoNextQuestionnaireTypes,
  DefaultShowTaskProgressCount,
  DefaultSkippableQuestionnaireTypes,
} from '../../../../assets/data/defaultConfig';
import { LocalizationService } from '../../../core/services/misc/localization.service';
import { ConfigKeys } from '../../../shared/enums/config';
import { ShowIntroductionType } from '../../../shared/models/assessment';
import {
  Question,
  QuestionPosition,
  QuestionType,
} from '../../../shared/models/question';
import { parseAndEvalLogic } from '../../../shared/utilities/parsers';
import { getSeconds } from '../../../shared/utilities/time';
import { Utility } from '../../../shared/utilities/util';
import { AnswerService } from './answer.service';
import { TimestampService } from './timestamp.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  PREVIOUS_BUTTON_DISABLED_SET: Set<QuestionType> = new Set([
    QuestionType.timed,
    QuestionType.audio,
  ]);
  NEXT_BUTTON_ENABLED_SET: Set<QuestionType> = new Set(
    DefaultSkippableQuestionnaireTypes
  );
  NEXT_BUTTON_AUTOMATIC_SET: Set<QuestionType> = new Set(
    DefaultAutoNextQuestionnaireTypes
  );
  DELIMITER = ',';
  isProgressCountShown = false;

  constructor(
    private answerService: AnswerService,
    private timestampService: TimestampService,
    private localization: LocalizationService,
    private util: Utility
  ) {}

  initRemoteConfigParams() {
    this.NEXT_BUTTON_AUTOMATIC_SET = new Set(
      this.stringToArray(
        DefaultAutoNextQuestionnaireTypes.toString(),
        this.DELIMITER
      )
    );
    this.NEXT_BUTTON_ENABLED_SET = new Set(
      this.stringToArray(
        DefaultSkippableQuestionnaireTypes.toString(),
        this.DELIMITER
      )
    );
  }

  reset() {
    this.answerService.reset();
    this.timestampService.reset();
  }

  deleteLastAnswer() {
    this.answerService.pop();
  }

  deleteLastAnswers(questions: Question[]) {
    const questionKeys = questions.map((q) => q.field_name);
    this.answerService.keys = this.answerService.keys.filter(
      (k) => !questionKeys.includes(k)
    );
  }

  submitAnswer(answer) {
    this.answerService.add(answer);
  }

  getData() {
    return {
      answers: this.getAnswers(),
      timestamps: this.timestampService.timestamps,
    };
  }

  getAttemptedAnswers() {
    return this.answerService.answers;
  }

  getAnswers() {
    const answers = {};
    this.answerService.keys.map(
      (d) => (answers[d] = this.answerService.answers[d])
    );
    return answers;
  }

  getTime() {
    return getSeconds({ milliseconds: this.timestampService.getTimeStamp() });
  }

  updateAssessmentIntroduction(assessment, taskType) {
    if (assessment.showIntroduction !== ShowIntroductionType.ALWAYS) {
      assessment.showIntroduction = false;
    }
  }

  processQuestions(title, questions: Question[]) {
    return questions.map((q) =>
      Object.assign(q, { isAutoNext: this.getIsNextAutomatic(q.field_type) })
    );
  }

  isAnswered(question: Question) {
    const id = question.field_name;
    return this.answerService.check(id);
  }

  isAnyAnswered(questions: Question[]) {
    return questions.some((q) => this.isAnswered(q));
  }

  getNextQuestion(groupedQuestions, currentQuestionId): QuestionPosition {
    let qIndex = currentQuestionId + 1;
    const groupKeys: string[] = Array.from(groupedQuestions.keys());
    const questionIndices = [];

    while (qIndex < groupKeys.length) {
      const groupQuestions = groupedQuestions.get(groupKeys[qIndex]);
      const answers = this.util.deepCopy(this.answerService.answers);
      groupQuestions.forEach((q, i) => {
        if (
          this.isNotNullOrEmpty(
            groupedQuestions.get(groupKeys[qIndex])[i].branching_logic
          )
        ) {
          if (parseAndEvalLogic(q.branching_logic, answers))
            questionIndices.push(i);
        } else questionIndices.push(i);
      });
      if (questionIndices.length)
        return {
          groupKeyIndex: qIndex,
          questionIndices: questionIndices,
        };

      qIndex += 1;
    }
    return {
      groupKeyIndex: qIndex,
      questionIndices: questionIndices,
    };
  }

  isNotNullOrEmpty(value) {
    return value && value.length && value != '';
  }

  getAttemptProgress(total) {
    const answers = this.answerService.answers;
    const attemptedAnswers = Object.keys(answers)
      .map((d) => (answers[d] ? answers[d] : null))
      .filter((a) => a);
    return Math.ceil((attemptedAnswers.length * 100) / total);
  }

  recordTimeStamp(question, startTime) {
    const id = question.field_name;
    this.timestampService.add({
      id: id,
      value: {
        startTime: startTime,
        endTime: this.getTime(),
      },
    });
  }

  getIsPreviousDisabled(questionType: string) {
    return this.PREVIOUS_BUTTON_DISABLED_SET.has(questionType);
  }

  getIsAnyPreviousEnabled(questions: Question[]) {
    // NOTE: This checks if any question in the array has previous button enabled
    return questions.some((q) => this.getIsPreviousDisabled(q.field_type));
  }

  getIsNextEnabled(questionType: string) {
    return this.NEXT_BUTTON_ENABLED_SET.has(questionType);
  }

  getIsAnyNextEnabled(questions: Question[]) {
    // NOTE: This checks if any question in the array has next button enabled
    return questions.some((q) => this.getIsNextEnabled(q.field_type));
  }

  getIsNextAutomatic(questionType: string) {
    return this.NEXT_BUTTON_AUTOMATIC_SET.has(questionType);
  }

  processCompletedQuestionnaire(task, questions): Promise<any> {
    const data = this.getData();
    return Promise.resolve();
  }

  handleClinicalFollowUp(assessment, completedInClinic?) {
    return Promise.resolve();
  }

  stringToArray(array, delimiter) {
    return array.split(delimiter).map((s) => s.trim());
  }

  getIsProgressCountShown() {
    return Promise.resolve(true);
  }
}
