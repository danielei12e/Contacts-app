import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { defaults } from '../../common/const/text-app.const'
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';
import { ContactsService } from '../../services/contacts/contacts.service';
import { AlertDialogComponent } from '../shared/alert-dialog/alert-dialog.component';
import { IContact } from 'src/app/models/IContact';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  public isEditMode: boolean;
  public roles: string[] = []
  public editForm: FormGroup;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private contactsService: ContactsService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buildForm()
  }

  public buildForm(): void {

    const param = this.activatedRoute.snapshot.params;
    const IsEmptyObj: boolean = Object.keys(param).length === 0 && param.constructor === Object;
    this.isEditMode = IsEmptyObj ? false : true;

    this.editForm = new FormGroup({
      name: new FormControl(param.name ? param.name : '', Validators.required),
      picture: new FormControl(param.picture ? param.picture : ''),
      roles: new FormControl(param.roles ? this.roles = param.roles.split(',') : this.roles),
      isActive: new FormControl(param.isActive ? param.isActive : false),
      telephone: new FormControl(param.telephone ? param.telephone : '')
    })

  }

  public onSubmit(): void {

    const contact: IContact = {
      picture: this.editForm.controls['picture'].value ? this.editForm.controls['picture'].value : defaults.DEFAULT_PICTURE,
      name: this.editForm.controls['name'].value,
      roles: this.editForm.controls['roles'].value,
      telephone: this.editForm.controls['telephone'].value,
      isActive: this.editForm.controls['isActive'].value
    }
    this.sendContact(contact);
  }

  private async sendContact(contact): Promise<void> {
    try {
      if (!this.isSubmitEnabled) {
        this.openAlertDialog('Contact is not valid');
        return;
      }

      if (!this.isEditMode) {
        await this.contactsService.addContact(contact)
      }
      else {
        contact["id"] = this.activatedRoute.snapshot.params.userID;
        await this.contactsService.setContact(contact);
      }
      this.router.navigate(['/']);

    } catch (ex) {
      this.openAlertDialog(ex.error.message);
    }
  }

  public isSubmitEnabled(): boolean {
    return this.editForm.valid;
  }


  public clickBack(): void {
    this.router.navigate(['/']);
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.roles.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  public remove(role: string): void {
    const index = this.roles.indexOf(role);
    if (index >= 0) {
      this.roles.splice(index, 1);
    }
  }

  public getPictureValue(): string {
    const param = this.activatedRoute.snapshot.params;
    return param.picture ? param.picture : defaults.DEFAULT_PICTURE
  }

  private openAlertDialog(error) {
    this.dialog.open(AlertDialogComponent, { data: { message: error, buttonText: { cancel: 'Done' } } });
  }

}
