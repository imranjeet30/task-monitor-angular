/**
 *
 *
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Router } from '@angular/router';
import { User } from '../Models/User';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Common } from '../Services/Common';


const cookieService = new CookieService;


// Decorator
@Component({
    selector: 'app-header',
    templateUrl: './header.html',
})

/**
 * Header class
 */
export class Header
{
    @ViewChild('userForm') userForm: ElementRef;
    username = cookieService.get('username');
    user: User = new User();
    confirmed = 1;
    showModal: boolean;
    ResponseMessage = '';

    // constructor
    constructor(
        private router: Router,
        private flashMessagesService: FlashMessagesService,
        private commonService: Common,
    ) { }

    /**
     * Change Password Function
     */
    change()
    {
        if (this.user.confirmpassword != this.user.newpassword)
        {
            this.confirmed = 0;
        }
        else
        {
            this.confirmed = 1;
            this.user.id = Number(cookieService.get('id'));
            this.commonService.updatePassword('users', this.user)
                .subscribe(user =>
                {
                    let element: HTMLElement = document.getElementsByClassName('close')[0] as HTMLElement;

                    if (user.status == 1)
                    {
                        element.click();
                        this.ResponseMessage = '';
                        this.flashMessagesService.show(user['message'], { cssClass: 'alert-success flash', timeout: 5000 }, );
                    }
                    else
                    {
                        this.ResponseMessage = (user['message']);
                    }

                });
        }
    }

    /**
     * Logout Function
     */
    logout()
    {
        cookieService.put('token', '');
        window.location.href = '/auth/login';
    }

}
