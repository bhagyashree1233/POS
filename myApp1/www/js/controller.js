

angular.module('starter.controller', [])


.controller('homeCtrl', ['$scope', '$rootScope','$state', '$cordovaSQLite', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'dbService', '$ionicPlatform', '$ionicLoading', function($scope, $rootScope, $state, $cordovaSQLite, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, dbService, $ionicPlatform, $ionicLoading) {

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
        if($rootScope.SelCat =='0')
        {
            $scope.OnCatClick("favourite")
        //$scope.highlight = "favourite";
        }
        else
        {
            $scope.OnCatClick($rootScope.SelCat)
        //$scope.highlight = $rootScope.SelCat;
        }
    });

   

    


    $ionicPlatform.ready(function() {
        //loadProducts();
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
            if(highlight!=undefined)
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

    $scope.onPressHold = function() {
        console.log('enterd on hold');
        $scope.showDelete = true;
    }
    $scope.deleteItem = function(index) {
        $scope.productArr.splice(index, 1);
        $scope.showDelete = false;
        delete $scope.itemsInStockObj[product.productId];
        calculateProductCost();
    }

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

    $scope.save = function(product) {
        console.log("New Product"+product);
        if($scope.productArr!=undefined && $scope.productArr.length<1){
            for (var i=0;i<$scope.productArr.length;i++){
                if(product.productId==$scope.productArr[i].productId){
                   $scope.productArr[i].quantity=product.quantity+$scope.productArr[i].quantity;
                    $scope.productArr[i].productTotalPrice=product.productTotalPrice+$scope.productArr[i].productTotalPrice;

                }
            }
        }
        console.log($scope.typedCode);
        if ($scope.typedCode == null) {
            console.log('Type Code Null')
            qty = $scope.typedCode = 1;
        } else {
            qty = $scope.typedCode;
        }
        $scope.itemsInStockObj[product.productId] = parseFloat(product.inStock) - parseFloat(qty);
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
        $scope.numericModal.hide();
        $scope.newProduct = {};
        $scope.typedCode = null;
        console.log($scope.productArr);
        $scope.totalPrice = $scope.totalPrice + productTotalPrice;
        $scope.totalTaxAmount = parseFloat(($scope.totalTaxAmount + productTotalTax).toFixed(2));
        $scope.discountAmount = parseFloat(($scope.discountAmount + discountAmount).toFixed(2));
        $scope.totalChargeAmount = parseFloat(($scope.totalChargeAmount + productTotalAmount).toFixed(2));
        console.log('This is Total Price' + $scope.totalPrice);
    }
    $scope.paidAmount = function() {
        console.log('I am in Paid Function')
        console.log($scope.typedAmount)
        var typedAmount = parseFloat($scope.typedAmount);
        $scope.paidAmount1 = typedAmount;
        console.log(typedAmount)
        $scope.Balance = typedAmount - $scope.totalChargeAmount;
        // document.getElementById("buttonPayment").disabled = true;
        $scope.enterBtn = true;
        $scope.receiptBtnShow = false;
    }
    //receipt function to store all transaction details in DB
    $scope.receipt = function() {
        $scope.paymentModal.hide();
        $scope.transactionDate = (new Date()).getTime();
        var promise = dbService.storeToTransaction($scope.productArr, $scope.transactionDate);
        promise.then(function(result) {
            console.log(result);
            $scope.paymentMethod = "cash";
            $scope.totalItems = $scope.productArr.length;
            //update inStock in product
            var promise = dbService.updateItemsInStock($scope.itemsInStockObj);
            toBillDetails();
        }, function(result) {
            console.log(result);
        })
    }
    //function to save bill details to database
    function toBillDetails() {
        var promise = dbService.storeToBillDetails($scope.totalPrice, $scope.discountAmount, $scope.totalTaxAmount, $scope.totalChargeAmount, $scope.paymentMethod, $scope.totalItems, $scope.transactionDate);
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
        }, function(result) {
            console.log(result);
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
            console.log(res)
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
    //Numeric keypad for Quantity Start
    $scope.typedCode = 1;
    var count = 0
    $scope.keyPressed = function(keyCode) {
        console.log($scope.typedCode.length);
        console.log(count++)
        if ($scope.typedCode.length == count) {
            $scope.typedCode = $scope.typedCode.slice(0, -1);
        } else {
            console.log($scope.typedCode.length);
        }
        tempT = $scope.typedCode;
        switch (keyCode) {
            case -4:
                $scope.sendTheCodeQ();
                break;
            case -3:
                $scope.removeQ();
                break;
            case -2:
                $scope.removeAllQ();
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
                    $scope.typedCode = keyCode;
                } else {
                    $scope.typedCode += '' + keyCode;
                    console.log($scope.typedCode)
                }
                break;
        }
    };
    $scope.sendTheCodeQ = function() {
        if (/\d/.test(tempT)) {
            // TODO : sends the entered code
            console.log('entered code is ' + $scope.typedCode + " " + $scope.typedCode.length);
            $scope.typedCode = "";
        }
    };
    $scope.removeQ = function() {
        console.log($scope.typedCode)
        if ($scope.typedCode.length > 0) {
            $scope.typedCode = $scope.typedCode.slice(0, -1);
        } else {
            $scope.typedCode = '';
        }
        console.log('I am in remove');
        // TODO start scaning the code and once it receives send to the socket
    };
    $scope.removeAllQ = function() {
        //Numeric keypad for Payment Start
        $scope.typedCode = '';
    }
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
    };
    // Payment model end
    // Quantity model start
    $ionicModal.fromTemplateUrl('templates/numericKeypad.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.numericModal = modal;
    });
    
    $scope.OnProductClick = function(Product)
    {
      if($rootScope.Mode == 1) //edit or add mode;;
      {
          console.log("Mode Edit");
          $rootScope.CreateMode = 0; //edit mode;;
          $rootScope.CurrentProduct = Product;
          $state.go('app.product');

      }
      else
      {
          $scope.openNumericModal(Product);
      }



    }


    $scope.openNumericModal = function(product) {

        console.log(' Open Numeric Model')
        $scope.numericModal.show();
        $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
        $scope.typedCode = "1";
        console.log(product.productId);
        
        $scope.newProduct=product
        
    };
    $scope.closeNumericModal = function() {
        console.log(' Closing Numeric Model')
        $scope.numericModal.hide();
        $scope.newProduct = {};
        $scope.typedCode = null;
        count = 0;
    };
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
    };
    $scope.holdItems = function() {
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
    };
    //Slide Ends

}]) //END OF HOMECTRL;;



.controller("productCtrl", function($scope, $state, $rootScope, $ionicPopover, $ionicHistory, $ionicPopup, $cordovaSQLite, $cordovaCamera, $timeout, $cordovaFile, $ionicModal, dbService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        console.log('working before enter..')

        

        if ($rootScope.CreateMode == 0) { //editing;;
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


    $scope.addEditProduct = function()
    {

        var productId=$scope.newProduct.productId;
        if(productId==undefined ||productId.length<1){

             $rootScope.ShowToast("Enter productId ", false);
            console.log('Enter Product Id')
            return false
        }

        var productName=$scope.newProduct.name;
        if(productName==undefined ||productName.length<2){
            $rootScope.ShowToast("Enter productName", false);
            console.log('Enter Product Name')
            return false
            }
    

      var productSellingPrice = $scope.newProduct.unitPrice;
    if (productSellingPrice==undefined ||productSellingPrice.length < 1) {

        $rootScope.ShowToast("Enter Selling Price ", false);
        console.log("Enter Selling Price");
        return false
    } else if (!$scope.newProduct.unitPrice.match(/^[0-9]+([,.][0-9]+)?$/g)) {
        $rootScope.ShowToast("Invalid Selling Price", false);
        console.log('Invalid product Selling')
        return false
    }

    var taxRate = $scope.newProduct.taxRate;
    console.log(taxRate);
    if (taxRate == undefined) {
        $rootScope.ShowToast("Select taxRate", false);
        console.log('Select taxRate')
        return false
    }

    var buyingPrice = $scope.newProduct.actualPrice;
    if (buyingPrice==undefined || buyingPrice.length < 1) {
        document.getElementById('buyingPrice').value = 0;
    } else if (!buyingPrice.match(/^[0-9]+([,.][0-9]+)?$/g)) {
        $rootScope.ShowToast("Invalid buyingPrice", false);
        console.log('Invalid buyingPrice')
        return false
    }
    var itemInStock = $scope.newProduct.inStock;
    if (itemInStock==undefined ||itemInStock.length < 1) {
        document.getElementById('itemsStock').value = 100000;

    } else if (!itemInStock.match('^[0-9]+$') && $scope.newProduct.unit == 'pieces') {
        $rootScope.ShowToast("Invalid  itemInStock", false);
        console.log('Invalid  itemInStock');
        return false
    } else if (!itemInStock.match(/^[0-9]+([,.][0-9]+)?$/g) && $scope.newProduct.unit == 'litres') {
        $rootScope.ShowToast("Invalid  itemInStock", false);
        console.log('Invalid  itemInStock');
        return false
    } else if (!itemInStock.match(/^[0-9]+([,.][0-9]+)?$/g) && $scope.newProduct.unit == 'kgs') {
        $rootScope.ShowToast("Invalid  itemInStock", false);
        console.log('Invalid  itemInStock');
        return false
    }
    var discount = $scope.newProduct.discount;

    if (discount==undefined||discount.length < 1) {
        document.getElementById('discount').value = 0;
        
    } else if (!discount.match(/^[0-9]+([,.][0-9]+)?$/g)) {
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
     

     if ($rootScope.CreateMode == 0)
     {
         console.log("Edit Product");
         editProduct();
     }
     else
     {
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
    $scope.TaxSettings1 = [{
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
    }]

    $scope.onTaxRateSelect = function(tax) {
        $scope.newProduct.taxRate = tax.TaxRate;
        $scope.newProduct.taxId = tax.Id;
        $scope.taxRatePopover.hide();
    }
    
    $ionicPopover.fromTemplateUrl('templates/taxRatePopover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.taxRatePopover = popover;
    });

    $scope.openTaxRatePopover = function($event) {
        $scope.taxRatePopover.show($event);
    };
    $scope.$watch('newProduct.productId', function(newpId, oldpId) {
        console.log(newpId);
        if (newpId) {
            // to hide success message
            $scope.productSuccessMessage = false;
            //   $scope.categoryForm.catIdInput.$setUntouched();
        }
        if ($scope.notEditingProduct) {
            query = "SELECT * FROM Product where ProductId = '" + newpId + "'";
            $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
                console.log(res);
                if (res.rows.length == 0) {
                    console.log('Id not exists..');
                    $scope.idExistsError = false;
                } else {
                    console.log('Id already exists..');
                    $scope.idExistsError = true;
                }
            })
        }
    });

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
        //$scope.newProduct.image = "/img/icedcoffee.jpg";
        console.log($scope.newProduct);
        
            if (!($scope.idExistsError)) {
               /* if (!(angular.isDefined($scope.newProduct.discount))) {
                    $scope.newProduct.discount = 0;
                }
                 if (!(angular.isDefined($scope.newProduct.inStock))) {
                    $scope.newProduct.inStock = 1000000;
                }*/
                console.log('validation success and entered if');
                console.log($scope.newProduct);
                $rootScope.showDbLoading();
                var promise = dbService.addNewProduct($scope.newProduct.productId, $scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image, $scope.newProduct.favourite);
                promise.then(function(result) {
                    console.log(result);
                    console.log("Product Added Sucessfully");
                    $rootScope.ShowToast("Product Added Sucessfully",false);
                    //  $rootScope.Products.push($scope.newProduct);
                    $scope.newProduct = {
                        unit: 'pieces',
                        image: "/img/sc1.jpg",
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
                    $rootScope.ShowToast("Unable to add product",false);
                    $rootScope.hideDbLoading();
                })
            }
        
    }


 function editProduct()
        { 
            $rootScope.showDbLoading();
            var promise = dbService.editProduct($scope.newProduct.productId, $scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image, $scope.newProduct.favourite);
            promise.then(function(result) {
                console.log(result);
                console.log("product Edited Sucessfully");
                $rootScope.hideDbLoading();
                 $rootScope.ShowToast("product Edited Sucessfully",false);
                $ionicHistory.goBack();
            }, function(result) {
                console.log(result);
                $rootScope.ShowToast("Unable to Edit product",false);
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
            console.log("ProductId 2:",productId);
            var promise = dbService.deleteProduct(productId);
            promise.then(function(result) {

                $rootScope.hideDbLoading();
                $ionicHistory.goBack();
               
            }, function(result) {
                console.log(result);
                $rootScope.hideDbLoading();
            });

                }
                else
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
        $state.go('app.category');
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
            }, function(err) { // error
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
        $scope.newCategory={};
        $scope.newCategory.categoryId = "";
        $scope.newCategory.categoryName="";
        $scope.newCategory.categoryDescription="";

        if($rootScope.CreateMode == 1)
         $rootScope.CategoryButtonText = "Add Category";
         else
         {
         $rootScope.CategoryButtonText = "Edit Category";
         loadCategory();
         }
    });

    function loadCategory() {
        
        $rootScope.showDbLoading();
        var promise = dbService.GetCategoryById($rootScope.SelCat);
        promise.then(function(res) {
            if(res.categoryId !="Failed")
            $scope.newCategory = res;

            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    $scope.OnDone = function()
    {
      if($rootScope.CreateMode == 1)
       $scope.addNewCategory();
      else
      $scope.saveEditedCategory();

    }

    $scope.deleteAllProductsAndCat = function()
    {

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
                         $rootScope.ShowToast("Failed to delete Products in Category",false);
                        $rootScope.hideDbLoading();
                    })


                     }
                     else
                        return;

                     });
                


        

    }


    $scope.deleteCategory = function() {
        
            
           
       var promise = dbService.deleteCategory($scope.newCategory.categoryId);
                    promise.then(function(res) {
                        console.log(res);
                         $rootScope.ShowToast("Delete Category Success",false);
                        $rootScope.hideDbLoading();
                        //$ionicHistory.goBack();
                        $rootScope.SelCat = 'favourite';
                        $state.go('app.home');
                    }, function() {
                        console.log(res);
                        $rootScope.ShowToast("Failed to Delete Category",false);
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
        if ($scope.newCategory.name !='' && $scope.newCategory.categoryId !='') {
            console.log($scope.newCategory.categoryName);
            console.log($scope.newCategory.categoryId);
            console.log($scope.newCategory.categoryDescription);
            $rootScope.showDbLoading();
            var promise = dbService.editCategory($scope.newCategory.categoryId, $scope.newCategory.categoryName, $scope.newCategory.categoryDescription);
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


        if (!($scope.catIdErrorMsg)) 
        {
            $rootScope.showDbLoading();
            var promise = dbService.addNewCategory($scope.newCategory.categoryId, $scope.newCategory.categoryName, $scope.newCategory.categoryDescription);
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
                    $rootScope.ShowToast("Category Added Sucessfully",false);
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
                $rootScope.ShowToast("Failed to Add Category",false);
                $rootScope.hideDbLoading();
            });
        }
        else
        {
            console.log("Id already Exists");
            $rootScope.ShowToast("Id already Exists",false);
        }
    }


    $scope.$watch('newCategory.categoryId', function(newcId, oldcId) {
        if (newcId) {
            $scope.succesMessage = false;
            // to hide success message
            //     $scope.categoryForm.catIdInput.$setUntouched();
        }
        console.log(newcId);
        query = "SELECT * FROM Category where CategoryId = '" + newcId + "'";
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log(res);
            if (res.rows.length == 0) {
                console.log('Id not exists..');
                $scope.catIdErrorMsg = false;
            } else {
                console.log('Id already exists..');
                $scope.catIdErrorMsg = true;
            }
        })
    });


})
/*
.controller('editProductsCtrl', function($scope, $rootScope, $state, $ionicHistory, dbService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        loadProducts();
    });
    $scope.editProduct = function(editingProduct) {
        console.log(editingProduct);
        $rootScope.editingProduct = editingProduct;
        $state.go('app.product');
    }

    function loadProducts() {
        $rootScope.showDbLoading();
        var promise = dbService.loadProductFromDB('Product');
        promise.then(function(res) {
            $rootScope.hideDbLoading();
            $scope.Products = res;
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }
    $scope.showProduct = true;
    $scope.onEditProductHold = function() {
        console.log('on hold');
        $scope.showDeleteOnHold = true;
        $scope.showCheckMark = true;
    }
    $scope.cancelDelete = function() {
        //  $scope.deleteProductId = {};
        $scope.showDeleteOnHold = false;
        $scope.showCheckMark = false;
    }
    $scope.deleteProductId = {};
    $scope.selectedProduct = function(productId, value) {
        if (value) {
            $scope.deleteProductId[productId] = 'selected';
            console.log(productId);
        } else {
            delete $scope.deleteProductId[productId];
            console.log('unselected');
        }
        console.log($scope.deleteProductId);
    }
   
})*/

.controller('MenuCtrl', function($scope, settingService, $rootScope,$state) {

$rootScope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
console.log($rootScope.devWidth);
$rootScope.menuWidth = 0.90 * $rootScope.devWidth;
console.log("In Menu Ctrl");
$scope.rightItems = [];

jQuery.getJSON('json/MenuItems.json', function(data) {

$scope.rightItems = data.MenuItems;



});

/*var Items = {};
Items.name = "Home";
Items.icon = "ion-ios-home-outline";
Items.state = "app.TaxSettings";

$scope.rightItems.push(Items);

var Items1= {};
Items1.name = "Settings";
Items1.icon = "ion-ios-compose-outline";
Items1.state = "app.Reports";

$scope.rightItems.push(Items1);*/

$scope.itemclick = function(obj)
{
    console.log("OnClick");
    $state.go(obj.state);
}

})

.controller('taxSetting', ['$scope', '$rootScope', '$state', '$cordovaSQLite', '$ionicPlatform', 'settingService', function($scope, $rootScope, $state, $cordovaSQLite, $ionicPlatform, settingService) {    
    console.log('I am in tax  settings');

    $scope.taxSettings = [];
    $scope.txSetting = {};
    $scope.tax={}
    $scope.addView=true;
    console.log($rootScope.TaxSettings.length)
    for( var i=0;i<$rootScope.TaxSettings.length;i++){
    $scope.taxSettings[i] = {
        id: $rootScope.TaxSettings[i].id,
        name: $rootScope.TaxSettings[i].name,
        taxRate: $rootScope.TaxSettings[i].taxRate
    };
    }
    //$scope.taxSettings=[]
    console.log($scope.taxSettings);
    var d = new Date();
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
    

   /* $scope.addMore = function() {
        var taxNme=$scope.txSetting.name;
    if(taxNme==undefined ||taxNme.length<1){
        console.log('Enter tax Setting')
        return false
    }else if(!taxNme.match(/^[a-z0-9]+$/i)){
        console.log('Invalid tax Setting')
        return false
    }

    var taxRate=$scope.txSetting.taxRate;
    if(taxRate==undefined ||taxRate.length<1){
        console.log('Enter tax Rate')
    }else if(!taxRate.match(/^[0-9]+([,.][0-9]+)?$/g)){
        console.log('Invalid tax Rate')
        return false
    }
        console.log('Hi am in addMore')
        var txSetting = $scope.txSetting
        $scope.taxSettings.push({
            txSetting

        })
        console.log($scope.taxSettings)
        document.getElementById("myTaxSettingForm").reset();
        $scope.txSetting = {}
    }
*/
    $scope.saveTaxSetting = function() {
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

        var txSetting = $scope.txSetting
        console.log($scope.taxSettings);
        $scope.taxSettings.push({
             id:d,
           name: txSetting.name,
           taxRate:txSetting.taxRate
        })
        console.log('Hai i am in TaxSetting Save')
        console.log($scope.taxSettings)
        var taxSettings = JSON.stringify($scope.taxSettings);
        var promise = settingService.set("TaxSettings", taxSettings)
        promise.then(function(data) {
            console.log(data);
            if (data.rowsAffected >= 1) {
                var promise = settingService.get("TaxSettings", taxSettings);
                promise.then(function(data) {
                    $rootScope.TaxSettings = JSON.parse(data.rows[0].SettingsValue);
                })
            } else {
                console.log('No TaxSettings Record Found')
            }
        })
     

        /* $cordovaSQLite.execute($rootScope.db, 'delete from Settings where SettingsName="TaxSettings"')

        var taxSettings = JSON.stringify($scope.taxSettings);
        var promise = settingService.set("TaxSettings", taxSettings)
        promise.then(function(data) {=
            console.log(data);
        })
        /* $cordovaSQLite.execute($rootScope.db, 'delete from Settings where SettingsName="TaxSettings"')
                 .then(function(result) {
                     $scope.statusMessage = "Message saved successful, cheers!";
                     console.log($scope.statusMessage)
                 }, function(error) {
                     $scope.statusMessage = "Error on saving: " + error.message;
                     console.log($scope.statusMessage)
                 })*/
           $scope.txSetting = {}
       
    }
    $scope.editTaxSetting=function(tax){
        console.log(tax)
        for(var i=0;i<$rootScope.TaxSettings.length;i++){
            if(tax==$rootScope.TaxSettings[i].id){
                console.log($rootScope.TaxSettings[i].id)
                console.log($scope.txSetting.taxRate)
            $rootScope.TaxSettings[i].name=$scope.txSetting.name;
            $rootScope.TaxSettings[i].taxRate=$scope.txSetting.taxRate;
            }
        }
        console.log($rootScope.TaxSettings)
    }
   $scope.view=function(tax){
$scope.addView=false;
$scope.txSetting.id=tax.id;
$scope.txSetting.name=tax.name;
$scope.txSetting.taxRate=tax.taxRate;
$state.go('app.TaxSettings')
   }
    
}]).controller('printerSettings', function($scope, settingService, $rootScope) {
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
        
        if(shopName==undefined||shopName.length<2){
            $rootScope.ShowToast("Enter Shop Name", false);
                console.log('Enter Shop Name')
                return false
            }else if(!shopName.match(/^[a-z0-9]+$/i)){
                $rootScope.ShowToast("Invalid shopName", false);
                console.log('Invalid shopName')
              return false  
            }
        var number1=$scope.printFormatSettings.phNumber;
        if(!number1.match('^[0-9\+\]+$')){
            $rootScope.ShowToast("Invalid Number", false);
            console.log('Invalid Number')
            return false 
        }
        var tinNum=$scope.printFormatSettings.tin;
        if(!tinNum.match('^[0-9]+$')){
            $rootScope.ShowToast("Invalid TIN Number", false);
           
        }
       
        var billNumber=$scope.printFormatSettings.strtBillNmbr;
        if(billNumber==undefined||billNumber.length<1){
            document.getElementById('billNumber').value=1;
        }else if(!billNumber.match('^[0-9]+$')){
            console.log('Invalid bill Number')
            return false
        }
        var trtTokenNum=$scope.printFormatSettings.tokStartNmbr;
        console.log(trtTokenNum)
        if(trtTokenNum==undefined||trtTokenNum.length<1){
            document.getElementById('trtTokenNum').value=1;
        }
        
       var restTokenNum=$scope.printFormatSettings.tokResetAftr;
        if(restTokenNum==undefined||restTokenNum.length<1){
            document.getElementById('restTokenNum').value=999;
        }else if(!restTokenNum.match('^[0-9]+$')||restTokenNum<trtTokenNum){
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
                    $rootScope.printFormatSettings = JSON.parse(data.rows[0].SettingsValue);
                })
            } else {
                console.log('No PrinterFormatSettings Record Found')
            }
        })
    }
})


.controller('paymentSettings', function($scope, settingService, $rootScope) {

    $scope.paymentSetting = {};
    console.log($rootScope.PaymentSettings)
    $scope.paymentSetting.currency = $rootScope.PaymentSettings.currency;
    console.log($scope.paymentSetting)
    $scope.paymentSetting.paymentOptions = $rootScope.PaymentSettings.paymentOptions;
    $scope.savePaymentSettings = function() {
        console.log($scope.paymentSetting)

        var paymentSetting = JSON.stringify($scope.paymentSetting);
        var promise = settingService.set("PaymentSettings", paymentSetting);
        promise.then(function(data) {
            console.log(data.rows.length);
            console.log(data)
            if (data.rowsAffected >= 1) {
                var promise = settingService.get("PaymentSettings", paymentSetting);
                promise.then(function(data) {
                    $rootScope.PaymentSettings = JSON.parse(data.rows[0].SettingsValue);
                    var currency = $rootScope.PaymentSettings.currency.split(' ');
                    var currencyName = currency[0];
                    var currencySymbol = currency[1];
                    $rootScope.currencySymbol = currencySymbol;
                })
            } else {
                console.log('No PayMent Setting Record Found')
                var currency = $rootScope.PaymentSettings.currency.split(' ');
                var currencyName = currency[0];
                var currencySymbol = currency[1];
                $rootScope.currencySymbol = currencySymbol;
            }
        })
    }
}).controller('reports', function($scope,$rootScope,settingService) {
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
})

.controller('salesReportCtrl', function($scope, salesService, $rootScope) {
$scope.Dte={}
$scope.salesReport=[]
$scope.save=function(){

 var promise = salesService.getSalesReport($scope.Dte.start.getTime(), $scope.Dte.end.getTime());
        promise.then(function(data) {
            console.log(data)
            $scope.salesReport=data;
        })
}
})