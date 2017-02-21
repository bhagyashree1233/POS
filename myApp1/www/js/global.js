var printFormatSettings={
addressLine1:"",
addressLine2:"",
billCopies:1,
greeting:"",
phNumber:null,
shopName:"",
strtBillNmbr:1,
tin:"",
tokNum:true,
tokResetAftr:999,
tokStartNmbr:1,
wifiSsid:""}


var TaxSettings=[{
    id:0,
    name:'Hai',
    taxRate:0.0
}]

var PaymentSettings={
   currency:'USD ($)',
   paymentOptions:[{
   Cash:true,
    Master: false,
     Amex: false,
     PayTM: false,
     Visa: false
  } ]
}

var Reports={
        storeCloud: false,
        sendEmail:false,
        emailAddress:'',
        sendSMS:false,
        smsLowStock:false,
        smsDailyCollection:false,
        smsPhoneNo:''
    }



angular.module('starter.globalcontroller', [])

.controller('global',function($rootScope,$scope,$cordovaSQLite,$state,$cordovaToast, $ionicLoading){
  console.log('Hello hai');
   $rootScope.Mode = 0;
   $rootScope.SelCat ='0';
   $rootScope.CreateMode = 0;
   $rootScope.PrevSelCat='0';
   $rootScope.CurrentProduct={};

   $rootScope.OnModeChangeClick = function()
   {
     console.log("Toggle Clicked");
     if($rootScope.Mode == 0)
       $rootScope.Mode =1;
     else
     $rootScope.Mode =0;
     console.log($rootScope.Mode);

     if($rootScope.Mode == 1)//edit Mode;;
     {
       

     }

   }

   $rootScope.OnEditCategory = function()
   {
    console.log("On Edit Category");
    $rootScope.CreateMode =0;
     
    if($rootScope.SelCat !='favourite')
    $state.go('app.category');

   }


$rootScope.AddNewCat = function()
   { 
    console.log("On Add Category");
    $rootScope.CreateMode =1;
    $state.go('app.category');

   }

$rootScope.AddNewPro = function()
   {
    console.log("On Add Product");
    $rootScope.CreateMode =1;
    $state.go('app.product');

   }


$rootScope.EditPro = function()
   {
    console.log("On Edit Product");
    $rootScope.CreateMode =0;
    $state.go('app.product');

   }

       $rootScope.showDbLoading = function() {
            $ionicLoading.show({
                template: 'Loading...'
               // duration: 15000
            }).then(function() {
                console.log("The loading indicator is now displayed");
            });
        };
        $rootScope.hideDbLoading = function() {
            $ionicLoading.hide().then(function() {
                console.log("The loading indicator is now hidden");
            });
        };

   $rootScope.ShowToast = function(message,longx)
{
    if(window.cordova){
    if(longx == true)
    {

 $cordovaToast.showLongCenter(message).then(function(success) {
    // success
    console.log("Toast Success");
  }, function (error) {
    // error
    console.log("Toast Failed");
  });   
    }

else
{
$cordovaToast.showShortCenter(message).then(function(success) {
    // success
    console.log("Toast Success");
  }, function (error) {
    // error
    console.log("Toast Failed");
  });   

}}

}
   
   




})
