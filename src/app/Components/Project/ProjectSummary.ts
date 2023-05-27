/**
 *
 *
 */
import { Component, OnInit } from '@angular/core';
import { Project } from '../../Models/Project';
import { Pagination } from '../../Models/Pagination';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Common } from '../../Services/Common';

@Component({
    selector: 'project-summary',
    templateUrl: './summary.html',
})

/**
 * ProjectSummary Class Handles The Functionality Of Summary
 */
export class ProjectSummary implements OnInit
{

    pagination = new Pagination();
    Projects: Project[];
    searchMember = '';
    searchname = '';
    sortFieldname = 'id';
    sortOrder = 'desc';
    selected = [];
    searchArray: any;

    //constructor
    constructor(
        private flashMessagesService: FlashMessagesService,
        private commonService: Common,
    ) { this.searchData(); }

    // OnInit
    ngOnInit()
    {
        this.GetProject();
    }

    /**
     *  Get the projects Detalis For Project Summary
     */
    GetProject()
    {
        this.searchArray = [{ key: 'name', value: this.searchname }]

        this.commonService.getRecords('projects', this.searchArray, this.sortFieldname, this.sortOrder, this.pagination.offset, this.pagination.limit)
            .subscribe(responce =>
            {
                this.Projects = responce['data'];
                this.pagination.update(responce);
            });
    }

    /**
     * @param page
     *  Navigates on different pages
     */
    onPageChange(page: number)
    {
        this.pagination.offset = (page - 1) * this.pagination.limit;
        this.GetProject();
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
        this.GetProject();
    }

    /**
     * Search
     */
    searchData()
    {
        this.sortFieldname = 'id';
        this.sortOrder = 'desc';
        this.pagination.offset = 0;
        this.GetProject();
    }

    /**
     *  Clear search
     */
    clearSearch()
    {
        this.searchMember = '';
        this.searchname = '';
        this.sortFieldname = 'id';
        this.sortOrder = 'desc';
        this.pagination.offset = 0;
        this.GetProject();
    }

    /**
     * @param project
     * Toggles the status : update the satus by id
     */
    toggle(project: any): void
    {
        this.commonService.toggleStatus('projects', project)
            .subscribe(r =>
            {
                let index = this.Projects.findIndex((u => u.id == project.id));
                this.Projects[index].is_active = 1 - project.is_active;
                this.flashMessagesService.show(r['message'], { cssClass: 'alert-success' });
            });
    }

    /**
     * @param id
     * Delete Data
     */
    delete(id): void
    {
        var x = confirm("Are you sure you want to delete?");
        if (x)
        {
            this.commonService.deleteRecords('projects', id)
                .subscribe(r =>
                {
                    this.Projects = this.Projects.filter(u => u.id !== id);
                    this.flashMessagesService.show(r['message'], { cssClass: 'alert-success' });
                    this.GetProject();
                });
        }
    }

}






