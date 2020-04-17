import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShareDataService } from '../../../services/share-data/share-data.service';
import { IContact } from './../../../models/IContact';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() onFilterEvent = new EventEmitter<string>();
   public counterIsActive: number;

  constructor(private shareDataService: ShareDataService) {
  }

  ngOnInit(): void {
    this.getContactsLength()
  }

  private getContactsLength(): void{
    this.shareDataService.getContactObservable().subscribe(contacts => {
      this.counterIsActive = contacts.length;
    })
  }

  public searchContact(value: string) {
    this.onFilterEvent.emit(value);
  }


}
