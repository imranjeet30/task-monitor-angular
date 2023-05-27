/**
 *
 *
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../Models/Pagination';

// Decorators
@Component({
    selector: 'app-paginate',
    templateUrl: './paginate.html'
})

/**
 *  Component Class
 */
export class Paginate
{
    currentPage: any;

    // Declrations
    @Input() message: Boolean;
    @Input() pagination: Pagination;
    @Output() onPageChange = new EventEmitter<number>();

    /**
     * @param page
     * Page click event
     */
    onPageClick(page: number)
    {
        this.currentPage = page;
        this.onPageChange.emit(page);
    }

    /**
     * @param page
     * prev click event
     */
    onPagePrev(page: number)
    {
        if (page > 1)
        {
            this.onPageChange.emit(page - 1);
        }
    }

    /**
     * @param totalPage
     * @param current
     * Next click event
     */
    onPageNext(totalPage: number, current: number)
    {
        if (current < totalPage)
        {
            this.onPageChange.emit(current + 1);
        }
    }
}
