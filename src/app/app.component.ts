// Imports
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
// import { Layout } from '../assets/layouts/layout/scripts/layout.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Constants } from './config/constants';

const cookieService = new CookieService;
const token = cookieService.get('token');
const role = cookieService.get('role');
const helper = new JwtHelperService();
const constants = new Constants();



// Decorators
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

// App Component
export class AppComponent implements OnInit
{

    // Declarations
    urlPath: string;

    // Constructor
    constructor(public loader: LoadingBarService, public router: Router)
    {
        router.events.subscribe(event =>
        {
            if (event instanceof NavigationEnd)
            {
                this.updateSidebarContentHeight();
            }
        });
    }

    ngOnInit()
    {
        if (token)
        {
            const isExpired = helper.isTokenExpired(token);

            if (isExpired)
            {
                this.router.navigate(['/auth/login']);
            }
            if (Number(role) == constants.UserRole)
            {
                this.router.navigate(['/tasks']);
            }
            // statement(s) will execute if the boolean expression is true
        } else
        {
            this.router.navigate(['/auth/login']);
            // statement(s) will execute if the boolean expression is false  
        }
        this.router.events.subscribe((e) =>
        {
            if (e instanceof NavigationEnd)
            {
                this.urlPath = e.url;
                console.log(this.urlPath);
            }
        });
    }

    // Updates sidebar and content height
    updateSidebarContentHeight()
    {
        //console.log('runs');
        //setTimeout(function(){ Layout.fixContentHeight(); }, 1000);
    }
}
