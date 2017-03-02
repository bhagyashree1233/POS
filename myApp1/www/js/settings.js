angular.module('starter.settingscontroller', [])


.controller('taxSetting', ['$scope', '$rootScope', '$state', '$cordovaSQLite', '$ionicPlatform', 'settingService', function($scope, $rootScope, $state, $cordovaSQLite, $ionicPlatform, settingService) {    
    console.log('I am in tax  settings');

    $scope.taxSettings = [];
    $scope.txSetting = {};
    $scope.tax={}
    $scope.addView=true;
    console.log($rootScope.TaxSettings.length);
    for( var i=0;i<$rootScope.TaxSettings.length;i++){
    $scope.taxSettings[i] = {
        id: $rootScope.TaxSettings[i].id,
        name: $rootScope.TaxSettings[i].name,
        taxRate: $rootScope.TaxSettings[i].taxRate
    };
    }
    //$scope.taxSettings=[]
    console.log($scope.taxSettings);
    
    var taxSettings = []
    console.log($rootScope.TaxSettings)

    $scope.add=function(tax){
       $scope.tax=tax
        for(var i=0;i<$rootScope.TaxSettings.length;i++){
            if(tax.id==$rootScope.TaxSettings[i].id){
                 $scope.tax=tax;
                console.log($rootScope.TaxSettings[i].taxRate);
            }
        }
    }
    

    $scope.saveTaxSetting = function(taxid) {
        console.log($scope.taxSettings);
          var taxNme=$scope.txSetting.name;
    if(taxNme==undefined ||taxNme.length<1){
        console.log('Enter tax Setting')
        return false
    }


    var taxRate=$scope.txSetting.taxRate;
    if(taxRate==undefined ||taxRate.length<1){
        console.log('Enter tax Rate')
    }else if(!taxRate.match(/^[0-9]+([,.][0-9]+)?$/g)){
        console.log('Invalid tax Rate')
        return false
    }

        var d = new Date();
        $scope.taxSettings.push({
             id:d,
           name: $scope.txSetting.name,
           taxRate:$scope.txSetting.taxRate
        })

        
         $scope.SaveTaxSettingsToDB($scope.taxSettings);
    }


    $scope.SaveTaxSettingsToDB= function(taxsettings1)
    {

     var taxSettings = JSON.stringify(taxsettings1);

        var promise = settingService.set("TaxSettings", taxSettings);
        promise.then(function(data) {
            console.log(data);
            if (data.rowsAffected >= 1) {
                console.log("Data inserted");
                 $scope.txSetting = {};
                 $scope.addView = true;
                 $rootScope.TaxSettings = taxSettings1;

            } else { 
                console.log('Unable to Save TaxSettings');
            }
        })

    }


$scope.GetTaxIndex = function(taxId)
{
  for(var i=0;i<$scope.TaxSettings.length;i++){

            if(taxId==$rootScope.TaxSettings[i].id)
            {
               return(i);
           
            }
  
  }

  return(-1);

}

$scope.deleteTaxSettings=function(taxId)
{
 var ind = $scope.GetTaxIndex(taxId);

        if(ind >-1)//found index;;
        {
             //delete taxSettings
             $scope.TaxSettings.splice(ind,1);
             $scope.SaveTaxSettingsToDB($scope.TaxSettings);
             console.log("Deleted");
        }

}

    $scope.editTaxSetting=function(taxId){

        var taxNme=$scope.txSetting.name;
    if(taxNme==undefined ||taxNme.length<1){
        console.log('Enter tax Setting')
        return false
    }


    var taxRate=$scope.txSetting.taxRate;

    if(taxRate==undefined ||taxRate.length<1){
        console.log('Enter tax Rate')
    }else if(!taxRate.match(/^[0-9]+([,.][0-9]+)?$/g)){
        console.log('Invalid tax Rate')
        return false
    }

     var ind = $scope.GetTaxIndex(taxId);

        if(ind >-1)//found index;;
        {
            $scope.taxSettings[ind].name = $scope.txSetting.name;
            $scope.taxSettings[ind].taxRate = $scope.txSetting.taxRate;
            //$scope.taxSettings[ind].id = ind;
            $scope.SaveTaxSettingsToDB($scope.taxSettings);

        }
        else
        {
          console.log("Tax Settings Not Found");
          $rootScope.ShowToast("Tax Settings Not Found",false);

        }

     
    }

$scope.view=function(tax){
$scope.addView=false;
$scope.txSetting.id=tax.id;
$scope.txSetting.name=tax.name;
$scope.txSetting.taxRate=tax.taxRate;
   }


    
}])



.controller('printerSettings', function($scope, settingService, $rootScope) {
    $scope.printFormatSettings = {};
    $scope.printFormatSettings['addressLine1'] = $rootScope.printFormatSettings.addressLine1;
    $scope.printFormatSettings.addressLine2 = $rootScope.printFormatSettings.addressLine2,
        $scope.printFormatSettings.billCopies = $rootScope.printFormatSettings.billCopies,
        $scope.printFormatSettings.greeting = $rootScope.printFormatSettings.greeting,
        $scope.printFormatSettings.phNumber = $rootScope.printFormatSettings.phNumber,
        $scope.printFormatSettings.shopName = $rootScope.printFormatSettings.shopName,
        $scope.printFormatSettings.strtBillNmbr = $rootScope.printFormatSettings.strtBillNmbr,
        $scope.printFormatSettings.tin = $rootScope.printFormatSettings.tin,
        $scope.printFormatSettings.tokNum = $rootScope.printFormatSettings.tokNum,
        $scope.printFormatSettings.tokResetAftr = $rootScope.printFormatSettings.tokResetAftr,
        $scope.printFormatSettings.tokStartNmbr = $rootScope.printFormatSettings.tokStartNmbr,
        $scope.printFormatSettings.wifiSsid = $rootScope.printFormatSettings.wifiSsid
    $scope.savePrinterSettings = function() {
        var shopName=$scope.printFormatSettings.shopName;
        var pattern= new RegExp(/^[a-z0-9]+$/i);
        if(shopName==undefined||shopName.length<2){
            $rootScope.ShowToast("Enter Shop Name", false);
                console.log('Enter Shop Name')
                return false
            }
        var number1=$scope.printFormatSettings.phNumber;
        var pattern= new RegExp('^[0-9\+\]+$');
        if(!pattern.test(number1)){
            $rootScope.ShowToast("Invalid Number", false);
            console.log('Invalid Number')
            return false 
        }
        var tinNum=$scope.printFormatSettings.tin;
        var pattern= new RegExp('^[0-9]+$');
        if(!pattern.test(tinNum)){
            $rootScope.ShowToast("Invalid TIN Number", false);
           
        }
       
        var billNumber=$scope.printFormatSettings.strtBillNmbr;
        var pattern= new RegExp('^[0-9]+$');
        if(billNumber==undefined||billNumber.length<1){
            document.getElementById('billNumber').value=1;
        }else if(!pattern.test(billNumber)){
            console.log('Invalid bill Number')
            return false
        }
        var trtTokenNum=$scope.printFormatSettings.tokStartNmbr;
         var pattern= new RegExp('^[0-9]+$');
        console.log(trtTokenNum)
        if(trtTokenNum==undefined||trtTokenNum.length<1){
            document.getElementById('trtTokenNum').value=1;
        }else if(!pattern.test(trtTokenNum)){
            console.log('Invalid Token Number')
            return false
        }
        
       var restTokenNum=$scope.printFormatSettings.tokResetAftr;
           var pattern= new RegExp('^[0-9]+$');
        if(restTokenNum==undefined||restTokenNum.length<1){
            document.getElementById('restTokenNum').value=999;
        }else if(!pattern.test(restTokenNum)||restTokenNum<trtTokenNum){
            console.log('Invalid Input or reset should be greater then start token number')
            return false
        }
       var billCopies=$scope.printFormatSettings.billCopies;
       if(billCopies==undefined||billCopies.length<1){
            document.getElementById('billCopies').value=1;
        }
       
        console.log($scope.printFormatSettings)
        var printFormatSettings = JSON.stringify($scope.printFormatSettings);
        var promise = settingService.set("PrinterFormatSettings", printFormatSettings);
        promise.then(function(data) {
            console.log(data)
            if (data.rowsAffected >= 1) {
                var promise = settingService.get("PrinterFormatSettings", printFormatSettings);
                promise.then(function(data) {
                    $rootScope.printFormatSettings = JSON.parse(data.rows.item(0).SettingsValue);
                })
            } else {
                console.log('No PrinterFormatSettings Record Found')
            }
        })
    }
})




.controller('BlueToothCtrl', function($scope, settingService, $rootScope) {

$scope.CurrentDevice = "";

//$rootScope.InitPrinter();


$scope.SaveBluetoothSettings = function(btsettings)
{

var promise = settingService.set("bluetoothSettings", JSON.stringify(btsettings));
            promise.then(function(data) {
            //console.log(data.rows.length);
            console.log(data)
            if (data.rowsAffected >= 1)
            {
                console.log("Settings Saved");
                $rootScope.ShowToast("BT Settings Saved",false);
                $rootScope.BluetoothSettings = btsettings;
            }
        })
}

function OnSuccessPairedList(data,status)
{
 if(status ==false)
  {
      console.log("Unable to Get Paired List");
      $rootScope.ShowToast("Unable to Get Paired List");
     
  }
  else
  {
      console.log("Success getting Paired List");
       $scope.pairedDevices = [];
       for(var i=0;i<data.length;i++)
       {
           $scope.pairedDevices[i] = {};
           $scope.pairedDevices[i].name = data[i];
           if(data[i] == $rootScope.printerName && $rootScope.PrinterStatus == true)
           {
            $scope.pairedDevices[i].status = "connected";
           }
           else
           {
            $scope.pairedDevices[i].status = "not connected";
           }
       }
      //$rootScope.ShowToast("Unable to Get Paired List");
  }

}

//$scope.getPairedList = function()
//{
    //$scope.CurrentDevice = "";

    $rootScope.getPairedList(OnSuccessPairedList);
//}

$scope.selectDevice = function(device)
{
$scope.CurrentDevice = device;
console.log("sel Device is: ", device);
$rootScope.ShowToast("Sel Device: " + device, false);
}



function OnsuccessConnect(status,name)
{
   if(status == true)
   {
       console.log("Sucessfully Connected to Printer: ", $scope.CurrentDevice);
       $rootScope.ShowToast("Sucessfully Connected to Printer: " + $scope.CurrentDevice, false);
       $rootScope.printerName = name;
       $rootScope.PrinterStatus = true;
       var btsettings = {};
       btsettings.PrinterName = name;
       $scope.SaveBluetoothSettings(btsettings);
       $rootScope.getPairedList(OnSuccessPairedList);

   }
   else
   {
       console.log("Failed to Connect to Printer: ", $scope.CurrentDevice);
       $rootScope.ShowToast("Failed to Connect to Printer: "+ $scope.CurrentDevice,false);
       $rootScope.printerName = "";
       $rootScope.getPairedList(OnSuccessPairedList);
   }

}

function OnDisconnectSuccess(ret)
{
   if(ret == true)
   {
       console.log($rootScope.printerName, " Printer Disconnected");
       $rootScope.ShowToast($rootScope.printerName + " Printer Disconnected", false);
       $rootScope.PrinterStatus = false;
       $rootScope.getPairedList(OnSuccessPairedList);
   }
   else
   {
       console.log($rootScope.printerName, " Unable to Disconnect");
       $rootScope.ShowToast($rootScope.printerName + ": Unable to Disconnect",false);
       $rootScope.PrinterStatus = false;
       $rootScope.getPairedList(OnSuccessPairedList);
   }

}

$scope.disconnect = function()
{
    if($rootScope.printerName == "" || $rootScope.PrinterStatus == false)
     {
         console.log("Nothing to Disconnect");
         $rootScope.ShowToast("Not Connected to Printer");
         $rootScope.PrinterStatus = false;
         return;
     }

    $rootScope.printerDisconnect($rootScope.printerName,OnDisconnectSuccess);
}

$scope.connect = function()
{
    if($scope.CurrentDevice == "")
    {
        console.log("No Device to Connect");
        $rootScope.ShowToast("No device to Connect",false);
        //toast;;
        return;
    }

    if($rootScope.PrinterStatus == true)
    {
      console.log("printer Already Connected");
      $rootScope.ShowToast("Please Disconnect before Reconnecting",false);
      return;
    }


    console.log("connecting to device: ", $scope.CurrentDevice);

    $rootScope.ShowToast("connecting to device: " + $scope.CurrentDevice ,false);

   $rootScope.printerConnect($scope.CurrentDevice,OnsuccessConnect);

}

$scope.testPrint = function()
{

$rootScope.Testing();
     return;
/*
BTPrinter.printText(function(data){
    console.log("Success");
    $rootScope.ShowToast("Test Print Success");
    console.log("data received:" ,data);
},function(err){
    console.log("Error");
     $rootScope.ShowToast("Failed to Test Print");
    console.log(err)
}, "PayUPad Test Print\n")*/

}


})

.controller('paymentSettings', function($scope, settingService, $rootScope) {
    $scope.Options ={};
    $scope.Options.SelCurrency = {};
    $scope.Options.SelPaymentMode=[];
    //$scope.paymentSetting = {};
    jQuery.getJSON('json/CurrencyOptions.json', function(data) {
         $scope.paymentSetting = {};
         $scope.paymentSetting.currency = data.CurrencyOptions;
         $scope.paymentSetting.paymentOptions = data.PaymentMode;
         console.log($rootScope.PaymentSettings);
         $scope.Options.SelCurrency =   $rootScope.PaymentSettings.CurrencyOptions.id;

         console.log($scope.Options.SelCurrency);
         console.log($scope.paymentSetting.currency);

         console.log("$rootscope.paymentsettings : ",$rootScope.PaymentSettings);
         //$scope.paymentSetting.paymentOptions[0].sel = true;

         for(var i=0;i<$scope.paymentSetting.paymentOptions.length;i++)
         {
             for(var k=0;k<$rootScope.PaymentSettings.PaymentMode.length;k++)
             {
                 if($scope.paymentSetting.paymentOptions[i].id == $rootScope.PaymentSettings.PaymentMode[k].id)
                  {
                      $scope.paymentSetting.paymentOptions[i].sel = true;
                      break;
                  }
             }
           
           
         }

         //$scope.Options.SelPaymentMode = $rootScope.PaymentSettings.PaymentMode;
        });

    
    $scope.savePaymentSettings = function() {
        console.log("Chosen Currency: ", $scope.Options.SelCurrency);
        var tempPaymentSettings = {};

        for(var j=0;j<$scope.paymentSetting.currency.length;j++)
        {
          if($scope.paymentSetting.currency[j].id == $scope.Options.SelCurrency)
          {
              tempPaymentSettings.CurrencyOptions = $scope.paymentSetting.currency[j];
              break;
          }

        }

        tempPaymentSettings.PaymentMode = [];
        for(var i=0;i<$scope.paymentSetting.paymentOptions.length;i++)
        {
          if($scope.paymentSetting.paymentOptions[i].sel!=undefined && $scope.paymentSetting.paymentOptions[i].sel == true)
          {
            tempPaymentSettings.PaymentMode.push($scope.paymentSetting.paymentOptions[i]);

          }

        }
         
        if(tempPaymentSettings.PaymentMode.length<=0) //load defaults;;
           {
              tempPaymentSettings.PaymentMode.push($scope.paymentSetting.paymentOptions[0]);
               
           }

           console.log("Sel Pay Method: ", tempPaymentSettings);
           var paymentSetting = JSON.stringify(tempPaymentSettings);

            var promise = settingService.set("PaymentSettings", paymentSetting);
            promise.then(function(data) {
            console.log(data.rows.length);
            console.log(data)
            if (data.rowsAffected >= 1) {
                var promise = settingService.get("PaymentSettings", paymentSetting);
                promise.then(function(data) {
                    $rootScope.PaymentSettings = JSON.parse(data.rows[0].SettingsValue);
                    $rootScope.ShowToast("Payment Settings Updated",false);  
                    console.log("Payment Settings Updated");
                })
            } else {
                console.log('No PayMent Setting Record Found')
                $rootScope.ShowToast("Unable to update Payment Settings",false); 
            }
        })
         //handle error in promise;;

       // console.log("chosen Options:")
        /*console.log($scope.paymentSetting);

        
       */
    }

})


.controller('reportSettings', function($scope,$rootScope,settingService) {
    $scope.reportObj = {}
    $scope.reportObj.storeCloud=$rootScope.Reports.storeCloud;
    $scope.reportObj.sendEmail=$rootScope.Reports.sendEmail;
    $scope.reportObj.emailAddress=$rootScope.Reports.emailAddress;
    $scope.reportObj.sendSMS=$rootScope.Reports.sendSMS;
    $scope.reportObj.smsLowStock=$rootScope.Reports.smsLowStock;
    $scope.reportObj.smsDailyCollection=$rootScope.Reports.smsDailyCollection;
    $scope.reportObj.smsPhoneNo=$rootScope.Reports.smsPhoneNo;
    
    console.log($scope.reportObj)
    $scope.saveReports = function() {
        var sendEmailReport=$scope.reportObj.sendEmail;
        var sendEmail=$scope.reportObj.emailAddress;
        if(sendEmailReport==true){
         if(sendEmail==undefined || sendEmail.length<=2){
             $rootScope.ShowToast("Enter Email ID", false);
             console.log('Enter Email ID')
             return false
         }
        }
        var sendSMSAlert= $scope.reportObj.sendSMS;
        var phNo=$scope.reportObj.smsPhoneNo;
        if(sendSMSAlert==true){
         if(phNo==undefined || phNo<7){
           $rootScope.ShowToast("Enter Phone Number or Valid Phone Number", false);
             console.log('Enter Phone Number or Valid Phone Number')
             return false  
         }else if(!phNo.match('^[0-9\+\]+$')){
            $rootScope.ShowToast("Enter Valid Phone Number", false);
             console.log('Enter Valid Phone Number')
             return false   
         }
        }
         var reportsObj = JSON.stringify($scope.reportObj);
        var promise = settingService.set("Reports", reportsObj);
        promise.then(function(data) {
            console.log(data.rows.length);
            console.log(data)
            if (data.rowsAffected >= 1) {
                var promise = settingService.get("Reports", reportsObj);
                promise.then(function(data) {
                    $rootScope.Reports = JSON.parse(data.rows[0].SettingsValue);
                    console.log($rootScope.Reports)
                })
            } else {
                console.log('No PayMent Setting Record Found')
                var currency = $rootScope.PaymentSettings.currency.split(' ');
                var currencyName = currency[0];
                var currencySymbol = currency[1];
                $rootScope.currencySymbol = currencySymbol;
            }
        })
        console.log($scope.reportObj)
    }
});