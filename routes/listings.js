const User = require('../models/user'); // Importing user model schema
const Listing = require('../models/listing'); // Importting listing model schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

  /* ===============================================================
     CREATE NEW LISTING
  =============================================================== */
  router.post('/newListing', (req, res) => {
    // Checking if listing title was provided
    if (!req.body.title) {
      res.json({ success: false, message: 'Listing title is required!' }); // Return error message
    } else {
      // Check if listing body was provided
      if (!req.body.body) {
        res.json({ success: false, message: 'Listing body is required!' }); // Return error message
      } else {
        // Check if listing's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Listing creator is required!' }); // Return error
        } else {
          // Create the listing object for insertion into database
          const listing = new Listing({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy // CreatedBy field
          });
          // Save listing into database
          listing.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the title field
                if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message }); // Return error message
                } else {
                  // Check if validation error is in the body field
                  if (err.errors.body) {
                    res.json({ success: false, message: err.errors.body.message }); // Return error message
                  } else {
                    res.json({ success: false, message: err }); // Return general error message
                  }
                }
              } else {
                res.json({ success: false, message: err }); // Return general error message
              }
            } else {
              res.json({ success: true, message: 'Listing saved successfully' }); // Return success message
            }
          });
        }
      }
    }
  });

  /* ===============================================================
     GET ALL LISTINGS
  =============================================================== */
  router.get('/allListings', (req, res) => {
    // Search database for all listing posts
    Listing.find({}, (err, listings) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if listings were found in database
        if (!listings) {
          res.json({ success: false, message: 'No listings found!' }); // Return error of no listings found
        } else {
          res.json({ success: true, listings: listings }); // Return success and listings array
        }
      }
    }).sort({ '_id': -1 }); // Sort listings from newest to oldest
  });

  /* ===============================================================
     GET SINGLE LISTING
  =============================================================== */
  router.get('/singleListing/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No listing ID was provided!' }); // Return error message
    } else {
      // Check if the listing id is found in database
      Listing.findOne({ _id: req.params.id }, (err, listing) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid listing id!' }); // Return error message
        } else {
          // Check if listing was found by id
          if (!listing) {
            res.json({ success: false, message: 'Listing not found!' }); // Return error message
          } else {
            // Find the current user that is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error
              } else {
                // Check if username was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user!' }); // Return error message
                } else {
                  // Check if the user who requested single listing is the one who created it
                  if (user.username !== listing.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this listing!' }); // Return authentication reror
                  } else {
                    res.json({ success: true, listing: listing }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     UPDATE LISTING POST
  =============================================================== */
  router.put('/updateListing', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No listing id provided!' }); // Return error message
    } else {
      // Check if id exists in database
      Listing.findOne({ _id: req.body._id }, (err, listing) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid listing id!' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!listing) {
            res.json({ success: false, message: 'Listing id was not found!' }); // Return error message
          } else {
            // Check who user is that is requesting listing update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user!' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update listing post
                  if (user.username !== listing.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this listing post!' }); // Return error message
                  } else {
                    listing.title = req.body.title; // Save latest listing title
                    listing.body = req.body.body; // Save latest body
                    listing.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly!' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Listing updated successfully' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     DELETE LISTING POST
  =============================================================== */
  router.delete('/deleteListing/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided!' }); // Return error message
    } else {
      // Check if id is found in database
      Listing.findOne({ _id: req.params.id }, (err, listing) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id!' }); // Return error message
        } else {
          // Check if listing was found in database
          if (!listing) {
            res.json({ success: false, messasge: 'Listing was not found!' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user!' }); // Return error message
                } else {
                  // Check if user attempting to delete listing is the same user who originally posted the listing
                  if (user.username !== listing.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this listing post' }); // Return error message
                  } else {
                    // Remove the listing from database
                    listing.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Listing deleted successfully' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     LIKE LISTING POST
  =============================================================== */
  router.put('/likeListing', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided!' }); // Return error message
    } else {
      // Search the database with id
      Listing.findOne({ _id: req.body.id }, (err, listing) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Invalid listing id!' }); // Return error message
        } else {
          // Check if id matched the id of a listing post in the database
          if (!listing) {
            res.json({ success: false, message: 'That listing was not found!' }); // Return error message
          } else {
            // Get data from user that is signed in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong!' }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user!' }); // Return error message
                } else {
                  // Check if user who liked post is the same user that originally created the listing post
                  if (user.username === listing.createdBy) {
                    res.json({ success: false, messagse: 'Cannot like your own post!' }); // Return error message
                  } else {
                    // Check if the user who liked the post has already liked the listing post before
                    if (listing.likedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already liked this post!' }); // Return error message
                    } else {
                      // Check if user who liked post has previously disliked a post
                      if (listing.dislikedBy.includes(user.username)) {
                        listing.dislikes--; // Reduce the total number of dislikes
                        const arrayIndex = listing.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
                        listing.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                        listing.likes++; // Increment likes
                        listing.likedBy.push(user.username); // Add username to the array of likedBy array
                        // Save listing post data
                        listing.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong!' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Listing liked successfully' }); // Return success message
                          }
                        });
                      } else {
                        listing.likes++; // Incriment likes
                        listing.likedBy.push(user.username); // Add liker's username into array of likedBy
                        // Save listing post
                        listing.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong!' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Listing liked successfully' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     DISLIKE LISTING POST
  =============================================================== */
  router.put('/dislikeListing', (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided!' }); // Return error message
    } else {
      // Search database for listing post using the id
      Listing.findOne({ _id: req.body.id }, (err, listing) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid listing id!' }); // Return error message
        } else {
          // Check if listing post with the id was found in the database
          if (!listing) {
            res.json({ success: false, message: 'That listing was not found!' }); // Return error message
          } else {
            // Get data of user who is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong!' }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user!' }); // Return error message
                } else {
                  // Check if user who disliekd post is the same person who originated the listing post
                  if (user.username === listing.createdBy) {
                    res.json({ success: false, messagse: 'Cannot dislike your own post!' }); // Return error message
                  } else {
                    // Check if user who disliked post has already disliked it before
                    if (listing.dislikedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already disliked this post!' }); // Return error message
                    } else {
                      // Check if user has previous disliked this post
                      if (listing.likedBy.includes(user.username)) {
                        listing.likes--; // Decrease likes by one
                        const arrayIndex = listing.likedBy.indexOf(user.username); // Check where username is inside of the array
                        listing.likedBy.splice(arrayIndex, 1); // Remove username from index
                        listing.dislikes++; // Increase dislikeds by one
                        listing.dislikedBy.push(user.username); // Add username to list of dislikers
                        // Save listing data
                        listing.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong!' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Listing disliked successfully' }); // Return success message
                          }
                        });
                      } else {
                        listing.dislikes++; // Increase likes by one
                        listing.dislikedBy.push(user.username); // Add username to list of likers
                        // Save listing data
                        listing.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong!' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Listing disliked successfully' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     COMMENT ON LISTING POST
  =============================================================== */
  router.post('/comment', (req, res) => {
    // Check if comment was provided in request body
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided!' }); // Return error message
    } else {
      // Check if id was provided in request body
      if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided!' }); // Return error message
      } else {
        // Use id to search for listing post in database
        Listing.findOne({ _id: req.body.id }, (err, listing) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: 'Invalid listing id!' }); // Return error message
          } else {
            // Check if id matched the id of any listing post in the database
            if (!listing) {
              res.json({ success: false, message: 'Listing not found!' }); // Return error message
            } else {
              // Grab data of user that is logged in
              User.findOne({ _id: req.decoded.userId }, (err, user) => {
                // Check if error was found
                if (err) {
                  res.json({ success: false, message: 'Something went wrong!' }); // Return error message
                } else {
                  // Check if user was found in the database
                  if (!user) {
                    res.json({ success: false, message: 'User not found!' }); // Return error message
                  } else {
                    // Add the new comment to the listing post's array
                    listing.comments.push({
                      comment: req.body.comment, // Comment field
                      commentator: user.username // Person who commented
                    });
                    // Save listing post
                    listing.save((err) => {
                      // Check if error was found
                      if (err) {
                        res.json({ success: false, message: 'Something went wrong!' }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Comment saved' }); // Return success message
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });

  return router;
};
