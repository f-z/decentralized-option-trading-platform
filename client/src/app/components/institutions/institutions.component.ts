import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { ListingService } from '../../services/listing.service';
import { ContractsService } from '../../services/contract.service';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent implements OnInit {
  account: any;
  averagePrice: any;

  institutions = [];

  symbol: string;
  exercisePrice: number;
  expirationDate: FormControl;

  minDate = new Date(Date.now());
  maxDate = new Date(2021, 0, 1);

  messageClass;
  message;
  newPost = false;
  loadingListings = false;
  form;
  commentForm;
  processing = false;
  username;
  ListingPosts;
  newComment = [];
  enabledComments = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private listingService: ListingService,
    public contractService: ContractsService
  ) {
    this.account = this.contractService.account;

    this.institutions = this.contractService.institutions;

    // setting default option factory to be the first one
    this.contractService.selectedOptionFactoryId = 0;

    // setting default symbol to ETH
    this.symbol = 'ETH';

    // setting default exercise price to 450
    this.exercisePrice = 400;

    // setting default date as today
    this.expirationDate = new FormControl(new Date());

    this.createNewListingForm(); // creating new listing form on start up
    this.createCommentForm(); // creating form for posting comments on a listing post
  }

  ngOnInit() {
    // getting profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // used when creating new listing posts and comments
    });

    this.getAllListings(); // getting all listings on component load

    // testing the creation of an option contract
    // parameters: underlying asset, exercise price, expiration date
    // (current block timestamp is counted in seconds from the beginning of the current epoch, like Unix time)
    // this.buyOption('BTC', 5600, Math.floor(new Date().getTime() / 1000) + 300, this.contractService.web3.toWei('0.1', 'ether'));
    this.averagePrice = this.loadAveragePrice();
  }

  getAveragePrice(): void {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    this.contractService.registry.getAveragePrice(
      this.contractService.oracleAddresses[0],
      this.contractService.oracleAddresses[1],
      this.contractService.oracleAddresses[2],
      {
        from: this.account,
        gas: 4000000,
        value: this.contractService.web3.toWei(0.01, 'ether')
      },
      function(error, transactionHash) {
        // getting the transaction hash as callback from the function
        if (error) {
          alert(error);
          return;
        } else {
          console.log('Price is being requested from the three oracles...');
          console.log('Transaction hash: ' + transactionHash);
        }
      }
    );

    /*
     * Web3.js allows subscribing to an event, so the web3 provider triggers some logic in the code every time it fires
     */
    // Event that signifies that the registry has received the price from the oracle
    // tslint:disable-next-line:prefer-const
    let registryPriceEvent = this.contractService.registry.AverageOraclePrice(
      function(error, priceInfo) {
        if (error) {
          return;
        }
        console.log(
          'The registry has successfully received the prices from the oracles and calculated the weighted average'
        );
        __this.averagePrice = priceInfo.args.price;
        __this.saveAveragePrice();
        console.log('Latest price average: ' + __this.averagePrice);
      }
    );
  }

  getOptionPremiums(): void {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    console.log(
      'Number of institutions selling: ' + __this.institutions.length
    );

    // tslint:disable-next-line:prefer-const
    let optionPremiumEvents = [];

    for (let i = 0; i < __this.institutions.length; i++) {
      __this.contractService.getOptionPremium(i, __this.exercisePrice);

      // Listening for the OptionPremium event and printing the result to the console
      // Could also use `filter` to only trigger this code, when _id equals the current option id
      // tslint:disable-next-line:prefer-const
      optionPremiumEvents.push(
        __this.contractService.optionFactories[i].OptionPremium(function(
          error,
          optionPremiumInfo
        ) {
          if (error) {
            return;
          }
          __this.setOptionPremium(i, optionPremiumInfo.args.premium);
          console.log('Option premium from factory ' + i + ': ' + __this.institutions[i][3]);
        })
      );
    }
  }

  setOptionPremium(id: number, premium: number) {
    this.institutions[id][3] = premium;
  }

  buyOption(): void {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    for (let i = 0; i < __this.institutions.length; i++) {
      // comparing option premiums to find the minimum
      if (
        __this.institutions[i][3] <
        __this.institutions[__this.contractService.selectedOptionFactoryId][3]
      ) {
        // setting the cheapest option factory as the default one
        __this.contractService.selectedOptionFactoryId = i;
      }
    }

    console.log('Cheapest premium: ' + __this.institutions[__this.contractService.selectedOptionFactoryId][3]);
    console.log('From option factory: ' + __this.contractService.selectedOptionFactoryId);

    // calculating amount to send
    // sending a little over the actual price to ensure it goes through
    const amount = __this.contractService.web3.toWei(
      (__this.institutions[__this.contractService.selectedOptionFactoryId][3] * 1.05) /
        Math.floor(__this.averagePrice)
    );

    console.log('Purchase amount converted from USD to wei: ' + amount);

    // converting time to unix timestamp
    __this.contractService.buyOption(
      __this.contractService.selectedOptionFactoryId,
      __this.symbol,
      __this.exercisePrice,
      __this.expirationDate.value.getTime() / 1000,
      amount
    );

    // Listening for the NewOption event and printing the result to the console
    // Using `filter` to only trigger this code, when _buyer equals the current user's account
    // tslint:disable-next-line:prefer-const
    let newOptionEvent = __this.contractService.optionFactories[
      __this.contractService.selectedOptionFactoryId
    ].NewOption({ filter: { _buyer: __this.contractService.account } }, function(
      error,
      newOption
    ) {
      if (error) {
        return;
      }
      console.log('Option bought successfully');
      console.log('Option buyer: ' + newOption.args._buyer);
      console.log('New option id: ' + newOption.args._id.c[0]);
      // converting wei to ether
      console.log(
        'Balance left: ' +
          newOption.args._balanceLeft / 1000000000000000000 +
          ' ether'
      );
    });
  }

  private saveAveragePrice(): void {
    localStorage.setItem('averagePrice', JSON.stringify(this.averagePrice));
  }

  private loadAveragePrice(): any {
    let price = JSON.parse(localStorage.getItem('averagePrice'));
    if (price === undefined || price === null) {
      price = '...';
    }

    return price;
  }

  private saveOptionPremium(): void {
    localStorage.setItem(
      'optionPremium',
      JSON.stringify(this.institutions[0].optionPremium)
    );
  }

  private loadOptionPremium(): any {
    let premium = JSON.parse(localStorage.getItem('optionPremium'));
    if (premium === undefined || premium === null) {
      premium = '...';
    }

    return premium;
  }

  // Function to create new Listing form
  createNewListingForm() {
    this.form = this.formBuilder.group({
      // Title field
      title: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
          this.alphaNumericValidation
        ])
      ],
      // Body field
      body: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(5)
        ])
      ]
    });
  }

  // Create form for posting comments
  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200)
        ])
      ]
    });
  }

  // Enable the comment form
  enableCommentForm() {
    this.commentForm.get('comment').enable(); // Enable comment field
  }

  // Disable the comment form
  disableCommentForm() {
    this.commentForm.get('comment').disable(); // Disable comment field
  }

  // Enable new Listing form
  enableFormNewListingForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable(); // Enable body field
  }

  // Disable new Listing form
  disableFormNewListingForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('body').disable(); // Disable body field
  }

  // Validation for title
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { alphaNumericValidation: true }; // Return error in validation
    }
  }

  // Function to display new Listing form
  newListingForm() {
    this.newPost = true; // Show new Listing form
  }

  // Reload Listings on current page
  reloadListings() {
    this.loadingListings = true; // Used to lock button
    this.getAllListings(); // Add any new Listings to the page
    setTimeout(() => {
      this.loadingListings = false; // Release button lock after four seconds
    }, 4000);
  }

  // Function to post a new comment on Listing post
  draftComment(id) {
    this.commentForm.reset(); // Reset the comment form each time users starts a new comment
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id); // Add the post that is being commented on to the array
  }

  // Function to cancel new post transaction
  cancelSubmission(id) {
    const index = this.newComment.indexOf(id); // Check the index of the Listing post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    this.commentForm.reset(); // Reset  the form after cancellation
    this.enableCommentForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
  }

  // Function to submit a new Listing post
  onListingSubmit() {
    this.processing = true; // Disable submit button
    this.disableFormNewListingForm(); // Lock form

    // Create Listing object from form fields
    const Listing = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      createdBy: this.username // CreatedBy field
    };

    // Function to save Listing into database
    this.listingService.newListing(Listing).subscribe(data => {
      // Check if Listing was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewListingForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        this.getAllListings();
        // Clear form data after two seconds
        setTimeout(() => {
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewListingForm(); // Enable the form fields
        }, 2000);
      }
    });
  }

  // Function to go back to previous page
  goBack() {
    window.location.reload(); // Clear all variable states
  }

  // Function to get all Listings from the database
  getAllListings() {
    // Function to GET all Listings from database
    this.listingService.getAllListings().subscribe(data => {
      this.ListingPosts = data.listings; // Assign array to use in HTML
    });
  }

  // Function to like a Listing post
  likeListing(id) {
    // Service to like a Listing post
    this.listingService.likeListing(id).subscribe(data => {
      this.getAllListings(); // Refresh Listings after like
    });
  }

  // Function to disliked a Listing post
  dislikeListing(id) {
    // Service to dislike a Listing post
    this.listingService.dislikeListing(id).subscribe(data => {
      this.getAllListings(); // Refresh Listings after dislike
    });
  }

  // Function to post a new comment
  postComment(id) {
    this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.listingService.postComment(id, comment).subscribe(data => {
      this.getAllListings(); // Refresh all Listings to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the Listing id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) {
        this.expand(id);
        // Expand comments for user on comment submission
      }
    });
  }

  // Expand the list of comments
  expand(id) {
    this.enabledComments.push(id); // Add the current listing post id to array
  }

  // Collapse the list of comments
  collapse(id) {
    const index = this.enabledComments.indexOf(id); // Get position of id in array
    this.enabledComments.splice(index, 1); // Remove id from array
  }
}
