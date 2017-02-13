angular.module('starter.services', [])

.factory("dbService", function($q, $cordovaSQLite, $rootScope) {
    function addNewCategory(id, name, desc) {
        var deferred = $q.defer();
        console.log('entered add newCategory service..');
        var query = "INSERT INTO Category (CategoryId, CategoryName, CategoryDesc) VALUES (?,?,?)";
        $cordovaSQLite.execute($rootScope.db, query, [id, name, desc]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            console.log("new category added successfully...");
            deferred.resolve('success');
        }, function(err) {
            console.log(err.message);
            deferred.reject('failure');
        });
        return deferred.promise;
    }
    function loadProductFromDB(tableName) {
        var deferred = $q.defer();
        //  query = "SELECT * FROM Category where CategoryId = "+enteredCatId;
        query = "SELECT * FROM " + tableName;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            var Products = [];
            for (var i = 0; i < res.rows.length; i++) {
                Products.push({
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
                    image: res.rows.item(i).Image,
                    favorite: res.rows.item(i).Favourite
                });
            }
            deferred.resolve(Products);
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        })
        return deferred.promise;
    }
    function loadCategoryFromDB(tableName) {
        var deferred = $q.defer();
        var categoryArr = [{
            categoryName: 'Favourite',
            categoryId: 'favourite'
        }];
        //  query = "SELECT * FROM Category where CategoryId = "+enteredCatId;
        query = "SELECT * FROM " + tableName;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log('success');
            for (var i = 0; i < res.rows.length; i++) {
                categoryArr.push({
                    categoryId: res.rows.item(i).CategoryId,
                    categoryName: res.rows.item(i).CategoryName,
                    categoryDescription: res.rows.item(i).CategoryDesc
                });
            }
            deferred.resolve(categoryArr);
        }, function(err) {
            console.log(err);
            deferred.reject('failure');
        })
        return deferred.promise;
    }

    function GetCategoryById(CatId) {
        var deferred = $q.defer();
        var categoryArr = {};
        categoryArr.categoryId = "Failed";
        //  query = "SELECT * FROM Category where CategoryId = "+enteredCatId;
        var query = "SELECT * FROM Category where CategoryId = '" + CatId + "'";
        console.log("hello",query);
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log('success');
            if(res.rows.length > 0)
            {
              categoryArr.categoryId = res.rows.item(0).CategoryId;
              categoryArr.categoryName= res.rows.item(0).CategoryName;
              categoryArr.categoryDescription= res.rows.item(0).CategoryDesc;

            }
           
            deferred.resolve(categoryArr);
        }, function(err) {
            console.log(err);
            deferred.reject(categoryArr);
        })

        return deferred.promise;
    }

    function loadProductsForCategory(categoryId) {
        var deferred = $q.defer();
        var query = "SELECT * FROM Product where CategoryId = '" + categoryId + "'";
        if (categoryId == 'favourite') {
            query = "SELECT * FROM Product where Favourite = 'true'";
        }
        //query = "SELECT * FROM "+tableName;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            var Products = [];
            for (var i = 0; i < res.rows.length; i++) {
                Products.push({
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
                    image: res.rows.item(i).Image,
                    favorite: res.rows.item(i).Favourite
                });
            }
            deferred.resolve(Products);
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        })
        return deferred.promise;
    }
    function addNewProduct(productId, name, unit, unitPrice, taxId, actualPrice, taxRate, inStock, discount, categoryId, categoryName, image, favourite) {
        var deferred = $q.defer();
        var query = "INSERT INTO Product (ProductId, ProductName, ProductUnit, ProductPrice, TaxId, BuyingPrice, TaxRate, ItemsinStock, Discount, CategoryId, CategoryName, Image, Favourite) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute($rootScope.db, query, [productId, name, unit, unitPrice, taxId, actualPrice, taxRate, inStock, discount, categoryId, categoryName, image, favourite]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            console.log("new Product added successfully...");
            deferred.resolve('success');
        }, function(err) {
            console.log(err);
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
        var billDetail = [];
        query = "SELECT * FROM BillDetails where BillNo = " + billNo;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log('success');
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
            deferred.resolve(billDetail);
        }, function(err) {
            console.error(err);
            deferred.reject('unable to load BillDetails');
        })
        return deferred.promise;
    }
    function getTransactionDetails(billNo) {
        var deferred = $q.defer();
        var transactionDetail = [];
        query = "SELECT * FROM TransactionDetails where BillNo = " + billNo;
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log('success');
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
            deferred.resolve(transactionDetail);
        }, function(err) {
            console.error(err);
            deferred.reject('unable to load TransactionDetails');
        })
        return deferred.promise;
    }
    function editProduct(productId, name, unit, unitPrice, taxId, actualPrice, taxRate, inStock, discount, categoryId, categoryName, image, favourite) {
        var deferred = $q.defer();
        var query = "update Product Set ProductName='" + name + "', ProductUnit='" + unit + "', ProductPrice=" + unitPrice + ", TaxId='" + taxId + "', BuyingPrice=" + actualPrice + ", TaxRate=" + taxRate + ", ItemsinStock=" + inStock + ", Discount=" + discount + ", CategoryId='" + categoryId + "', CategoryName='" + categoryName + "', Image='" + image + "', Favourite='" + favourite + "' where ProductId='" + productId + "'";
        console.log(query);
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            deferred.resolve("Product edited successfully...");
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        });
        return deferred.promise;
    }
    function editCategory(categoryId, name, desc) {
        var deferred = $q.defer();
        var query = "update Category Set CategoryName='" + name + "',CategoryDesc='" + desc + "' where CategoryId='" + categoryId + "'";
        console.log(query);
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            deferred.resolve("Category edited successfully...");
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        });
        return deferred.promise;
    }

    
    function deleteProduct(deleteProductId) {
        var deferred = $q.defer();
        
            var query = "delete from Product where ProductId='" + deleteProductId + "'";
            console.log(query);
            $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
                console.log("deleted from Product successfully...");
                deferred.resolve('success');
            }, function(err) {
                console.error(err);
                deferred.reject('failure');
            });
        
        return deferred.promise;
    }


    function deleteCategory(deleteCategoryId) {
        var deferred = $q.defer();
        var query = "delete from Category where CategoryId='" + deleteCategoryId + "'";
        console.log(query);
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log("deleted from Category successfully...");
            deferred.resolve('deleted success');
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        });
        return deferred.promise;
    }

  
    function deleteAllProductsInCat(CatId) {
        var deferred = $q.defer();
        
            var query = "delete from Product where CategoryId='" + CatId + "'";
            console.log(query);
            $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
                console.log("deleted all Products in Category successfully...");
                deferred.resolve('success');
            }, function(err) {
                console.error(err);
                deferred.reject('failure');
            });
        
        return deferred.promise;
    }




    function updateItemsInStock(itemsInStockObj) {
        /*
         UPDATE 'Product' SET 
          'ItemsinStock' = CASE 'ProductId'
            WHEN '1' THEN '20'
            WHEN '3' THEN '90'
          END
          WHERE `ProductId` IN (1,3);
        */
        var deferred = $q.defer();
        var query = "";
        var idString = "";
        for (var item in itemsInStockObj) {
            idString = idString + "'" + item + "',"
            query = query + "WHEN '" + item + "' THEN " + itemsInStockObj[item] + " "
        }
        idString = idString.slice(0, -1);
        query = "UPDATE Product SET ItemsinStock = CASE ProductId " + query + "END" + " WHERE ProductId IN(" + idString + ")";        
       // var query = "update Product Set ItemsinStock = 50 where ProductId= 'ftr'";
          console.log(query);
        $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
            console.log("Product Stock Updated successfully...");
            deferred.resolve('In stock update success');
        }, function(err) {
            console.error(err);
            deferred.reject('failure');
        });
        return deferred.promise;
    }
    return {
        addNewCategory: addNewCategory,
        addNewProduct: addNewProduct,
        loadProductsForCategory: loadProductsForCategory,
        loadProductFromDB: loadProductFromDB,
        GetCategoryById: GetCategoryById,
        loadCategoryFromDB: loadCategoryFromDB,
        storeToTransaction: storeToTransaction,
        storeToBillDetails: storeToBillDetails,
        getBillDetails: getBillDetails,
        getTransactionDetails: getTransactionDetails,
        editProduct: editProduct,
        editCategory: editCategory,
        deleteProduct: deleteProduct,
        deleteCategory: deleteCategory,
        deleteAllProductsInCat:deleteAllProductsInCat,
        updateItemsInStock: updateItemsInStock
    }
})


.factory("settingService", function($q, $cordovaSQLite, $rootScope) {
    function set(SettingsName, SettingsValue) {
        var dfd = $q.defer();
        $cordovaSQLite.execute($rootScope.db, 'INSERT OR REPLACE INTO Settings (SettingsName,SettingsValue) VALUES (?,?) ', [SettingsName, SettingsValue]).then(function(result) {
           console.log(result)
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
        console.log(itemCode + "itemCode" + strt + '' + end)
        if (strt == undefined && end == undefined) {
            console.log('I am in First query')
            query = 'Select * from TransactionDetails WHERE ProductId=' + itemCode + ''
        } else if (itemCode == undefined && strt == undefined) {
            console.log('I am in Second query')
            query = 'Select * from TransactionDetails WHERE DateTime=' + end + ''
        } else if (itemCode == undefined && end == undefined) {
            console.log('I am in third query')
            query = 'Select * from TransactionDetails WHERE DateTime=' + strt + ''
        } else {
            query = 'Select * from TransactionDetails WHERE (DateTime BETWEEN ' + strt + 'AND ' + end + ')'
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
        if (end == undefined) {
            var query = 'Select * from BillDetails Where DateTime=' + strt + '';
        } else if (strt == undefined) {
            var query = 'Select * from BillDetails Where DateTime=' + end + '';
        } else {
            var query = 'Select * from BillDetails Where DateTime Between ' + strt + ' and ' + end + '';
        }
        $cordovaSQLite.execute($rootScope.db, query).then(function(result) {
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
