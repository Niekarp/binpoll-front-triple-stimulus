import { UserInfo } from './user-info.model';

export class ProblemReport {
  constructor(public userInfo: UserInfo, public message: string) { }

  public toSnakeCase(): object {
    return {
      user_info: this.userInfo.toSnakeCase(),
      message: this.message
    };
  }
}
