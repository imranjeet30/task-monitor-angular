<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Project;

class ProjectController extends Controller
{
  public function index()
  {
      return Project::all();
  }

  public function show($id)
  {
      return Project::find($id);
  }

  public function store(Request $request)
  {
      return Project::create($request->all());
  }

  public function update(Request $request, $id)
  {
      $project = Project::findOrFail($id);
      $project->update($request->all());

      return $project;
  }

  public function delete(Request $request, $id)
  {
      $project = Project::findOrFail($id);
      $project->delete();

      return 204;
  }
}
