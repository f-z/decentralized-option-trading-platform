import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './shared/services/item.service';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(items: Item[], term: string): Item[] {
    if (term === 'All') {
      return items;
    }

    term = term.toLowerCase();

    const filteredItems: Item[] = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].name.toLowerCase().includes(term)) {
        filteredItems.push(items[i]);
      } else if (
        items[i].categoryName != null &&
        items[i].categoryName.toLowerCase().includes(term)
      ) {
        filteredItems.push(items[i]);
      } else if (
        items[i].description != null &&
        items[i].description.toLowerCase().includes(term)
      ) {
        filteredItems.push(items[i]);
      }
    }

    return filteredItems;
  }
}
