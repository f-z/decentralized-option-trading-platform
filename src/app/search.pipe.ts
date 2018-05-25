import { Pipe, PipeTransform } from '@angular/core';
import { Listing } from './shared/services/listing.service';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(listings: Listing[], term: string): Listing[] {
    if (term === 'All') {
      return listings;
    }

    term = term.toLowerCase();

    const filteredListings: Listing[] = [];

    for (let i = 0; i < listings.length; i++) {
      if (listings[i].title.toLowerCase().includes(term)) {
        filteredListings.push(listings[i]);
      } else if (
        listings[i].categoryName != null &&
        listings[i].categoryName.toLowerCase().includes(term)
      ) {
        filteredListings.push(listings[i]);
      } else if (
        listings[i].description != null &&
        listings[i].description.toLowerCase().includes(term)
      ) {
        filteredListings.push(listings[i]);
      }
    }

    return filteredListings;
  }
}
