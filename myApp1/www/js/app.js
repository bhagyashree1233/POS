// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'starter.controller', 'starter.services', 'ion-digit-keyboard', 'ngCordova', 'starter.globalcontroller','starter.keypad','ion-floating-menu','starter.settingscontroller']).run(function($ionicPlatform, $cordovaSQLite, $rootScope, $q, $ionicLoading, settingService, salesService, dbService,$state) {

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
        $rootScope.editingProduct = {};
    //showdbloading;;
        //$rootScope.printFormatSettings = printFormatSettings;
        //$rootScope.TaxSettings = TaxSettings;
        //$rootScope.PaymentSettings = PaymentSettings;
        //$rootScope.Reports=Reports;
        //$cordovaSQLite.execute($rootScope.db, "DROP TABLE TransactionDetails ").then(console.log('Transaction table droped Successfully')); 
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Category (CategoryId text primary key, CategoryName text, CategoryDesc text)").then(console.log('Category table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Product (ProductId text primary key, ProductName text, ProductUnit text, ProductPrice real, TaxId integer, BuyingPrice real, TaxRate real, ItemsinStock real, Discount real, CategoryId text, CategoryName text, Image text, Favourite text)").then(console.log('Product table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS TransactionDetails (BillNo integer, DateTime text,DiscountAmount real, ProductId text, ProductName text, Quantity real, ProductPrice real, TotalPrice real, TaxAmount real, TotalAmount real, Discount real, TaxRate real, TaxId integer, CategoryId text, CategoryName text)").then(console.log('TransactionDetails table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS BillDetails (BillNo integer, TotalPrice real, DiscountAmount real, TaxAmount real, TotalAmount real, PaymentMethod text, DateTime text, TotalItems integer, BillStatus text)").then(console.log('BillDetails table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Settings (SettingsName text PRIMARY KEY ,SettingsValue TEXT)').then(console.log('Settings table created Successfully'));
        //console.log($rootScope.printFormatSettings);
        //console.log($rootScope.PaymentSettings);
        //console.log($rootScope.TaxSettings);
        var promise = settingService.get("PrinterFormatSettings");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.printFormatSettings = JSON.parse(data.rows.item(0).SettingsValue);
            } else {
                console.log('No PrinterFormatSettings Record Found')
            }
        })
        var promise = settingService.get("TaxSettings");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.TaxSettings = JSON.parse(data.rows.item(0).SettingsValue);
            } else {
                console.log('No TaxSettings Record Found')
            }
        })

        var promise5 = settingService.get("bluetoothSettings");
        promise5.then(function(data) {
            console.log("bluetooth: " ,data)
            if (data.rows.length >= 1) {
                //console.log("Bluetooth Settings: ",  data.rows.item(0));
                $rootScope.BluetoothSettings = JSON.parse(data.rows.item(0).SettingsValue);
                $rootScope.printerName = $rootScope.BluetoothSettings.PrinterName;
                $rootScope.InitPrinter();

         if($rootScope.printerName!="")
                 {
         if($rootScope.PrinterStatus == false)
         $rootScope.printerConnect($rootScope.printerName,$rootScope.ConnectStatusFunc);
                 }
          else
           {
        $rootScope.ShowToast("Please Configure Printer");
           }



            } else {
                console.log('No bluetoothsettings Record Found');
                $rootScope.ShowToast("Please Configure Printer");
            }
        })

        
        
        var promise = settingService.get("PaymentSettings");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.PaymentSettings = JSON.parse(data.rows.item(0).SettingsValue);
                
            } else {
                console.log('No PayMent Setting Record Found')
            }
        })

         var promise = settingService.get("PasswordSettings");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.password = data.rows.item(0).SettingsValue;
                
            } else {
                console.log('No Password Setting Record Found');
            }
        })


        var promise = salesService.get("233", undefined, undefined);
        promise.then(function(data) {
            console.log(data)
        })
        var promise = salesService.getSalesReport("1485937937792.0", undefined);
        promise.then(function(data) {
            console.log(data)
        })

        $state.go('app.home');
    });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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
                templateUrl: 'templates/Reports.html'
            }
        }
    }).state('app.TaxSettings', {
        url: '/TaxSettings',
        views: {
            'menuContent': {
                controller: 'taxSetting',
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
    })
    .state('app.salesReport', {
        url: '/salesReport',
        views: {
            'menuContent': {
                
                templateUrl: 'templates/salesReport.html'
            }
        }
    })
    .state('app.productReport', {
        url: '/productReport',
        views: {
            'menuContent': {
                templateUrl: 'templates/productReport.html'
            }
        }
    })

    .state('app.editProducts', {
        url: '/editProducts',
        views: {
            'menuContent': {
                templateUrl: 'templates/editProducts.html'
            }
        }
    })

      .state('app.passwordChange', {
        url: '/passwordChange',
        views: {
            'menuContent': {
                templateUrl: 'templates/passwordChange.html'
            }
        }
    })

    .state('app.billdetails', {
        url: '/billdetails',
        views: {
            'menuContent': {
                templateUrl: 'templates/BillDetails.html'
            }
        }
    })

   .state('app.bluetoothsettings', {
        url: '/bluetoothsettings',
        views: {
            'menuContent': {
                templateUrl: 'templates/bluetoothSettings.html'
            }
        }
    })


    .state('Test1', {
        url: '/Test',
        templateUrl: 'templates/Keypad.html',
    }).state('Splash', {
        url: '/Splash',
        templateUrl: 'templates/Splash.html',
    })
    $urlRouterProvider.otherwise('/Splash');

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
