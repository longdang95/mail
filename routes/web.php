<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\WidgetController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Installer Routes
Route::get('/installer', function () {
    if (file_exists(storage_path('installed'))) {
        return redirect()->route('home');
    } else {
        return view('installer.index');
    }
})->name('installer');

Route::middleware(['verify.install'])->group(function () {
    Route::post('unlock', [AppController::class, 'unlock'])->name('unlock');
    Route::middleware('lock')->group(function () {
        Route::get('/', [AppController::class, 'load'])->name('home');
        //App Routes
        Route::get('mailbox/{email?}', [AppController::class, 'mailbox'])->name('mailbox');
        Route::get('message/{messageId}', [AppController::class, 'message'])->name('message');
        Route::get('switch/{email}', [AppController::class, 'switch'])->name('switch');
        //Locale
        Route::post('locale/{locale}', [AppController::class, 'locale'])->name('locale');
        //Contact Form
        Route::post('widget/contact', [WidgetController::class, 'contact'])->name('widget.contact');
    });
    //Admin User Routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/', function () {
            return redirect()->route('dashboard');
        })->name('admin');
        Route::get('/dashboard', function () {
            return view('backend.dashboard');
        })->name('dashboard');
        Route::get('/settings', function () {
            return view('backend.settings.index');
        })->name('settings');
        Route::get('/menu', function () {
            return view('backend.menu.index');
        })->name('menu');
        Route::get('/pages', function () {
            return view('backend.pages.index');
        })->name('pages');
        Route::get('/themes', function () {
            return view('backend.themes.index');
        })->name('themes');
        Route::get('/update', function () {
            return view('backend.update.index');
        })->name('update');
    });
    //Auto Sitemap
    Route::get('sitemap.xml', [AppController::class, 'sitemap']);
    //Page Routes
    Route::get('{slug}/{inner?}', [AppController::class, 'page'])->middleware('lock')->name('page');
});
