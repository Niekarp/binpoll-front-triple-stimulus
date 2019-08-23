import { UserInfo } from './user-info.model';

export class PollData {
  constructor(
      public startDate: string,
      public endDate: string,
      public assignedSetId: number,
      public answers: any,
      public userInfo: UserInfo,
      public seed: number) { }

  public toSnakeCase(): object {
    return {
      start_date: this.startDate,
      end_date: this.endDate,
      assigned_set_id: this.assignedSetId,
      answers: this.answers,
      user_info: this.userInfo.toSnakeCase(),
      seed: this.seed
    };
  }
}
