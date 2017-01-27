angular.module('starter.controller', []).controller('homeCtrl', ['$scope', '$rootScope', '$cordovaSQLite', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'dbService', function($scope, $rootScope, $cordovaSQLite, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, dbService) {
        console.log($rootScope.Products);

        $scope.onHold = function() {
            console.log('enterd on hold');
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
        var promise = dbService.loadFromDB('Category');
        promise.then(function(res) {
            for (var i = 0; i < res.rows.length; i++) {
                $rootScope.categoryArr.push({
                    categoryId: res.rows.item(i).CategoryId,
                    categoryName: res.rows.item(i).CategoryName
                });
            }
        }, function(res) {
            console.log(res);
        })
        //load products list from DB
        $rootScope.Products = [];
        var promise = dbService.loadFromDB('Product');
        promise.then(function(res) {
            console.log(res);
            for (var i = 0; i < res.rows.length; i++) {
                $rootScope.Products.push({
                    productId: res.rows.item(i).ProductId,
                    name: res.rows.item(i).ProductName,
                    unit: res.rows.item(i).ProductUnit,
                    unitPrice: res.rows.item(i).ProductPrice,
                    taxRate: res.rows.item(i).TaxRate,
                    taxId: res.rows.item(i).TaxId,
                    actualPrice: res.rows.item(i).BuyingPrice,
                    inStock: res.rows.item(i).ItemsinStock,
                    discount: res.rows.item(i).Discount,
                    categoryId: res.rows.item(i).CategoryId,
                    categoryName: res.rows.item(i).CategoryName,
                    image: res.rows.item(i).Image
                });
            }
        }, function(res) {
            console.log(res)
        })

        /*
                productId: product.productId,
                name: product.name,
                quantity: qty,
                productPrice: product.unitPrice,
                productTotalPrice: productTotalPrice,
                productTaxAmount: productTotalTax,
                productTotalAmount: productTotalAmount,
                discount: product.discount,
                taxRate: product.taxRate,
                taxId: product.taxId,
                category: product.categoryId,
                categoryName: product.categoryName,
                selected: false
             */
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
        $scope.prodCat = $scope.Products;
        $scope.productArr = [];
        $scope.totalPrice = null;
        $scope.totalTaxAmount = 0;
        $scope.index = null;
        $scope.totalChargeAmount = 0;
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
            console.log('I am in Save Function');
            console.log('Scope quanitity' + qty);
            console.log(product.name + ' ' + product.unitPrice + ' ' + qty);
            var productTotalPrice = product.unitPrice * qty;
            console.log(productTotalPrice);
            var productTotalTax = (product.taxRate / 100) * productTotalPrice;
            console.log(productTotalTax);
            var productTotalAmount = productTotalPrice + productTotalTax;
            console.log(productTotalAmount);
            $scope.productArr.push({
                productId: product.productId,
                name: product.name,
                quantity: qty,
                productPrice: product.unitPrice,
                productTotalPrice: productTotalPrice,
                productTaxAmount: productTotalTax,
                productTotalAmount: productTotalAmount,
                discount: product.discount,
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
            $scope.totalChargeAmount = $scope.totalChargeAmount + productTotalAmount;
            console.log('This is Totla Price' + $scope.totalPrice);
        }
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
            $scope.totalTaxAmount = 0
            $scope.totalChargeAmount = 0;
        }
        //Numeric keypad for Quantity Start
        $scope.typedCode = 1;
        var count=0;
        $scope.keyPressed = function(keyCode) {
            //console.log(keyCode)
            tempT = $scope.typedCode.length;
            console.log(tempT)
            console.log(count++)
                 console.log($scope.typedCode.length)
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
        };
        $scope.sendTheCodeQ = function() {
            if (/^\d+$/.test(tempT)) {
                // TODO : sends the entered code
                console.log('entered code is ' + $scope.typedCode + " " + $scope.typedCode.length);
                $scope.typedCode = null;
            }
        };
        $scope.removeQ = function() {
            console.log($scope.typedCode)
            if ($scope.typedCode > 0) {
                $scope.typedCode = $scope.typedCode.slice(0, -1);
            } else {
                $scope.typedCode = null;
            }
            console.log('I am in remove');
            // TODO start scaning the code and once it receives send to the socket
        };
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
        };
        $scope.sendTheCodeA = function() {
            if (/^\d+$/.test(tempT)) {
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
            console.log('I am in openModel')
            $scope.typedAmount = null;
            $scope.payableAmount = $scope.totalPrice + ($scope.serviceTax * $scope.totalPrice);
            $scope.paymentModal.show();
            $scope.receiptBtnShow = true;
            $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
        };
        $scope.closePaymentModal = function() {
            console.log('I am in close Model')
            $scope.typedAmount = "";
            $scope.paymentModal.hide();
        };
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
            var promise = dbService.storeToTransaction($scope.productArr);
            promise.then(function(result) {
                console.log(result);
                $scope.productArr = [];
                $scope.totalPrice = null;
                $scope.payableAmount = null;
                $scope.typedAmount = null;
                $scope.Balence = null;
            }, function(result) {
                console.log(result);
            })
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
        };
        $scope.closeNumericModal = function() {
            console.log(' Closing Numeric Model')
            $scope.numericModal.hide();
            $scope.newProduct = {};
            $scope.typedCode = null;
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
    }]).controller("productCtrl", function($scope, $state, $rootScope, $cordovaSQLite, $cordovaCamera, $timeout, $cordovaFile, $ionicModal, dbService) {
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
        $scope.$watch('newProduct.inStock', function(newValue, oldValue) {
            if ($scope.newProduct.unit == 'pieces') {
                $scope.newProduct.inStock = Math.round(newValue);
            }
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
                var promise = dbService.addNewProduct($scope.newProduct.productId, $scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image);
                promise.then(function(result) {
                    console.log(result);
                    $rootScope.Products.push($scope.newProduct);
                    $scope.newProduct = {
                        unit: 'pieces'
                    };
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
    }).controller('categoryCtrl', function($scope, $state, $cordovaSQLite, $rootScope, dbService) {
        $scope.newCategory = {};
        $scope.addNewCategory = function() {
            var promise = dbService.addNewCategory($scope.newCategory.categoryId, $scope.newCategory.categoryName, $scope.newCategory.categoryDescription);
            promise.then(function(result) {
                console.log(result);
                $rootScope.categoryArr.push($scope.newCategory);
                $scope.newCategory = {};
            }, function() {
                console.log(result);
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
    })
    .controller('taxSetting', ['$scope', '$rootScope', '$cordovaSQLite', '$ionicPlatform', 'settingService', function($rootScope, $scope, $cordovaSQLite, $ionicPlatform, settingService) {

      $scope.taxSettings = [];
       $scope.txSetting={};
       console.log($rootScope.TaxSettings[0].name);
     // $scope.taxSettings[0]['$scope.txSetting.id']=$rootScope.TaxSettings[0].id;
     // $scope.taxSettings[0][$scope.txSetting.name]=$rootScope.TaxSettings[0].name;
     // $scope.taxSettings[0][$scope.txSetting.taxRate]=$rootScope.TaxSettings[0].taxRate;
      console.log($rootScope.$scope.TaxSettings[0].name)
        var d = new Date();
        var taxSettings = []
        $scope.addMore=function(){
                var txSetting =$scope.txSetting
                $scope.taxSettings.push({txSetting})
                console.log($scope.taxSettings)
                document.getElementById("myTaxSettingForm").reset();
                $scope.txSetting={}
        }
          $scope.saveTaxSetting = function() {
              var txSetting =$scope.txSetting
              $scope.taxSettings.push({txSetting})
            console.log('Hai i am in TaxSetting Save')
           
           console.log($scope.taxSettings)
            
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
    }])
    .controller('printerSettings', function($scope, settingService,$rootScope) {
         $scope.printFormatSettings={}  ; 
        $scope.printFormatSettings['addressLine1'] = $rootScope.printFormatSettings.addressLine1;
         $scope.printFormatSettings.addressLine2=$rootScope.printFormatSettings.addressLine2,
          $scope.printFormatSettings.billCopies=$rootScope.printFormatSettings.billCopies,
          $scope.printFormatSettings.greeting=$rootScope.printFormatSettings.greeting,
           $scope.printFormatSettings.phNumber=$rootScope.printFormatSettings.phNumber,
           $scope.printFormatSettings.shopName=$rootScope.printFormatSettings.shopName,
            $scope.printFormatSettings.strtBillNmbr=$rootScope.printFormatSettings.strtBillNmbr,
           $scope.printFormatSettings.tin=$rootScope.printFormatSettings.tin,
            $scope.printFormatSettings.tokNum=$rootScope.printFormatSettings.tokNum,
            $scope.printFormatSettings.tokResetAftr=$rootScope.printFormatSettings.tokResetAftr,
            $scope.printFormatSettings.tokStartNmbr=$rootScope.printFormatSettings.tokStartNmbr,
             $scope.printFormatSettings.wifiSsid=$rootScope.printFormatSettings.wifiSsid
        $scope.savePrinterSettings = function() {
                console.log($scope.printFormatSettings)
            var printFormatSettings = JSON.stringify($scope.printFormatSettings);
            var promise = settingService.set("PrinterFormatSettings", printFormatSettings);
            promise.then(function(data) {
                console.log(data)
            })

        }
    }).controller('paymentSettings', function($scope, settingService,$rootScope) {
       console.log($rootScope.PaymentSettings)
      $scope.paymentSetting=$rootScope.PaymentSettings
        $scope.savePaymentSettings = function() {
            var paymentSetting = JSON.stringify($scope.paymentSetting);
            var promise = settingService.set("PaymentSettings", paymentSetting);
            promise.then(function(data) {
                console.log(data)
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