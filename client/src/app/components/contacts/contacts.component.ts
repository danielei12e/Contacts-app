import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ShareDataService } from '../../services/share-data/share-data.service';
import { ContactsService } from '../../services/contacts/contacts.service';
import { AlertDialogComponent } from '../shared/alert-dialog/alert-dialog.component';
import { errorsMessage } from '../../common/const/text-app.const'
import { IContact } from './../../models/IContact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [ShareDataService]
})
export class ContactsComponent implements OnInit {

  public filterItem: string

  constructor(private router: Router,
    private contactsService: ContactsService,
    private shareDataService: ShareDataService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.setContactsNumber()
  }

  private async setContactsNumber() {
    try {
      const contacts: IContact[] = await this.contactsService.getContacts();
      this.shareDataService.setContactObservable(contacts);
    } catch (ex) {
      this.openAlertDialog(ex.error.message);
    }
  }

  private async deleteContact(rows) {
    try {
      const ids = rows.map((item) => item.userID);
      await this.contactsService.deleteContact(ids);
      const contacts: IContact[] = await this.contactsService.getContacts();
      this.shareDataService.removeContactList = [];
      this.shareDataService.setContactObservable(contacts);
    } catch (ex) {
      this.openAlertDialog(ex.error.message);
    }
  }

  public filterList(filter: string): void {
    this.filterItem = filter;
  }

  public addNewItem(): void {
    this.router.navigate(['/item']);
  }

  public deleteItem(): void {
    const contacts: IContact[] = this.shareDataService.removeContactList;
    if (contacts.length == 0) {
      this.openAlertDialog(errorsMessage.DELETE_ERROR);
    }
    else {
      this.deleteContact(contacts)
    }
  }

  private openAlertDialog(error): void {
    this.dialog.open(AlertDialogComponent, { data: { message: error, buttonText: { cancel: 'Done' } } });
  }
}
