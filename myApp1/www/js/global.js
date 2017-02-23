
angular.module('starter.globalcontroller', [])

.controller('global',function($rootScope,$scope,$cordovaSQLite,$state,$cordovaToast,$scope, $ionicLoading,$ionicPopup){
  console.log('Hello hai');
   $rootScope.Mode = 0;
   $rootScope.SelCat ='0';
   $rootScope.CreateMode = 0;
   $rootScope.PrevSelCat='0';
   $rootScope.CurrentProduct={};

   $rootScope.password = "password123";

   $rootScope.VolatileData =
   {
    CurrentBillNo: 1,
    CurrentTokenNo:1
   };

   $rootScope.printFormatSettings = {
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
      wifiSsid:""
};

$rootScope.TaxSettings=[
{
    id:0,
    name:'sampleTax',
    taxRate:0.0
}
];




$rootScope.Reports={
        storeCloud: false,
        sendEmail:false,
        emailAddress:'',
        sendSMS:false,
        smsLowStock:false,
        smsDailyCollection:false,
        smsPhoneNo:''
    };


   $rootScope.PaymentSettings = 
   {
     CurrencyOptions:
     {
     id :0,
     name :"Rupee",
     symbol : "Ru",
     },
     PaymentMode:
     [
      {
      id : 1,
      name : "Cash",
      desc : "Cash Payment Mode"
      }

     ]

   }

   $rootScope.showPaymentMode = function()
   {
     var AvailButtons = [];
     console.log($rootScope.PaymentSettings.PaymentMode);
     //$scope.returnvalues=[];
     for(var i=0; i<$rootScope.PaymentSettings.PaymentMode.length;i++)
     {
         //$scope.returnvalues.push()
         var name = $rootScope.PaymentSettings.PaymentMode[i].name;
       var newbutton = 
       {
         text : $rootScope.PaymentSettings.PaymentMode[i].name,
         onTap: function (e) { console.log(e); return e.originalEvent.target.childNodes[0];}
       }
      AvailButtons.push(newbutton);

     }

        $ionicPopup.show({
              title: 'Payment Mode',
              subTitle: 'Select Payment Mode',
              scope:$scope,
              buttons: AvailButtons

   }).then(function(res) {
              console.log('Sel Button is', res);
              if(res=="Cash")
              {
                  
              }
             

});


   }

   $rootScope.ShowPopUpPassword = function()
   {
     if($rootScope.Mode ==1)//already in admin mode;;
     {
       $rootScope.OnModeChangeClick();
       return;

     }
     $scope.result ={};
     $scope.result.done=false;
     $scope.result.text="";
    $ionicPopup.prompt({
              template: '<input type="password" ng-model="result.text">',
              title: 'Password Check',
              subTitle: 'Enter admin password',
              inputType: 'password',
              inputPlaceholder: 'Your password',
              scope:$scope,

              buttons: [
              { text: 'Cancel', onTap: function(e) { return $scope.result; } },
              {
                  text: '<b>OK</b>',
                  type: 'button-positive',
                  onTap: function(e) { $scope.result.done=true; return $scope.result;}
              }

              ]
   }).then(function(res) {
              console.log('Your password is', res);
              if(res.done ==true)
              {
                if(res.text=='payupad123' || res.text==$rootScope.password)
                  $rootScope.OnModeChangeClick();
                else
                 {
                 console.log("Wrong Password");
                 $rootScope.ShowToast("Wrong Password",false);
                 }
              }

});


   }

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
