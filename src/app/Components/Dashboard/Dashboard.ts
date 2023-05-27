import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartReadyEvent } from 'ng2-google-charts';
import { ChartErrorEvent } from 'ng2-google-charts';
import { ChartSelectEvent } from 'ng2-google-charts';
import { ChartMouseOverEvent, ChartMouseOutEvent } from 'ng2-google-charts';
import { User } from '../../Models/User';
import { Task } from '../../Models/Task';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { DatePipe } from '@angular/common';
import { AppGlobalService } from '../../app-global.service';
import { Constants } from '../../config/constants';
import { Common } from '../../Services/Common';

const cookieService = new CookieService;        /* call cookie service to get role from cookies */
const constants = new Constants;               

@Component({
  selector: 'app-deshboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  @ViewChild('cchart') cchart;
  tasks           : Task[];
  users           : any;
  searchUsername  = '';
  searchFromDate  = '';
  searchToDate    = '';
  constant        = constants;
  FromDate:any    = new Date();
  Todate:any      = new Date();
  idleTime        = 0; 
  realTime        = 0;
  pieChartData    :any;
  searchArray     : any;

  role = Number(cookieService.get('role'));

  constructor
  (
  private commonService: Common,
  private datePipe: DatePipe,
  private appGlobals: AppGlobalService 

  ) { }

  ngOnInit()  
  {
    this.getUsers();
    this.getTasks();
  }
  
  /**
   * Get Tasks
   */
  getTasks()
  {
    if (constants.UserRole == Number(cookieService.get('role')))
      {
        this.searchUsername = cookieService.get('id');
      }

    if (this.FromDate != '') 
    {
        this.FromDate = '01-' +this.datePipe.transform(this.FromDate,'MMM-yyyy');
    }

    if (this.Todate != '') 
    {
        this.Todate = this.datePipe.transform(this.Todate, 'yyyy-MM-dd');
    }

    this.searchArray = [
      { key: 'user_id',   value: this.searchUsername },
      { key: 'from_date', value: this.FromDate },
      { key: 'to_date',   value: this.Todate },
    ]

    this.commonService.getRecords('tasks/idle/time',this.searchArray, '', '', '', '')
      .subscribe(tasks =>
          {
              this.tasks        =  tasks;
              this.idleTime     =  this.tasks['idleTime']
              this.realTime     =  this.tasks['realTime']
              this.pieChartData = {
              chartType: 'PieChart',
              dataTable: [
                ['Task', 'Hours per Day'],
                ['Real Time',this.idleTime],
                ['Idle Time',this.realTime],
          
              ],  
              options: {
                'title' : 'Work Time Report',
                pieHole : 0.2,
                'width' : 1000,
                'height': 300
              },
              };

              this.cchart.redraw();
          });
  }

  /**
   * Get User
   */
  getUsers()
  {
      this.commonService.getLists('users/list/full')
      .subscribe(response => {
      this.users = response['data'];
      });
  }

  /**
    * Search Data
    */
  searchData()
  {
    if (this.searchFromDate != '')
    {
        this.FromDate = this.datePipe.transform(this.searchFromDate, 'yyyy-MM-dd');
    }

    if (this.searchToDate != '')
    {
        this.Todate = this.datePipe.transform(this.searchToDate, 'yyyy-MM-dd');
    }
    this.getTasks();
  }

  /**
   * Clear search
   */
  clearSearch()
  {
    this.searchUsername = '';
    this.FromDate = '';
    this.Todate = "";
    this.getTasks();
  }

}