/**
 *
 *
 */
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
    selector: 'task-summary',
    templateUrl: './summary.html'
})

/**
 * TaskSummary Class Handles The Functionality Of Summary
 */
export class TaskSummary implements OnInit
{

    //Declarations
    pagination = new Pagination();
    tasks: Task[];
    users: any;
    projects: any;
    searchCategory = '';
    searchUsername = '';
    searchProjectname = '';
    searchCategoryname = '';
    searchFromDate = '';
    searchToDate = '';
    searchTitle = '';
    sortFieldname = 'id';
    sortOrder = 'desc';
    selected = [];
    role = Number(cookieService.get('role'));
    constant = constants;
    FromDate = '';
    ToDate = '';
    searchArray: any;

    // Constructor
    constructor(
        private flashMessagesService: FlashMessagesService,
        private datePipe: DatePipe,
        private commonService: Common,
        private appGlobals: AppGlobalService) { }

    // OnInit
    ngOnInit()
    {
        this.getTasks();
        this.getUsers();
        this.getProjects();
    }

    /**
     *  Gets users summary for search dropdown by users firstname
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
     * Gets projectss summary  for search dropdown by projects name
     */
    getProjects()
    {
        this.commonService.getLists('projects/list/full')
            .subscribe(response =>
            {
                this.projects = response['data'];
            });
    }

    /**
     * Gets tasks summary
     */
    getTasks()
    {
        if (constants.UserRole == Number(cookieService.get('role')))
        {
            this.searchUsername = cookieService.get('id');
        }
        this.searchArray = [
            { key: 'title', value: this.searchTitle },
            { key: 'user_id', value: this.searchUsername },
            { key: 'category_id', value: this.searchCategoryname },
            { key: 'project_id', value: this.searchProjectname },
            { key: 'from_date', value: this.FromDate },
            { key: 'to_date', value: this.ToDate },
        ]

        this.commonService.getRecords('tasks', this.searchArray, this.sortFieldname, this.sortOrder, this.pagination.offset, this.pagination.limit)
            .subscribe(tasks =>
            {
                this.tasks = tasks['data'];
                this.pagination.update(tasks);
            });
    }

    /**
     * @param page
     * Navigates on different pages
     */
    onPageChange(page: number)
    {
        this.pagination.offset = (page - 1) * this.pagination.limit;
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
        }

        if (this.searchToDate != '')
        {
            this.ToDate = this.datePipe.transform(this.searchToDate, 'yyyy-MM-dd');
        }

        this.sortFieldname = 'id';
        this.sortOrder = 'desc';
        this.pagination.offset = 0;
        this.getTasks();
    }

    /**
     * Clear search
     */
    clearSearch()
    {
        this.searchUsername = '';
        this.searchProjectname = '';
        this.searchTitle = '';
        this.searchFromDate = '';
        this.searchToDate = '';
        this.searchCategoryname = '';
        this.FromDate = '';
        this.ToDate = '';
        this.sortFieldname = 'id';
        this.sortOrder = 'desc';
        this.pagination.offset = 0;
        this.getTasks();
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
            this.commonService.deleteRecords('tasks', id)
                .subscribe(r =>
                {
                    this.tasks = this.tasks.filter(u => u.id !== id);
                    this.flashMessagesService.show('Deleted Succesfully', { cssClass: 'alert-success' });
                    this.getTasks();
                });
        }
    }

    /**
     * @param task
     * Toggles the status
     */
    toggle(task: Task): void
    {
        this.commonService.toggleStatus('tasks', task)
            .subscribe(r =>
            {
                let index = this.tasks.findIndex((u => u.id == task.id));
                this.tasks[index].is_active = 1 - task.is_active;
            });
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
