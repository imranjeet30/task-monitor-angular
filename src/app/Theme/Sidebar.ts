/**
 *
 *
 */
import { Component } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Constants } from '../config/constants';

const cookieService = new CookieService;
const constants = new Constants;

// Decorators
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.html',
})

/**
 * Sidebar Class
 */
export class Sidebar
{
    role = Number(cookieService.get('role'));
    constant = constants;
}
