
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controller', 'starter.services', 'ion-digit-keyboard', 'ngCordova', 'ion-floating-menu']).run(function($ionicPlatform, $cordovaSQLite, $rootScope, $q, settingService, salesService, dbService) {
    var dfd = $q.defer();
    $rootScope.deviceReady = dfd.promise;
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        if (window.cordova) {
            $rootScope.db = $cordovaSQLite.openDB({
                name: "PayUPos.db",
                location: 'default'
            });
            //device
            console.log("Android");
        } else {
            $rootScope.db = window.openDatabase("PayUPos.db", '1', 'PayUPos', 1024 * 1024 * 100);
            // browser 
            console.log("browser");
        }
        //  $cordovaSQLite.execute($rootScope.db, "DROP TABLE BillDetails ").then(console.log('Transaction table droped Successfully')); 
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Category (CategoryId text primary key, CategoryName text, CategoryDesc text)").then(console.log('Category table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Product (ProductId text primary key, ProductName text, ProductUnit text, ProductPrice real, TaxId integer, BuyingPrice real, TaxRate real, ItemsinStock real, Discount real, CategoryId text, CategoryName text, Image text, Favourite text)").then(console.log('Product table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS TransactionDetails (BillNo integer, DateTime integer, ProductId text, ProductName text, Quantity real, ProductPrice real, TotalPrice real, TaxAmount real, TotalAmount real, DiscountAmount real, Discount real, TaxRate real, TaxId integer, CategoryId text, CategoryName text)").then(console.log('TransactionDetails table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS BillDetails (BillNo integer, TotalPrice real, DiscountAmount real, TaxAmount real, TotalAmount real, PaymentMethod text, DateTime integer, TotalItems integer, BillStatus text)").then(console.log('BillDetails table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Settings (SettingsName text PRIMARY KEY ,SettingsValue TEXT)').then(console.log('Settings table created Successfully'));
       $rootScope.editingProduct = {};
        var promise = settingService.get("PrinterFormatSettings");
        promise.then(function(data) {
            console.log(data)
 //           $rootScope.printFormatSettings = data.rows[0].SettingsValue;
        })
        var promise = settingService.get("TaxSettings");
        promise.then(function(data) {
            console.log(data)
  //          $rootScope.TaxSettings = data.rows[0].SettingsValue;
        })
        var promise = settingService.get("PaymentSettings");
        promise.then(function(data) {
            console.log(data)
   //         $rootScope.PaymentSettings = data.rows[0].SettingsValue;
        })
        var promise = salesService.get("233");
        promise.then(function(data) {
            console.log(data)
        })
        var promise = salesService.getSalesReport("1485323465391", "1485323465391");
        promise.then(function(data) {
            console.log(data)
        })

        $rootScope.Products = [];
    var promise = dbService.loadFromDB('Product');
    promise.then(function(res) {
        console.log(res);
        for (var i = 0; i < res.rows.length; i++) {
            $rootScope.Products.push({
                productId: res.rows.item(i).ProductId,
                name: res.rows.item(i).ProductName,
                unit: res.rows.item(i).ProductUnit,
                unitPrice: res.rows.item(i).ProductPrice,
                taxRate: res.rows.item(i).TaxRate,
                taxId: res.rows.item(i).TaxId,
                actualPrice: res.rows.item(i).BuyingPrice,
                inStock: res.rows.item(i).ItemsinStock,
                discount: res.rows.item(i).Discount,
                categoryId: res.rows.item(i).CategoryId,
                categoryName: res.rows.item(i).CategoryName,
                image: res.rows.item(i).Image,
                favorite: res.rows.item(i).Favourite
            });
        }
    }, function(res) {
        console.log(res)
    })
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
    }).state('app.TaxSettings', {
        url: '/TaxSettings',
        views: {
            'menuContent': {
                controller: 'reports',
                templateUrl: 'templates/TaxSettings.html'
            }
        }
    }).state('app.inventory', {
        url: '/inventory',
        views: {
            'menuContent': {
                templateUrl: 'templates/inventoryPage.html'
            }
        }
    }).state('app.category', {
        url: '/category',
        views: {
            'menuContent': {
                templateUrl: 'templates/categoryPage.html'
            }
        }
    }).state('app.product', {
        url: '/product',
        views: {
            'menuContent': {
                templateUrl: 'templates/productPage.html'
            }
        }
    }).state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/homePage.html'
            }
        }
    }).state('app.editProducts', {
        url: '/editProducts',
        views: {
            'menuContent': {
                templateUrl: 'templates/editProducts.html'
            }
        }
    }).state('Test1', {
        url: '/Test',
        templateUrl: 'templates/Keypad.html',
    })
    $urlRouterProvider.otherwise('/app/home');
}).directive('textarea', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            var update = function() {
                element.css("height", "auto");
                var height = element[0].scrollHeight;
                element.css("height", element[0].scrollHeight + "px");
            };
            scope.$watch(attr.ngModel, function() {
                update();
            });
        }
    };
});
