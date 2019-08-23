import { UserInfo } from './user-info.model';

export class Questionnaire {
  public age: string;
  public hearingDifficultiesPresent: boolean;
  public listeningTestParticipated: boolean;
  public typedHeadphonesMakeAndModel: string;

  public toUserInfo(): UserInfo {
    return new UserInfo(
        this.age,
        this.hearingDifficultiesPresent,
        this.listeningTestParticipated,
        this.typedHeadphonesMakeAndModel);
  }
}
