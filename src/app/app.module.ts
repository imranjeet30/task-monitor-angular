// Modules
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { JwtModule } from '@auth0/angular-jwt';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { AppRoutingModule } from './/app-routing.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';


// Components
import { AppComponent } from './app.component';
import { Theme } from './Theme/Theme';
import { Header } from './Theme/Header';
import { Logo } from './Theme/Logo';
import { Sidebar } from './Theme/Sidebar';
import { Footer } from './Theme/Footer';
import { UserSummary } from './Components/User/UserSummary';
import { UserForm } from './Components/User/UserForm';
import { Login } from './Auth/Login/Login'
import { AuthTheme } from './Auth/Theme/AuthTheme';
import { ProjectForm } from './Components/Project/ProjectForm';
import { TaskSummary } from './Components/Task/TaskSummary';
import { ProjectSummary } from './Components/Project/ProjectSummary';
import { TaskForm } from './Components/Task/TaskForm';
import { Dashboard } from './Components/Dashboard/Dashboard';
import { Paginate } from './Components/Paginate/Paginate';
import { Progress } from './components/Progress/Progress';

// Services
import { Auth } from './Services/Auth';
import { Common } from './Services/Common';
import { AppGlobalService } from './app-global.service';

// Directives
import { SortingDirective } from './sorting.directive';
// Pipes
import { DatePipe } from '@angular/common';


@NgModule({

    declarations: [
        AppComponent,
        Theme,
        Header,
        Logo,
        Sidebar,
        Footer,
        UserSummary,
        UserForm,
        TaskSummary,
        TaskForm,
        TaskForm,
        Paginate,
        SortingDirective,
        Login,
        AuthTheme,
        ProjectForm,
        ProjectSummary,
        Progress,
        Dashboard,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        LoadingBarHttpClientModule,
        FlashMessagesModule.forRoot(),
        BsDatepickerModule.forRoot(),
        Ng2GoogleChartsModule
    ],
    providers: [Auth, AppGlobalService, Common,
        CookieService, DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }