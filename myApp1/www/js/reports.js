angular.module('starter.reportscontroller', [])

.controller('billwiseReportCtrl', function($scope, salesService, $rootScope) {

    /*
BTPrinter.list(function(data){
        console.log("Success");
        console.log(data); //list of printer in data array
    },function(err){
        console.log("Error");
        console.log(err);
    })
*/

    $scope.Dte = {}
    $scope.salesReport = []
    $scope.totalAmount = {
        avgBillAmount: 0,
        taxAmount: 0,
        billAmt: 0,
        amountAftertax: 0
    };

    $scope.save = function() {

        var stDate;
        var edDate;
        var startDate = $scope.Dte.start;
        //console.log(startDate);
        var endDate = $scope.Dte.end;

        if (endDate < startDate) {
            console.log("Invalid Date Selected");
            $rootScope.ShowToast("Please select valid Date", false);
            return;
        }

        if (startDate == undefined && endDate == undefined) //no date entered;;
        {
            console.log("start and End Date undefined");
            startDate = new Date();
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate = new Date();
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            //return;

        } else if (startDate == undefined || endDate == undefined) {
            console.log('Select Start and End Date');
            $rootScope.ShowToast("Select Start and End Date", false);
            return false
        }
        else {
            startDate = $scope.Dte.start;
            endDate = $scope.Dte.end;

            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            // return;

        }

        var promise = salesService.getBillWiseReport(stDate, edDate);
        promise.then(function(data) {
            $scope.totalAmount.taxAmount = 0;
             $scope.totalAmount.billAmt=0;
              $scope.totalAmount.amountAftertax=0;
              $scope.totalAmount.avgBillAmount=0;
            console.log("Got Data");
             if(data.length >0)
              $scope.showreport = true;

            console.log(data)
            $scope.salesReport = data;
            for (var i = 0; i < $scope.salesReport.length; i++) {
                // $scope.totalAmount.avgBillAmount=($scope.salesReport[i].billAmt+$scope.totalAmount.avgBillAmount)/$scope.salesReport.length 
                $scope.totalAmount.taxAmount = $scope.salesReport[i].taxAmount + $scope.totalAmount.taxAmount
                $scope.totalAmount.billAmt = $scope.salesReport[i].billAmt + $scope.totalAmount.billAmt
                $scope.totalAmount.amountAftertax = $scope.salesReport[i].amountAftertax + $scope.totalAmount.amountAftertax
                
            }
            if($scope.salesReport.length > 0)
            $scope.totalAmount.avgBillAmount = $scope.totalAmount.billAmt / $scope.salesReport.length
        })
    }
})


.controller('SalesReportCtrl', function($scope, salesService, $rootScope) {

    $scope.Dte = {}
    $scope.salesReport = []
    $scope.totalAmount = {
        avgBillAmount: 0,
        taxAmount: 0,
        billAmt: 0,
        amountAftertax: 0
    };

    $scope.save = function() {

        var stDate;
        var edDate;
        var startDate = $scope.Dte.start;
        //console.log(startDate);
        var endDate = $scope.Dte.end;

        if (endDate < startDate) {
            console.log("Invalid Date Selected");
            $rootScope.ShowToast("Please select valid Date", false);
            return;
        }

        if (startDate == undefined && endDate == undefined) //no date entered;;
        {
            console.log("start and End Date undefined");
            startDate = new Date();
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate = new Date();
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            //return;

        } else if (startDate == undefined || endDate == undefined) {
            console.log('Select Start and End Date');
            $rootScope.ShowToast("Select Start and End Date", false);
            return false
        }
        else {
            startDate = $scope.Dte.start;
            endDate = $scope.Dte.end;

            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            // return;

        }

        var promise = salesService.getSalesReport(stDate, edDate);
        promise.then(function(data) {
            
            console.log("Got Data");
             if(data.length >0)
              $scope.showreport = true;

              //totalPrice: result.rows.item(i).TotalPrice,
              //taxAmount: result.rows.item(i).TaxAmount,
              //totalAmount: result.rows.item(i).TotalAmount,

            console.log(data)
            $scope.salesReport = data[0];

           // if(data.length >0)
            // $scope.salesReport.totalBills = 10;

            //
     
        })
    }

    $scope.onPrintSalesReport = function()
    {

    $rootScope.PrintCollectionReport($scope.salesReport,$scope.Dte.start, $scope.Dte.end);

    }


   })


.controller('productReportCtrl', function($scope, salesService, $rootScope) {
   $scope.Dte = {}
    $scope.productReport = []
   

    $scope.save = function() {

        var stDate;
        var edDate;
        var startDate = $scope.Dte.start;
        //console.log(startDate);
        var endDate = $scope.Dte.end;

        if (endDate < startDate) {
            console.log("Invalid Date Selected");
            $rootScope.ShowToast("Please select valid Date", false);
            return;
        }

        if (startDate == undefined && endDate == undefined) //no date entered;;
        {
            console.log("start and End Date undefined");
            startDate = new Date();
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate = new Date();
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            //return;

        } else if (startDate == undefined || endDate == undefined) {
            console.log('Select Start and End Date');
            $rootScope.ShowToast("Select Start and End Date", false);
            return false
        } else {
            startDate = $scope.Dte.start;
            endDate = $scope.Dte.end;

            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            // return;

        }

        var promise = salesService.getItemWiseReport(stDate, edDate);
        promise.then(function(data) {
            //console.log(data.rows)
            $scope.productReport = data;

             if(data.length >0)
              $scope.showreport = true;
        })
    }
})