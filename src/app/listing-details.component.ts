import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { User, UserService } from './shared/services/user.service';
import {
  Listing,
  ListingService,
  Bid,
  Feedback
} from './shared/services/listing.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MatDialog, MatDateFormats } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { BidHistoryComponent } from './bid-history.component';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.html',
  styleUrls: ['./listing-details.css']
})
export class ListingDetailsComponent implements OnDestroy {
  listing: Listing;

  loadComplete = false;

  distinctViewers = 0;
  totalViews = 0;
  numberBids = 0;
  highestBid: number;
  buyItNowPrice: number;
  reservePrice: number;
  highestBidderID: number;
  highestBidder: User;
  emailHighest: string;
  seller: User;
  sellerRating: number;
  sellerFeedbackCount: number;

  auctionID: number;
  itemID: number;
  sub: any;
  user: User;
  newBid: number;
  watchers: number;

  isExpired: boolean;
  feedback: Feedback;
  sellerFeedbackGiven: boolean;
  buyerFeedbackGiven: boolean;
  isWatching: boolean;
  isOutbid: boolean;

  slideIndex: number;

  recommendedAuctions: Observable<Listing[]> = null;
  bids: Observable<Bid[]> = null;

  constructor(
    public userService: UserService,
    public listingService: ListingService,
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpClient,
    public dialog: MatDialog,
    public bidHistoryDialog: MatDialog
  ) {
    route.params.subscribe(val => {
      this.auctionID = +this.route.snapshot.url[1].path;
      this.user = this.getUser();
      this.getAuctionInformation();

      let countdownText = document.getElementById('countdown');
      countdownText = null;
    });

    // Scroll to top of page when page refreshes.
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.slideIndex = 1;
  }

  reauction(): void {
    this.router.navigate(['add-item']);
  }

  getListing(): Listing {
    return this.listingService.getListing();
  }

  setItem(listing: Listing): void {
    this.listingService.setListing(listing);
  }

  ngOnDestroy() {
    let countdownText = document.getElementById('countdown');
    countdownText = null;
  }

  getUser(): User {
    return this.userService.getUser();
  }

  setUser(user: User): void {
    this.userService.setUser(user);
  }

  getSellerRating(sellerID: number): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = { sellerID: sellerID },
      url: any =
        'https://okergo.azurewebsites.net/php/retrieve_seller_rating.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // Set the date we're counting down to.
        if (data != null) {
          this.sellerRating = data.average * 20;
          this.sellerFeedbackCount = data.count;
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return null;
  }

  isUserWatching(auctionID): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        buyerID: this.user.username,
        auctionID: auctionID
      },
      url: any = 'https://okergo.azurewebsites.net/php/is_user_watching.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data.watching[0].maxbid != null) {
          this.isWatching = true;
        } else if (data.watching[0].maxbid === null) {
          this.isWatching = false;
        }
        if (data.outbid[0].outbid != null) {
          this.isOutbid = true;
        } else if (data.outbid[0].outbid === null) {
          this.isOutbid = false;
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return;
  }

  stopWatching(): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        buyerID: this.user.username,
        auctionID: this.listing.auctionID
      },
      url: any = 'https://okergo.azurewebsites.net/php/stop_watching.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.openDialog('You are no longer watching this auction!', '', true);
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return;
  }

  getAuctionInformation(): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = { auctionID: +this.route.snapshot.url[1].path },
      url: any =
        'https://okergo.azurewebsites.net/php/retrieve_auction_information.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.listing = data[0];

        if (data[0].sellerID !== this.user.username) {
          this.incrementViewings(data[0].auctionID);
        }
        this.getViewings();
        this.getSellerRating(data[0].sellerID);
        this.getHighestBid(data[0].auctionID);
        this.countDown(data[0].endTime);
        this.setIsExpired(data[0].endTime);
        this.getWatchers(data[0].auctionID);
        this.getFeedback(data[0].auctionID);
        this.isUserWatching(data[0].auctionID);
        this.buyItNowPrice = +data[0].buyNowPrice;
        if (this.buyItNowPrice === 0) {
          this.buyItNowPrice = null;
        }
        this.reservePrice = data[0].reservePrice;

        this.getAuctionRecommendations(data[0].auctionID);
        this.getAllBids(data[0].auctionID);
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );

    return null;
  }

  getViewings(): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        auctionID: +this.route.snapshot.url[1].path,
        userID: this.user.username
      },
      url: any = 'https://okergo.azurewebsites.net/php/retrieve_viewings.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // Set the date we're counting down to.
        if (data != null) {
          this.distinctViewers = data.distinctViewings;
          this.totalViews = data.totalViewings;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );

    return null;
  }

  incrementViewings(auctionID: number): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        auctionID: auctionID,
        userID: this.user.username
      },
      url: any = 'https://okergo.azurewebsites.net/php/increment_viewings.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => { },
      (error: any) => {
        console.log(error);
      }
    );

    return null;
  }

  getFeedback(auctionID): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = { auctionID: auctionID },
      url: any = 'https://okergo.azurewebsites.net/php/retrieve_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // Set the date we're counting down to.
        if (data != null) {
          this.feedback = data;
          if (data.sellerComment != null || data.sellerRating != null) {
            this.sellerFeedbackGiven = true;
          } else {
            this.sellerFeedbackGiven = false;
          }
          if (data.buyerComment != null || data.buyerRating != null) {
            this.buyerFeedbackGiven = true;
          } else {
            this.buyerFeedbackGiven = false;
          }
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return null;
  }

  getWatchers(auctionID): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = { auctionID: auctionID },
      url: any = 'https://okergo.azurewebsites.net/php/retrieve_watchers.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // Set the date we're counting down to.
        if (data != null) {
          this.watchers = data.watchers;
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return null;
  }

  getAllBids(auctionID): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = { auctionID: auctionID },
      url: any = 'https://okergo.azurewebsites.net/php/retrieve_all_auction_bids.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.bids = data;
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return null;
  }

  getHighestBid(auctionID): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = { auctionID: auctionID },
      url: any =
        'https://okergo.azurewebsites.net/php/retrieve_bid_information.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // Set the date we're counting down to.
        if (data != null) {
          this.highestBid = +data.bid.highestBid;
          this.numberBids = data.count.count;
          this.highestBidderID = data.bid.buyerID;
          this.getUsers(data.bid.buyerUsername, this.listing.sellerUsername);
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );

    return null;
  }

  bid(): void {
    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
    if (this.validateBid()) {
      const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
        options: any = {
          buyerID: this.user.username,
          auctionID: this.listing.auctionID,
          price: this.newBid
        },
        url: any = 'https://okergo.azurewebsites.net/php/insert_bid.php';

      this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any) => {
          this.notifyCurrentBidder(
            this.listing.auctionID,
            this.user.username,
            this.newBid
          );
          this.notifyPrevBidder(
            this.listing.auctionID,
            this.highestBidderID,
            this.user.username
          );
          this.notifyWatchers(this.listing.auctionID, this.newBid);
          this.openDialog(
            'Congratulations, you have successfully placed your bid!',
            '',
            true
          );
        },
        (error: any) => {
          // If there is an error, return to main search page.
          this.openDialog(
            'Oops, something went wrong... Please try again!',
            '',
            true
          );
        }
      );
    }
    return null;
  }

  buyItNow(): void {
    if (this.buyItNowPrice > 0) {
      const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
        options: any = {
          buyerID: this.user.username,
          auctionID: this.listing.auctionID,
          price: this.buyItNowPrice
        },
        url: any = 'https://okergo.azurewebsites.net/php/insert_bid.php';

      this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any) => {
          this.endAuction();
          this.openDialog(
            'Congratulations, you have won this auction!',
            '',
            true
          );
        },
        (error: any) => {
          // If there is an error, return to main search page.
          this.openDialog(
            'Oops, something went wrong... Please try again!',
            '',
            true
          );
        }
      );
      return null;
    } else {
      this.openDialog(
        'The seller did not specify a buy-it-now price!',
        '',
        true
      );
    }
  }

  endAuction(): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        auctionID: this.listing.auctionID
      },
      url: any = 'https://okergo.azurewebsites.net/php/end_auction.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        console.log(data);
        this.isExpired = true;
      },
      (error: any) => { }
    );
    return null;
  }

  validateBid(): boolean {
    if (this.newBid == null) {
      this.openDialog('Please enter your bid amount!', '', true);
      return false;
    } else if (this.highestBid == null) {
      if (this.newBid < this.listing.startPrice) {
        this.openDialog('Please enter more than the start price!', '', true);
        return false;
      }
    } else if (this.newBid <= this.highestBid) {
      this.openDialog('Please enter more than the current bid!', '', true);
      return false;
    }

    return true; // if bid is valid
  }

  notifyCurrentBidder(auctionID, buyerID, newBid): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options1: any = {
        auctionID: auctionID,
        buyerID: buyerID,
        highestBid: newBid,
        itemID: this.itemID
      },
      url: any =
        'https://okergo.azurewebsites.net/php/notify_current_bidder.php';

    this.http.post(url, JSON.stringify(options1), headers).subscribe(
      (data: any) => {
        console.log('Previous highest bidder: ' + this.highestBidderID);
      },
      (error: any) => { }
    );

    return null;
  }

  notifyPrevBidder(auctionID, highestBidderID, newBuyer): void {
    console.log('Previous Highest Bidder: ' + highestBidderID);
    console.log('New Highest Bidder: ' + newBuyer);
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options1: any = {
        auctionID: auctionID,
        prevBidderID: this.highestBidderID,
        newBuyer: newBuyer,
        itemID: this.itemID
      },
      url: any = 'https://okergo.azurewebsites.net/php/notify_prev_bidder.php';

    this.http.post(url, JSON.stringify(options1), headers).subscribe(
      (data: any) => {
        // console.log(data);
      },
      (error: any) => { }
    );

    return null;
  }

  notifyWatchers(auctionID, newBid): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options1: any = {
        auctionID: auctionID,
        highestBid: newBid,
        itemID: this.itemID
      },
      url: any = 'https://okergo.azurewebsites.net/php/notify_watchers.php';

    this.http.post(url, JSON.stringify(options1), headers).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error: any) => { }
    );

    return null;
  }

  watchAuction(): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        buyerID: this.user.username,
        auctionID: this.listing.auctionID,
        price: 0
      },
      url: any = 'https://okergo.azurewebsites.net/php/insert_bid.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.openDialog('You are now watching the auction!', '', true);
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops, something went wrong... Please try again!',
          '',
          true
        );
      }
    );

    return null;
  }

  setIsExpired(auction_endTime: string): void {
    // Set the date we're counting down to
    const countDownDate = new Date(auction_endTime).getTime();
    const now = new Date().getTime();

    // Find the distance between now an the count down date
    const distance = countDownDate - now;
    if (distance <= 0) {
      this.isExpired = true;
    } else {
      this.isExpired = false;
    }
    return;
  }

  getUsers(buyerUsername: string, sellerUsername: string): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        buyerUsername: buyerUsername,
        sellerUsername: sellerUsername
      },
      url: any =
        'https://okergo.azurewebsites.net/php/retrieve_buyer_seller_users.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.highestBidder = data[0];

          this.seller = data[1];
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return null;
  }

  // Displays time remaining on auction.
  countDown(auction_endTime: string): void {
    // Set the date we're counting down to.
    const countDownDate = new Date(auction_endTime).getTime();

    window.clearInterval(localStorage['counter']);

    const counter = setInterval(
      (window.onload = function () {
        // Get todays date and time
        const now = new Date().getTime();

        // Find the distance between now and the countdown date.
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds.
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id='countdown'.
        if (document.getElementById('countdown') != null) {
          if (days >= 1) {
            document.getElementById('countdown').innerHTML =
              'Time remaining: ' +
              days +
              'd ' +
              hours +
              'h ' +
              minutes +
              'm ' +
              seconds +
              's ';
          } else if (hours >= 1) {
            document.getElementById('countdown').innerHTML =
              'Time remaining: ' +
              hours +
              'h ' +
              minutes +
              'm ' +
              seconds +
              's ';
          } else if (minutes >= 1) {
            document.getElementById('countdown').innerHTML =
              'Time remaining: ' + minutes + 'm ' + seconds + 's ';
          } else if (seconds >= 1) {
            document.getElementById('countdown').innerHTML =
              'Time remaining: ' + seconds + 's ';
          }
          // If the count down is finished, display a notification text message.
          if (distance < 0) {
            clearInterval(counter);
            document.getElementById('countdown').innerHTML =
              'Time remaining: EXPIRED';
          }
        } else {
          clearInterval(counter);
        }
      }),
      1000
    );
    window.localStorage['counter'] = counter;
  }

  openDialog(message: string, username: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: username
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!succeeded) {
        this.router.navigate(['/search']);
      } else {
        window.location.reload();
      }
    });
  }

  showBidHistory(): void {
    if (this.numberBids > 0) {
      const dialogRef = this.dialog.open(BidHistoryComponent, {
        data: this.bids
      });
      dialogRef.updateSize('70%', '70%');
    }
  }

  goBack(): void {
    this.router.navigate(['/my-items']);
  }

  goToMyProfile(): void {
    this.router.navigate(['/profile', this.user.username]);
  }

  logout(): void {
    this.user = null;
    this.setUser(null);
    this.router.navigate(['/search']);
  }

  // Image carousel
  plusSlides(n: number): void {
    this.showSlides((this.slideIndex += n));
  }

  currentSlide(n: number): void {
    this.showSlides((this.slideIndex = n));
  }

  showSlides(n: number): void {
    let i: number;
    const slides = document.getElementsByClassName(
      'mySlides'
    ) as HTMLCollectionOf<HTMLElement>;
    const dots = document.getElementsByClassName('dot') as HTMLCollectionOf<
      HTMLElement
      >;

    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }
    slides[this.slideIndex - 1].style.display = 'block';
    dots[this.slideIndex - 1].className += ' active';
  }

  getAuctionRecommendations(auctionID: number): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        auctionID: auctionID
      },
      url: any =
        'https://okergo.azurewebsites.net/php/get_auction_recommendations.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.recommendedAuctions = data;
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog('Error getting Auction recommendations...', '', false);
      }
    );
    return null;
  }
}
