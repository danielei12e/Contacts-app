import _ from 'lodash'
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../services/share-data/share-data.service';
import { IContact } from './../../../models/IContact';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],

})
export class ItemListComponent implements OnChanges, OnInit {

  @Input() filterValue: string;
  private itemsData: IContact[] = [];
  public dataSource: MatTableDataSource<IContact[]>
  public selection = new SelectionModel<IContact[]>(true, []);
  public displayedColumns: string[] = ['select', 'picture', 'name', 'telephone', 'isActive', 'action'];


  constructor(private shareDataService: ShareDataService, private router: Router) {
  }

  ngOnInit(): void {
    this.getAllContacts();
  }

  ngOnChanges(): void {
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue;
    }
    else {
      this.dataSource = new MatTableDataSource<any>(this.itemsData);
    }
  }

  private getAllContacts(): void {
    this.shareDataService.getContactObservable().subscribe(contacts => {
      this.itemsData = contacts;
      this.dataSource = new MatTableDataSource<any>(this.itemsData);
    })
  }

  public edit(element) {
    element.roles = this.handleRoles(element.roles)
    this.router.navigate(['/item', element]);
  }

  public clickOnLine(event: MouseEvent, row: IContact): void {
    event.stopPropagation();
    if (this.isExist(row.name)) {
      _.remove(this.shareDataService.removeContactList, (item: IContact) => item.name === row.name);
    } else {
      this.shareDataService.removeContactList.push(row);
    }
  }

  public masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
      } row ${row.userID + 1}`;
  }

  public isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length
  }

  private isExist(name: string): boolean {
    return _.some(this.shareDataService.removeContactList, { name });
  }

  private handleRoles(roles): string[] {
    return roles.map((role) => role.role)
  }

}
