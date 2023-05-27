/**
 *
 *
 */
import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Router } from '@angular/router';
import { User } from '../../Models/User';
import { Pagination } from '../../Models/Pagination';
import { AppGlobalService } from '../../app-global.service';
import { Constants } from '../../config/constants';
import { Common } from '../../Services/Common';

const cookieService = new CookieService;
const constants = new Constants

// Decorators
@Component({
  selector: 'user-summary',
  templateUrl: './summary.html'
})

/**
 * UserSummary Class Handles The Functionality Of Summary
 */
export class UserSummary implements OnInit
{
  //Declarations
  pagination      = new Pagination;
  users           : User[]
  searchUsername  = '';
  searchFullname  = '';
  sortFieldname   = 'id';
  sortOrder       = 'desc';
  selected        = [];
  searchArray     :any;

  // Constructor
  constructor(
    private appGlobals: AppGlobalService,
    private flashMessagesService: FlashMessagesService,
    public router: Router,
    private commonService : Common
  ) { }

  // OnInit
  ngOnInit()
  {
      if(Number(cookieService.get('role')) == constants.UserRole)
      {
        this.router.navigate(['/tasks']);
      }
      this.getUsers();
  }

  /**
   * Gets users summary
   */
  getUsers()
  {
      this.searchArray = [
        { key: 'username', value: this.searchUsername },
        { key: 'name', value: this.searchFullname } ]

      this.commonService.getRecords('users',this.searchArray, this.sortFieldname, this.sortOrder, this.pagination.offset, this.pagination.limit)
      .subscribe(users =>
      {
          this.users = users['data'];
          this.pagination.update(users);
      });
  }

  /**
   * @param page
   * Navigates on different pages
   */
  onPageChange(page: number)
  {
      this.pagination.offset = (page - 1) * this.pagination.limit;
      this.getUsers();
  }

  /**
   * @param sf
   *  Sorts the summary
   */
  onSortChange(sf: string)
  {
      let so                 = event.srcElement.className;
      this.sortFieldname     = sf;
      this.sortOrder         = so;
      this.pagination.offset = 0;
      this.getUsers();
  }

  /**
   * Search Data
   */
  searchData()
  {
      this.sortFieldname     = 'id';
      this.sortOrder         = 'desc';
      this.pagination.offset = 0;
      this.getUsers();
  }

  /**
   * Clear search
   */
  clearSearch()
  {
      this.searchUsername    = '';
      this.searchFullname    = '';
      this.sortFieldname     = 'id';
      this.sortOrder         = 'desc';
      this.pagination.offset = 0;
      this.getUsers();
  }

  /**
   * @param id
   * Deletes the record
   */
  delete(id): void
  {
      var x = confirm("Are you sure you want to delete?");
      if (x)
      {
        this.commonService.deleteRecords('users',id)
        .subscribe(r =>
        {
            this.users = this.users.filter(u => u.id !== id);
            this.flashMessagesService.show(r['message'], { cssClass: 'alert-success' });
            this.getUsers();
        });
      }
  }

  /**
   * @param user
   *  Toggles the status
   */
  toggle(user: any): void
  {
      this.commonService.toggleStatus('users',user)
      .subscribe(r =>
      {
          let index = this.users.findIndex((u => u.id == user.id));
          this.users[index].is_active = 1 - user.is_active;
          this.flashMessagesService.show(r['message'], { cssClass: 'alert-success flash',timeout: 2000 }, );
      });
  }

}
