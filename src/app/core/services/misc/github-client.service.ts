import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DefaultGithubFetchStrategy } from '../../../../assets/data/defaultConfig';
import { ConfigKeys } from '../../../shared/enums/config';
import {
  GithubContent,
  GithubFetchStrategy,
} from '../../../shared/models/github';
import { Utility } from '../../../shared/utilities/util';

@Injectable()
export class GithubClient {
  constructor(private util: Utility, private http: HttpClient) {}

  getRaw(url): Promise<any> {
    return this.getFetchStrategy().then((strategy) => {
      switch (strategy) {
        case GithubFetchStrategy.APP_SERVER:
          return this.http.get(url).toPromise();
        default:
          return this.http.get(url).toPromise();
      }
    });
  }

  getContent(url): Promise<any> {
    return this.getRaw(url).then((res: GithubContent) => {
      return JSON.parse(this.util.base64ToUnicode(res.content));
    });
  }

  getFetchStrategy(): Promise<String> {
    return Promise.resolve(DefaultGithubFetchStrategy);
  }
}
