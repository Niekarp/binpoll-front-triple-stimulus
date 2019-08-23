export class UserComment {
  constructor(
      public pollData: any,
      public message: string) { }

  public toSnakeCase(): object {
    return {
      poll_data: this.pollData,
      message: this.message
    };
  }
}
