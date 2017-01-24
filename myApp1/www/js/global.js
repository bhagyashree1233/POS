function addNewCategoryGloabl(id, name, desc) {
    console.log('gloabl.js');
    console.log('eneterd add newCategory..');
    var query = "INSERT INTO Category (CategoryId, CategoryName, CategoryDesc) VALUES (?,?,?)";
    $cordovaSQLite.execute($rootScope.db, query, [id, name, desc]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
        $rootScope.categoryArr.push($scope.newCategory.categoryName);
        console.log("saved to category successfully...");
        $scope.newCategory = {};
    }, function(err) {
        console.error(err.message);
    });
}
