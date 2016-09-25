controllers.controller('CartController@payhistory', 
    function(LocalDb,UsersService,Products,$ionicPopup, $scope, $state, $rootScope,$stateParams, $ionicHistory,
      $ionicLoading,$ionicModal,$ionicSideMenuDelegate,OrdersService) {
    'use strict';
    LocalDb.set('firstLoad',true);
    if(LocalDb.get('Logout')===true)
      {
        $state.go('welcome');
      }
      $scope.checkout=function()
      {
        $state.go('checkout');
      };
      LocalDb.set('Step',9);
     UsersService.init();
    $scope.IsCart=Products.cartProducts.length>0?true:false;
    $ionicSideMenuDelegate.canDragContent(true);

    $scope.orders=$scope.orders||[];
    var InputPayLoad={};

    $scope.GetData=function()
    {
        $ionicLoading.show({
                template: '<img src="img/spiner.gif">'
            });
        var currentUser = LocalDb.getObject('user');  
        InputPayLoad.UserID=currentUser.id;
        OrdersService.getAllByUser(InputPayLoad).then(
            function(successOrders)
            {
                if(successOrders.length>0)
                {
                  //console.log(JSON.stringify(successOrders));
                    $scope.orders=successOrders;
                }
                else
                {
                    $scope.orders=[];
                }
                $ionicLoading.hide();
            },function(error)
            {
                $scope.orders=[];
                $ionicLoading.hide();
            }).finally(function ()
                        {
                            // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                        });
    };
    $scope.GetData();
    $scope.orderDetail=function(order)
    {
      LocalDb.setObject('selectedOrder',order);
      $state.go('payhistory-details');
    };
});

controllers.controller('CartController@payhistory-details', 
    function(LocalDb,UsersService,Products,$ionicPopup, $scope, $state, $rootScope,$stateParams, $ionicHistory,
      $ionicLoading,$ionicModal,$ionicSideMenuDelegate,OrdersService) {
    'use strict';
    LocalDb.set('firstLoad',true);
    if(LocalDb.get('Logout')===true)
      {
        $state.go('welcome');
      }
      LocalDb.set('Step',10);
    $scope.order=LocalDb.getObject('selectedOrder');
    console.log(JSON.stringify($scope.order));
    $scope.PaidTotalAmount=parseFloat($scope.order.TotalAmount)-parseFloat($scope.order.TaxAmount)+parseFloat($scope.order.DiscountAmount);
    $scope.PaidTotalAmount=$scope.PaidTotalAmount.toFixed(2);
      $scope.back=function()
      {
        console.log('back called');
        $ionicHistory.goBack();
      };
});
controllers.controller('CartController@checkout', 
  function(LocalDb,UsersService,MovieTheatersService,ShowsService,OrdersService,PaymentMethodService,
        $ionicPopup, $scope, $state, $rootScope,$stateParams,$ionicHistory,$ionicLoading,$ionicModal,$ionicSideMenuDelegate,
        Products, stripeCheckout,CheckoutValidation,PromoCodesService) 
  {
    'use strict';
    document.addEventListener("deviceready",function(){
      LocalDb.set('firstLoad',true);
      if(LocalDb.get('Logout')===true)
        {
          $state.go('welcome');
        }
    var app = {
      initPaymentUI: function() {
        var clientIDs = {
          "PayPalEnvironmentProduction": "AUax-BbKKJH-j2mczQWIa9NSmZJaPLQnYdrk8apI0q2wytAevReknM5x3e9ooOr2yEGO2dRW8TEzip7E",
          "PayPalEnvironmentSandbox": "AdRAG7IS518XS_Ke4kmL1kfS_6K1eI_tZLovZ9534PJQqJiAGm7epsl_yJSlQTZyDjKIDmXSdZDQt8Bh"
        };
        PayPalMobile.init(clientIDs, app.onPayPalMobileInit);

      },
      onSuccesfulPayment: function(response) {
       // console.log("payment success: " + JSON.stringify(response, null, 4));
        if(response)
        {
          var PayPalToken=response.id;
          var products=Products.cartProducts;     
         var currentUser=LocalDb.getObject('user');
         var InputPayLoad=LocalDb.getObject('currentSelection');    
            //console.log('setStripeTokenCallback InputPayLoad');
            
            MovieTheatersService.getByID(InputPayLoad).then(
                function(successMovieTheater){
                    ShowsService.getByID(InputPayLoad).then(
                        function(successShow){
                            InputPayLoad.TheaterName=successMovieTheater.TheaterName;
                            InputPayLoad.TheaterImage=successMovieTheater.Image;
                            InputPayLoad.MovieName=successShow.MovieName;
                            InputPayLoad.MovieImage=successShow.Image;
                            InputPayLoad.StartTime=successShow.StartTime;
                            InputPayLoad.UserFullName=currentUser.firstName+" "+currentUser.lastName;
                            InputPayLoad.UserID=currentUser.id;
                            InputPayLoad.OrderItems=products;                                             
                            InputPayLoad.TaxAmount=$scope.TaxAmount.toFixed(2);
                            if($scope.DiscountAmount!==undefined)
                              InputPayLoad.DiscountAmount=$scope.DiscountAmount.toFixed(2);
                            else
                              InputPayLoad.DiscountAmount=0.0;  
                            InputPayLoad.TotalAmount=$scope.TotalAmount.toFixed(2);
                            InputPayLoad.OrderStatus=0;
                            InputPayLoad.PaymentMethod="PayPal";
                            InputPayLoad.Token =PayPalToken;
                            InputPayLoad.paymentHistory=response;
                            InputPayLoad.deliveryType='Pick Up';
                            InputPayLoad.deliveryTime=$scope.data.deliveryTime;
                            InputPayLoad=angular.fromJson(angular.toJson(InputPayLoad));
                            OrdersService.placeOrder(InputPayLoad).then(
                                function(successOrders){
                                    InputPayLoad={};
                                    InputPayLoad.OrderID=successOrders.order.OrderID;
                                    InputPayLoad.OrderStatus=1;
                                    OrdersService.changeStatus(InputPayLoad).then(
                                      function(successStatus){
                                        $scope.OrderNumber='Order #'+successStatus;
                                        LocalDb.setObject('order',{});
                                        Products.galleryProducts = [];
                                        Products.cartProducts = [];
                                        Products.checkout = {};
                                        Products.total=0.0;
                                        var currentSelection=LocalDb.getObject('currentSelection');
                                        currentSelection.MovieName=null;
                                        currentSelection.ShowTime=null;
                                        LocalDb.setObject('currentSelection',currentSelection); 
                                        $scope.proccessing=false;
                                        LocalDb.set('CheckShowTime',0);
                                      },
                                      function(error){
                                          //$ionicLoading.hide();
                                          $scope.proccessing=false;
                                          $scope.IsProccess=false;
                                          $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error order change in " + error});
                                      });                               
                                },
                                function(error){
                                    //$ionicLoading.hide();
                                    $scope.proccessing=false;
                                    $scope.IsProccess=false;
                                    $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error order place in " + error});
                                });
                        },
                        function(error){
                            //$ionicLoading.hide(); 
                            $scope.proccessing=false;
                            $scope.IsProccess=false;                       
                            $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error Shows in " + error});
                    });
                },
                function(error){
                    //$ionicLoading.hide();   
                    $scope.proccessing=false;
                    $scope.IsProccess=false;             
                    $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error MovieTheater in " + error});
            });
        }
      },
      onAuthorizationCallback: function(authorization) {
       // console.log("authorization: " + JSON.stringify(authorization, null, 4));
      },
      createPayment: function(grandTotal) {
        // for simplicity use predefined amount
        var paymentDetails = new PayPalPaymentDetails(''+grandTotal.toFixed(2), "0.00", "0.00");
        var payment = new PayPalPayment(''+grandTotal.toFixed(2), "USD", "POPii", "Purchase",
          paymentDetails);
        return payment;
      },
      configuration: function() {
        // for more options see `paypal-mobile-js-helper.js`
        var config = new PayPalConfiguration({
          merchantName: "My test shop",
          merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
          merchantUserAgreementURL: "https://mytestshop.com/agreement"
        });
        return config;
      },
      onPrepareRender: function() {

        $scope.payByPayPal = function(grandTotal) {
          // single payment
          PayPalMobile.renderSinglePaymentUI(app.createPayment(grandTotal), app.onSuccesfulPayment,
            app.onUserCanceled);
        };
      },
      onPayPalMobileInit: function() {
        // must be called
        // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
        PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", app.configuration(),
          app.onPrepareRender);
      },
      onUserCanceled: function(result) {
       // console.log('result');
       // console.log(result);
        $scope.proccessing=false;
        $scope.IsProccess=false;
        $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error PayPal : " + result});
      }
    };
    stripeCheckout.setStripeTokenCallback = function(status, response) 
    {
      console.log(JSON.stringify(response));
      if(response)
      {
        var StripeToken=response.id;
        var products=Products.cartProducts;     
        var currentUser=LocalDb.getObject('user');
        var InputPayLoad=LocalDb.getObject('currentSelection');        
        MovieTheatersService.getByID(InputPayLoad).then(
              function(successMovieTheater){
                  ShowsService.getByID(InputPayLoad).then(
                      function(successShow){
                        console.log(successMovieTheater.EmployeeID);
                          InputPayLoad.TheaterName=successMovieTheater.TheaterName;
                          InputPayLoad.TheaterImage=successMovieTheater.Image;
                          InputPayLoad.MovieName=successShow.MovieName;
                          InputPayLoad.MovieImage=successShow.Image;
                          InputPayLoad.StartTime=successShow.StartTime;
                          InputPayLoad.UserFullName=currentUser.firstName+" "+currentUser.lastName;
                          InputPayLoad.UserID=currentUser.id;
                          InputPayLoad.OrderItems=products;                        
                          InputPayLoad.TaxAmount=$scope.TaxAmount.toFixed(2);
                          if($scope.DiscountAmount!==undefined)
                          InputPayLoad.DiscountAmount=$scope.DiscountAmount.toFixed(2);
                          else
                          InputPayLoad.DiscountAmount=0.0;  
                          InputPayLoad.TotalAmount=$scope.TotalAmount.toFixed(2);
                          InputPayLoad.OrderStatus=0;
                          InputPayLoad.PaymentMethod="Stripe";
                          InputPayLoad.Token =StripeToken;
                          InputPayLoad.paymentHistory=response;
                          InputPayLoad.deliveryType='Pick Up';
                          InputPayLoad.deliveryTime=$scope.data.deliveryTime;
                          InputPayLoad=angular.fromJson(angular.toJson(InputPayLoad));
                          OrdersService.placeOrder(InputPayLoad).then(
                              function(successOrders){
                                console.log(JSON.stringify(successOrders));
                                  //$ionicLoading.hide();
                                  //$ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: successOrders.msg});
                                  LocalDb.setObject('order',{});
                                  Products.galleryProducts = [];
                                  Products.cartProducts = [];
                                  Products.checkout = {};
                                  Products.total=0.0;
                                  InputPayLoad={};
                                  InputPayLoad.OrderID=successOrders.order.OrderID;
                                  InputPayLoad.OrderStatus=1;
                                  OrdersService.changeStatus(InputPayLoad).then(
                                    function(successStatus){
                                      $scope.OrderNumber='Order #'+successStatus;
                                      LocalDb.setObject('order',{});
                                      Products.galleryProducts = [];
                                      Products.cartProducts = [];
                                      Products.checkout = {};
                                      Products.total=0.0;
                                      var currentSelection=LocalDb.getObject('currentSelection');
                                      currentSelection.MovieName=null;
                                      currentSelection.ShowTime=null;
                                      LocalDb.setObject('currentSelection',currentSelection); 
                                      $scope.proccessing=false;
                                      LocalDb.set('CheckShowTime',0);
                                    },
                                    function(successStatus,error){
                                        //$ionicLoading.hide();
                                        $scope.proccessing=false;
                                        $scope.IsProccess=false;
                                        $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error order change in " + JSON.stringify(error)});
                                    });
                              },
                              function(successOrders,error){
                                  //$ionicLoading.hide();
                                  $scope.proccessing=false;
                                  $scope.IsProccess=false;
                                  $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error order place in " + JSON.stringify(error)});
                              });
                      },
                      function(successShow,error){
                          //$ionicLoading.hide(); 
                          $scope.proccessing=false;
                          $scope.IsProccess=false;                       
                          $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error Shows in " + JSON.stringify(error)});
                  });
              },
              function(successMovieTheater,error){
                  //$ionicLoading.hide();   
                  $scope.proccessing=false;
                  $scope.IsProccess=false;             
                  $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error MovieTheater payment via stripe " + JSON.stringify(error)});
          });
      }
      else
      {
        $scope.proccessing=false;
        $scope.IsProccess=false;             
        $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(response)});
      }
    };    
    app.initPaymentUI();
    screen.lockOrientation('portrait');
    
    $scope.proccessing=false;
    $scope.IsProccess=false;
    $scope.localPaymentMethod='PayPal';
    $scope.OrderNumber='wait for your order number';
    
    var currentUser = LocalDb.getObject('user');
    $scope.fullName=currentUser.firstName+" "+currentUser.lastName;
    $scope.profilePic=currentUser.profilePic;
    $scope.Shows=$scope.Shows||[];
    $scope.ShowTimes=$scope.ShowTimes||[];
    $scope.selectedMovie=$scope.selectedMovie||{};
    $scope.selectedMovie.ShowTime=$scope.selectedMovie.ShowTime||LocalDb.getObject('currentSelection').ShowTime;
    $scope.selectedMovie.MovieName=$scope.selectedMovie.MovieName||LocalDb.getObject('currentSelection').MovieName;
    
    $scope.IsShow=0;
    $scope.addDialogShowList=function()
    {
      $ionicModal.fromTemplateUrl('templates/dialogs/show-list.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.addDialog = modal;
          $scope.addDialog.show();
        });
    };    
    $scope.leaveAddChangeDialog = function(action) {
        //if(action===0)
        //$scope.addDialog.hide();
        $scope.IsShow=0;
        // else
        // {  
        $scope.addDialog.remove();
        // }
    };

    $scope.GetData = function()
    {
          $scope.currentSelection=LocalDb.getObject('currentSelection');
          console.log('currentSelection'+JSON.stringify($scope.currentSelection));
            if($scope.currentSelection.TheaterID!==undefined)
            {
              $ionicLoading.show({template: '<img src="img/spiner.gif">'});
                ProductTypesService.getAllByTheaterID($scope.currentSelection).then(function(successProductTypes)
                                {
                                    $ionicLoading.hide();
                                    $rootScope.productTypes=successProductTypes;  
                                },function(error)
                                {
                                    $rootScope.productTypes=[];
                                    $ionicLoading.hide();
                                    //LocalDb.setObject('currentOrder',{});
                                    //LocalDb.setObject('order',[]);
                                }).finally(function () {
                            $scope.$broadcast('scroll.refreshComplete');
                        });
            }
    };
    $scope.addDialogGoWellWith=function()
    {
      $ionicModal.fromTemplateUrl('templates/dialogs/go-well-with.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.addDialogSB = modal;
        $scope.addDialogSB.show();
      });
    };
    $scope.leaveGoWellWithDialog = function() {
        $scope.addDialogSB.remove();$scope.addDialogSB.hide();
        //$scope.productTypes=[];
    };
    function objectFindByKey(array, key, value)
        {
                  for (var i = 0; i < array.length; i++) 
                  {
                    if (array[i][key] === value) 
                    {
                     return array[i];
                    }
                  }
                  return null;
        };
    $scope.loadProducts= function(ProductTypeID)
      {
       $scope.leaveGoWellWithDialog();
        LocalDb.setObject('selectedProductType',objectFindByKey($rootScope.productTypes, 'ProductTypeID', ProductTypeID));
        $state.go('products', {id: ProductTypeID});         
      };
    $scope.setShow=function(Show)
    {
      $scope.selectedMovie.MovieName=Show.MovieName;
      var InputPayLoad=LocalDb.getObject('currentSelection');
      InputPayLoad.ShowID=Show.ShowID;
      InputPayLoad.MovieName=Show.MovieName;
      LocalDb.setObject('currentSelection',InputPayLoad);
      $scope.ShowTimes=Show.ShowTime;
      $scope.IsShow=1;
    }
    $scope.setShowTime=function(ShowTime)
    {
      var InputPayLoad=LocalDb.getObject('currentSelection');
      InputPayLoad.ShowTime=ShowTime;
      $scope.selectedMovie.ShowTime=ShowTime;
      LocalDb.setObject('currentSelection',InputPayLoad);
      LocalDb.set('CheckShowTime',1);
      $scope.IsShow=2;
      $scope.leaveAddChangeDialog(0);
    }
    $scope.GetShowsData = function()
            {
              $ionicLoading.show({template: '<img src="img/spiner.gif">'});
                var InputPayLoad={};
                InputPayLoad.TheaterID=LocalDb.getObject('currentSelection').TheaterID;
                console.log(JSON.stringify(InputPayLoad));
                ShowsService.getByTheaterID(InputPayLoad).then(
                    function(successShows){ 
                      //console.log(JSON.stringify(successShows));
                      if(successShows.length>0)
                      {
                        $scope.Shows=successShows;
                        $scope.addDialogShowList();
                       }
                       else
                        $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "No Show / Movies playing under this theater!!"});
                        $ionicLoading.hide(); 
                      },
                    function(error){
                      $ionicLoading.hide();
                        $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "Error:Getting Shows#" + JSON.stringify(error)});
                    }); 
            };
    if(parseInt(LocalDb.get('CheckShowTime'),10)!==1)
      {
        //alert(LocalDb.get('CheckShowTime'));
        $scope.GetShowsData();
      }
    $scope.CheckShowTime=function()
    {
    //alert(LocalDb.get('CheckShowTime'));
      if(parseInt(LocalDb.get('CheckShowTime'),10)!==1)
      {
        $scope.GetShowsData();
      }
    };
    

    // PRODUCTS IN CART //
    $scope.cartProducts = Products.cartProducts;
    $scope.checkout = Products.checkout; 
    Products.updateTotal();
    $scope.cartTotal=parseFloat(Products.total);
    $scope.TaxAmount=$scope.cartTotal*0.10||0.0;//TAX 10%    
    $scope.DiscountAmount=$scope.DiscountAmount||0.0;//DISCOUNT 1%        
    $scope.TotalAmount=$scope.cartTotal-$scope.DiscountAmount;
    $scope.TotalAmount=($scope.cartTotal+$scope.TaxAmount);//-$scope.DiscountAmount;
    $scope.IsDiscount=false;
    $scope.processCheckout = stripeCheckout.processCheckout;
    $scope.stripeCallback = stripeCheckout.stripeCallback;
    $scope.deliveryType=$scope.deliveryType||'0';
    $scope.data=$scope.data||{};
    $scope.data.deliveryTime=$scope.data.deliveryTime||'';
    //click
    $scope.onProcessPaypalTapped = function(grandTotal){
        
        if(Products.cartProducts.length>0)
        {
          $scope.proccessing=true;
          $scope.IsProccess=true;
          $scope.payByPayPal(grandTotal);
        }else
        {
            $scope.proccessing=false;
            $scope.IsProccess=false;
            $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:'You don\'t have add any food item into your cart, please choose any one food item from food list!!'});
        }
      };

    $scope.onProcessStripeTapped = function(grandTotal)
    {    
      // console.log('jugal0');
      if(Products.cartProducts.length>0)
        {
         //  console.log('jugal01');
          $scope.proccessing=true;
          $scope.IsProccess=true;
          var currentUser = LocalDb.getObject('user');
          var InputPayLoad={}; 
          InputPayLoad.UserID=currentUser.id;
            PaymentMethodService.getCreditCard(InputPayLoad).then(function(successCreditCard)
              {
               //  console.log('jugal');
                if(successCreditCard.creditCardNumber!==undefined ||successCreditCard.creditCardNumber!==null)
                {
                //   console.log('jugal1');
                  $scope.checkout.cc    = successCreditCard.creditCardNumber;
                  $scope.checkout.month = successCreditCard.creditCardExpMonth;//.slice(0,2);
                  $scope.checkout.year  = successCreditCard.creditCardExpYear;
                  $scope.checkout.cvc   = successCreditCard.creditCardCvc;
                  //$scope.checkout.tax   = $scope.tax;//
                  if (CheckoutValidation.checkAll($scope.checkout)) {
                   //   console.log('jugal2');
                      $scope.processCheckout($scope.checkout,$scope.stripeCallback);
                      
                      //$scope.proccessing=false;
                      //$scope.IsProccess=false;
                    } else {
                     //  console.log('jugal3');
                      $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:'Not valid payment method saved with your profile.Please choose any one of payment method!!'});
                      $state.go('app.payment-method',{id:1});
                    }
                  }
                  else
                  {
                    // console.log('jugal4');
                      $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:'No payment method saved with your profile.Please choose any one of payment method!!'});
                      $state.go('app.payment-method',{id:1});
                  }

              },function(error)
              {
                // console.log('jugal5');
                $scope.proccessing=false;
                $scope.IsProccess=false;
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:error});
                $state.go('app.payment-method',{id:1});
               //$ionicLoading.hide();
              });
        }
      else
        {
          // console.log('jugal00');
            $scope.proccessing=false;
            $scope.IsProccess=false;
            $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:'You don\'t have add any food item into your cart, please choose any one food item from food list!!'});
        }
    };
    //end click
    $scope.onProcessCheckoutTapped = function(){
      UsersService.init(true);
      if(Products.cartProducts.length>0)
        {
          if($scope.data.deliveryTime===undefined || $scope.data.deliveryTime===null ||$scope.data.deliveryTime==='')
          {
            $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:'You don\'t select delivery time slot,Please select at least one of delivery time slot!!'});
          }
          else
          $ionicPopup.confirm({
               title: 'Please choose payment method!!',
               template: '',
               buttons: [              
                {
                  text: 'Credit Card',
                  type: 'button button-block button-dark bg-grey b',
                  onTap: function(res) {
                           if(res) 
                           {                   
                              $scope.onProcessStripeTapped($scope.TotalAmount);
                           }                         
                         }
                },
                {
                  text: 'PayPal',
                  type: 'button button-block button-dark bg-grey b',
                  onTap: function(res) {
                           if(res) 
                           {                
                              $scope.onProcessPaypalTapped($scope.TotalAmount);
                           }
                         }
                }
              ]
             });
        }
      else
        {
          $scope.proccessing=false;
          $scope.IsProccess=false;
          $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:'You don\'t have add any food item into your cart, please choose any one food item from food list!!'});
        }
    };
    $scope.pluse=function(product)
    {
      Products.addOneProduct(product);
      // PRODUCTS IN CART //
      $scope.cartProducts = Products.cartProducts;
      $scope.checkout = Products.checkout; 
      Products.updateTotal();
      $scope.cartTotal=parseFloat(Products.total);
      $scope.TaxAmount=$scope.cartTotal*0.10;//TAX 10%    
      //$scope.DiscountAmount=$scope.cartTotal*0.01;//DISCOUNT 1%    
      $scope.TotalAmount=($scope.cartTotal+$scope.TaxAmount);//-$scope.DiscountAmount;
    };
    $scope.minus=function(product)
    {
      product.purchaseQuantity <= 1 ? Products.removeProduct(product) : Products.removeOneProduct(product);
      // PRODUCTS IN CART //
      $scope.cartProducts = Products.cartProducts;
      $scope.checkout = Products.checkout; 
      Products.updateTotal();
      $scope.cartTotal=parseFloat(Products.total);
      $scope.TaxAmount=$scope.cartTotal*0.10;//TAX 10%    
      //$scope.DiscountAmount=$scope.cartTotal*0.01;//DISCOUNT 1%    
      $scope.TotalAmount=($scope.cartTotal+$scope.TaxAmount);//-$scope.DiscountAmount;
    };
    $scope.PromoCodeApply=function(PromoCode)
    {
      
      if($scope.TotalAmount>0.0)
      {
        $ionicLoading.show({template: '<img src="img/spiner.gif">'});
        var InputPayLoad={};
        InputPayLoad.PromoCode=PromoCode;
        PromoCodesService.getDiscount(InputPayLoad).then(
          function(successPromoCode){
           // console.log(successPromoCode.AmountType);
            if(successPromoCode.AmountType === '$')
            {
             // console.log(successPromoCode.Value);
              $scope.DiscountAmount=parseFloat(successPromoCode.Value);
              $scope.TotalAmount=$scope.cartTotal-$scope.DiscountAmount;
              $scope.IsDiscount=true;
            }
            else if(successPromoCode.AmountType === '%')
            {
              $scope.DiscountAmount=$scope.cartTotal*(parseFloat(successPromoCode.Value)/100);
              $scope.TotalAmount=$scope.cartTotal-$scope.DiscountAmount;
             $scope.IsDiscount=true;
             // console.log(successPromoCode.Value);
            }
            else if(successPromoCode.AmountType === '#')
            {
              $scope.DiscountAmount=$scope.cartTotal*(parseFloat(successPromoCode.Value)/100);
              $scope.TotalAmount=$scope.cartTotal-$scope.DiscountAmount;
              $scope.IsDiscount=true;
              $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:'Promo code not valid!!'});
            }
            $ionicLoading.hide();
          },
          function(successCreditCard,error){
            $ionicLoading.hide();
            $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:error});
          });
        
      }
      else
      {
        $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:'Please add food to cart!!'});
      }
    };
    $scope.setShowID=function(ShowID,ShowTime)
    {
      $scope.selectedShowID=ShowID;
      var InputPayLoad=LocalDb.getObject('currentSelection');
      InputPayLoad.ShowID=ShowID;
      InputPayLoad.ShowTime=ShowTime;
      LocalDb.setObject('currentSelection',InputPayLoad);
    };

        $scope.back = function(){
         if($scope.IsProccess && !$scope.proccessing)
         {
         $state.go('app.product-types',{},{reload:true});
         }
         else
         {
          $state.go('app.product-types');
         }
      };
    });
});