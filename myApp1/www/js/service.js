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
    function getBillDetails(billNo) {
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
    function getTransactionDetails(billNo) {
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
    function editProduct(productId, name, unit, unitPrice, taxId, actualPrice, taxRate, inStock, discount, categoryId, categoryName, image, favourite) {
        var deferred = $q.defer();
        var query = "update Product Set ProductName='" + name + "', ProductUnit='" + unit + "', ProductPrice=" + unitPrice + ", TaxId='" + taxId + "', BuyingPrice=" + actualPrice + ", TaxRate=" + taxRate + ", ItemsinStock=" + inStock + ", Discount=" + discount + ", CategoryId='" + categoryId + "', CategoryName='" + categoryName + "', Image='" + image + "', Favourite='" + favourite + "' where ProductId=" + productId;
        console.log(query);
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            //console.log("INSERT ID -> " + res.insertId);
            console.log("saved to Product successfully...");
            deferred.resolve('success');
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        });
        return deferred.promise;
    }
    function deleteProduct(deleteProductId) {
        var deferred = $q.defer();
        for (var id in deleteProductId) {
            var productId = id;
            var query = "delete from Product where ProductId='" + productId+"'";
            console.log(query);
            $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
                //console.log("INSERT ID -> " + res.insertId);
                console.log("deleted from Product successfully...");
                deferred.resolve('success');
            }, function(err) {
                console.error(err);
                deferred.reject('failure');
            });
        }
        return deferred.promise;
    }
    return {
        addNewCategory: addNewCategory,
        addNewProduct: addNewProduct,
        loadProductsForCategory: loadProductsForCategory,
        loadFromDB: loadFromDB,
        storeToTransaction: storeToTransaction,
        storeToBillDetails: storeToBillDetails,
        getBillDetails: getBillDetails,
        getTransactionDetails: getTransactionDetails,
        editProduct: editProduct,
        deleteProduct: deleteProduct
    }
}).factory("settingService", function($q, $cordovaSQLite, $rootScope) {
    function set(SettingsName, SettingsValue) {
        var dfd = $q.defer();
        $cordovaSQLite.execute($rootScope.db, 'INSERT OR REPLACE INTO Settings (SettingsName,SettingsValue) VALUES (?,?) ', [SettingsName, SettingsValue]).then(function(result) {
            dfd.resolve(result);
        }, function(error) {
            dfd.resolve(error);
        })
        return dfd.promise;
    }
    function get(SettingsName) {
        var dfd = $q.defer();
        //$rootScope.deviceReady = dfd.promise;
        $cordovaSQLite.execute($rootScope.db, 'Select SettingsValue  from Settings where SettingsName=?', [SettingsName]).then(function(result) {
            dfd.resolve(result);
        }, function(error) {
            dfd.resolve(error);
        })
        return dfd.promise;
    }
    return {
        set: set,
        get: get
    }
}).factory("salesService", function($q, $cordovaSQLite, $rootScope) {
    var report = []
    function get(itemCode, strt, end) {
        var dfd = $q.defer();
        // BillNo integer, DateTime text, ProductId text, ProductName text, Quantity real, ProductPrice real, TotalPrice real, TaxAmount real, TotalAmount real, Discount real, TaxRate real, TaxId integer, CategoryId text, CategoryName text
        var query = '';
        if (strt && end == undefined) {
            query = 'Select * from TransactionDetails WHERE ProductId=' + itemCode + ''
        } else if (itemCode == undefined && strt == undefined) {
            query = 'Select * from TransactionDetails WHERE DateTime=' + end + ''
        } else if (itemCode == undefined && end == undefined) {
            query = 'Select * from TransactionDetails WHERE DateTime=' + strt + ''
        } else {
            var query = 'Select * from TransactionDetails WHERE (DateTime BETWEEN ' + strt + 'AND ' + end + ')'
        }
        $cordovaSQLite.execute($rootScope.db, query).then(function(result) {
            console.log(result)
            console.log(result.rows.length)
            for (var i = 0; i < result.rows.length; i++) {
                report.push({
                    itemCode: result.rows[i].ProductId,
                    itemName: result.rows[i].ProductName,
                    qtySold: result.rows[i].Quantity,
                    totalAmountwoTax: result.rows[i].TotalPrice,
                    totalTax: result.rows[i].TaxAmount,
                    totalAmount: result.rows[i].TotalAmount
                })
            }
            console.log(report.length);
            dfd.resolve(report);
        }, function(error) {
            dfd.resolve(error);
        })
        return dfd.promise;
    }
    function getSalesReport(strt, end) {
        var salesReport = []
        //$cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS BillDetails (BillNo integer, TotalPrice real, DiscountAmount real, TaxAmount real, TotalAmount real, PaymentMethod text, DateTime text, TotalItems integer, BillStatus text)").then(console.log('BillDetails table created Successfully'));
        var dfd = $q.defer();
        if (end = "") {
            var query = 'Select * from BillDetails Where DateTime=' + strt + '';
        } else if (strt = "") {
            var query = 'Select * from BillDetails Where DateTime=' + end + '';
        } else {
            var query = 'Select * from BillDetails Where DateTime Between ' + strt + ' and ' + end + '';
        }
        $cordovaSQLite.execute($rootScope.db, query, [strt, end]).then(function(result) {
            console.log(result)
            for (var i = 0; i < result.rows.length; i++) {
                salesReport.push({
                    totalBills: result.rows[i].TotalItems,
                    avgBillAmt: result.rows[i].TotalPrice / result.rows[i].TotalItems,
                    totalBillAmt: result.rows[i].TotalPrice,
                    totalTax: result.rows[i].TaxAmount,
                    afterTax: result.rows[i].TotalAmount,
                    startDate: strt,
                    endDate: end
                })
            }
            dfd.resolve(salesReport);
        }, function(error) {
            dfd.resolve(error);
        })
        return dfd.promise;
    }
    return {
        get: get,
        getSalesReport: getSalesReport
    }
})
