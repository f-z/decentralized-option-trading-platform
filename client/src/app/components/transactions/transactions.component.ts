import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ContractsService } from '../../services/contract.service';
import { Option } from '../../services/option.service';
import { MatTableDataSource, MatTable } from '@angular/material';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;

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
                this.options.sort();
              });
            }

            this.dataSource = new MatTableDataSource(this.options);
            // this.table.renderRows();
          });
      }); // deployment check closing brace
    }); // get account closing brace
  }

  ngOnInit() {
    /*
      contractService.exerciseOption(0).then(transactionHash => {
        const exerciseEvent = contractService.optionFactory.OptionExercise(function (
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
            contractService.web3.fromWei(exercise.args._balanceLeft.c[0]) +
            ' ether'
          );
        });
      });
    */
  }

  deposit(amount: number): void {
    // 1 ether = 1000000000000000000 wei
    this.contractService
      .deposit(this.contractService.web3.toWei(amount, 'ether'))
      .then(hash => {
        // could display button to check if transaction has been mined
      });
  }
}
