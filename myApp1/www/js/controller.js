angular.module('starter.controller', [])

.controller('MyCtrl', function($scope) {
$(function () { $('.click-to-jiggle').click(function (e) {  $(this).toggleClass('jiggle');  
        return false; 
    });
});$(function () { $('.click-to-jiggle').click(function (e) {  $(this).toggleClass('jiggle');  
        return false; 
    });
});
    



  $scope.tabExpand = function(index) {
    console.log('Tab ' + index + ' expanded');
  };
  $scope.tabCollapse = function(index) {
    console.log('Tab ' + index + ' collapsed');
  };

   $scope.tab1 = {
    expand: false   // initial state  
  };
      
  $scope.toggleTab1 = function() {
    $scope.tab1.expand = !$scope.tab1.expand;
  };
})

.controller('homeCtrl', ['$scope', '$rootScope', '$state', '$cordovaSQLite', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'dbService', '$ionicPlatform', '$ionicLoading', '$ionicPopup','settingService', function($scope, $rootScope, $state, $cordovaSQLite, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, dbService, $ionicPlatform, $ionicLoading, $ionicPopup, settingService) {

    /*
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        console.log('entered before enter view')
        loadProducts();
        loadCategory();
    });
*/

    //ionicParentView

    //load products list from DB


    $scope.OnCatClick = function(catId) {
        console.log(catId);
        $rootScope.SelCat = catId;

        //change background color;;
        // if($rootScope.PrevSelCat!='0')
        // document.getElementById($rootScope.PrevSelCat).style.backgroundColor='Black';

        //console.log("Setting Color.. Please Wait: ", catId);
        //document.getElementById(catId).style.backgroundColor='Red';
        //$rootScope.PrevSelCat = catId;
        //console.log("After Red");

        $scope.highlight = catId;

        $rootScope.showDbLoading();
        var promise = dbService.loadProductsForCategory(catId);
        promise.then(function(res) {
            $scope.Products = res;
            console.log('products loaded...');
            productSlideLogic();
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    $scope.$on("$ionicParentView.enter", function(event, data) {
        console.log('entered before enter parent view');
        //loadProducts();
        loadCategory();
        //$scope.highlight = "1x";
        if ($rootScope.SelCat == '0') {
            $scope.OnCatClick("favourite")
            //$scope.highlight = "favourite";
        } else {
            $scope.OnCatClick($rootScope.SelCat)
            //$scope.highlight = $rootScope.SelCat;
        }
    });

    $ionicPlatform.ready(function() {//loadProducts();
    //loadCategory();

    //console.log("First Time");
    // $scope.OnCatClick('favourite');

    })

    



    $scope.Products = [];
    $scope.categoryArr = [];
    $scope.allSlideCatArr = [];
    $scope.allSlideProductArr = [];

    function loadProducts() {
        $rootScope.showDbLoading();
        var promise = dbService.loadProductFromDB('Product');
        promise.then(function(res) {
            $scope.Products = res;
            console.log('products loaded...');
            productSlideLogic();
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    function loadCategory(highlight) {
        $rootScope.showDbLoading();
        var promise = dbService.loadCategoryFromDB('Category');
        promise.then(function(res) {
            $scope.categoryArr = res;
            $rootScope.hideDbLoading();
            if (highlight != undefined)
                $scope.OnCatClick(highlight);
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    function productSlideLogic() {
        $scope.allSlideProductArr = [];
        var tempProductArr = [];
        console.log($scope.Products);
        for (var i = 0; i < $scope.Products.length; i++) {
            tempProductArr.push($scope.Products[i]);
            if (((i != 0) && (i % 11 == 0)) || (i == ($scope.Products.length - 1))) {
                $scope.allSlideProductArr.push(tempProductArr)
                tempProductArr = [];
            }
        }
        console.log($scope.allSlideProductArr);
    }

    /*
    function categorySlideLogic() {
        $scope.allSlideCatArr = [];
        var tempCatArr = [];
        //  console.log(tempCatArr)
        for (var i = 0; i < $scope.categoryArr.length; i++) {
            tempCatArr.push($scope.categoryArr[i]);
            if (((i != 0) && (i % 4 == 0)) || (i == ($scope.categoryArr.length - 1))) {
                $scope.allSlideCatArr.push(tempCatArr)
                tempCatArr = [];
            }
        }
        console.log($scope.allSlideCatArr);
    }
*/
$scope.onPressHoldProduct = function()
{

    $scope.jiggleProduct = true;
    
}

    $scope.onPressHold = function(index) {
        console.log('enterd on hold');
        $scope.showDelete = true;
        $scope.holdIndex = index;
    }

    $scope.deleteItem = function(index) {
        $scope.productArr.splice(index, 1);
        $scope.showDelete = false;
        delete $scope.itemsInStockObj[product.productId];
        calculateProductCost();
    }

       $scope.testDivBlurFunc = function()
   {
        $scope.showDelete = false;

       console.log('clicked outside');
   };


    function calculateProductCost() {
        $scope.totalPrice = 0;
        $scope.totalTaxAmount = 0;
        $scope.discountAmount = 0;
        $scope.totalChargeAmount = 0;
        for (var i = 0; i < $scope.productArr.length; i++) {
            var tempObj = $scope.productArr[i];
            $scope.totalPrice = $scope.totalPrice + tempObj.productTotalPrice;
            $scope.totalTaxAmount = parseFloat(($scope.totalTaxAmount + tempObj.productTaxAmount).toFixed(2));
            $scope.discountAmount = parseFloat(($scope.discountAmount + tempObj.discountAmount).toFixed(2));
            $scope.totalChargeAmount = parseFloat(($scope.totalChargeAmount + tempObj.productTotalAmount).toFixed(2));
        }
    }

    //$scope.OnCatClick("favourite");

    /*
    $scope.scrollTopBtn = false;
    $scope.scrollBottomBtn = false;
    $scope.onScroll = function() {
        var scrollTopCurrent = $ionicScrollDelegate.getScrollPosition().top;
        var scrollTopMax = $ionicScrollDelegate.getScrollView().__maxScrollTop;
        var scrollBottom = scrollTopMax - scrollTopCurrent;
        console.log(scrollTopCurrent + " " + scrollTopMax);
        if (scrollTopMax) {
            $scope.scrollBottomBtn = true;
            $scope.scrollTopBtn = true;
        } else {
            $scope.scrollBottomBtn = false;
            $scope.scrollTopBtn = false;
        }
    };
    $scope.scrollTop = function() {
        $ionicScrollDelegate.$getByHandle('scrollSmall').scrollTop(true);
        //$ionicScrollDelegate.scrollBy(0, -50, true);
    }
    $scope.scrollBottom = function() {
        $ionicScrollDelegate.scrollBy(0, 50, true);
        // $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
    }*/

    $scope.itemsInStockObj = {};
    // $scope.numValue = 0;
    $scope.productArr = [];
    $scope.index = null;
    $scope.totalPrice = 0;
    $scope.totalTaxAmount = 0;
    $scope.discountAmount = 0;
    $scope.totalChargeAmount = 0;
    //  $scope.quantity=0;

    $scope.save = function(product, typedCode) {

        console.log("New Product" + product);
        if ($scope.productArr != undefined && $scope.productArr.length < 1) {
            for (var i = 0; i < $scope.productArr.length; i++) {
                if (product.productId == $scope.productArr[i].productId) {
                    $scope.productArr[i].quantity = product.quantity + $scope.productArr[i].quantity;
                    $scope.productArr[i].productTotalPrice = product.productTotalPrice + $scope.productArr[i].productTotalPrice;

                }
            }
        }
        console.log(typedCode);
        if (typedCode == null) {
            console.log('Type Code Null')
            qty = typedCode = 1;
        } else {
            qty = typedCode;
        }
        $scope.itemsInStockObj[product.productId] = parseFloat(product.inStock) - parseFloat(qty);
        if ($scope.itemsInStockObj[product.productId] < 0)
            $scope.itemsInStockObj[product.productId] = 0;

        console.log($scope.itemsInStockObj);
        //  var qty =document.getElementById('quantity').value;
        console.log('I am in Save Function');
        // console.log('Scope quanitity' + qty);
        console.log(product.name + ' ' + product.unitPrice + ' ' + qty);
        var productTotalPrice = parseFloat((product.unitPrice * qty).toFixed(2));
        console.log("productTotalPrice: " + productTotalPrice);
        var productTotalTax = parseFloat(((product.taxRate / 100) * productTotalPrice).toFixed(2));
        console.log("productTotalTax: " + productTotalTax);
        var discountAmount = parseFloat(((product.discount / 100) * productTotalPrice).toFixed(2));
        console.log("discountAmount: " + discountAmount);
        var productTotalAmount = parseFloat((productTotalPrice + productTotalTax - discountAmount).toFixed(2));
        console.log("productTotalAmount: " + productTotalAmount);
        $scope.productArr.push({
            productId: product.productId,
            name: product.name,
            quantity: qty,
            productPrice: product.unitPrice,
            productTotalPrice: productTotalPrice,
            productTaxAmount: productTotalTax,
            discount: product.discount,
            discountAmount: discountAmount,
            productTotalAmount: productTotalAmount,
            taxRate: product.taxRate,
            taxId: product.taxId,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            selected: false
        })
        //$scope.numericModal.hide();
        //$scope.newProduct = {};
        //$scope.typedCode = null;
        console.log($scope.productArr);
        $scope.totalPrice = $scope.totalPrice + productTotalPrice;
        $scope.totalTaxAmount = parseFloat(($scope.totalTaxAmount + productTotalTax).toFixed(2));
        $scope.discountAmount = parseFloat(($scope.discountAmount + discountAmount).toFixed(2));
        $scope.totalChargeAmount = parseFloat(($scope.totalChargeAmount + productTotalAmount).toFixed(2));
        console.log('This is Total Price' + $scope.totalPrice);
    }

    //receipt function to store all transaction details in DB

    $scope.receipt = function(tokenNo) {
        //$scope.paymentModal.hide();
       console.log("Print Receipt");
        var billSummary = {};
       // $scope.NoCopies = $rootScope.printFormatSettings.billCopies;

        billSummary.totalPrice = $scope.totalPrice;
        billSummary.discountAmount = $scope.discountAmount;
        billSummary.totalTaxAmount = $scope.totalTaxAmount;
        billSummary.totalChargeAmount = $scope.totalChargeAmount;
        billSummary.BillStatus = "Active";
        billSummary.DateTime = new Date();

        $scope.CurrentTokenNumber = tokenNo;

        $rootScope.print(billSummary, $scope.productArr,onPrintReceiptSuccess,PrintReceiptError,tokenNo,$rootScope.VolatileData.CurrentBillNo);
        return(true);
    
    }  

    function onPrintReceiptSuccess()
    {
        $scope.billCopies++;

      if($scope.billCopies < $rootScope.printFormatSettings.billCopies)
      {
         
       $ionicPopup.show({
              title: 'Print another copy',
              subTitle: 'Click Print to get another bill copy',
              scope:$scope,
               buttons: [
              { text: 'Cancel', onTap: function(e) { return "cancel"; } },
              {
                  text: '<b>Print</b>',
                  type: 'button-positive',
                  onTap: function(e) { return "Print";}
              }

              ]

   }).then(function(res) {
       
        if(res == "Print")
        {
            $scope.receipt($scope.CurrentTokenNumber);
        }
        else
        {
            SaveTransactionDetailstoDB();
            $scope.billCopies = $rootScope.printFormatSettings.billCopies;
        }


        });
         
      }
      else
      {
        SaveTransactionDetailstoDB();
        //UpdateVolatileDataToDB();
      }



    }

    function UpdateVolatileDataToDB()
    {
          var promise = settingService.set("VolatileData", JSON.stringify($rootScope.VolatileData));
        promise.then(function(data) {
            if (data.rowsAffected >= 1) {
                console.log("Data update Success");
                //$rootScope.ShowToast("Data update Success",false);
               // $rootScope.password = newpassword;
            } else {
                
                console.log("Data update Failed");
                //$rootScope.ShowToast("Unable to Password",false);
            }
        },function(err)
        {
            console.log("Data update Failed: ", err);
            //$rootScope.ShowToast("Unable to Password",false);
        })
    }

    function PrintReceiptError()
    {
      console.log("Print Receipt Error");

      if($scope.billCopies > 0) //atleast one copy printed;;
      {
          SaveTransactionDetailstoDB();
          //UpdateVolatileDataToDB();

      }

    }

    function SaveTransactionDetailstoDB()
    {
         $scope.transactionDate = (new Date()).getTime();
        //check

        console.log($scope.transactionDate);
        var promise = dbService.storeToTransaction($scope.productArr, $scope.transactionDate,$rootScope.VolatileData.CurrentBillNo);
        promise.then(function(result) {
            console.log(result);
            $scope.paymentMethod = "cash";
            $scope.totalItems = $scope.productArr.length;
            //update inStock in product
            var promise = dbService.updateItemsInStock($scope.itemsInStockObj);
            SaveBillDetails();
        }, function(result) {
            console.log(result);
        })

    }


    //function to save bill details to database
    function SaveBillDetails() {
        var promise = dbService.storeToBillDetails($scope.totalPrice, $scope.discountAmount, $scope.totalTaxAmount, $scope.totalChargeAmount, $scope.paymentMethod, $scope.totalItems, $scope.transactionDate,$rootScope.VolatileData.CurrentBillNo);
        promise.then(function(result) {
            console.log(result);
            //clear all values
            $scope.productArr = [];
            $scope.typedAmount = null;
            $scope.Balance = null;
            $scope.totalPrice = 0;
            $scope.totalTaxAmount = 0;
            $scope.discountAmount = 0;
            $scope.totalChargeAmount = 0;

            console.log("updating volatile Data" ,result);

            $rootScope.VolatileData.CurrentBillNo =  Number($rootScope.VolatileData.CurrentBillNo) + 1;
            if(Number($rootScope.VolatileData.CurrentBillNo) > 99999999)
            $rootScope.VolatileData.CurrentBillNo = 1;

          if($rootScope.printFormatSettings.tokNum == "Auto")
           {
            $rootScope.VolatileData.CurrentTokenNo = Number($rootScope.VolatileData.CurrentTokenNo) + 1;
            if(Number($rootScope.VolatileData.CurrentTokenNo) > $rootScope.printFormatSettings.tokResetAftr)
            {
                $rootScope.VolatileData.CurrentTokenNo = $rootScope.printFormatSettings.tokStartNmbr;
            }
           }

            UpdateVolatileDataToDB();
        }, function(result) {
            console.log("Error: ", result);
        })
    }
    //function to get bill details
    function getBillDetails() {
        var billDetail = [];
        var promise = dbService.getBillDetails(2);
        promise.then(function(res) {
            billDetail = res;
            console.log(billDetail);
        }, function(res) {
            console.log(res)
        })
    }
    //function to get transaction details
    function getTransactionDetails() {
        var transactionDetail = [];
        var promise = dbService.getTransactionDetails(3);
        promise.then(function(res) {
            transactionDetail = res;
            console.log(transactionDetail);
        }, function(res) {
            console.log(res);
        })
    }
    $scope.void = function() {
        $scope.productArr = [];
        $scope.typedAmount = null;
        $scope.Balance = null;
        $scope.totalPrice = 0;
        $scope.totalTaxAmount = 0;
        $scope.discountAmount = 0;
        $scope.totalChargeAmount = 0;
    }



    $scope.onPaymentOk = function(value) {
        console.log("Payment Ok");

        

        console.log('I am in Paid Function')
        console.log(value)
        var typedAmount = parseFloat(value);

        if (typedAmount < $scope.totalChargeAmount) {
            $rootScope.ShowToast("Collected Amount is less than Bill Amount", false);
            console.log("Collected Amount less than Bill Amount");
            return ( false) ;
        }
        
        $scope.paidAmount1 = typedAmount;
        console.log(typedAmount);

        var balance = typedAmount - $scope.totalChargeAmount;
        $scope.Balance = parseFloat(balance).toFixed(2);
        $scope.typedAmount = typedAmount;

          $ionicPopup.show({
              title: 'Print Receipt',
              subTitle: 'Print Receipt to Complete Transaction',
              scope:$scope,
               buttons: [
              { text: 'Close', onTap: function(e) { return "cancel"; } },
              {
                  text: '<b>Print</b>',
                  type: 'button-positive',
                  onTap: function(e) { return "Print";}
              },
              {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function(e) { return "Save";}
              }

              ]

   }).then(function(res) {
       if(res=="Print")
       {
           //console.log("printer Name is: ", $rootScope.printerName);
           //$rootScope.printerConnect($rootScope.printerName,$rootScope.ConnectStatusFunc);
           console.log("Print Receipt Invoked");
           $scope.billCopies = 0;
        if($rootScope.printFormatSettings.tokNum == "Manual")
        {
             $rootScope.openNumericModal($scope, $scope.receipt, $scope.receipt);

        }
        else if($rootScope.printFormatSettings.tokNum == "Auto")
        {
            $scope.receipt($rootScope.VolatileData.CurrentTokenNo);
           // $rootScope.VolatileData.CurrentTokenNo = $rootScope.VolatileData.CurrentTokenNo + 1;
           // if($rootScope.VolatileData.CurrentTokenNo > $rootScope.printFormatSettings.tokResetAftr)
            //{
              //  $rootScope.VolatileData.CurrentTokenNo = $rootScope.printFormatSettings.tokStartNmbr;
            //}
        }
        else //disable;;
        {
            $scope.receipt(undefined);
        }
           //();
           return;
           
       }
       else if(res=="Save")
       {
           SaveTransactionDetailstoDB();
           //UpdateVolatileDataToDB();
       }
       else
       {
           return;
       }


   });


    return (true);

        
    }

    $scope.onPaymentCancel = function() {

        console.log("Payment Cancel");
    }

    $scope.showPaymentMode = function() {

        if ($scope.productArr.length <= 0) {
            return;
        }

        if ($rootScope.PaymentSettings.PaymentMode.length <= 0) {
            $rootScope.openNumericModal($scope, $scope.onPaymentOk, $scope.onPaymentCancel);
            return;

        }

        if ($rootScope.PaymentSettings.PaymentMode.length == 1 && $rootScope.PaymentSettings.PaymentMode[0].name == "Cash") {
            $rootScope.openNumericModal($scope, $scope.onPaymentOk, $scope.onPaymentCancel);
            return;
        }

        var AvailButtons = [];
        console.log($rootScope.PaymentSettings.PaymentMode);
        //$scope.returnvalues=[];
        for (var i = 0; i < $rootScope.PaymentSettings.PaymentMode.length; i++) {
            //$scope.returnvalues.push()
            var name = $rootScope.PaymentSettings.PaymentMode[i].name;
            var newbutton = {
                text: $rootScope.PaymentSettings.PaymentMode[i].name,
                onTap: function(e) {
                    console.log(e);
                    return e.currentTarget.childNodes[0].data;
                }
            }
            AvailButtons.push(newbutton);

        }

        $ionicPopup.show({
            title: 'Payment Mode',
            subTitle: 'Select Payment Mode',
            scope: $scope,
            buttons: AvailButtons

        }).then(function(res) {
            console.log('Sel Button is', res);

            //var st = res.toString();
            //console.log(typeof(res));

            if (res == "Cash") {
                //show keypad;;
                //showing Modal();
                console.log("In cash");
               $rootScope.openNumericModal($scope, $scope.onPaymentOk, $scope.onPaymentCancel);
            }

        });

    }

    /*

    $scope.typedAmount = "";

    $scope.keyPressedAmount = function(keyCode) {
        //console.log(keyCode)
        tempT = $scope.typedAmount;
        switch (keyCode) {
            case -4:
                $scope.sendTheCodeA();
                break;
            case -3:
                $scope.removeA();
                break;
            case -2:
                $scope.removeAllA();
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0:
            case '.':
                if (!/\d/.test(tempT)) {
                    $scope.typedAmount = keyCode;
                    console.log($scope.typedAmount)
                } else {
                    $scope.typedAmount += '' + keyCode;
                    console.log($scope.typedAmount)
                }
                break;
        }
    };


    $scope.sendTheCodeA = function() {
        if (/\d/.test(tempT)) {
            // TODO : sends the entered code
            console.log('entered code is ' + $scope.typedCode + " " + $scope.typedAmount.length);
            $scope.typedAmount = "";
        }
    };
    $scope.removeA = function() {
        console.log($scope.typedAmount)
        if ($scope.typedAmount.length > 0) {
            $scope.typedAmount = $scope.typedAmount.slice(0, -1);
        } else {
            $scope.typedAmount = "";
        }
        console.log('I am in remove');
        // TODO start scaning the code and once it receives send to the socket
    };
    $scope.removeAllA = function() {
        $scope.typedAmount = "";
    }


    $ionicModal.fromTemplateUrl('templates/PaymentModel.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.paymentModal = modal;
    });

    $scope.openPaymentModal = function() {
        $scope.enterBtn = false;
        if ($scope.productArr.length) {
            console.log('I am in openModel')
            $scope.typedAmount = null;
            $scope.paymentModal.show();
            $scope.receiptBtnShow = true;
            $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
        }
    };


    $scope.closePaymentModal = function() {
        console.log('I am in close Model')
        $scope.typedAmount = "";
        $scope.paymentModal.hide();
    };*/

    // Payment model end

    $scope.OnProductClick = function(Product) {
        console.log("on product click");
        if ($rootScope.Mode == 1) //edit or add mode;;
        {
            console.log("Mode Edit");
            $rootScope.CreateMode = 0;
            //edit mode;;
            $rootScope.CurrentProduct = Product;
            $state.go('product');

        } else {
            $rootScope.CurrentProduct = Product;
            $rootScope.openNumericModal($scope, $scope.onQuantityOk, $scope.onQuantityCancel);
        }

    }

    $scope.onQuantityOk = function(value) {
        console.log("On Quantity Ok: ", value);
        //checks here;;
        if (value <= 0) {
            console.log("Quantity cannot be zero");
            $rootScope.ShowToast("Quantity cannot be zero", false);
            return ( false) ;
        }

        console.log("value is: ",value);
        value = Number(value);

        if(isNaN(value))
        {
            console.log("please Enter Valid Qty");
             $rootScope.ShowToast("please Enter Valid Qty",false);
             return(false);
        }

        if ((value * $rootScope.CurrentProduct.unitPrice) > 99999.99) {
            console.log("Total Amount too large, Please split Quantity");
            $rootScope.ShowToast("Total Amount too large, Please split Quantity", false);
            return ( false) ;
        }

        if(value > 9999.99)
        {
           console.log("Quantity greater than 9999.99");
            $rootScope.ShowToast("Quantity cannot be greater than 9999.99", false);
            return ( false) ;   
        }

        if($rootScope.CurrentProduct.unit == "pieces")
        {
            var n = Math.abs(value); // Change to positive
            var decimal = n - Math.floor(n);
            if(decimal > 0)
            {
            console.log("Quantity cannot be decimal for peices type product");
            $rootScope.ShowToast("Quantity cannot be decimal for this product", false);
            return(false);
            }

        }

        $scope.save($rootScope.CurrentProduct, value);
        return ( true) ;
    }

    $scope.onQuantityCancel = function() {
        console.log("On Quantity Cancel");
    }

    $ionicModal.fromTemplateUrl('templates/recallModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.recallModal = modal;
    });
    $scope.openRecallModal = function(product) {
        $scope.recallModal.show();
    }
    $scope.closeRecallModal = function() {
        $scope.recallModal.hide();
    }
    ;


    $scope.holdItems = function() {


       if($rootScope.holdItemArr.length== 0 && $scope.productArr.length != 0) //hold;;
      {
         $rootScope.holdItemArr = $scope.productArr; //deepcopy;;
         $scope.totalPrice =0;
         $scope.productArr = [];
         $scope.totalPrice = 0;
         $scope.totalTaxAmount = 0;
         $scope.discountAmount = 0;
         $scope.totalChargeAmount = 0;
         $scope.Balance = undefined;
         $scope.typedAmount =undefined;
         console.log("Current Bill put on hold");
         $rootScope.ShowToast("Current Bill put on hold",false);
         return;
      }
      else if($rootScope.holdItemArr.length!= 0 && $scope.productArr.length == 0) //recall;;
      {

         $scope.productArr = $rootScope.holdItemArr; //deepcopy;;
         $rootScope.holdItemArr = [];
         calculateProductCost();
         console.log("Saved Bill Recalled");
         $rootScope.ShowToast("Saved Bill Recalled",false);
         return;
      }
      else
      {
          console.log("Else case");
          $rootScope.ShowToast("Current Bill Not Empty or Hold Item already Exists",false);
      }


 /*
        if ($scope.productArr.length != 0) {
            var itemsDetails = {};
            var d = new Date();
            console.log("--" + d.toString().substring(4, 24) + "--");
            var id = d.getTime();
            console.log(id);
            var itemsJsonObj = window.localStorage.getItem('holdEvents');
            //     console.log(itemsJsonObj);
            if (itemsJsonObj != "") {
                itemsJsonObj = JSON.parse(itemsJsonObj);
            } else {
                itemsJsonObj = {};
            }
            itemsDetails.date = d.toString().substring(4, 24);
            itemsDetails.products = $scope.productArr;
            itemsDetails.totalPrice = $scope.totalPrice;
            itemsJsonObj[id] = itemsDetails;
            console.log(itemsJsonObj);
            window.localStorage.setItem('holdEvents', JSON.stringify(itemsJsonObj));
            $scope.productArr = [];
            $scope.totalPrice = null;
        }
   */


    }



    $rootScope.recallItems = function() {
        var itemsJsonObj = window.localStorage.getItem('holdEvents');
        console.log(itemsJsonObj);
        if (itemsJsonObj != "") {
            itemsJsonObj = JSON.parse(itemsJsonObj);
        } else {
            itemsJsonObj = {};
        }
        $scope.holdItemObj = itemsJsonObj;
        var transactionJsonObj = window.localStorage.getItem('transactionEvents');
        console.log(transactionJsonObj);
        if (transactionJsonObj != "") {
            transactionJsonObj = JSON.parse(transactionJsonObj);
        } else {
            transactionJsonObj = {};
        }
        $scope.transactionObj = transactionJsonObj;
        $scope.openRecallModal();
    }
    $scope.unHold = function(holdKey, holdValue) {
        $scope.recallModal.hide();
        $scope.productArr = holdValue.products;
        $scope.totalPrice = holdValue.totalPrice;
        var itemsJsonObj = window.localStorage.getItem('holdEvents');
        console.log(itemsJsonObj);
        if (itemsJsonObj != "") {
            itemsJsonObj = JSON.parse(itemsJsonObj);
            delete itemsJsonObj[holdKey];
            window.localStorage.setItem('holdEvents', JSON.stringify(itemsJsonObj));
        }
    }
    $scope.nextCategorySlide = function() {
        console.log('I am in next')
        //  $ionicScrollDelegate.scrollBy(0, 68, true);
        $ionicSlideBoxDelegate.$getByHandle('categorySlideHandle').next();
    }
    ;
    $scope.previousCategorySlide = function() {
        // $ionicScrollDelegate.scrollBy(0, -68, true);
        $ionicSlideBoxDelegate.$getByHandle('categorySlideHandle').previous();
    }
    ;
    //Slide Ends

}
])//END OF HOMECTRL;;

.controller("productCtrl", function($scope, $state, $rootScope, $ionicPopover, $ionicHistory, $ionicPopup, $cordovaSQLite, $cordovaCamera, $timeout, $cordovaFile, $ionicModal, dbService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        console.log('working before enter..')

        if ($rootScope.CreateMode == 0) {
            //editing;;
            $scope.ProductButtonText = "Edit Product";
            console.log("Edit Product: ");
            console.log($rootScope.CurrentProduct);
            $scope.newProduct = $rootScope.CurrentProduct;
            $rootScope.editingProduct = {};
            $scope.pIdDisable = true;
        }
        else {
            $scope.ProductButtonText = "Add Product";
            $scope.pIdDisable = false;
            $scope.newProduct = {
                unit: 'pieces',
                favourite: false
            };
        }
        loadCategory();
    });

    $scope.addEditProduct = function() {

       
        var productName = $scope.newProduct.name;
       
        if (productName == undefined || productName.length < 2) {
            $rootScope.ShowToast("Enter productName", false);
            console.log('Enter Product Name')
            return false
        }

        var productSellingPrice = $scope.newProduct.unitPrice;
        var pattern=new RegExp('^[0-9]+([,.][0-9]+)?$');
        var pattern1=new RegExp('^[0-9]+$');
        if (productSellingPrice == undefined || productSellingPrice.length < 1) {
            $rootScope.ShowToast("Enter Selling Price ", false);
            console.log("Enter Selling Price");
            return false
        } else if (!pattern.test(productSellingPrice)) {
            $rootScope.ShowToast("Invalid Selling Price", false);
            console.log('Invalid product Selling')
            return false;
        }

        if (productSellingPrice > 9999.99) {
            $rootScope.ShowToast("Invalid Selling Price", false);
            console.log('Invalid product Selling')
            return false; 
        }

        var taxRate = $scope.newProduct.taxRate;
        console.log(taxRate);
        if (taxRate == undefined) {
            $rootScope.ShowToast("Select taxRate", false);
            console.log('Select taxRate')
            return false
        }

        var buyingPrice = $scope.newProduct.actualPrice;
        if (buyingPrice == undefined || buyingPrice.length < 1) {
           $scope.newProduct.actualPrice= document.getElementById('buyingPrice').value = 0;
        } else if (!pattern.test(buyingPrice)) {
            $rootScope.ShowToast("Invalid buyingPrice", false);
            console.log('Invalid buyingPrice');
            return false
        }
        console.log(buyingPrice)
        if (buyingPrice > 9999.99) {
            $rootScope.ShowToast("Invalid Buying Price", false);
            console.log('Invalid buying price');
            return false;
        }

        console.log(productSellingPrice);
        console.log(buyingPrice);

        if (parseFloat(productSellingPrice) < parseFloat(buyingPrice)) {
            $rootScope.ShowToast("Invalid Buying Price", false);
            console.log('Invalid buying price');
            return false;

        }

        var itemInStock = $scope.newProduct.inStock;
        if (itemInStock == undefined || itemInStock < 0) {
          $scope.newProduct.inStock=document.getElementById('itemsStock').value = 1000000;

        } else if (!pattern1.test(itemInStock) && $scope.newProduct.unit == 'pieces') {
            $rootScope.ShowToast("Invalid  itemInStock", false);
            console.log('Invalid  itemInStock');
            return false
        } else if (!pattern.test(itemInStock) && $scope.newProduct.unit == 'litres') {
            $rootScope.ShowToast("Invalid  itemInStock", false);
            console.log('Invalid  itemInStock');
            return false
        } else if (!pattern.test(itemInStock) && $scope.newProduct.unit == 'kgs') {
            $rootScope.ShowToast("Invalid  itemInStock", false);
            console.log('Invalid  itemInStock');
            return false
        }

        console.log("Item in Stock is : ", itemInStock);

        var discount = $scope.newProduct.discount;

        if (discount == undefined || discount.length < 1) {
            $scope.newProduct.discount=document.getElementById('discount').value = 0;

        } else if (!pattern.test(discount)) {
            $rootScope.ShowToast("Invalid discount", false);
            console.log('Invalid discount')
            return false
        }

        var Categary = $scope.newProduct.categoryName;
        if (Categary == undefined) {
            $rootScope.ShowToast("Select Categary", false);
            console.log('Select Categary');
            return false
        }
        //validate here;;
        //min length;;
        //min value;;
        //valid number;;
        //valid selection;; ex: category , tax rate.
        //discount less than 100%
        //if discount not entered set discout =0 
        //if item in stock not entered set to 0;
        //if image not selected, set default image;;

        //$rootScope.ShowToast("Invalid Selling Price",false); 

        //console.log("Invalid Selling Price");

        if ($rootScope.CreateMode == 0) {
            console.log("Edit Product");
            editProduct();
        } else {
            console.log("Add Product");
            addNewProduct();
        }

    }

    function loadCategory() {
        $rootScope.showDbLoading();
        var promise = dbService.loadProductFromDB('Category');
        promise.then(function(res) {
            $scope.categoryArr = res;
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    //gautham;;
    $scope.TaxSettings1 = $rootScope.TaxSettings;

    /*[{
        Id: '1',
        Name: 'tax1',
        TaxRate: '5'
    }, {
        Id: '2',
        Name: 'tax2',
        TaxRate: '10'
    }, {
        Id: '3',
        Name: 'tax3',
        TaxRate: '15'
    }, {
        Id: '4',
        Name: 'tax4',
        TaxRate: '20'
    }]*/

    $scope.onTaxRateSelect = function(tax) {
        $scope.newProduct.taxRate = tax.taxRate;
        $scope.newProduct.taxId = tax.id;
        $scope.taxRatePopover.hide();
    }

    $ionicPopover.fromTemplateUrl('templates/taxRatePopover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.taxRatePopover = popover;
    });

    $scope.openTaxRatePopover = function($event) {
        $scope.taxRatePopover.show($event);
    }
    ;
   

    $scope.newProduct = {
        unit: 'pieces',
        favourite: false
    };

    console.log($scope.newProduct);

    /*$scope.$watch('newProduct.inStock', function(newValue, oldValue) {
        console.log($scope.newProduct);
        if (newValue) {
            if ($scope.newProduct.unit == 'pieces') {
                $scope.newProduct.inStock = Math.round(newValue);
            }
        }
    });*/

    function addNewProduct() {
        console.log($scope.selectedTax);
        console.log('entered addNewProduct()..');
        
        if($scope.newProduct.image == undefined || $scope.newProduct.image == "")
         $scope.newProduct.image = "img/sc1.jpg";

        console.log($scope.newProduct);

        
            /* if (!(angular.isDefined($scope.newProduct.discount))) {
                    $scope.newProduct.discount = 0;
                }
                 if (!(angular.isDefined($scope.newProduct.inStock))) {
                    $scope.newProduct.inStock = 1000000;
                }*/

            console.log("Cat ID: ",$scope.newProduct.categoryId);
            console.log('validation success and entered if');
            console.log($scope.newProduct);
            $rootScope.showDbLoading();
            var promise = dbService.addNewProduct($scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image, $scope.newProduct.favourite);
            promise.then(function(result) {
                console.log(result);
                console.log("Product Added Sucessfully");
                $rootScope.ShowToast("Product Added Sucessfully", false);
                //  $rootScope.Products.push($scope.newProduct);
                $scope.newProduct = {
                    unit: 'pieces',
                    image: "img/sc1.jpg",
                    favourite: false
                };
                $rootScope.hideDbLoading();
                $scope.productSuccessMessage = true;
                //confirmation popup
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Add More Products ',
                    template: 'Do you want to add more products?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        console.log('add more products');
                    } else {
                        console.log('No');
                        $ionicHistory.goBack();
                    }
                });
            }, function(result) {
                console.log(result);
                console.log("Unable to add product");
                $rootScope.ShowToast("Unable to add product", false);
                $rootScope.hideDbLoading();
            })
        

    }

    function editProduct() {
        $rootScope.showDbLoading();
        var promise = dbService.editProduct($scope.newProduct.productId, $scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image, $scope.newProduct.favourite);
        promise.then(function(result) {
            console.log(result);
            console.log("product Edited Sucessfully");
            $rootScope.hideDbLoading();
            $rootScope.ShowToast("product Edited Sucessfully", false);
            $ionicHistory.goBack();
        }, function(result) {
            console.log(result);
            $rootScope.ShowToast("Unable to Edit product", false);
            console.log("Unable to Edit product");
            $rootScope.hideDbLoading();
        })
    }

    $scope.deleteProduct = function(productId) {

        console.log("Product Id:", productId);
        $scope.ProductId = productId;
        var confirmPopup = $ionicPopup.confirm({
            title: 'The product will be permantly deleted',
            template: 'Are you sure you want to delete Product?'
        });

        confirmPopup.then(function(res) {
            if (res) {

                $rootScope.showDbLoading();
                console.log("ProductId 2:", productId);
                var promise = dbService.deleteProduct(productId);
                promise.then(function(result) {

                    $rootScope.hideDbLoading();
                    $ionicHistory.goBack();

                }, function(result) {
                    console.log(result);
                    $rootScope.hideDbLoading();
                });

            } else
                return;

        });

    }

    $scope.onCategorySelect = function(categoryObj) {
        $scope.newProduct.categoryName = categoryObj.categoryName;
        $scope.newProduct.categoryId = categoryObj.categoryId;
        $scope.categoryModal.hide();
    }
    $scope.addNewCategary = function(newCategaryName) {
        $rootScope.cameFromProduct = true;
        $state.go('category');
        $scope.categoryModal.hide();
    }
    $scope.openCamera = function() {
        console.log('camera opened..');
        document.addEventListener("deviceready", function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1020,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function(sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
                // $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                console.log("Copying from : " + sourceDirectory + sourceFileName);
                console.log("Copying to : " + cordova.file.dataDirectory + sourceFileName);
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function(success) {
                    $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                    console.log($scope.cameraFileName);
                    $scope.newProduct.image = $scope.cameraFileName;
                }, function(error) {
                    console.dir(error);
                });
            }, function(err) {// error
            });
        }, false);
    }
    $scope.openGallery = function() {
        console.log('gallery opened..');
        document.addEventListener("deviceready", function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true
            };
            $cordovaCamera.getPicture(options).then(function(sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
                var destinationTypeFileName = (new Date()).getTime() + '.jpg';
                // $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                console.log("Copying from : " + sourceDirectory + sourceFileName);
                console.log("Copying to : " + cordova.file.dataDirectory + destinationTypeFileName);
                console.log(sourceFileName);
                console.log($scope.galeryFileName);
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, destinationTypeFileName).then(function(success) {
                    $scope.galleryFileName = cordova.file.dataDirectory + destinationTypeFileName;
                    console.log($scope.galleryFileName);
                    $scope.newProduct.image = $scope.galleryFileName;
                }, function(error) {
                    console.dir(error);
                });
            }, function(err) {
                console.log(err);
            });
        }, false);
    }
    $ionicModal.fromTemplateUrl('templates/categoryModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.categoryModal = modal;
    })
    $scope.openCategoryModal = function() {
        console.log('open categoryModal')
        $scope.categoryModal.show();
    }
})
.controller('categoryCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $cordovaSQLite, $rootScope, dbService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $scope.newCategory = {};
        $scope.newCategory.categoryId = "";
        $scope.newCategory.categoryName = "";
        $scope.newCategory.categoryDescription = "";

        if ($rootScope.CreateMode == 1)
            $rootScope.CategoryButtonText = "Add Category";
        else {
            $rootScope.CategoryButtonText = "Edit Category";
            loadCategory();
        }
    });

    function loadCategory() {

        $rootScope.showDbLoading();
        var promise = dbService.GetCategoryById($rootScope.SelCat);
        promise.then(function(res) {
            if (res.categoryId != "Failed")
                $scope.newCategory = res;

            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    $scope.OnDone = function() {
        if ($rootScope.CreateMode == 1)
            $scope.addNewCategory();
        else
            $scope.saveEditedCategory();

    }

    $scope.deleteAllProductsAndCat = function() {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Will also delete all products in Category ',
            template: 'Are you sure you want to delete Category?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('Confirm Delete');
                $rootScope.showDbLoading();
                var promise1 = dbService.deleteAllProductsInCat($scope.newCategory.categoryId);
                promise1.then(function(res) {
                    console.log(res);
                    console.log("deleted Products");
                    $scope.deleteCategory();

                }, function() {
                    console.log(res);
                    console.log("Failed to delete Products in Category");
                    $rootScope.ShowToast("Failed to delete Products in Category", false);
                    $rootScope.hideDbLoading();
                })

            } else
                return;

        });

    }

    $scope.deleteCategory = function() {

        var promise = dbService.deleteCategory($scope.newCategory.categoryId);
        promise.then(function(res) {
            console.log(res);
            $rootScope.ShowToast("Delete Category Success", false);
            $rootScope.hideDbLoading();
            //$ionicHistory.goBack();
            $rootScope.SelCat = 'favourite';
            $state.go('home');
        }, function() {
            console.log(res);
            $rootScope.ShowToast("Failed to Delete Category", false);
            $rootScope.hideDbLoading();
        })

    }

    $scope.editedCategory = {
        name: "",
        description: ""
    };
    $scope.editCategory = function() {
        console.log('entered edit category');
        if ($scope.searchCategory.categoryId) {
            $scope.showEditField = true;
        } else {
            $scope.selectCategoryWarningMsg = true;
        }
    }

    $scope.saveEditedCategory = function() {
        if ($scope.newCategory.name != '' ) {
            console.log($scope.newCategory.categoryName);
           
            console.log($scope.newCategory.categoryDescription);
            $rootScope.showDbLoading();
            var promise = dbService.editCategory($scope.newCategory.categoryId,$scope.newCategory.categoryName, $scope.newCategory.categoryDescription);
            promise.then(function(res) {
                console.log(res);
                $rootScope.hideDbLoading();
                $scope.editedCategory = {};
                $scope.newNameDescSuccessMsg = true;
                newNameDescWarningMsg = false;
                $ionicHistory.goBack();
            }, function() {
                console.log(res);
                $rootScope.hideDbLoading();
            })
        } else {
            console.log('enter new name and description...');
            //$scope.newNameDescWarningMsg = true;
        }
    }

    $scope.nameFocused = function() {
        $scope.newNameDescWarningMsg = false;
    }

    $scope.searchCategory = {
        categoryId: ""
    };

    $scope.editSelectedCategory = function(categoryEditObj) {
        //  $scope.searchCategory = categoryEditObj;
        console.log(categoryEditObj);
        $scope.searchCategory.categoryId = categoryEditObj.categoryId;
        $scope.showCategoryEdit = true;
        $scope.selectCategoryWarningMsg = false;
    }

    $scope.newCategory = {};

    $scope.addNewCategory = function() {

        if (!($scope.catIdErrorMsg)) {
            $rootScope.showDbLoading();
            var promise = dbService.addNewCategory($scope.newCategory.categoryName, $scope.newCategory.categoryDescription);
            promise.then(function(result) {
                console.log(result);
                $rootScope.hideDbLoading();
                $scope.succesMessage = true;
                //   $rootScope.categoryArr.push($scope.newCategory);
                $scope.newCategory = {};
                if ($rootScope.cameFromProduct) {
                    $rootScope.cameFromProduct = false;
                    $ionicHistory.goBack();
                } else {
                    //confirmation popup
                    $rootScope.ShowToast("Category Added Sucessfully", false);
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Add More Category ',
                        template: 'Do you want to add more Category?'
                    });
                    confirmPopup.then(function(res) {
                        if (res) {
                            console.log('add more Category');
                            $state.reload();
                        } else {
                            console.log('No');
                            $ionicHistory.goBack();
                        }
                    });
                }
            }, function() {
                console.log("Failed to Add Category");
                $rootScope.ShowToast("Failed to Add Category", false);
                $rootScope.hideDbLoading();
            });
        } else {
            console.log("Id already Exists");
            $rootScope.ShowToast("Id already Exists", false);
        }
    }

   

})
.controller('MenuCtrl', function($scope, settingService, $rootScope, $state) {

    $rootScope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
    console.log($rootScope.devWidth);
    $rootScope.menuWidth = 0.90 * $rootScope.devWidth;
    console.log("In Menu Ctrl");
    $scope.rightItems = [];

    jQuery.getJSON('json/MenuItems.json', function(data) {

        $scope.rightItems = data.MenuItems;

    });

    $scope.itemclick = function(obj) {
        console.log("OnClick");
        if(obj.name == "Reprint-Bill")
        $rootScope.reprintBillButtonEnable = 1;
        else
        $rootScope.reprintBillButtonEnable = 0;
        $state.go(obj.state);
    }

})


