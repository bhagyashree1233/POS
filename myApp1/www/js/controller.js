 angular.module('starter.controller', [])
     .controller('ProductCtrl', ['$scope', function($scope) {
         $scope.Products = [{
                 productId: '1',
                 name: 'Coffee',
                 discount: '10%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'kg',
                 unitPrice: '4500000'

             },
             {
                 productId: '2',
                 name: 'Coffee',
                 discount: '15%',
                 image: '/img/coffee-cup.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '60'

             },
             {
                 productId: '3',
                 name: 'Coffee',
                 discount: '20%',
                 image: '/img/images.jpg',
                 categary: '',
                 unit: 'kg',
                 unitPrice: '70'

             },
             {
                 productId: '4',
                 name: 'Coffee',
                 discount: '18%',
                 image: '/img/download.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '80'

             },
             {
                 productId: '5',
                 name: 'Coffee',
                 discount: '9%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '50'

             },
             {
                 productId: '6',
                 name: 'Coffee',
                 discount: '10%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'kg',
                 unitPrice: '60'

             },
             {
                 productId: '7',
                 name: 'Coffee',
                 discount: '14%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '90'

             },
             {
                 productId: '8',
                 name: 'Coffee',
                 discount: '34%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '100000000'

             },
             {
                 productId: '9',
                 name: 'Coffee',
                 discount: '44%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '10'

             },
             {
                 productId: '10',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '20'

             }, {
                 productId: '11',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '50'

             }, {
                 productId: '12',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '100'

             }, {
                 productId: '13',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '120'

             }, {
                 productId: '14',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '233'

             }, {
                 productId: '15',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '34'

             }, {
                 productId: '16',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '45'

             }, {
                 productId: '17',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: '',
                 unit: 'ltr',
                 unitPrice: '66'

             }



         ];

         $scope.numValue = 0;
         $scope.productArr = [];
         $scope.totalPrice = null;
         $scope.index=null;
         $scope.quantity=0;
         

         $scope.save = function(product,newValue) {
            var qty =document.getElementById('quantity').value;
             console.log('I am in Save Function')
             console.log('Scope quanitity'+$scope.quantity)
             console.log(product.name + ' ' + product.unitPrice + ' ' + newValue);
             var productAmount = product.unitPrice * newValue;
             console.log('ProductAmount' + productAmount);
             $scope.productArr.push({
                 productName: product.name,
                 quantity: newValue,
                 productAmount: productAmount,
                 selected:false
             })
             console.log($scope.productArr);
             $scope.totalPrice = $scope.totalPrice + productAmount;
             console.log('This i    s Totla Price' + $scope.totalPrice);
         }
        
          $scope.selectedProduct = function(product){
              product.selected ?product.selected = false : product.selected=true;
          }

         $scope.cancel = function() {
             for(var i=0; i<$scope.productArr.length; i++){
                 var bool = $scope.productArr[i].selected;
                 if(bool){
                   $scope.totalPrice = $scope.totalPrice - $scope.productArr[i].productAmount; 
                   $scope.productArr.splice(i, 1);   
                  
                 }
             }  
            
         }
         $scope.void = function() {
             $scope.productArr = [];
             $scope.totalPrice = null;
         }


     }])