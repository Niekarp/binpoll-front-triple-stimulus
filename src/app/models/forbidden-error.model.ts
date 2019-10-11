export class ForbiddenError {
  public code: number;
  public message: string;

  constructor(error: object) {
    this.code = error.hasOwnProperty('code') ? error['code'] : -1;
    this.message = error.hasOwnProperty('message') ? error['message'] : '';
  }
}
