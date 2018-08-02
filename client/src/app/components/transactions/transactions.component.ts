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
    contractService.checkDeployment().then(result => {
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

      // this works
      // contractService.getOptionPremium(2).then(premium => (console.log(premium.c[0])));

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
          console.log('Profit/Loss: ' + exercise.args._id.c[0]);
          console.log(
            'Balance left: ' +
            contractService.web3.fromWei(exercise.args._balanceLeft) +
            ' ether'
          );
        });
      });
        */

      // Listening for the NewOption event and printing the result to the console
      // Web3.js allows subscribing to an event, so the web3 provider triggers some logic
      // in the code every time it fires:
      const event = contractService.optionFactory.NewOption(function(
        error,
        newOption
      ) {
        if (error) {
          return;
        }
        console.log('Option buyer: ' + newOption.args._buyer);
        console.log('New option id: ' + newOption.args._id.c[0]);
        console.log(
          'Balance left: ' +
            contractService.web3.fromWei(newOption.args._balanceLeft) +
            ' ether'
        );
      });
    });
  }

  ngOnInit() {
    // testing the creation of an option contract
    // parameters: underlying asset, exercise price, expiration date
    // (current block timestamp is counted in seconds from the beginning of the current epoch, like Unix time)
    // this.buyOption('BTC', 5600, 1533238281, this.contractService.web3.toWei('0.1', 'ether'));
    /*
    // this.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/lbsGNvd6Dz5L6qcjpLT3'));
    console.log(this.web3); // {eth: .., shh: ...} // it's here!

    // Use `filter` to only fire this code when `_to` equals `userAccount`
    cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
    .on("data", function(event) {
      let data = event.returnValues;
      // The current user just received a zombie!
      // Do something here to update the UI to show it
      getZombiesByOwner(userAccount).then(displayZombies);
    }).on("error", console.error);
  }

  function displayZombies(ids) {
    $("#zombies").empty();
    for (id of ids) {
      // Look up zombie details from our contract. Returns a `zombie` object
      getZombieDetails(id)
      .then(function(zombie) {
        // Using ES6's "template literals" to inject variables into the HTML.
        // Append each one to our #zombies div
        $("#zombies").append(`<div class="zombie">
          <ul>
            <li>Name: ${zombie.name}</li>
            <li>DNA: ${zombie.dna}</li>
            <li>Level: ${zombie.level}</li>
            <li>Wins: ${zombie.winCount}</li>
            <li>Losses: ${zombie.lossCount}</li>
            <li>Ready Time: ${zombie.readyTime}</li>
          </ul>
        </div>`);
      });
    }
  }

  function createRandomZombie(name) {
    // This is going to take a while, so update the UI to let the user know
    // the transaction has been sent
    $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
    // Send the tx to our contract:
    return cryptoZombies.methods.createRandomZombie(name)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      $("#txStatus").text("Successfully created " + name + "!");
      // Transaction was accepted into the blockchain, let's redraw the UI
      getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function(error) {
      // Do something to alert the user their transaction has failed
      $("#txStatus").text(error);
    });
  }

  function feedOnKitty(zombieId, kittyId) {
    $("#txStatus").text("Eating a kitty. This may take a while...");
    return cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
      getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function(error) {
      $("#txStatus").text(error);
    });
  }

  function levelUp(zombieId) {
    $("#txStatus").text("Leveling up your zombie...");
    return cryptoZombies.methods.levelUp(zombieId)
    .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
    .on("receipt", function(receipt) {
      $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
    })
    .on("error", function(error) {
      $("#txStatus").text(error);
    });
  }

  function getZombieDetails(id) {
    return cryptoZombies.methods.zombies(id).call()
  }

  function zombieToOwner(id) {
    return cryptoZombies.methods.zombieToOwner(id).call()
  }
  */
  }

  deposit(amount: number) {
    // 1 ether = 1000000000000000000 wei
    this.contractService
      .deposit(this.contractService.web3.toWei(amount, 'ether'))
      .then(hash => {
        // could display button to check if transaction has been mined
      });
  }

  buyOption(
    asset: string,
    exercisePrice,
    expirationDate: number,
    premium: number
  ) {
    this.contractService.buyOption(
      asset,
      exercisePrice,
      expirationDate,
      premium
    );
  }
}
