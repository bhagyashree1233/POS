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




angular.module('starter.globalcontroller', [])

.controller('global',function($rootScope,$scope,$cordovaSQLite){
  console.log('Hello hai')



})
