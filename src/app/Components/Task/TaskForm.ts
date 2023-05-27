/**
 *
 *
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../Models/Task';
import { User } from '../../Models/User';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Constants } from '../../config/constants';
import { DatePipe } from '@angular/common';
import { Common } from '../../Services/Common';

const cookieService = new CookieService;       /* call cookie service to get role from cookies */
const constants = new Constants;

@Component({
    selector: 'task-form',
    templateUrl: './form.html'
})

/**
 * TaskForm Class To Handle Addition And Updation Of Tasks
 */
export class TaskForm implements OnInit
{

    // Declarations
    @ViewChild('userForm') userForm: ElementRef;

    task: Task = new Task();
    username: String;
    urlPath = [];
    action = 'add';
    responseMessage = '';
    users: any;
    projects: any;
    user_id: any;
    role = Number(cookieService.get('role'));
    constant = constants;

    // Constructor
    constructor(
        private route: ActivatedRoute,
        private _flashMessagesService: FlashMessagesService,
        private router: Router,
        private datepipe: DatePipe,
        private commonService: Common,
    ) { }

    // OnInit
    ngOnInit()
    {
        this.urlPath = this.route.url['value'];

        if (this.urlPath[1].path == 'edit')
        {
            this.getTask();
            this.action = 'edit';
        }
        else
        {
            this.commonService.getLastRecord('tasks', Number(cookieService.get('id')))
                .subscribe(team =>
                {
                    if (team['data'])
                    {
                        this.task = team['data'];
                    }

                });
        }

        this.getUsers();
        this.getProjects();
    }

    /**
     * returns current date
     */
    currentDate()
    {
        var date = new Date();
        let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd  HH:mm:ss ');
        return latest_date;
    }

    /**
     * Adds user
     */
    add(): void
    {
        if (constants.UserRole == Number(cookieService.get('role')))
        {
            this.task.user_id = Number(cookieService.get('id'));
        }

        this.task.created_at = this.currentDate();
        this.task.completion_date = this.currentDate();
        this.task.updated_at = this.currentDate();
        this.task.updated_by = Number(cookieService.get('id'));
        this.task.created_by = Number(cookieService.get('id'));

        this.commonService.addRecords('tasks', this.task)
            .subscribe(task =>
            {
                this.responseMessage = task['message'];
                this.router.navigate(['/tasks'])
                this._flashMessagesService.show('Added Successfully', { cssClass: 'alert-success', timeout: 2000 });
            });
    }

    /**
     * Gets users summary
     */
    getUsers()
    {
        this.commonService.getLists('users/list/full')
            .subscribe(users =>
            {
                this.users = users['data'];
            });
    }

    /**
     * Gets Projectss List
     */
    getProjects()
    {
        this.commonService.getLists('projects/list/full')
            .subscribe(projects =>
            {
                this.projects = projects['data'];
            });
    }

    /**
     * Gets single task during updation
     */
    getTask()
    {
        const id = +this.route.snapshot.paramMap.get('id');
        this.commonService.getView('tasks', id).subscribe(task => { this.task = task; });
    }

    /**
     * Updates user
     */
    update(): void
    {
        this.task.updated_at = this.currentDate();
        this.task.updated_by = Number(cookieService.get('id'));

        this.commonService.updateRecords('tasks', this.task)
            .subscribe(task =>
            {
                this.router.navigate(['/tasks']);
                this._flashMessagesService.show('Updated Successfully', { cssClass: 'alert-success', timeout: 2000 });
            });
    }

}
