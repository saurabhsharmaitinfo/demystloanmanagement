import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DbUtility } from '../utility/db-utility';
import { lastValueFrom } from 'rxjs';
import {IModelBalanceSheet} from "../models/model-balance-sheet";
import {IModelApplication} from "../models/model-application";

@Injectable()
export class DbService {

  private _projectName = '';
  constructor( @Inject( HttpClient ) private _httpClient : HttpClient ) {
  }

  // To get the list of accounting providers
  getAccountingProviders() : Promise<string[]> {
    const targetAddress : string = DbUtility.getApiUri() + `/loan-management/accounting/accounting-providers/`;

    const headers = DbService._getHeaderWithAuthentication();
    const options = { headers: headers };

    return lastValueFrom(this._httpClient.get<string[]>(targetAddress, options));
  }

  // To get the balance sheet based on the details of business & accounting provider
  getBalanceSheet(bName : string, accProvider : string ) : Promise<IModelBalanceSheet[]> {
    const targetAddress : string = DbUtility.getApiUri() + `/loan-management/accounting/balance-sheet/${bName}/${accProvider}`;

    const headers = DbService._getHeaderWithAuthentication();
    const options = { headers: headers };

    return lastValueFrom(this._httpClient.get<IModelBalanceSheet[]>(targetAddress, options));
  }

  // To do the final submission of Loan request
  submitApplication(loanApplication : IModelApplication) : Promise<number> {
    const targetAddress : string = DbUtility.getApiUri() + `/loan-management/application-management/submit-application`;

    const body = {
      loanApplication : loanApplication
    };
    const headers = DbService._getHeaderWithAuthentication();
    const options = { headers: headers };

    return lastValueFrom(this._httpClient.post<number>(targetAddress, body, options));
  }

  // To add the headers such as content-type, authentication etc.
  private static _getHeaderWithAuthentication() : HttpHeaders {
    return new HttpHeaders(
      {
        'Content-Type': 'application/json'
      }
    );
  }

  private static _setCustomHeaderData( headers : HttpHeaders, data : any ) : HttpHeaders {
    return headers.append( 'x-sc-custom-data', JSON.stringify( data ) );
  }

}
