/**
 *
 *
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../Models/Project';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Constants } from '../../config/constants';
import { DatePipe } from '@angular/common'
import { Common } from '../../Services/Common';

const cookieService = new CookieService;    /**call cookie service to get role from browser cookies */
const constants = new Constants;

@Component({
    selector: 'project-form',
    templateUrl: './form.html',
})

/**
 * ProjectForm Class To Handle Addition And Updation Of Projects
 */
export class ProjectForm implements OnInit
{

    @ViewChild('userForm') userForm: ElementRef;

    project: Project = new Project();
    name: String;
    urlPath = [];
    action = 'add';
    responseMessage = '';
    users = [];

    // constructor
    constructor(
        private route: ActivatedRoute,
        private flashMessagesService: FlashMessagesService,
        private router: Router,
        private datePipe: DatePipe,
        private commonService: Common,

    ) { }

    // OnInit
    ngOnInit()
    {

        this.urlPath = this.route.url['value'];
        if (this.urlPath[1].path == 'edit')
        {
            this.getProject();
            this.action = 'edit';
        }

        this.getUsers();
    }

    /**
     * returns the current date time
     */
    currentDate()
    {
        var date = new Date();
        let latest_date = this.datePipe.transform(date, 'yyyy-MM-dd  HH:mm:ss ');
        return latest_date;
    }


    /**
     *  Add Project
     */
    add(): void
    {
        if (this.project.user_id != null)
        {
            this.project.user_id.push(this.project.team_leader_id);
        }
        else
        {
            this.project.user_id = this.project.team_leader_id.split(',');
        }

        this.project.is_closed = (this.project.is_closed) ? 1 : 0;
        this.project.is_active = 1;
        this.project.created_at = this.currentDate();
        this.project.updated_at = this.currentDate();
        this.project.updated_by = Number(cookieService.get('id'));
        this.project.created_by = Number(cookieService.get('id'));

        this.commonService.addRecords('projects', this.project)
            .subscribe(project =>
            {
                if (project['status'] == 1)
                {
                    this.router.navigate(['projects']);
                    this.flashMessagesService.show('Added Successfully', { cssClass: 'alert-success', timeout: 2000 });
                }
            });
    }

    /**
     *  Gets single  Project during updation
     */
    getProject()
    {
        const id = +this.route.snapshot.paramMap.get('id');
        this.commonService.getView('projects', id)
            .subscribe(pro =>
            {
                this.project = pro['data'][0];
                this.project.user_id = pro['data'][0].user_id.split(',')
            });
    }

    /**
     * Updates Project
     */
    update(): void
    {
        this.project.updated_at = this.currentDate();
        this.project.updated_by = Number(cookieService.get('id'));

        this.commonService.updateRecords('projects', this.project)
            .subscribe(project =>
            {
                this.router.navigate(['projects']);
                this.flashMessagesService.show(project['message'], { cssClass: 'alert-success', timeout: 2000 });
            });
    }

    /**
     * Get Users List Used For Dropdowns In Forms
     */
    getUsers()
    {
        this.commonService.getLists('users/list/full')
            .subscribe(teams =>
            {
                this.users = teams['data'];
            });
    }
}
