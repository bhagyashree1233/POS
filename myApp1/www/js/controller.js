angular.module('starter.controller', []).controller('ProductCtrl', ['$scope', '$rootScope', '$cordovaSQLite', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', function($scope, $rootScope, $cordovaSQLite, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate) {
    console.log($rootScope.Products);
    $scope.onHold = function() {
        console.log('eneterd on hold');
        $scope.showDelete = true;
    }
    /*    $rootScope.Products = [{
        productId: '1',
        name: 'Coffee',
        discount: '10',
        image: '/img/Iced_Coffee.jpg',
        categary: 'DCPTO1',
        unit: 'kg',
        unitPrice: '20',
        inStock: 100,
        tax: 5,
        actualPrice: '10'
    }];
 
    //  $rootScope.categaryArr = ['All', 'DCPTO1', 'DCPTO2', 'DCPTO3', 'DCPTO4', 'DCPTO5', 'DCPTO6', 'DCPTO7', 'DCPTO8', 'DCPTO9', 'DCPT10', 'DCPT11', 'DCPT12', 'DCPT13', 'DCPT14', 'DCPT15'];
   
 */
    //load categary list from DB
    $rootScope.categoryArr = [{
        categoryName: 'All'
    }];
    loadCategoryFromDB();
    function loadCategoryFromDB() {
        //  query = "SELECT * FROM Category where CategoryId = "+enteredCatId;
        query = "SELECT * FROM Category";
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log(res);
            for (var i = 0; i < res.rows.length; i++) {
                $rootScope.categoryArr.push({
                    categoryId: res.rows.item(i).CategoryId,
                    categoryName: res.rows.item(i).CategoryName
                });
                console.log(res.rows.item(i));
            }
            console.log($rootScope.categoryArr);
        })
    }
    //load products list from DB
    $rootScope.Products = [];
    loadProductsFromDB();
    function loadProductsFromDB() {
        //  query = "SELECT * FROM Category where CategoryId = "+enteredCatId;
        query = "SELECT * FROM Product";
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log(res);
            for (var i = 0; i < res.rows.length; i++) {
                $rootScope.Products.push({
                    productId: res.rows.item(i).ProductId,
                    name: res.rows.item(i).ProductName,
                    unit: res.rows.item(i).ProductUnit,
                    unitPrice: res.rows.item(i).ProductPrice,
                    tax: res.rows.item(i).TaxRate,
                    actualPrice: res.rows.item(i).BuyingPrice,
                    inStock: res.rows.item(i).ItemsinStock,
                    discount: res.rows.item(i).Discount,
                    category: res.rows.item(i).Category,
                    image: res.rows.item(i).Image
                });
            }
            console.log($rootScope.Products);
        })
    }
    $scope.display = function(catName) {
        $scope.prodCat = [];
        console.log($scope.prodCat.length);
        if (catName === 'All') {
            for (var i = 0; i < $scope.Products.length; i++) {
                $scope.prodCat.push($scope.Products[i]);
            }
        } else {
            for (var i = 0; i < $scope.Products.length; i++) {
                if ($scope.Products[i].categary == catName) {
                    $scope.prodCat.push($scope.Products[i]);
                }
            }
        }
        console.log($scope.prodCat)
        console.log($scope.prodCat.length)
    }
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
    }
    ;
    $scope.scrollTop = function() {
        $ionicScrollDelegate.$getByHandle('scrollSmall').scrollTop(true);
        //$ionicScrollDelegate.scrollBy(0, -50, true);
    }
    $scope.scrollBottom = function() {
        $ionicScrollDelegate.scrollBy(0, 50, true);
        // $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
    }
    // $scope.numValue = 0;
    $scope.prodCat = $scope.Products;
    $scope.productArr = [];
    $scope.totalPrice = null;
    $scope.index = null;
    $scope.serviceTax = 0.05;
    //  $scope.quantity=0;
    $scope.save = function(product) {
        console.log($scope.typedCode);
        if ($scope.typedCode == null) {
            console.log('Type Code Null')
            qty = $scope.typedCode = 1;
        } else {
            qty = $scope.typedCode;
        }
        //  var qty =document.getElementById('quantity').value;
        console.log('I am in Save Function')
        console.log('Scope quanitity' + qty)
        console.log(product.name + ' ' + product.unitPrice + ' ' + qty);
        var productAmount = product.unitPrice * qty;
        console.log('ProductAmount' + productAmount);
        $scope.productArr.push({
            productId: product.productId,
            name: product.name,
            quantity: qty,
            productAmount: productAmount,
            discount: product.discount,
            taxRate: product.taxRate,
            taxId: product.taxId,
            category: product.categoryId,
            categoryName: product.categoryName,
            selected: false
        })
        $scope.numericModal.hide();
        $scope.newProduct = {};
        $scope.typedCode = null;
        console.log($scope.productArr);
        $scope.totalPrice = $scope.totalPrice + productAmount;
        console.log('This is Totla Price' + $scope.totalPrice);
    }
    $scope.selectedProduct = function(product) {
        product.selected ? product.selected = false : product.selected = true;
    }
    $scope.cancel = function() {
        for (var i = 0; i < $scope.productArr.length; i++) {
            var bool = $scope.productArr[i].selected;
            if (bool) {
                $scope.totalPrice = $scope.totalPrice - $scope.productArr[i].productAmount;
                $scope.productArr.splice(i, 1);
            }
        }
    }
    $scope.void = function() {
        $scope.productArr = [];
        $scope.totalPrice = null;
    }
    //Numeric keypad for Quantity Start
    $scope.typedCode = 1;
    $scope.keyPressed = function(keyCode) {
        //console.log(keyCode)
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
            if (!/^\d+$/.test(tempT)) {
                $scope.typedCode = keyCode;
            } else {
                $scope.typedCode += '' + keyCode;
            }
            break;
        }
    }
    ;
    $scope.sendTheCodeQ = function() {
        if (/^\d+$/.test(tempT)) {
            // TODO : sends the entered code
            console.log('entered code is ' + $scope.typedCode + " " + $scope.typedCode.length);
            $scope.typedCode = null;
        }
    }
    ;
    $scope.removeQ = function() {
        console.log($scope.typedCode)
        if ($scope.typedCode > 0) {
            $scope.typedCode = $scope.typedCode.slice(0, -1);
        } else {
            $scope.typedCode = null;
        }
        console.log('I am in remove');
        // TODO start scaning the code and once it receives send to the socket
    }
    ;
    $scope.removeAllQ = function() {
        //Numeric keypad for Payment Start
        $scope.typedCode = null;
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
            if (!/^\d+$/.test(tempT)) {
                $scope.typedAmount = keyCode;
            } else {
                $scope.typedAmount += '' + keyCode;
            }
            break;
        }
    }
    ;
    $scope.sendTheCodeA = function() {
        if (/^\d+$/.test(tempT)) {
            // TODO : sends the entered code
            console.log('entered code is ' + $scope.typedCode + " " + $scope.typedAmount.length);
            $scope.typedAmount = "";
        }
    }
    ;
    $scope.removeA = function() {
        console.log($scope.typedAmount)
        if ($scope.typedAmount.length > 0) {
            $scope.typedAmount = $scope.typedAmount.slice(0, -1);
        } else {
            $scope.typedAmount = "";
        }
        console.log('I am in remove');
        // TODO start scaning the code and once it receives send to the socket
    }
    ;
    $scope.removeAllA = function() {
        $scope.typedAmount = "";
    }
    //Numeric keypad for Quantity Start
    /* $scope.numbers = '1';
          console.log($scope.numbers);
          $scope.keyboardVisible = false;
          $scope.showKeyboard = function() {
            $scope.keyboardVisible = true;
          }  
          $scope.keyboardSettings = {
           action: function(number) {
              $scope.numbers += number;
              console.log($scope.numbers);
           },
           leftButton: {
              html: '<i class="icon ion-backspace"></i>',
              action: function() {
                  $scope.numbers = $scope.numbers.slice(0, -1);
              }
           },
           rightButton: {
              html: '<i class="icon ion-checkmark-circled"></i>',
              action: function() {
                  
              }
            },
            showLetters:false,
            theme:'assertive',
            width:'100%',
            height:'50%',
              style: {
                  color: '#fff', // Text color
                  bgColor: '#4cda64', // Background color
                  activeBgColor: '#43bf58', // Baackground color when pressed
                  borderColor: '#43bf58' // Only clearly visible on round buttons (until next plugin version)
              }
          }

           //Numeric keypad ending*/
    $ionicModal.fromTemplateUrl('templates/PaymentModel.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.paymentModal = modal;
    });
    $scope.openPaymentModal = function() {
        console.log('I am in openModel')
        $scope.typedAmount = null;
        $scope.payableAmount = $scope.totalPrice + ($scope.serviceTax * $scope.totalPrice);
        $scope.paymentModal.show();
        $scope.receiptBtnShow = true;
        $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
        //  $scope.productAmount=$scope.newProduct.unitPrice*$scope.typedCode;
        // console.log($scope.productAmount);
    }
    ;
    $scope.closePaymentModal = function() {
        console.log('I am in close Model')
        $scope.typedAmount = "";
        $scope.paymentModal.hide();
    }
    ;
    // Payment model end
    $scope.paidAmount = function(typedAmount) {
        var typedAmount = parseInt($scope.typedAmount);
        $scope.paidAmount = typedAmount;
        $scope.Balence = typedAmount - $scope.payableAmount;
        // document.getElementById("buttonPayment").disabled = true;
        $scope.enterBtn = true;
        $scope.receiptBtnShow = false;
    }
    $scope.receipt = function() {
        $scope.paymentModal.hide();
        storeToTransaction();
        /*        //  document.getElementById("buttonPayment").disabled = true; 
        var transactionJsonObj = window.localStorage.getItem('transactionEvents');
        console.log(transactionJsonObj);
        if (transactionJsonObj != "") {
            transactionJsonObj = JSON.parse(transactionJsonObj);
        } else {
            transactionJsonObj = {};
        }
        console.log(transactionJsonObj);
        if (transactionJsonObj.lastRecieptId == undefined) {
            transactionJsonObj.lastRecieptId = "100";
        }
        var transactionObj = {};
       
        transactionObj.date = (new Date()).toString().substring(4, 24);
        transactionObj.recieptId = parseInt(transactionJsonObj.lastRecieptId) + 1;
        transactionObj.products = $scope.productArr;
        transactionObj.productsAmount = $scope.totalPrice;
        transactionObj.serviceTax = $scope.serviceTax * $scope.totalPrice;
        transactionObj.totalAmount = $scope.payableAmount;
        transactionObj.paidAmount = $scope.typedAmount;
        transactionObj.balanceAmount = $scope.Balence;
        transactionJsonObj[transactionObj.recieptId] = transactionObj;
        transactionJsonObj.lastRecieptId = (transactionObj.recieptId).toString();
        window.localStorage.setItem('transactionEvents', JSON.stringify(transactionJsonObj));
        console.log(transactionJsonObj);
  */
        $scope.productArr = [];
        $scope.totalPrice = null;
        $scope.payableAmount = null;
        $scope.typedAmount = null;
        $scope.Balence = null;
    }
 /*   {
            productId: product.productId,
            name: product.name,
            quantity: qty,
            productAmount: productAmount,
            discount: product.discount,
            taxRate: product.taxRate,
            taxId: product.taxId,
            category: product.categoryId,
            categoryName: product.categoryName,
            selected: false
        }
  */      
    function storeToTransaction() {
        var d = (new Date()).toString().substring(4, 24);
        $scope.BillNo =(new Date()).getTime();
        for (var i = 0; i < $scope.productArr.length; i++) {
            console.log($scope.productArr);
            var productObj = $scope.productArr[i];
            var query = "INSERT INTO Transaction (BillNo, DateTime, ProductId, ProductName, Quantity, ProductPrice, Discount, TaxRate, TaxId, Category, CategoryName) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute($rootScope.db, query, [$scope.BillNo, d, $scope.productObj.productId, $scope.productObj.name, $scope.productObj.quantity, $scope.productObj.productAmount, $scope.productObj.discount, $scope.productObj.taxRate, $scope.productObj.taxId, $scope.productObj.category, $scope.productObj.categoryName]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
               
            }, function(err) {
                console.error(err);
            });
        }
    }
    // Quantity model start
    $ionicModal.fromTemplateUrl('templates/numericKeypad.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.numericModal = modal;
    });
    $scope.openNumericModal = function(product) {
        console.log(' Open Numeric Model')
        $scope.numericModal.show();
        $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
        $scope.typedCode = "1";
        $scope.newProduct = product;
    }
    ;
    $scope.closeNumericModal = function() {
        console.log(' Closing Numeric Model')
        $scope.numericModal.hide();
        $scope.newProduct = {};
        $scope.typedCode = null;
    }
    ;
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
    $scope.next = function() {
        console.log('I am in next')
        $ionicScrollDelegate.scrollBy(0, 68, true);
    }
    ;
    $scope.previous = function() {
        $ionicScrollDelegate.scrollBy(0, -68, true);
    }
    ;
    //Slide Ends
}
]).controller("productCtrl", function($scope, $state, $rootScope, $cordovaSQLite, $cordovaCamera, $timeout, $cordovaFile, $ionicModal) {
    console.log($rootScope.Products);
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
    $scope.selectedTax = {};
    $scope.newProduct = {
        unit: 'pieces'
    };
    $scope.$watch('newProduct.productId', function(newpId, oldpId) {
        console.log(newpId);
        query = "SELECT * FROM Product where ProductId = '" + newpId + "'";
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log(res);
            if (res.rows.length == 0) {
                console.log('Id not exists..');
                $scope.checkIdShow = false;
            } else {
                console.log('Id already exists..');
                $scope.checkIdShow = true;
            }
        })
    });
    $scope.newProduct.image = "/img/sc1.jpg";
    $scope.addNewProduct = function() {
        console.log($scope.selectedTax);
        console.log('entered addNewProduct()..');
        console.log($scope.newProduct);
        if (!(angular.equals({}, $scope.selectedTax))) {
            $scope.newProduct['taxRate'] = $scope.selectedTax.tax.TaxRate;
            $scope.newProduct['taxId'] = $scope.selectedTax.tax.Id;
            console.log('validation success and entered if');
            console.log($scope.newProduct);
            var query = "INSERT INTO Product (ProductId, ProductName, ProductUnit, ProductPrice, TaxId, BuyingPrice, TaxRate, ItemsinStock, Discount, Category, Image) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute($rootScope.db, query, [$scope.newProduct.productId, $scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.image]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
                console.log("saved to draft successfully...");
                $rootScope.Products.push($scope.newProduct);
                $scope.newProduct = {
                    unit: 'pieces'
                };
            }, function(err) {
                console.error(err);
            });
        }
    }
    $scope.onCategorySelect = function(categoryObj) {
        $scope.newProduct.categoryName = categoryObj.categoryName;
        $scope.newProduct.categoryId = categoryObj.categoryId;
        $scope.categoryModal.hide();
    }
    $scope.addNewCategary = function(newCategaryName) {
        $state.go('app.category');
        $scope.categoryModal.hide();
        //  $rootScope.categoryArr.push(newCategaryName);
        //  document.getElementById('newCategoryAddField').value = null;
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
}).controller('categoryCtrl', function($scope, $cordovaSQLite, $rootScope) {
    $scope.newCategory = {};
    $scope.addNewCategory = function() {
        console.log('eneterd add newCategory..');
        var query = "INSERT INTO Category (CategoryId, CategoryName, CategoryDesc) VALUES (?,?,?)";
        $cordovaSQLite.execute($rootScope.db, query, [$scope.newCategory.categoryId, $scope.newCategory.categoryName, $scope.newCategory.categoryDescription]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            $rootScope.categoryArr.push($scope.newCategory.categoryName);
            console.log("saved to category successfully...");
            $scope.newCategory = {};
        }, function(err) {
            console.error(err.message);
        });
    }
    $scope.$watch('newCategory.categoryId', function(newcId, oldcId) {
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
}).controller('printerSettings', function($scope) {
    $scope.printrSettings = {};
    $scope.savePrinterSettings = function() {
        console.log($scope.printrSettings);
        document.getElementById("prinrSettings").reset();
    }
}).controller('paymentSettings', function($scope) {
    $scope.pamentSetting = {
        cash: false,
        master: false,
        amex: false,
        payCurncy: '',
        payTM: false,
        visa: false
    };
    $scope.savePaymentSettings = function() {
        console.log($scope.pamentSetting);
        document.getElementById("payMentSetting").reset();
    }
}).controller('reports', function($scope) {
    $scope.reportObj = {
        storeReportOnCloud: false,
        sendEmailReport: {
            value: false,
            email: ""
        },
        sendSMS: {
            value: false,
            onLowStock: "",
            dailyCollection: "",
            phoneNumber: ""
        }
    }
    $scope.saveReports = function() {
        console.log($scope.reportObj)
    }
})
