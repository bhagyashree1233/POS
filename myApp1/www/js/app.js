// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controller', 'ion-digit-keyboard', 'ngCordova']).run(function($ionicPlatform, $cordovaSQLite, $rootScope,$q) {
   var dfd = $q.defer();
    $rootScope.deviceReady = dfd.promise;
   $ionicPlatform.ready(function() {
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
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Category (CategoryId text primary key, CategoryName text, CategoryDesc text)").then(console.log('Category table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Product (ProductId text primary key, ProductName text, ProductUnit text, ProductPrice real, TaxId integer, BuyingPrice real, TaxRate real, ItemsinStock real, Discount real, Category text, Image text)").then(console.log('Product table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Transaction (BillNo integer, DateTime text, ProductId text, ProductName text, Quantity real, ProductPrice real, Discount real, TaxRate real, TaxId integer, Category text, CategoryName text)").then(console.log('Transaction table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS BillDetails (BillNo integer, TotalPrice real, DiscountAmount real, TaxAmount real, TotalAmount real, PaymentMethod text, DateTime text, TotalItems integer, BillStatus text)").then(console.log('BillDetails table created Successfully'));
        //$cordovaSQLite.execute($rootScope.db, 'DROP  table Settings').then( console.log('Settings table deleted Successfully'));

   $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Settings (SettingsName text PRIMARY KEY ,SettingsValue TEXT)').then( console.log('Settings table created Successfully'));
    $cordovaSQLite.execute($rootScope.db, 'Select SettingsValue  from Settings where SettingsName="PrinterFormatSettings"')
        .then(function(result) {
            //$scope.statusMessage = "Message saved successful, cheers!";
            console.log(result.rows.length)
            if(result.rows.length==1){
          $rootScope.printFormatSettings=console.log(JSON.parse(result.rows[0].SettingsValue))
           
            }else{
          $rootScope.printFormatSettings={}
            }
        }, function(error) {
            //$scope.statusMessage = "Error on saving: " + error.message;
            console.log(error)
        }) 
        $cordovaSQLite.execute($rootScope.db, 'Select SettingsValue  from Settings where SettingsName="TaxSettings"')
        .then(function(result) {
            //$scope.statusMessage = "Message saved successful, cheers!";
            console.log(result.rows.length)
            if(result.rows.length==1){
            	console.log(result.rows[0])
          $rootScope.TaxSettings=JSON.parse(result.rows[0].SettingsValue)
          console.log( $rootScope.TaxSettings)
           dfd.resolve( $rootScope.TaxSettings ); 
            }else{
          $rootScope.TaxSettings=[];
            }
        }, function(error) {
            //$scope.statusMessage = "Error on saving: " + error.message;
            console.log(error)
        })
		 });
})
        /*        
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
     */

    
   
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
