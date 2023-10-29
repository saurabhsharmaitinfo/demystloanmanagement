export class DbUtility {

  private static _apiPort : number = 3010;

  // To get the API URI
  static getApiUri() : string {
    return location.protocol + '//' + location.hostname + ':' + this._apiPort;
  }

  // To get the frontend application URI
  static getAppUri() : string {
    return location.protocol + '//' + window.location.host;
  }
}
