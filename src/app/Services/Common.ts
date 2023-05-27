/**
 *
 *
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Project } from '../Models/Project';
import { User } from '../Models/User';
import { Task } from '../Models/Task';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Constants } from '../config/constants';

const constants = new Constants;
const cookieService = new CookieService       /** call cookie service to get token from cookies */

// Header
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': cookieService.get('token')
    })
};


@Injectable()
/**
 * Common Class for all managers
 */
export class Common
{
    private url = constants.AdminRole == Number(cookieService.get('role')) ? `${constants.ApiUrl}admin` : `${constants.ApiUrl}member`;  // URL to web api

    // Constructor
    constructor(private http: HttpClient) { }

    /**
     *
     * @param apiUrl
     * @param filters
     * @param sortFieldname
     * @param sortOrder
     * @param offset
     * @param limit
     * Gets Records Data
     */
    getRecords(apiUrl, filters, sortFieldname, sortOrder, offset, limit): Observable<any[]>
    {
        const url = this.url + '/' + apiUrl
        var searchArray = filters.map(function (item)
        {
            return item['key'] + "=" + item['value'];
        });

        return this.http.get<any[]>(`${url}?${searchArray.join("&")}&sf=${sortFieldname}&so=${sortOrder}&offset=${offset}&limit=${limit}`, httpOptions).pipe(
            tap(_ => this.log(`found records matching search`)),
            catchError(this.handleError<any[]>('searchRecords', []))
        );
    }

    /**
     * @param apiUrl
     * Gets Records Full Lists
     */
    getLists(apiUrl): Observable<any[]>
    {
        var Url = this.url + '/' + apiUrl;

        return this.http.get<any[]>(Url, httpOptions).pipe(
            tap(_ => this.log(`found records lists`)),
            catchError(this.handleError<any[]>('recordsLists', []))
        );
    }

    /**
     * @param apiUrl
     * @param id
     * GET Record by id
     */
    getView(apiUrl, id: number): Observable<any>
    {
        const url = `${this.url}/${apiUrl}/${id}`;

        return this.http.get<any>(url, httpOptions).pipe(
            tap(_ => this.log(`fetched record id=${id}`)),
            catchError(this.handleError<any>(`getRecord id=${id}`))
        );
    }

    /**
     * @param apiUrl
     * @param id
     * GET lastInsertedfield Records by id
     */
    getLastRecord(apiUrl, id: number): Observable<any>
    {
        const url = `${this.url}/${apiUrl}/lastinsertedfield/${id}`;

        return this.http.get<any>(url, httpOptions).pipe(
            tap(_ => this.log(`fetched record id=${id}`)),
            catchError(this.handleError<any>(`getRecord id=${id}`))
        );
    }

    /**
     * @param apiUrl
     * @param record
     *  POST: add a new record to the server
     */
    addRecords(apiUrl, record: any): Observable<any>
    {
        const url = `${this.url}/${apiUrl}`

        return this.http.post<any>(url, record, httpOptions).pipe(
            tap((task: any) => this.log(`added record+ w/ id=${task.user_id}`)),
            catchError(this.handleError<any>('addRecord'))
        );
    }

    /**
     * @param apiUrl
     * @param record
     *  PUT: update the record on the server
     */
    updateRecords(apiUrl, record: any): Observable<any>
    {
        const url = `${this.url}/${apiUrl}/${record.id}`

        return this.http.put(url, record, httpOptions).pipe(
            tap(_ => this.log(`updated record  id=${record.id}`)),
            catchError(this.handleError<any>('updateRecord'))
        );
    }

    /**
     * @param apiUrl
     * @param user
     * PUT: update the user Password on the server
     */
    updatePassword(apiUrl, user: any): Observable<any>
    {
        const url = `${this.url}/${apiUrl}/changePassword/${user.id}`

        return this.http.put(url, user, httpOptions).pipe(
            tap(_ => this.log(`updated user id=${user.id}`)),
            catchError(this.handleError<any>('updateUser'))
        );
    }

    /**
     * @param apiUrl
     * @param id
     *  DELETE: delete the record from the server
     */
    deleteRecords(apiUrl, id: number): Observable<any>
    {
        const url = `${this.url}/${apiUrl}/${id}`;

        return this.http.delete<any>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted record id=${id}`)),
            catchError(this.handleError<any>('deleteRecord'))
        );
    }

    /**
     * @param apiUrl
     * @param task
     * update the record status on the server
     */
    toggleStatus(apiUrl, task: any): Observable<any>
    {
        return this.http.get(`${this.url}/${apiUrl}/toggle/${task.id}/${task.is_active}`, httpOptions).pipe(
            tap(_ => this.log(`updated task id=${task.id}`)),
            catchError(this.handleError<any>('updateTask'))
        );
    }

    /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
    private handleError<T>(operation = 'operation', result?: T)
    {
        return (error: any): Observable<T> =>
        {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string)
    {
        console.log(message);
    }

}

