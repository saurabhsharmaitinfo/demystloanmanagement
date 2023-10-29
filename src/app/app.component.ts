import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { IModelBalanceSheet } from "./models/model-balance-sheet";
import { DbService } from "./services/db-service";
import {IModelApplication} from "./models/model-application";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title : string = 'BLoanApp';
  balanceSheet : IModelBalanceSheet[];
  accountingProviders : string[];
  loanApplicationForm : FormGroup;
  submitted : boolean = false;
  msg : string;
  todayDate : Date = new Date();

  constructor(private fb : FormBuilder,
              private _dbService : DbService) {
    this.loanApplicationForm = this.fb.group({
        bName: ['', Validators.required],
        eYear: [this.todayDate.getFullYear(), [Validators.required]],
        loanAmount: [0, [Validators.required]],
        accProvider: ['', [Validators.required]]
      }
    );
    this.msg = '';
    this.balanceSheet = [];
    this.accountingProviders = [];
  }

  ngOnInit() {
    this._getAccountingProviders();
  }

  get loanApplicationFormControl() {
    return this.loanApplicationForm.controls;
  }

  // To fetch the list of Accounting Providers
  private _getAccountingProviders() : void {
    this._dbService.getAccountingProviders()
      .then(accProvider => {
        this.accountingProviders = accProvider;
      });
  }

  // To fetch balance sheet
  requestBalanceSheet() : void {
    this.msg = '';
    if (this.loanApplicationForm.invalid) {
      this.msg = 'Please fill all fields to fetch the Balance Sheet.';
      return;
    }
    if (this.loanApplicationForm.controls["loanAmount"].value <= 0) {
      this.msg = 'Please enter a valid Loan amount.';
      return;
    }

    this._dbService.getBalanceSheet(
      this.loanApplicationForm.controls["bName"].value,
      this.loanApplicationForm.controls["accProvider"].value
    ).then(balanceSheet => {
      this.balanceSheet = balanceSheet;
      this.loanApplicationForm.controls['bName'].disable();
      this.loanApplicationForm.controls['eYear'].disable();
      this.loanApplicationForm.controls['loanAmount'].disable();
      this.loanApplicationForm.controls['accProvider'].disable();
      this.msg = 'Balance Sheet has been fetched successfully. Now, you can submit your loan application.';
    });
  }

  // To submit the final application for the loan approval
  submitApplication() : void {
    this.msg = '';
    this.submitted = true;
    if (this.loanApplicationForm.invalid || this.balanceSheet.length === 0 || this.loanApplicationForm.controls["loanAmount"].value <= 0) {
      this.msg = 'Please fill all the fields to submit the application!';
      this.submitted = false;
      return;
    }
    let loanApplication : IModelApplication =
      {
        businessName: this.loanApplicationForm.controls['bName'].value,
        yearEstablished: this.loanApplicationForm.controls['eYear'].value,
        loanAmount: this.loanApplicationForm.controls['loanAmount'].value,
        profitOrLossSummary: this.balanceSheet,
        preAssessment: 0
      };
    this._dbService.submitApplication(loanApplication)
      .then(finalApproval => {
        this.msg = 'Your application has been processed, and ' + finalApproval +'% of your loan amount has been approved.';
      }).catch( ()=> {
        this.msg = '';
        this.submitted = false;
    });
  }
  // To reset the page/form
  reset() : void {
    this.submitted = false;
    this.msg = '';
    this.balanceSheet = [];
    this.loanApplicationForm.reset();
    this.loanApplicationForm.controls['bName'].enable();
    this.loanApplicationForm.controls['eYear'].enable();
    this.loanApplicationForm.controls['loanAmount'].enable();
    this.loanApplicationForm.controls['accProvider'].enable();
  }

}
