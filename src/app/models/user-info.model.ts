export class UserInfo {
  constructor(
      public age: string,
      public hearingDifficulties: boolean,
      public listeningTestParticipated: boolean,
      public headphonesMakeAndModel: string) { }

  public toSnakeCase(): object {
    return {
      headphones_make_and_model: this.headphonesMakeAndModel,
      hearing_difficulties: this.hearingDifficulties,
      listening_test_participated: this.listeningTestParticipated,
      age: this.age,
    };
  }
}
