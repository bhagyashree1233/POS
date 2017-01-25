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

$rootScope.TaxSettings=[{}]
$rootScope.PaymentSettings={
   currency:'Inr',
   paymentOptions:[]
}

})
