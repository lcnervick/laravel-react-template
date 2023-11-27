<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactFormController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

$routeData = json_decode(file_get_contents(base_path("/routes/routes.json")));

$standard_props = [
    "routes" => $routeData,
];

function register_auto_routes($routes, $std_props, $route_prefix = '') {
    /* Auto-Generate routes for all items in Global Routes Data File (routes.json) */
    foreach($routes as $page => $route) {
        
        // sets prefix directory for subfolder paths
        if($route_prefix) $route->path = $route_prefix.'/'.$route->path;

        // if a route needs special processing (has attributes) pass this and define later
        if(isset($route->override)) continue;

        Route::get($route->path, function (Request $request) use ($route, $std_props) {
            if($request->cookie('passwordResetToken')) $std_props += ['passwordResetToken' => $request->cookie('passwordResetToken')];
            return view('app', $std_props + [
                "title" => $route->title,
                "description" => $route->description,
            ]);
        })
        ->name($page)
        ->middleware(isset($route->protected) ? 'auth' : null);

        // These are standard PUBLIC facing routes that need no additional processing
        if(isset($route->children)) register_auto_routes($route->children, $std_props, $route->path);
    }
}

register_auto_routes($routeData, $standard_props);

Route::fallback(function (Request $request) use($standard_props) {
    // return response()->json([
    //     'fallback_route' => true,
    //     'request' => $_SERVER
    // ]);
    return view('app', $standard_props + [
        "title" => "Not Found",
        "description"=> ""
    ]);
});
