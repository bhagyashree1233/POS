 angular.module('starter.controller', [])
     .controller('ProductCtrl', ['$scope', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', function($scope, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate) {
         $scope.Products = [{
                 productId: '1',
                 name: 'Coffee',
                 discount: '10%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO1',
                 unit: 'kg',
                 unitPrice: '4500000'

             },
             {
                 productId: '2',
                 name: 'Coffee',
                 discount: '15%',
                 image: '/img/coffee-cup.jpg',
                 categary: 'DCPTO2',
                 unit: 'ltr',
                 unitPrice: '60'

             },
             {
                 productId: '3',
                 name: 'Coffee',
                 discount: '20%',
                 image: '/img/images.jpg',
                 categary: 'DCPTO3',
                 unit: 'kg',
                 unitPrice: '70'

             },
             {
                 productId: '4',
                 name: 'Coffee',
                 discount: '18%',
                 image: '/img/download.jpg',
                 categary: 'DCPTO2',
                 unit: 'ltr',
                 unitPrice: '80'

             },
             {
                 productId: '5',
                 name: 'Coffee',
                 discount: '9%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO1',
                 unit: 'ltr',
                 unitPrice: '50'

             },
             {
                 productId: '6',
                 name: 'Coffee',
                 discount: '10%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO1',
                 unit: 'kg',
                 unitPrice: '60'

             },
             {
                 productId: '7',
                 name: 'Coffee',
                 discount: '14%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO5',
                 unit: 'ltr',
                 unitPrice: '90'

             },
             {
                 productId: '8',
                 name: 'Coffee',
                 discount: '34%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO6',
                 unit: 'ltr',
                 unitPrice: '100000000'

             },
             {
                 productId: '9',
                 name: 'Coffee',
                 discount: '44%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO7',
                 unit: 'ltr',
                 unitPrice: '10'

             },
             {
                 productId: '10',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO8',
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
                 categary: 'DCPTO6',
                 unit: 'ltr',
                 unitPrice: '100'

             }, {
                 productId: '13',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO3',
                 unit: 'ltr',
                 unitPrice: '120'

             }, {
                 productId: '14',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO9',
                 unit: 'ltr',
                 unitPrice: '233'

             }, {
                 productId: '15',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO10',
                 unit: 'ltr',
                 unitPrice: '34'

             }, {
                 productId: '16',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO11',
                 unit: 'ltr',
                 unitPrice: '45'

             }, {
                 productId: '17',
                 name: 'Coffee',
                 discount: '12%',
                 image: '/img/Iced_Coffee.jpg',
                 categary: 'DCPTO10',
                 unit: 'ltr',
                 unitPrice: '66'

             }

         ];
         $scope.Categary = {
           slide1: [
             { catName: 'DCPTO1'},
             { catName: 'DCPTO2'},
             { catName: 'DCPTO3'},
             { catName: 'DCPTO4'},
             { catName: 'DCPTO5'},
             { catName: 'DCPTO6'},
             { catName: 'DCPTO7'},
             { catName: 'DCPTO8'},
             { catName: 'DCPTO9'},
             { catName: 'DCPT10'},
             { catName: 'DCPT11'},
             { catName: 'DCPT12'}
            ],
          slide2:  [             
             { catName: 'DCPT13'},
             { catName: 'DCPT14'},
             { catName: 'DCPT15'},
             { catName: 'DCPT16'},
             { catName: 'DCPT17'},
             { catName: 'DCPT18'},
             { catName: 'DCPT19'},
             { catName: 'DCPT20'},
             { catName: 'DCPT21'}
            ]
         }
		 
         $scope.display = function(catName) {
             $scope.prodCat = [];
             console.log($scope.prodCat.length);
             for (var i = 0; i < $scope.Products.length; i++) {
                 if ($scope.Products[i].categary == catName) {
                     $scope.prodCat.push($scope.Products[i]);
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
            console.log(scrollTopCurrent+" "+scrollTopMax);

            if(scrollTopMax){
               $scope.scrollBottomBtn = true;  
               $scope.scrollTopBtn = true; 
            } else {
               $scope.scrollBottomBtn = false;  
               $scope.scrollTopBtn = false;
            }
         };

         $scope.scrollTop = function(){
             $ionicScrollDelegate.$getByHandle('scrollSmall').scrollTop(true);
         }
         $scope.scrollBottom = function(){
             $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
         }


         // $scope.numValue = 0;
         $scope.prodCat = $scope.Products;
         $scope.productArr = [];
         $scope.totalPrice = null;
         $scope.index = null;
         //  $scope.quantity=0;

         $scope.save = function(product) {
             console.log($scope.typedCode);
             if($scope.typedCode==null){
                 console.log('Type Code Null')
                qty = $scope.typedCode=1;
             }else{
                qty =$scope.typedCode;
             }
             
             //  var qty =document.getElementById('quantity').value;
             console.log('I am in Save Function')
             console.log('Scope quanitity' + qty)
             console.log(product.name + ' ' + product.unitPrice + ' ' + qty);
             var productAmount = product.unitPrice * qty;
             console.log('ProductAmount' + productAmount);
             $scope.productArr.push({
                 name: product.name,
                 quantity: qty,
                 productAmount: productAmount,
                 selected: false
             })
             $scope.modal.hide();
             $scope.newProduct={};
             $scope.typedCode=null;
         
             console.log($scope.productArr);
             $scope.totalPrice = $scope.totalPrice + productAmount;
             console.log('This is Totla Price' + $scope.totalPrice);
             //  var qty =document.getElementById('quantity').value = 0;
             //   for(var i=0;i<$scope.productArr.length;i++){
             //   document.getElementsByClassName("quantity1")[i].value=null;
             //   }
         }
        var holdObj={};
        $scope.hold=function(){
          var holdValue = $scope.productArr;
          console.log($scope.holdValue);
          var d = new Date();
          var time=d.getTime();
          console.log(d)
          holdObj[time]=$scope.productArr;
           if($scope.productArr.length>0){
           window.localStorage.setItem("holdObj",JSON.stringify(holdObj));
         
          }
         var  =localStorage.getItem("holdObj");
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
         //Numeric keypad
         $scope.typedCode = 1;

         $scope.keyPressed = function(keyCode) {
         //console.log(keyCode)
             tempT = $scope.typedCode;

             switch (keyCode) {
                 case -4:
                     $scope.sendTheCode();
                     break;
                 case -3:
                     $scope.remove();
                     break;
                 case -2:
                     $scope.scanCode();
                     break;
                 case -1:
                     $scope.sendEscape();
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

         $scope.sendEscape = function() {
             $scope.typedCode = null;
             console.log('I am in Escape')
             // TODO : sends the escape code
         };

         $scope.sendTheCode = function() {
             if (/^\d+$/.test(tempT)) {
                 // TODO : sends the entered code
                 console.log('entered code is ' + $scope.typedCode + " " +
                     $scope.typedCode.length);
                 $scope.typedCode = null;
             }
         };

         $scope.scanCode = function() {
             $scope.typedCode = null;
             // TODO start scaning the code and once it receives send to the socket
         };
         $scope.remove = function() {
             $scope.typedCode = null;
             console.log('I am in remove');
             // TODO start scaning the code and once it receives send to the socket
         };
/*
        $scope.numbers = '1';
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
                alert($scope.numbers);
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
*/
         //Numeric keypad ending
         //Modal start
         $ionicModal.fromTemplateUrl('templates/numericKeypad.html', {
             scope: $scope,
             animation: 'slide-in-up'
         }).then(function(modal) {
             $scope.modal = modal;
             console.log( $scope.modal)
         });
 
         $scope.openModal = function(product) {
             $scope.modal.show();
             $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
             $scope.typedCode=1
             $scope.newProduct = product;
           //  $scope.productAmount=$scope.newProduct.unitPrice*$scope.typedCode;
             // console.log($scope.productAmount);
         };
        
         $scope.closeModal = function() {
             $scope.newProduct={};
             $scope.typedCode=null;
             console.log('I am in close Model')
             $scope.modal.hide();
         };
         // Cleanup the modal when we're done with it!
         $scope.$on('$destroy', function() {
             console.log('In am in destroy')
            

         });
         // Execute action on hide modal
         $scope.$on('modal.hidden', function() {
             // Execute action
             $scope.newProduct={};
            
            
         });
         // Execute action on remove modal
         $scope.$on('modal.removed', function() {
             // Execute action

               
         });

         ionic.Platform.ready(function(){
            var itemsJsonObj = window.localStorage.getItem('holdEvents', "");
            if(itemsJsonObj == undefined){
              window.localStorage.setItem('holdEvents', "");  
            }
         })


         $ionicModal.fromTemplateUrl('templates/holdModal.html', {
             scope: $scope,
             animation: 'slide-in-up'
         }).then(function(modal) {
             $scope.holdModal = modal;
         });
         $scope.openHoldModal = function(product) {
            $scope.holdModal.show();
         }
         $scope.closeModal = function() {
             $scope.holdModal.hide();
         }; 

          $scope.holdItems = function() {
          if($scope.productArr.length != 0) {  
            var d = new Date();
            var id = d.getTime();
            console.log(id);

            var itemsJsonObj = window.localStorage.getItem('holdEvents');
            console.log(itemsJsonObj);
            if(itemsJsonObj != ""){
               itemsJsonObj = JSON.parse(itemsJsonObj); 
            }else {
               itemsJsonObj = {};
            } 

            itemsJsonObj[id] = $scope.productArr;
            
            console.log(itemsJsonObj);
            window.localStorage.setItem('holdEvents', JSON.stringify(itemsJsonObj));
            $scope.holdItemObj = itemsJsonObj;
            $scope.productArr = [];
          }

           $scope.openHoldModal();
             
         } 

         $scope.unHold = function(holdValue){
             $scope.closeModal();
             $scope.productArr = holdValue;
         }

         $scope.currentSlide = 0;  
         $scope.slideHasChanged = function(index){
             console.log(index);
             $scope.currentSlide = index;
         }

         $scope.slidesCount = 0;
         if(!$scope.slidesCount){
             document.getElementById('button-next').style.color = '#fff';
         }
         $scope.next = function() {
             console.log('I am in next')
             $ionicSlideBoxDelegate.next();
             console.log($ionicSlideBoxDelegate.slidesCount());
             $scope.slidesCount = $ionicSlideBoxDelegate.slidesCount();

             if($scope.currentSlide === $scope.slidesCount-1) {
               document.getElementById('button-previous').style.color = '#fff';
               document.getElementById('button-next').style.color = '';
             }else {
               document.getElementById('button-previous').style.color = '#fff';
             }
         };
         $scope.previous = function() {
             $ionicSlideBoxDelegate.previous();
             if($scope.currentSlide === 0) {
               document.getElementById('button-previous').style.color = '';   
               document.getElementById('button-next').style.color = '#fff';
             } else {
               document.getElementById('button-next').style.color = '#fff';
             }
         };
         //Slide Ends

     }])
    