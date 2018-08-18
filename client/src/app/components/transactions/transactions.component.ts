import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ContractsService } from '../../services/contract.service';
import { Option } from '../../services/option.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  private balance: number;
  private depositAmount: number;

  private count: number;

  institutions = [];

  // material table elements
  displayedColumns: string[] = [
    'optionID',
    'asset',
    'exercisePrice',
    'timeToExpiration'
  ];
  options: Option[];
  dataSource: any;

  private optionToExercise: number;

  constructor(
    public router: Router,
    public contractService: ContractsService
  ) { }

  ngOnInit() {
    this.retrieveTransactionData();
  }

  retrieveTransactionData() {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    // clearing array
    __this.options = [];

    console.log(
      'Option factory connected to: ' +
      __this.contractService.selectedOptionFactoryId
    );

    this.institutions = this.contractService.institutions;

    __this.contractService.getAccount().then(account => {
      console.log('User account: ' + account);

      // does the selected option factory exist?
      if (
        __this.contractService.optionFactoryAddresses[
        __this.contractService.selectedOptionFactoryId
        ]
      ) {
        __this.contractService
          .checkFactoryDeployment(
            __this.contractService.selectedOptionFactoryId
          )
          .then(result => {
            __this.contractService
              .getContractBalance(
                __this.contractService.selectedOptionFactoryId
              )
              .then(balance => (__this.balance = balance));
            __this.contractService
              .getOptionCount(__this.contractService.selectedOptionFactoryId)
              .then(count => (__this.count = count));

            __this.contractService
              .getOptionsByBuyer(
                __this.contractService.selectedOptionFactoryId,
                __this.contractService.account
              )
              .then(optionIDs => {
                for (let i = 0; i < optionIDs.length; i++) {
                  // retrieving a specific option via its id
                  __this.contractService.getOption(0, i).then(optionInfo => {
                    const option: Option = {
                      id: i,
                      asset: optionInfo[0],
                      exercisePrice: optionInfo[1].c[0],
                      expirationDate: new Date(optionInfo[2].c[0] * 1000),
                      exercised: optionInfo[3]
                    };

                    __this.options.push(option);
                  });
                }
              });
          }); // deployment check closing brace
      } // option factory existence check closing brace
    }); // get account closing brace
  }

  deposit(amount: number): void {
    // 1 ether = 1000000000000000000 wei
    this.contractService
      .deposit(0, this.contractService.web3.toWei(amount, 'ether'))
      .then(hash => {
        // could display button to check if transaction has been mined
      });
  }

  exerciseOption(): void {
    if (this.optionToExercise === undefined) {
      alert('Please enter the id of the option to be exercised!');
      return;
    } else if (!this.checkIfOptionIdExists(this.optionToExercise)) {
      alert('Please enter the id of an option you own!');
      return;
    } else if (this.options[this.optionToExercise].exercised === true) {
      alert('Option already exercised!');
      return;
    } else {
      // tslint:disable-next-line:prefer-const
      let __this = this;

      __this.contractService
        .exerciseOption(
          __this.contractService.selectedOptionFactoryId,
          this.optionToExercise
        )
        .then(transactionHash => {
          // tslint:disable-next-line:prefer-const
          let exerciseEvent = this.contractService.optionFactories[
            __this.contractService.selectedOptionFactoryId
          ].OptionExercise(function (error, exercise) {
            if (error) {
              return;
            }
            console.log('Option buyer: ' + exercise.args._buyer);
            console.log('Profit/Loss: ' + exercise.args._settlementAmount.c[0]);
            console.log(
              'Balance left: ' +
              __this.contractService.web3.fromWei(
                exercise.args._balanceLeft.c[0]
              ) +
              ' ether'
            );
          });
        });
    }
  }

  checkIfOptionIdExists(id: number): boolean {
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].id === id) {
        return true;
      }
    }

    // if exited the loop and not found id
    return false;
  }

  switchInstitution() {
    this.retrieveTransactionData();
  }
}
