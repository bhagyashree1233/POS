angular.module('starter.globalcontroller', [])

.controller('global',function($rootScope,$scope,$cordovaSQLite){
$rootScope.printFormatSettings={
addressLine1:"",
addressLine2:"",
billCopies:1,
greeting:"",
phNumber:null,
shopName:"",
strtBillNmbr:1,
tin:"",
tokNum:true,
tokResetAftr:1,
tokStartNmbr:999,
wifiSsid:""}

$rootScope.TaxSettings=[{
    id:0,
    name:'',
    taxRate:0.0
}]
$rootScope.PaymentSettings={
   currency:'Inr',
   paymentOptions:[{
   cash:true,
    master: false,
     amex: false,
     payTM: false,
     visa: false
  } ]
}

})
