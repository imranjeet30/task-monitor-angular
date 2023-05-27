import { Component, OnInit } from '@angular/core';
import { User } from '../../Models/User';
import { Task } from '../../Models/Task';
import { Pagination } from '../../Models/Pagination';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { DatePipe } from '@angular/common';
import { AppGlobalService } from '../../app-global.service';
import { Constants } from '../../config/constants';
import { Common } from '../../Services/Common';

const cookieService = new CookieService;        /* call cookie service to get role from cookies */
const constants = new Constants;

@Component({
  selector: 'app-progress',
  templateUrl: './progress.html',
})

export class Progress implements OnInit
{ 
    pagination = new Pagination();
    tasks: Task[];
    users: any;
    searchUsername = '';
    searchFromDate = '';
    sortFieldname = 'id';
    sortOrder = 'desc';
    role = Number(cookieService.get('role'));
    constant = constants;
    FromDate:any = new Date();
    Todate:any = new Date();
    searchArray: any;

    constructor(
        private commonService: Common,
        private datePipe: DatePipe,
        private appGlobals: AppGlobalService) { }

    ngOnInit()
    { 
        this.getTasks();
        this.getUsers();
    }

  /**
   * Get Tasks
   */
    getTasks()
    {
        if(constants.UserRole == Number(cookieService.get('role'))) 
        {
            this.searchUsername = cookieService.get('id');
        }

        if (this.FromDate != '') 
        {
            this.FromDate = this.datePipe.transform(this.FromDate, 'yyyy-MM-dd');
        }

        if (this.Todate != '')
        {
            this.Todate = this.datePipe.transform(this.Todate, 'yyyy-MM-dd');
        }

        this.searchArray = [
            { key: 'user_id', value: this.searchUsername },
            { key: 'from_date', value: this.FromDate },
            { key: 'to_date', value: this.Todate },
        ]

        this.commonService.getRecords('tasks', this.searchArray, this.sortFieldname, this.sortOrder,
         this.pagination.offset, 500)
        .subscribe(tasks =>
        {
            this.tasks = tasks['data'];
            this.pagination.update(tasks);
        });
    }

  /**
   * Get User
   */   
    getUsers()
    {
        this.commonService.getLists('users/list/full')
        .subscribe(response =>
        {
        this.users = response['data'];
        });
    }

   /**
    * Clear search
    */
    clearSearch() 
    {
        this.searchUsername = '';
        this.searchFromDate = '';
        this.sortFieldname = 'id';
        this.sortOrder = 'desc';
        this.pagination.offset = 0;
        this.FromDate = new Date();
        this.Todate = new Date();
        this.getTasks();
    }

   /**
   * Search Data
   */
    searchData()
    {
        if (this.searchFromDate != '')
        {
            this.FromDate = this.datePipe.transform(this.searchFromDate, 'yyyy-MM-dd');

            if (this.FromDate)
            {
                this.Todate = this.FromDate
            }
        }

        this.sortFieldname = 'id';
        this.sortOrder = 'desc';
        this.pagination.offset = 0;
        this.getTasks();
    }

  /**
   * Page Change
   */
    onPageChange(page: number)
    {
    this.pagination.offset = (page - 1) * this.pagination.limit;
    this.getTasks();
    }

  /**
   * @param sf 
   *  Sorts the summary
   */
    onSortChange(sf: string) 
    {
    let so = event.srcElement.className;
    this.sortFieldname = sf;
    this.sortOrder = so;
    this.pagination.offset = 0;
    this.getTasks();
    }

}

