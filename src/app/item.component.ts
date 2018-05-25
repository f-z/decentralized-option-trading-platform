import { Component, Input } from '@angular/core';
import { Listing } from './shared/services/listing.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.html',
  styleUrls: ['./item.scss']
})
export class ItemComponent {
  @Input() item: Listing;
  timeLeft: string;

  constructor() {}
}
