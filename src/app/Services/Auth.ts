/**
 *
 *
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../Models/User';
import { Constants } from '../config/constants';

// constants
const constants = new Constants;

// Decorators
@Injectable()

/**
 * Auth Class For Handling Login Process
 */
export class Auth
{

    private usersUrl = `${constants.ApiUrl}admin/users/login`;  // URL to web api

    // Constructor
    constructor(private http: HttpClient) { }

    /**
     * @param user
     *  POST: Login
     */
    login(user: User): Observable<User>
    {
        return this.http.post<User>(this.usersUrl, user).pipe(
            tap((user: User) => this.log(`Login w/ id=${user.username}`)),
            catchError(this.handleError<User>('loginUser'))
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
