// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controller', 'ion-digit-keyboard', 'ngCordova']).run(function($ionicPlatform) {
    $ionicPlatform.ready(function($rootScope) {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        //   window.localStorage.removeItem("holdEvents");
        var itemsJsonObj = window.localStorage.getItem('holdEvents');
        if (itemsJsonObj == null) {
            window.localStorage.setItem('holdEvents', "");
        }
        //  window.localStorage.setItem('transactionEvents', "");    
        var transactionsJsonObj = window.localStorage.getItem('transactionEvents');
        console.log(transactionsJsonObj);
        if (transactionsJsonObj == null) {
            window.localStorage.setItem('transactionEvents', "");
        }
        var productsJsonObj = window.localStorage.getItem('productsObj');
        console.log(productsJsonObj);
        if (productsJsonObj == null) {
            window.localStorage.setItem('productsObj', "");
        }
    });
}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('top');
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
    }).state('app.Payments', {
        url: '/Settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/Settings.html'
            }
        }
    }).state('app.PrinterSetting', {
        url: '/printerSettings',
        views: {
            'menuContent': {
                templateUrl: 'templates/PrinterSettings.html'
            }
        }
    }).state('app.PaymentSetting', {
        url: '/paymentSettings',
        views: {
            'menuContent': {
                templateUrl: 'templates/PaymentSettings.html'
            }
        }
    }).state('app.Reports', {
        url: '/Reports',
        views: {
            'menuContent': {
                controller: 'reports',
                templateUrl: 'templates/Reports.html'
            }
        }
    }).state('app.inventory', {
        url: '/inventory',
        views: {
            'menuContent': {
                templateUrl: 'templates/inventoryPage.html'
            }
        }
    }).state('app.product', {
        url: '/product',
        views: {
            'menuContent': {
                templateUrl: 'templates/Product.html'
            }
        }
    }).state('Test1', {
        url: '/Test',
        templateUrl: 'templates/Keypad.html',
    })
    $urlRouterProvider.otherwise('/app/product');
});
