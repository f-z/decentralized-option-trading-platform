import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const LISTING_KEY = 'listing_key';

@Injectable()
export class ListingService {
  private listing: Listing;

  constructor(private http: HttpClient) {
    this.listing = this.loadState() || null;
  }

  private loadState(): Listing {
    return JSON.parse(localStorage.getItem(LISTING_KEY));
  }

  private saveState(): void {
    localStorage.setItem(LISTING_KEY, JSON.stringify(this.listing));
  }

  getListing(): Listing {
    // Returning a copy of the stored item.
    return { ...this.listing };
  }

  setListing(listing: Listing): void {
    this.listing = listing;
    this.saveState();
  }

  setListingFromID(listingID: number): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        listingID: listingID
      },
      url: any =
        'https://okergo.azurewebsites.net/retrieve_listing_from_ID.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.listing = data;

        this.listing.photo =
          'https://okergo.azurewebsites.net/uploads/' +
          this.listing.photo.substring(5, this.listing.photo.length - 5);

        this.saveState();
      },
      (error: any) => {
        console.log(error);
      }
    );
    return null;
  }

  removeListing(): void {
    delete this.listing[LISTING_KEY];
    this.saveState();
  }
}

export interface Listing {
  listingID: number;
  title: string;
  photo: string;
  description: string;
  quantity: number;
  categoryName: string;
  sellerUsername: string;
  auctionID: number;
  startPrice: number;
  reservePrice: number;
  buyNowPrice: number;
  startTime: string;
  endTime: string;
  viewings: number;
  highestBid: number;
}

export interface Category {
  categoryName: string;
  description: string;
}

export interface Bid {
  bidID: number;
  price: number;
  time: string;
  bidderUsername: number;
  highest: number;
}

export interface Feedback {
  listingID: number;
  title: string; // of listing
  username: string; // of person making comment
  comment: string;
  rating: number;
  endTime: string;
}
