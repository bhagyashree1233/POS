angular.module('starter.services', []).factory("dbService", function($q, $cordovaSQLite, $rootScope) {
    function addNewCategory(id, name, desc) {
        var deferred = $q.defer();
        console.log('enterd add newCategory serice..');
        var query = "INSERT INTO Category (CategoryId, CategoryName, CategoryDesc) VALUES (?,?,?)";
        $cordovaSQLite.execute($rootScope.db, query, [id, name, desc]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            console.log("saved to category successfully...");
            deferred.resolve('success');
        }, function(err) {
            console.error(err.message);
            deferred.reject('failure');
        });
        return deferred.promise;
    }
    function loadFromDB(tableName) {
        var deferred = $q.defer();
        //  query = "SELECT * FROM Category where CategoryId = "+enteredCatId;
        query = "SELECT * FROM " + tableName;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log('success');
            deferred.resolve(res);
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        })
        return deferred.promise;
    }
    function loadProductsForCategory(categoryId) {
        var deferred = $q.defer();
        query = "SELECT * FROM Product where CategoryId = " + categoryId;
        //query = "SELECT * FROM "+tableName;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log('success');
            deferred.resolve(res);
        }, function(err) {
            console.error(err);
            deferred.reject('unable to load products for category');
        })
        return deferred.promise;
    }
    function addNewProduct(productId, name, unit, unitPrice, taxId, actualPrice, taxRate, inStock, discount, categoryId, categoryName, image, favourite) {
        var deferred = $q.defer();
        var query = "INSERT INTO Product (ProductId, ProductName, ProductUnit, ProductPrice, TaxId, BuyingPrice, TaxRate, ItemsinStock, Discount, CategoryId, CategoryName, Image, Favourite) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute($rootScope.db, query, [productId, name, unit, unitPrice, taxId, actualPrice, taxRate, inStock, discount, categoryId, categoryName, image, favourite]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            console.log("saved to Product successfully...");
            deferred.resolve('success');
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        });
        return deferred.promise;
    }
    function storeToTransaction(productArr, d) {
        var deferred = $q.defer();
        console.log(productArr);
        //  var BillNo = (new Date()).getTime();
        var lastBillNo = localStorage.getItem('lastBillNumber');
        if (!(lastBillNo)) {
            lastBillNo = '0';
        }
        var BillNo = 1 + parseInt(lastBillNo);
        for (var i = 0; i < productArr.length; i++) {
            var productObj = productArr[i];
            console.log(productObj);
            var query = "INSERT INTO TransactionDetails (BillNo, DateTime, ProductId, ProductName, Quantity, ProductPrice, TotalPrice, TaxAmount, TotalAmount, DiscountAmount, Discount, TaxRate, TaxId, CategoryId, CategoryName) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute($rootScope.db, query, [BillNo, d, productObj.productId, productObj.name, productObj.quantity, productObj.productPrice, productObj.productTotalPrice, productObj.productTaxAmount, productObj.productTotalAmount, productObj.discountAmount, productObj.discount, productObj.taxRate, productObj.taxId, productObj.categoryId, productObj.categoryName]).then(function(res) {
                //     $cordovaSQLite.execute($rootScope.db, query, [102, "24-Jan-2017 11:03:24", "Cofee123", "cofee", 2, 120, 3, 4, 4, "CAT01", "Category 01"]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
                localStorage.setItem('lastBillNumber', BillNo.toString());
                deferred.resolve('success');
            }, function(err) {
                console.error(err);
                deferred.reject('failure');
            });
        }
        return deferred.promise;
    }
    function storeToBillDetails(totalPrice, discountAmount, totalTaxAmount, totalChargeAmount, paymentMethod, totalItems, d) {
        var deferred = $q.defer();
        var BillNo = localStorage.getItem('lastBillNumber');
        //var productObj = productArr[i];
        //console.log(productObj);
        var query = "INSERT INTO BillDetails (BillNo, TotalPrice, DiscountAmount, TaxAmount, TotalAmount, PaymentMethod, DateTime, TotalItems, BillStatus) VALUES (?,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute($rootScope.db, query, [BillNo, totalPrice, discountAmount, totalTaxAmount, totalChargeAmount, paymentMethod, d, totalItems, 'success']).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            deferred.resolve('success');
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        });
        return deferred.promise;
    }

    function getBillDetails(billNo){
         var deferred = $q.defer();
        query = "SELECT * FROM BillDetails where BillNo = " + billNo;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log('success');
            deferred.resolve(res);
        }, function(err) {
            console.error(err);
            deferred.reject('unable to load BillDetails');
        })
        return deferred.promise;
    }

    function getTransactionDetails(billNo){
        var deferred = $q.defer();
        query = "SELECT * FROM TransactionDetails where BillNo = " + billNo;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log('success');
            deferred.resolve(res);
        }, function(err) {
            console.error(err);
            deferred.reject('unable to load TransactionDetails');
        })
        return deferred.promise;
    }

    return {
        addNewCategory: addNewCategory,
        addNewProduct: addNewProduct,
        loadProductsForCategory: loadProductsForCategory,
        loadFromDB: loadFromDB,
        storeToTransaction: storeToTransaction,
        storeToBillDetails:storeToBillDetails,
        getBillDetails:getBillDetails,
        getTransactionDetails:getTransactionDetails
    }
})
