import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../../services/listing.service';

@Component({
  selector: 'app-edit-institution',
  templateUrl: './edit-institution.component.html',
  styleUrls: ['./edit-institution.component.css']
})
export class EditInstitutionComponent implements OnInit {
  message;
  messageClass;
  listing;
  processing = false;
  currentUrl;
  loading = true;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private listingService: ListingService,
    private router: Router
  ) { }

  // Function to submit update
  updateListingSubmit() {
    this.processing = true; // Lock form fields
    // Function to send listing object to backend
    this.listingService.editListing(this.listing).subscribe(data => {
      // Check if PUT request was a success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set error bootstrap class
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
      } else {
        this.messageClass = 'alert alert-success'; // Set success bootstrap class
        this.message = data.message; // Set success message
        // After two seconds, navigate back to listing page
        setTimeout(() => {
          this.router.navigate(['/listing']); // Navigate back to route page
        }, 2000);
      }
    });
  }

  // Function to go back to previous page
  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
    // Function to GET current listing with id in params
    this.listingService.getSingleListing(this.currentUrl.id).subscribe(data => {
      // Check if GET request was success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
      } else {
        this.listing = data.listing; // Save listing object for use in HTML
        this.loading = false; // Allow loading of listing form
      }
    });

  }

}
