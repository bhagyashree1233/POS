// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'starter.controller', 'starter.services', 'ngCordova', 'starter.globalcontroller', 'starter.keypad', 'ion-floating-menu', 'starter.reportscontroller', 'starter.settingscontroller', 'ionic-sidetabs', 'divBlur', 'draggable', 'tabSlideBox', 'starter.filter', 'angularMoment']).run(function($ionicPlatform, $cordovaSQLite, $rootScope, $q, $ionicLoading, settingService, salesService, dbService, $state) {

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
            //cordova.plugins.Keyboard.disableScroll(false);
            //ionic.Platform.isFullScreen = true;
        }
         if (window.StatusBar) {
           //StatusBar.styleDefault();
           StatusBar.hide();
         }
        window.addEventListener('native.keyboardhide', function(e) {
            //show stuff on keyboard hide
            StatusBar.hide();
            console.log("keyboard hidden");
            window.AndroidFullScreen.immersiveMode(false, false);
        });

        //}

        /*function errorFunction(error) { console.error(error); }
  AndroidFullScreen.isSupported(AndroidFullScreen.immersiveMode, errorFunction);
                
            //ionic.Platform.fullScreen();
        }*/
        /*
if (ionic.Platform.isAndroid()) {
window.addEventListener('native.keyboardhide', function (e) {
//show stuff on keyboard hide
StatusBar.hide();
console.log("keyboard hidden");
window.AndroidFullScreen.immersiveMode(false, false);
}); }
*/

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
       // showdbloading;;
       // $rootScope.printFormatSettings = printFormatSettings;
       // $rootScope.TaxSettings = TaxSettings;
       // $rootScope.PaymentSettings = PaymentSettings;
       // $rootScope.Reports=Reports;
       // $cordovaSQLite.execute($rootScope.db, "DROP TABLE TransactionDetails ").then(console.log('Transaction table droped Successfully')); 
       // $cordovaSQLite.execute($rootScope.db, "DROP TABLE BillDetails").then(console.log('TableInfo table droped Successfully')); 

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Category (CategoryId integer primary key AUTOINCREMENT, CategoryName text, CategoryDesc text)").then(console.log('Category table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Product (ProductId integer primary key AUTOINCREMENT, ProductName text, ProductUnit text, ProductPrice real, TaxId integer, BuyingPrice real, TaxRate real, ItemsinStock real, Discount real, CategoryId integer, CategoryName text, Image text, Favourite text)").then(console.log('Product table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS TransactionDetails (BillNo integer, DateTime text,DiscountAmount real, ProductId integer, ProductName text, Quantity real, ProductPrice real, TotalPrice real, TaxAmount real, TotalAmount real, Discount real, TaxRate real, TaxId integer, CategoryId integer, CategoryName text)").then(console.log('TransactionDetails table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS BillDetails (BillNo integer, TotalPrice real, DiscountAmount real, TaxAmount real, TotalAmount real, PaymentMethod text, DateTime text, TotalItems integer, BillStatus text)").then(console.log('BillDetails table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Settings (SettingsName text PRIMARY KEY ,SettingsValue TEXT)').then(console.log('Settings table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS TableInfo (id integer primary key AUTOINCREMENT, TableNumber text, TableDescription text, TableSectionId integer, TableSectionName text, TableCharges real, TableCapacity integer)").then(console.log('TableInfo table edited and created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS TableInfoSection (SectionId integer primary key AUTOINCREMENT, SectionName text, SectionDescription text)").then(console.log('TableInfoSection table created Successfully'));
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
            console.log("bluetooth: ", data)
            if (data.rows.length >= 1) {
                //console.log("Bluetooth Settings: ",  data.rows.item(0));
                $rootScope.BluetoothSettings = JSON.parse(data.rows.item(0).SettingsValue);
                $rootScope.printerName = $rootScope.BluetoothSettings.PrinterName;
                $rootScope.InitPrinter();

                if ($rootScope.printerName != "") {
                    if ($rootScope.PrinterStatus == false)
                        $rootScope.printerConnect($rootScope.printerName, $rootScope.ConnectStatusFunc);
                } else {
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

        var promise = settingService.get("VolatileData");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.VolatileData = JSON.parse(data.rows.item(0).SettingsValue);
                console.log("volatile data is: ", $rootScope.VolatileData);
            } else {
                console.log('No Data Setting Record Found');
                $rootScope.VolatileData.CurrentBillNo = 1;
                $rootScope.VolatileData.CurrentTokenNo = $rootScope.printFormatSettings.tokStartNmbr;
            }
        })

        $state.go('home');
    });
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('top');

    $stateProvider.state('Payments', {
        url: '/Settings',
        templateUrl: 'templates/Settings.html'

    }).state('PrinterSetting', {
        url: '/printerSettings',
        templateUrl: 'templates/PrinterSettings.html'

    }).state('PaymentSetting', {
        url: '/paymentSettings',
        templateUrl: 'templates/PaymentSettings.html'

    }).state('Reports', {
        url: '/Reports',
        templateUrl: 'templates/Reports.html'

    }).state('TaxSettings', {
        url: '/TaxSettings',
        controller: 'taxSetting',
        templateUrl: 'templates/TaxSettings.html'

    }).state('inventory', {
        url: '/inventory',

        templateUrl: 'templates/inventoryPage.html'

    }).state('category', {
        url: '/category',

        templateUrl: 'templates/categoryPage.html'

    }).state('product', {
        url: '/product',

        templateUrl: 'templates/productPage.html'

    }).state('home', {
        url: '/home',

        templateUrl: 'templates/homePage.html'

    }).state('billWiseReport', {
        url: '/billWiseReport',

        templateUrl: 'templates/billWiseReport.html'

    })
    .state('salesReport', {
        url: '/salesReport',

        templateUrl: 'templates/salesReport.html'

    })
    .state('itemReport', {
        url: '/itemReport',

        templateUrl: 'templates/itemReport.html'

    })
    .state('editProducts', {
        url: '/editProducts',

        templateUrl: 'templates/editProducts.html'

    })
    .state('passwordChange', {
        url: '/passwordChange',

        templateUrl: 'templates/passwordChange.html'

    })
    .state('billdetails', {
        url: '/billdetails',

        templateUrl: 'templates/BillDetails.html'

    })
    .state('bluetoothsettings', {
        url: '/bluetoothsettings',

        templateUrl: 'templates/bluetoothSettings.html'

    })
    .state('Test1', {
        url: '/Test',
        templateUrl: 'templates/Keypad.html',
    }).state('Splash', {
        url: '/Splash',
        templateUrl: 'templates/Splash.html',
    }).state('tableInfo', {
        url: '/tableInfo',
        templateUrl: 'templates/tableInfo.html',
    }).state('addEditTableInfo', {
        url: '/addEditTableInfo',
        templateUrl: 'templates/addEditTableInfo.html',
    })
    .state('addEditTableSection', {
        url: '/addEditTableSection',
        templateUrl: 'templates/addEditTableSection.html',
    })
    //$urlRouterProvider.otherwise('/Splash');

}).directive('limitChar', function() {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            limit: '=limit',
            ngModel: '=ngModel'
        },
        link: function(scope) {
            scope.$watch('ngModel', function(newValue, oldValue) {
                if (newValue) {
                    var length = newValue.toString().length;
                    if (length > scope.limit) {
                        scope.ngModel = oldValue;
                    }
                }
            });
        }
    };
})

.directive('textarea', function() {
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

 moment.locale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d sec",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})