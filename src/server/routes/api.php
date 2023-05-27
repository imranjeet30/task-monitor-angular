<?php

use Illuminate\Http\Request;
use App\Project;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//
// Route::get('/', function () {
//     return Project::all();
// });

Route::apiResources([
    'projects' => 'ProjectController'
]);
