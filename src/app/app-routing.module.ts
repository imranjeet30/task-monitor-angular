// Imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Theme } from './Theme/Theme';
import { AuthTheme } from './Auth/Theme/AuthTheme'

import { Login } from './Auth/Login/Login';
import { UserSummary } from './Components/User/UserSummary';
import { UserForm } from './Components/User/UserForm';
import { TaskForm } from './Components/Task/TaskForm';
import { TaskSummary } from './Components/Task/TaskSummary';
import { ProjectSummary } from './Components/Project/ProjectSummary';
import { ProjectForm } from './Components/Project/ProjectForm';
import { Progress } from './components/Progress/Progress';
import { Dashboard } from './Components/Dashboard/Dashboard';


// Routes
const routes: Routes =
    [
        {
            path: 'auth',
            component: AuthTheme,
            children:
                [
                    //Login
                    { path: 'login', component: Login, pathMatch: 'full' },
                ]
        },
        // Home
        { path: '', redirectTo: 'users', pathMatch: 'full' },

        //Site routes goes here 
        {
            path: '',
            component: Theme,
            children:
                [
                    { path: 'users', component: UserSummary, pathMatch: 'full' },
                    { path: 'users/add', component: UserForm, pathMatch: 'full' },
                    { path: 'users/edit/:id', component: UserForm, pathMatch: 'full' },
                    // Projects
                    { path: 'projects', component: ProjectSummary, pathMatch: 'full' },
                    { path: 'projects/add', component: ProjectForm, pathMatch: 'full' },
                    { path: 'projects/edit/:id', component: ProjectForm, pathMatch: 'full' },
                    // Tasks
                    { path: 'tasks', component: TaskSummary, pathMatch: 'full' },
                    { path: 'tasks/add', component: TaskForm, pathMatch: 'full' },
                    { path: 'tasks/edit/:id', component: TaskForm, pathMatch: 'full' },
                    { path: 'tasks/progress', component: Progress, pathMatch: 'full' },
                    { path: 'tasks/dashboard', component: Dashboard, pathMatch: 'full' },
                ]
        }
    ];

// Decorators
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

// App Routing
export class AppRoutingModule { }
