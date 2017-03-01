
angular.module('starter.globalcontroller', [])

.controller('global',function($rootScope,$scope,$cordovaSQLite,$state,$cordovaToast,$scope, $ionicLoading,$ionicPopup){
  console.log('Hello hai');
   $rootScope.Mode = 0;
   $rootScope.SelCat ='0';
   $rootScope.CreateMode = 0;
   $rootScope.PrevSelCat='0';
   $rootScope.CurrentProduct={};

   $rootScope.password = "password123";
   $rootScope.printerName = "";
   $rootScope.PrinterStatus = false; 

   $rootScope.PrintElement = 
   {
       type : "",
       data : ""
   }

   $rootScope.PrintQueue = [];
   $rootScope.IsPrinting =false;


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

$rootScope.BluetoothSettings = 
{
  PrinterName: ""
}

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


   $rootScope.ShowPopUpPassword = function()
   {

     //$rootScope.Testing();
     //return;

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


//print functions;;

$rootScope.InitPrinter = function()
{

BTPrinter.BTStateDisconnect(function(data)
{
console.log("printer Disconnection Notification");
$rootScope.ShowToast("printer Disconnection Notification",false);
$rootScope.PrinterStatus = false;
},function(err)
{
  console.log("error Disconnection");   
})

}

$rootScope.printerDisconnect= function (PrinterName,callbackFunc)
{
BTPrinter.disconnect(function(data){
    console.log("Success");
    console.log(data)
    callbackFunc(true);
},function(err){
    console.log("Error");
    console.log(err);
    callbackFunc(false);
}, PrinterName)

}

$rootScope.connectCallBack= function(status,PrinterName)
{
    if(status == true)
    {
        console.log("Connected to Printer: ", PrinterName);
        $rootScope.ShowToast("Connected to Printer: " + PrinterName,false);
        $rootScope.PrinterStatus = true;
    }
    else
    {
        console.log("Failed to Connect Printer: ", PrinterName);
        $rootScope.ShowToast("Failed to Connect Printer: " + PrinterName,false);
        $rootScope.PrinterStatus = false;

    }
}

$rootScope.printerConnect = function (name,callbackFunc)
{

   BTPrinter.connect(function(data){
    console.log("Success");
    
    console.log(data)
    callbackFunc(true,name);
    },
    function(err){
    console.log("Error");
    //$rootScope.ShowToast("Failed to Connect");
    console.log(err);
    callbackFunc(false,name);
    },name)
}

$rootScope.getPairedList = function (callbackFunc)
{

    BTPrinter.list(function(data){
        console.log("Success");
        console.log(data); //list of printer in data array
        callbackFunc(data,true);

    },function(err){
        console.log("Error");
        console.log(err);
        callbackFuncdata({},false);
    })
}

$rootScope.Testing= function()
{
    $rootScope.PrintInit();
    $rootScope.PrintEnableUnderline(true);
    $rootScope.PrintEnableBold(true);
    $rootScope.PrintAlign("center");
    $rootScope.PrintChangeBigFont("both");
    $rootScope.PrintText("Super Shop\n\n");
    $rootScope.PrintEnableUnderline(false);
    $rootScope.PrintChangeBigFont("normal");
    $rootScope.PrintAlign("left");
    $rootScope.PrintText("sample without Underline\n");
    $rootScope.PrintEnableBold(false);
    $rootScope.PrintText("sample without bold\n");
    $rootScope.EndPrint($rootScope.testSuccess,$rootScope.testError);
}

$rootScope.testSuccess=function()
{
    console.log("Success Success");
}

$rootScope.testError=function()
{
    console.log("Error Error");
}

$rootScope.PrintInit= function()
{
   $rootScope.PrintQueue = [];
   $rootScope.IsPrinting =false;
}

$rootScope.EndPrint = function(SuccessCallBack,ErrorCallBack)
{
  var Element = 
  {
    type:"PRINTEND",
    successfunc: SuccessCallBack,
    errorfunc:ErrorCallBack
  }
$rootScope.PrintQueue.push(Element);
}


$rootScope.PrintText= function(data)
{
$rootScope.PushToQueue("TEXT",data);
$rootScope.StartPrintQueue();
}

$rootScope.PrintEnableBold = function(bold)
{
 //allow : 1B 45 01
 //ban :   1B 45 00
  var data = "";
  if(bold ==true)
   data = "1B 45 01";
   else
   data = "1B 45 00";
$rootScope.PushToQueue("POS",data);

}

$rootScope.PushToQueue= function(type,data)
{
    var Element =
    {
      type : type,
      data : data

    }

    $rootScope.PrintQueue.push(Element);
    console.log($rootScope.PrintQueue);
    //initiate print if queue was empty;;

}

$rootScope.GetFromQueue=function()
{
 var item = [];
 if($rootScope.PrintQueue.length >0)
 item =$rootScope.PrintQueue.splice(0,1);

 console.log("spliced item: " ,item[0]);
 return(item[0]);
}

$rootScope.PrintEnableUnderline = function(underline)
{
 //allow : 1C 2D 01
 //ban :   1C 2D 00

 var data = "";
  if(underline ==true)
   data = "1C 2D 01";
   else
   data = "1C 2D 00";
$rootScope.PushToQueue("POS",data);


}

$rootScope.PrintChangeBigFont = function(fontSize)
{
    //potrait zoom: 1D 21 01
    //hori zoom: 1D 21 10
    //overall zoom: 1D 21 11
    //Remove Zoom : 1D 21 00
    var data  = "";
    if(fontSize == "vertical")
    data = "1D 21 01";
    else if(fontSize=="horizontal")
    data = "1D 21 10";
    else if(fontSize=="both")
    data = "1D 21 11";
    else
    data = "1D 21 00";

 $rootScope.PushToQueue("POS",data);


}

$rootScope.PrintAlign = function(side)
{
    //left, right, center;;

    //left: 1B 61 00
    //center: 1B 61 01
    //right: 1B 61 02


    //page feed: OC

    //Init: 1B 40
    //newline: 0A
    //horizon tab : 09
    //detect model : 1B 2B

var data = "";
  if(side =="right")
   data = "1B 61 02";
   else if(side=="center")
   data = "1B 61 01";
   else
   data = "1B 61 00"; //left

   $rootScope.PushToQueue("POS",data);



}


$rootScope.OnPrintError = function(err)
{
console.log("Error Occured while printing");
console.log(err);
//try to reconnect to printer, by using alert box;;
//if user presses cancel, go back to user's errorfunction;;
}

$rootScope.StartPrintQueue = function()
{


    console.log("print Queue: ", $rootScope.PrintQueue);

    if($rootScope.IsPrinting == true)
      return;

var item = $rootScope.GetFromQueue();
console.log("item: ", item);
if(item != undefined)
{
    $rootScope.IsPrinting =true;

    if(item.type == "POS")
     {
         console.log("Printing POS Command");
         console.log(item);
         $rootScope.SendPosCommand(item.data,$rootScope.StartPrintQueue,$rootScope.OnPrintError);
     }
     else if(item.type == "PRINTEND") //end of print;;
     {
         //$rootScope.StartPrintQueue();
         $rootScope.SendPosCommand("0A",$rootScope.StartPrintQueue,$rootScope.OnPrintError);
         item.successfunc();
     }
     else
     {
         console.log("Printing Text");
         console.log(item);
         $rootScope.SendPrintCommand(item.data,$rootScope.StartPrintQueue,$rootScope.OnPrintError);
     }
}
else
{
  $rootScope.IsPrinting = false;
  console.log("finished printing");
}



}

$rootScope.SendPosCommand = function(cmd,callbackFunc,callbackError)
{

BTPrinter.printPOSCommand(function(data){
    console.log("Success");
    console.log(data);
    $rootScope.IsPrinting = false;
    callbackFunc();
},function(err){
    console.log("Error");
    console.log(err); //socket closed
    callbackError(err);
}, cmd)

}



$rootScope.SendPrintCommand = function(text,callbackFunc,callbackError)
{

BTPrinter.printText(function(data){
    console.log("Success");
    $rootScope.ShowToast("Print Success");
    console.log(data);
    $rootScope.IsPrinting = false;
    callbackFunc();
},function(err){
    console.log("Error");
     $rootScope.ShowToast("Failed to Test Print");
    console.log(err)
    callbackError(err);
}, text);

}   
   

})
