import {IModelBalanceSheet} from "./model-balance-sheet";

export interface IModelApplication {
  businessName: string;
  yearEstablished: number;
  profitOrLossSummary : IModelBalanceSheet[];
  loanAmount : number;
  preAssessment: number;
}
