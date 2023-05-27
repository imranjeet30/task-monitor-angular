/**
 *
 *
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../Models/User';
import { Constants } from '../../config/constants';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DatePipe } from '@angular/common';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Common } from '../../Services/Common';

const cookieService   = new CookieService;     /** call cookie service to get role from cookies */
const constants       = new Constants;

// Decorators
@Component({
  selector: 'user-form',
  templateUrl: './form.html'
})

/**
 * UserForm Class To Handle Addition And Updation Of Users
 */
export class UserForm implements OnInit {

  // Declarations
  @ViewChild('userForm') userForm: ElementRef;

  user      : User    = new User();
  username  : String;
  urlPath             = [];
  action              = 'add';
  responseMessage     = '';

  // Constructor
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
        this.getUser();
        this.action = 'edit';
      }
  }
/**
 * returns currecnt date time
 */
  currentDate()
  {
      var date=new Date();
      let latest_date =this.datePipe.transform(date, 'yyyy-MM-dd  HH:mm:ss ');
      return latest_date;
  }

  /**
   *  Adds user
   */
  add(): void
  {
      this.user.is_active   =  1 ;
      this.user.role        = constants.UserRole;
      this.user.created_at  = this.currentDate();
      this.user.updated_at  = this.currentDate();
      this.user.updated_by  = Number(cookieService.get('id'));
      this.user.created_by  = Number(cookieService.get('id'));

      this.commonService.addRecords('users/register',this.user)
      .subscribe(user =>
        {
            if(user['status'] == 1)
            {
                this.router.navigate(["users"]);
                this.flashMessagesService.show( user['message'], { cssClass: 'alert-success', timeout: 2000 });
            }
            else
            {
                this.responseMessage = user['message'];
            }
        });
  }

  /**
   * Gets single user during updation
   */
  getUser()
  {
      const id = +this.route.snapshot.paramMap.get('id');
      this.commonService.getView('users',id)
      .subscribe(user => { this.user = user;});
  }

  /**
   * Updates user
   */
  update(): void
  {
      this.user.updated_at = this.currentDate();
      this.user.updated_by = Number(cookieService.get('id'));

      this.commonService.updateRecords('users',this.user)
      .subscribe(user =>
      {
          this.router.navigate(["users"]);
          this.flashMessagesService.show('Updated Successfully', { cssClass: 'alert-success', timeout: 2000 });
      });
  }

}
