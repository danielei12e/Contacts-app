import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IContact } from '../../models/IContact'

@Injectable({
  providedIn: 'root'
})

export class ContactsService {

  private readonly serverURL: string = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
  }

  getContacts(): Promise<IContact[]> {
    return this.httpClient.get<IContact[]>(`${this.serverURL}/get-contacts`, {}).toPromise();
  }

  deleteContact(contacts: string []) {
    return this.httpClient.post(`${this.serverURL}/delete-contact`, { id: contacts }).toPromise();
  }

  addContact(contact:IContact) {
    return this.httpClient.post(`${this.serverURL}/add-contact`,contact).toPromise();
  }

  setContact(contact:IContact) {
    return this.httpClient.put(`${this.serverURL}/set-contact`, contact).toPromise();
  }

}

