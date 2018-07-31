import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../../services/listing.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-institution',
  templateUrl: './delete-institution.component.html',
  styleUrls: ['./delete-institution.component.css']
})
export class DeleteInstitutionComponent implements OnInit {
  message;
  messageClass;
  foundListing = false;
  processing = false;
  listing;
  currentUrl;

  constructor(
    private listingService: ListingService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  // Function to delete listings
  deleteListing() {
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.listingService.deleteListing(this.currentUrl.id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error bootstrap class
        this.message = data.message; // Return error message
      } else {
        this.messageClass = 'alert alert-success'; // Return bootstrap success class
        this.message = data.message; // Return success message
        // After two second timeout, route to listing page
        setTimeout(() => {
          this.router.navigate(['/listing']); // Route users to listing page
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL paramaters on page load
    // Function for GET request to retrieve listing
    this.listingService.getSingleListing(this.currentUrl.id).subscribe(data => {
      // Check if request was successfull
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      } else {
        // Create the listing object to use in HTML
        this.listing = {
          title: data.listing.title, // Set title
          body: data.listing.body, // Set body
          createdBy: data.listing.createdBy, // Set created_by field
          createdAt: data.listing.createdAt // Set created_at field
        };
        this.foundListing = true; // Displaly listing window
      }
    });
  }
}
