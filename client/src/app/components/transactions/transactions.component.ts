import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ContractsService } from '../../services/contract.service';
import { Option } from '../../services/option.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  private balance: number;
  private depositAmount: number;

  private count: number;

  // material table elements
  displayedColumns: string[] = [
    'optionID',
    'asset',
    'exercisePrice',
    'timeToExpiration'
  ];
  options: Option[] = [];
  dataSource: any;

  private optionToExercise: number;

  constructor(
    public authService: AuthService,
    public contractService: ContractsService
  ) {
    contractService.getAccount().then(account => {
      contractService.checkFactoryDeployment().then(result => {
        contractService
          .getContractBalance()
          .then(balance => (this.balance = balance));
        contractService.getOptionCount().then(count => (this.count = count));

        contractService
          .getOptionsByBuyer(contractService.account)
          .then(optionIDs => {
            for (let i = 0; i < optionIDs.length; i++) {
              // retrieving a specific option via its id
              contractService.getOption(i).then(optionInfo => {
                const option: Option = {
                  id: i,
                  asset: optionInfo[0],
                  exercisePrice: optionInfo[1].c[0],
                  expirationDate: new Date(optionInfo[2].c[0] * 1000),
                  exercised: optionInfo[3]
                };

                this.options.push(option);
              });
            }
          });
      }); // deployment check closing brace
    }); // get account closing brace
  }

  ngOnInit() {
  }

  deposit(amount: number): void {
    // 1 ether = 1000000000000000000 wei
    this.contractService
      .deposit(this.contractService.web3.toWei(amount, 'ether'))
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

      this.contractService.exerciseOption(this.optionToExercise).then(transactionHash => {
        // tslint:disable-next-line:prefer-const
        let exerciseEvent = this.contractService.optionFactory.OptionExercise(function (
          error,
          exercise
        ) {
          if (error) {
            return;
          }
          console.log('Option buyer: ' + exercise.args._buyer);
          console.log('Profit/Loss: ' + exercise.args._settlementAmount.c[0]);
          console.log(
            'Balance left: ' +
            __this.contractService.web3.fromWei(exercise.args._balanceLeft.c[0]) +
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
}
