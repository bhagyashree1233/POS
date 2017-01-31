angular.module('starter.controller', []).controller('homeCtrl', ['$scope', '$rootScope', '$cordovaSQLite', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'dbService', '$ionicPlatform', function($scope, $rootScope, $cordovaSQLite, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, dbService, $ionicPlatform) {
        $scope.$on("$ionicView.beforeEnter", function(event, data) {
            console.log('entered before enter view')
            loadProducts();
            loadCategory();
        });
        $ionicPlatform.ready(function() {
            loadProducts();
            loadCategory();
        })
        $scope.Products = [];
        $scope.categoryArr = [];
        $scope.allSlideCatArr = [];
        $scope.allSlideProductArr = [];

        function loadProducts() {
            var promise = dbService.loadProductFromDB('Product');
            promise.then(function(res) {
                $scope.Products = res;
                console.log('products loaded...');
                productSlideLogic();
            }, function(res) {
                console.log(res)
            })
        }

        function loadCategory() {
            var promise = dbService.loadCategoryFromDB('Category');
            promise.then(function(res) {
                $scope.categoryArr = res;
                categorySlideLogic();
            }, function(res) {
                console.log(res);
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
        $scope.onHold = function() {
            console.log('enterd on hold');
            $scope.showDelete = true;
        }
        //load products list from DB
        $scope.display = function(catId) {
            console.log(catId);
            $scope.prodCat = [];
            console.log($scope.prodCat.length);
            if (catId == 'favourite') {
                for (var i = 0; i < $scope.Products.length; i++) {
                    if ($scope.Products[i].favourite == "true") {
                        $scope.prodCat.push($scope.Products[i]);
                    }
                }
            } else {
                for (var i = 0; i < $scope.Products.length; i++) {
                    if ($scope.Products[i].categoryId == catId) {
                        $scope.prodCat.push($scope.Products[i]);
                    }
                }
            }
            /*
        var promise = dbService.loadProductsForCategory(categoryId)
        promise.then(function(res){
            $scope.prodCat.push({
                categoryId: res.rows.item(i).CategoryId,
                categoryName: res.rows.item(i).CategoryName,
                categoryDescription: res.rows.item(i).CategoryDesc
              }) 
        }, function(res){
             console.log(res); 
        })
 */
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
        };
        $scope.scrollTop = function() {
            $ionicScrollDelegate.$getByHandle('scrollSmall').scrollTop(true);
            //$ionicScrollDelegate.scrollBy(0, -50, true);
        }
        $scope.scrollBottom = function() {
            $ionicScrollDelegate.scrollBy(0, 50, true);
            // $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
        }
        // $scope.numValue = 0;
        $scope.productArr = [];
        $scope.discountAmount = 0;
        $scope.totalPrice = null;
        $scope.totalTaxAmount = 0;
        $scope.index = null;
        $scope.totalChargeAmount = 0;
        $scope.serviceTax = 0.05;
        //  $scope.quantity=0;
        $scope.save = function(product) {
            console.log(product);
            console.log($scope.typedCode);
            if ($scope.typedCode == null) {
                console.log('Type Code Null')
                qty = $scope.typedCode = 1;
            } else {
                qty = $scope.typedCode;
            }
            //  var qty =document.getElementById('quantity').value;
            console.log('I am in Save Function');
            // console.log('Scope quanitity' + qty);
            console.log(product.name + ' ' + product.unitPrice + ' ' + qty);
            var productTotalPrice = product.unitPrice * qty;
            console.log("productTotalPrice: " + productTotalPrice);
            var productTotalTax = (product.taxRate / 100) * productTotalPrice;
            console.log("productTotalTax: " + productTotalTax);
            var discountAmount = (product.discount / 100) * productTotalPrice;
            console.log("discountAmount: " + discountAmount);
            var productTotalAmount = productTotalPrice + productTotalTax - discountAmount;
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
            //  TotalPrice real, TaxAmount real, TotalAmount real;
            $scope.numericModal.hide();
            $scope.newProduct = {};
            $scope.typedCode = null;
            console.log($scope.productArr);
            $scope.totalPrice = $scope.totalPrice + productTotalPrice;
            $scope.totalTaxAmount = $scope.totalTaxAmount + productTotalTax;
            $scope.discountAmount = ($scope.discountAmount + discountAmount);
            $scope.totalChargeAmount = $scope.totalChargeAmount + productTotalAmount;
            console.log('This is Totla Price' + $scope.totalPrice);
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
        $scope.receipt = function() {

            $scope.paymentModal.hide();
            $scope.transactionDate = (new Date()).getTime();
            var promise = dbService.storeToTransaction($scope.productArr, $scope.transactionDate);
            promise.then(function(result) {
                console.log(result);
                $scope.paymentMethod = "cash";
                $scope.totalItems = $scope.productArr.length;
                toBillDetails();
                //clear all values
                $scope.productArr = [];
                $scope.totalPrice = null;
                $scope.payableAmount = null;
                $scope.typedAmount = null;
                $scope.Balance = null;
                $scope.totalTaxAmount = 0;
                $scope.discountAmount = 0;
                $scope.totalChargeAmount = 0;

            }, function(result) {
                console.log(result);
            })
        }

        function toBillDetails() {
            var promise = dbService.storeToBillDetails($scope.totalPrice, $scope.discountAmount, $scope.totalTaxAmount, $scope.totalChargeAmount, $scope.paymentMethod, $scope.totalItems, $scope.transactionDate);
            promise.then(function(result) {
                console.log(result);
            }, function(result) {
                console.log(result);
            })
        }
        //BillNo, TotalPrice, DiscountAmount, TaxAmount, TotalAmount, PaymentMethod, DateTime, TotalItems, BillStatus
        var billDetail = [];
        var promise = dbService.getBillDetails(2);
        promise.then(function(res) {
            for (var i = 0; i < res.rows.length; i++) {
                billDetail.push({
                    BillNo: res.rows.item(i).BillNo,
                    TotalPrice: res.rows.item(i).TotalPrice,
                    DiscountAmount: res.rows.item(i).DiscountAmount,
                    TaxAmount: res.rows.item(i).TaxAmount,
                    TotalAmount: res.rows.item(i).TotalAmount,
                    PaymentMethod: res.rows.item(i).PaymentMethod,
                    DateTime: res.rows.item(i).DateTime,
                    TotalItems: res.rows.item(i).TotalItems,
                    BillStatus: res.rows.item(i).BillStatus
                });
            }
            console.log(billDetail);
        }, function(res) {
            console.log(res)
        })
        //BillNo, DateTime, ProductId, ProductName, Quantity, ProductPrice, TotalPrice, TaxAmount, TotalAmount, DiscountAmount, Discount, TaxRate, TaxId, CategoryId, CategoryName    
        var transactionDetail = [];
        var promise = dbService.getTransactionDetails(3);
        promise.then(function(res) {
            for (var i = 0; i < res.rows.length; i++) {
                transactionDetail.push({
                    BillNo: res.rows.item(i).BillNo,
                    DateTime: res.rows.item(i).DateTime,
                    ProductId: res.rows.item(i).ProductId,
                    ProductName: res.rows.item(i).ProductName,
                    Quantity: res.rows.item(i).Quantity,
                    ProductPrice: res.rows.item(i).ProductPrice,
                    TotalPrice: res.rows.item(i).TotalPrice,
                    TaxAmount: res.rows.item(i).TaxAmount,
                    TotalAmount: res.rows.item(i).TotalAmount,
                    DiscountAmount: res.rows.item(i).DiscountAmount,
                    Discount: res.rows.item(i).Discount,
                    TaxRate: res.rows.item(i).TaxRate,
                    TaxId: res.rows.item(i).TaxId,
                    CategoryId: res.rows.item(i).CategoryId,
                    CategoryName: res.rows.item(i).CategoryName
                });
            }
            console.log(transactionDetail);
        }, function(res) {
            console.log(res)
        })
        $scope.selectedProduct = function(product) {
            product.selected ? product.selected = false : product.selected = true;
        }
        $scope.cancel = function() {
            for (var i = 0; i < $scope.productArr.length; i++) {
                var bool = $scope.productArr[i].selected;
                if (bool) {
                    $scope.totalPrice = $scope.totalPrice - $scope.productArr[i].productTotalPrice;
                    $scope.productArr.splice(i, 1);
                }
            }
        }
        $scope.void = function() {
            $scope.productArr = [];
            $scope.totalPrice = null;
            $scope.payableAmount = null;
            $scope.typedAmount = null;
            $scope.Balance = null;
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
                $scope.payableAmount = $scope.totalPrice + ($scope.serviceTax * $scope.totalPrice);
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
        $scope.openNumericModal = function(product) {
            console.log(' Open Numeric Model')
            $scope.numericModal.show();
            $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
            $scope.typedCode = "1";
            $scope.newProduct = product;
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
        $scope.next = function() {
            console.log('I am in next')
            $ionicScrollDelegate.scrollBy(0, 68, true);
        };
        $scope.previous = function() {
            $ionicScrollDelegate.scrollBy(0, -68, true);
        };
        //Slide Ends
    }]).controller("productCtrl", function($scope, $state, $rootScope, $ionicHistory, $ionicPopup, $cordovaSQLite, $cordovaCamera, $timeout, $cordovaFile, $ionicModal, dbService) {
        $scope.$on("$ionicView.beforeEnter", function(event, data) {
            loadCategory();
            $scope.notEditingProduct = angular.equals({}, $rootScope.editingProduct);
            console.log($scope.notEditingProduct);
            if (!($scope.notEditingProduct)) {
                $scope.newProduct = $rootScope.editingProduct;
                $rootScope.editingProduct = {};
                $scope.pIdDisable = true;
                console.log($scope.selectedTax);
            } else {
                $scope.pIdDisable = false;
            }
            console.log("State Params: ", data.stateParams);
        });

        function loadCategory() {
            var promise = dbService.loadProductFromDB('Category');
            promise.then(function(res) {
                $scope.categoryArr = res;
            }, function(res) {
                console.log(res)
            })
        }
        console.log($rootScope.Products);
        console.log($rootScope.editingProduct);
        $scope.newProduct = $rootScope.editingProduct;
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
            if (newpId) {
                $scope.productSuccessMessage = false;
                // to hide success message
                //   $scope.categoryForm.catIdInput.$setUntouched();
            }
            if ($scope.notEditingProduct) {
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
            }
        });
        $scope.$watch('newProduct.inStock', function(newValue, oldValue) {
            if ($scope.newProduct.unit == 'pieces') {
                $scope.newProduct.inStock = Math.round(newValue);
            }
        });
        $scope.newProduct.image = "/img/sc1.jpg";
        $scope.addNewProduct = function() {
            console.log($scope.selectedTax);
            console.log('entered addNewProduct()..');
            $scope.newProduct.image = "/img/sc1.jpg";
            console.log($scope.newProduct);
            if ($scope.notEditingProduct) {
                if (!($scope.checkIdShow)) {
                    $scope.newProduct['taxRate'] = $scope.selectedTax.tax.TaxRate;
                    $scope.newProduct['taxId'] = $scope.selectedTax.tax.Id;
                    console.log('validation success and entered if');
                    console.log($scope.newProduct);
                    var promise = dbService.addNewProduct($scope.newProduct.productId, $scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image, $scope.newProduct.favourite);
                    promise.then(function(result) {
                        console.log(result);
                        //  $rootScope.Products.push($scope.newProduct);
                        $scope.newProduct = {
                            unit: 'pieces',
                            image: "/img/sc1.jpg"
                        };
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
                    })
                }
            } else {
                if (!(angular.equals({}, $scope.newProduct))) {
                    $scope.newProduct['taxRate'] = $scope.selectedTax.tax.TaxRate;
                    $scope.newProduct['taxId'] = $scope.selectedTax.tax.Id;
                }
                //  console.log($scope.newProduct);
                var promise = dbService.editProduct($scope.newProduct.productId, $scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image, $scope.newProduct.favourite);
                promise.then(function(result) {
                    console.log(result);
                    //   $rootScope.Products.push($scope.newProduct);
                    $ionicHistory.goBack();
                }, function(result) {
                    console.log(result);
                })
            }
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
    }).controller('categoryCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $cordovaSQLite, $rootScope, dbService) {
        $scope.$on("$ionicView.beforeEnter", function(event, data) {
            loadCategory();
        });

        function loadCategory() {
            var promise = dbService.loadProductFromDB('Category');
            promise.then(function(res) {
                $scope.categoryArr = res;
            }, function(res) {
                console.log(res)
            })
        }
        $scope.deleteCategory = function() {
            if ($scope.searchCategory.categoryId) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete Category ',
                    template: 'Are you sure you want to delete Category?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        console.log('delete Category');
                        var promise = dbService.deleteCategory($scope.searchCategory.categoryId);
                        promise.then(function(res) {
                            console.log(res);
                            $ionicHistory.goBack();
                        }, function() {
                            console.log(res);
                        })
                    } else {
                        console.log('No');
                    }
                });
            } else {
                $scope.selectCategoryWarningMsg = true;
            }
        }
        $scope.editCategory = function() {
            console.log('entered edit category');

            if ($scope.searchCategory.categoryId) {
                $scope.showEditField = true;
            } else {
                $scope.selectCategoryWarningMsg = true;
            }
        }
        $scope.searchCategory = {
            categoryId: ""
        };
        $scope.editSelectedCategory = function(categoryEditObj) {
            //  $scope.searchCategory = categoryEditObj;
            $scope.searchCategory.categoryId = categoryEditObj.categoryId;
            $scope.showCategoryEdit = true;
        }
        $scope.newCategory = {};
        $scope.addNewCategory = function() {
            if (!($scope.catIdErrorMsg)) {
                var promise = dbService.addNewCategory($scope.newCategory.categoryId, $scope.newCategory.categoryName, $scope.newCategory.categoryDescription);
                promise.then(function(result) {
                    console.log(result);
                    $scope.succesMessage = true;
                    //   $rootScope.categoryArr.push($scope.newCategory);
                    $scope.newCategory = {};
                    if ($rootScope.cameFromProduct) {
                        $rootScope.cameFromProduct = false;
                        $ionicHistory.goBack();
                    } else {
                        //confirmation popup
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Add More Category ',
                            template: 'Do you want to add more Category?'
                        });
                        confirmPopup.then(function(res) {
                            if (res) {
                                console.log('add more Category');
                            } else {
                                console.log('No');
                                $ionicHistory.goBack();
                            }
                        });
                    }
                }, function() {
                    console.log(result);
                });
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

    }).controller('editProductsCtrl', function($scope, $rootScope, $state, $ionicHistory, dbService) {
        $scope.$on("$ionicView.beforeEnter", function(event, data) {
            loadProducts();
        });
        $scope.editProduct = function(editingProduct) {
            console.log(editingProduct);
            $rootScope.editingProduct = editingProduct;
            $state.go('app.product');
        }

        function loadProducts() {
            var promise = dbService.loadProductFromDB('Product');
            promise.then(function(res) {
                $scope.Products = res;
            }, function(res) {
                console.log(res)
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
        $scope.deleteSelectedProducts = function() {
            if (!(angular.equals({}, $scope.deleteProductId))) {
                var promise = dbService.deleteProduct($scope.deleteProductId);
                promise.then(function(result) {
                    // $ionicHistory.goBack();
                    var promise = dbService.loadProductFromDB('Product');
                    promise.then(function(res) {
                        $rootScope.Products = res;
                    }, function(res) {
                        console.log(res)
                    })
                }, function(result) {
                    console.log(result);
                })
            }
        }
    })
    .controller('taxSetting', ['$scope', '$rootScope', '$cordovaSQLite', '$ionicPlatform', 'settingService', function($rootScope, $scope, $cordovaSQLite, $ionicPlatform, settingService) {
        $scope.taxSettings = [];
        $scope.txSetting = {};
        console.log($rootScope.TaxSettings)

        $scope.taxSettings[0] = {
            id: $rootScope.TaxSettings[0].id,
            name: $rootScope.TaxSettings[0].name,
            taxRate: $rootScope.TaxSettings[0].taxRate
        };
        // $scope.taxSettings[0][$scope.txSetting.name]=;
        // $scope.taxSettings[0][$scope.txSetting.taxRate]=;
        //console.log($rootScope.$scope.TaxSettings[0].name)

        var d = new Date();
        var taxSettings = []
        $scope.addMore = function() {
            var txSetting = $scope.txSetting
            $scope.taxSettings.push({
                txSetting
            })
            console.log($scope.taxSettings)
            document.getElementById("myTaxSettingForm").reset();
            $scope.txSetting = {}
        }
        $scope.saveTaxSetting = function() {

            var txSetting = $scope.txSetting
            $scope.taxSettings.push({
                txSetting
            })
            console.log('Hai i am in TaxSetting Save')
            console.log($scope.taxSettings)
            var taxSettings = JSON.stringify($scope.taxSettings);
            var promise = settingService.set("TaxSettings", taxSettings)
            promise.then(function(data) {
                console.log(data);
                if(data.rows.length>=1){
               $rootScope.TaxSettings=data.rows[0].SettingsValue;
               }else{
                   console.log('No TaxSettings Record Found')
               }
            })
            /* $cordovaSQLite.execute($rootScope.db, 'delete from Settings where SettingsName="TaxSettings"')

            var taxSettings = JSON.stringify($scope.taxSettings);
            var promise = settingService.set("TaxSettings", taxSettings)
            promise.then(function(data) {
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
            console.log($scope.printFormatSettings)
            var printFormatSettings = JSON.stringify($scope.printFormatSettings);
            var promise = settingService.set("PrinterFormatSettings", printFormatSettings);
            promise.then(function(data) {
                console.log(data)
                if(data.rows.length>=1){
              $rootScope.printFormatSettings=JSON.parse(data.rows[0].SettingsValue);
               }else{
                 console.log('No PrinterFormatSettings Record Found')  
               }
            })
        }
    }).controller('paymentSettings', function($scope, settingService, $rootScope) {

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
               if(data.rows.length>=1){
               $rootScope.PaymentSettings=JSON.parse(data.rows[0].SettingsValue);
               var  currency= $rootScope.PaymentSettings.currency.split(' ');
               var  currencyName=currency[0];
               var currencySymbol=currency[1];
               $rootScope.currencySymbol=currencySymbol;
               }else{
                   console.log('No PayMent Setting Record Found')
                   var  currency= $rootScope.PaymentSettings.currency.split(' ');
                   var  currencyName=currency[0];
                   var currencySymbol=currency[1];
               $rootScope.currencySymbol=currencySymbol;
               }
            })
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