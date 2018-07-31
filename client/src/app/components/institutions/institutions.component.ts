import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent implements OnInit {
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
    private listingService: ListingService
  ) {
    this.createNewListingForm(); // Create new Listing form on start up
    this.createCommentForm(); // Create form for posting comments on a user's Listing post
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
    this.enabledComments.push(id); // Add the current Listing post id to array
  }

  // Collapse the list of comments
  collapse(id) {
    const index = this.enabledComments.indexOf(id); // Get position of id in array
    this.enabledComments.splice(index, 1); // Remove id from array
  }

  ngOnInit() {
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new Listing posts and comments
    });

    this.getAllListings(); // Get all Listings on component load
  }
}
