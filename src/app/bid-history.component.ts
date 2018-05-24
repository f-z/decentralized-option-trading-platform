import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-bid-history',
  templateUrl: 'bid-history.html',
  styleUrls: ['./bid-history.css']
})
export class BidHistoryComponent {
  displayedColumns = ['username', 'price', 'time'];
  dataSource: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = new MatTableDataSource(data);
  }
}
