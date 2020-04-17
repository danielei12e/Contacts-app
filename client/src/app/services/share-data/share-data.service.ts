import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { IContact } from '../../models/IContact';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private contactsSubject: Subject<IContact[]> = new Subject<IContact[]>();
  public removeContactList: IContact[] = []

  constructor() {
  }

  public getContactObservable(): Observable<IContact[]> {
    return this.contactsSubject.asObservable();
  }

  public setContactObservable(contacts: IContact[]): void {
    return this.contactsSubject.next(contacts);
  }

}



