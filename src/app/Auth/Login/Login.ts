/**
 *
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Constants } from '../../config/constants';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../Models/User';
import { Auth } from '../../Services/Auth';

const helper = new JwtHelperService();            /**call json web token service */
const constants = new Constants;

@Component({
    selector: 'app-login',
    templateUrl: './login.html'
})

/**
 * Login Class To Handle Login Requests
 */
export class Login implements OnInit
{
    // Declarations
    @ViewChild('userForm') userForm: ElementRef;
    user: User = new User;
    responseMessage = '';

    // constructor
    constructor(
        private authService: Auth,
        private router: Router,
        private flashMessagesService: FlashMessagesService,
        private cookieService: CookieService
    ) { }

    // OnInit
    ngOnInit() { }

    /**
     * @param event
     * for submit form on enter
     */
    keyDownFunction(event)
    {
        if (event.keyCode == 13 && this.user.username.length > 0 && this.user.password.length > 0)
        {
            this.onSubmit();
        }
    }

    /**
     * fuction for submit the login form
     */
    onSubmit()
    {
        this.authService.login(this.user)
            .subscribe(user =>
            {
                if (user['status'])
                {
                    const decodedToken = helper.decodeToken(user.token);
                    this.cookieService.put('token', user.token);
                    this.cookieService.put('role', decodedToken.role);
                    this.cookieService.put('username', decodedToken.username);
                    this.cookieService.put('id', decodedToken.id);

                    if (decodedToken.role == constants.AdminRole)
                    {
                        window.location.href = '/users'
                    }
                    else
                    {
                        window.location.href = '/tasks'
                    }
                }
                else
                {
                    this.flashMessagesService.show(user['message'], { cssClass: 'alert-danger', timeout: 10000 });
                }
            });
    }

}
