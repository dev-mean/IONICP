controllers.controller('ProductsController@food',
function(LocalDb,UsersService,Geo,$ionicPopup, $q,$scope, $state,$stateParams, $rootScope, 
  $ionicHistory,$ionicLoading,$ionicModal,$ionicSideMenuDelegate,$cordovaCamera,
  $cordovaGeolocation,$interval,ProductTypesService,MovieTheatersService, Products, stripeCheckout,$ionicPlatform) 
  {
    'use strict';
  document.addEventListener("deviceready",function()
  {
    LocalDb.set('firstLoad',true);
    if(LocalDb.get('Logout')===true)
      {
        $state.go('welcome');
      }
    $scope.toggleLeftSideMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.checkout=function()
      {
        $state.go('checkout');
      };
    $scope.watching=null;
    $scope.IsFinding=$scope.IsFinding||'imglocation';
    $scope.IsCart=Products.cartProducts.length>0?true:false;
    $rootScope.productTypes=$rootScope.productTypes||[];
    $scope.currentSelection=LocalDb.getObject('currentSelection')||{};
    $scope.CurrentLocality =$scope.currentSelection.TheaterName||'Tap to search your theater';
    $scope.addDialogShow=function()
    {
    $ionicModal.fromTemplateUrl('templates/dialogs/theater-list.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.addDialog = modal;
        $scope.addDialog.show();
      });
    };    
    $scope.leaveAddChangeDialog = function(action) {
      if(action===1)
      {
        $scope.IsFinding='imglocation';
        $scope.CurrentLocality ='Tap to search your theater';
      }
      else
      {
        LocalDb.set('Step',2);         
      }
        $scope.addDialog.remove();
        $scope.modalProductSubTypes=[];
    };

      $scope.showConfirm = function(titleText,desc,settingCode) {
      var confirmPopup = $ionicPopup.confirm({
      title: titleText,
      template: desc,
      buttons: [
      { 
        text: 'Don’t Allow',
        type: 'button button-block button-dark bg-grey b',
        onTap: function(res) {
                 return 1;
               }      
      },
      {
        text: '<b>Allow</b>',
        type: 'button button-block button-dark bg-grey b',
        onTap: function(res) {
                 if(res) {
                   if(settingCode===1)
                    {         
                      if (navigator.userAgent.match(/android/i)||navigator.userAgent.toLowerCase().match(/iphone/) ||
                                navigator.userAgent.toLowerCase().match(/ipad/) ||
                                navigator.userAgent.match(/ipod/i)) {
                        cordova.plugins.diagnostic.switchToLocationSettings(); 
                        return 1;                       
                      }
                    }
                 } else {
                   return 0;
                 }
               }
      }
    ]});
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
                                    LocalDb.setObject('currentOrder',{});
                                    LocalDb.setObject('order',[]);
                                }).finally(function () {
                            $scope.$broadcast('scroll.refreshComplete');
                        });
            }
    };
  screen.lockOrientation('portrait'); 
  $scope.onTapGeoPin=function()
    {
      cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
          if(enabled)
            {
              if($scope.IsFinding==='imglocation')
                {  
                  $scope.IsFinding='imgfinding';
                  $scope.CurrentLocality = 'Searching for theater......';         
                  var watching=navigator.geolocation.getCurrentPosition(
                  function (position) 
                    {
                      if(position!==undefined)
                        {
                          if(position.coords!==undefined)
                            {
                              if(position.coords.latitude!==undefined)
                              {
                                var currentLocation={};
                                if(position.coords.latitude===0 && position.coords.longitude ===0)
                                  {
                                    currentLocation.latitude=37.323494;
                                    currentLocation.longitude=-122.047409;
                                  }
                                else
                                  {
                                    currentLocation.latitude=position.coords.latitude;
                                    currentLocation.longitude=position.coords.longitude;
                                  }
                                
                                LocalDb.setObject('currentLocation',currentLocation);
                                MovieTheatersService.getByLocationWithDistance(currentLocation).then(
                                function(successTheaters){
                                  if(successTheaters.length>0)
                                  {
                                    $scope.Theaters=successTheaters;                   
                                    $scope.addDialogShow();
                                  }
                                  else
                                  {
                                    $scope.Theaters=[];
                                    MovieTheatersService.getAllWithDistance(currentLocation).then(
                                      function(successMovieTheaters){
                                        $scope.Theaters=successMovieTheaters;
                                        $scope.addDialogShow();
                                      },
                                      function(error){
                                        $ionicLoading.hide();
                                          $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error MovieTheater in " + JSON.stringify(error)});
                                      });
                                    $scope.IsFinding='imglocation';
                                    $scope.CurrentLocality ='No Theater found near by(50 mtr) your current location';
                                  }
                                },
                                function(successTheaters,error){
                                  $scope.Theaters=[];                            
                                  //console.log(JSON.stringify(error));
                                  $scope.IsFinding='imglocation';
                                  $scope.CurrentLocality ='Tap to search your theater';
                                });

                              }
                              else
                              {
                                    //console.log(JSON.stringify(position));
                                    $scope.IsFinding='imglocation';
                                    $scope.CurrentLocality ='Tap to search your theater';
                              }
                            }
                          else
                            {
                                    //console.log(JSON.stringify(position));
                                    $scope.IsFinding='imglocation';
                                    $scope.CurrentLocality ='Tap to search your theater';
                            }
                        }
                      else
                        {
                                    //console.log(JSON.stringify(position));
                                    $scope.IsFinding='imglocation';
                                    $scope.CurrentLocality ='Tap to search your theater';
                        }
                    },
                  function (position,error) 
                    {
                          $scope.IsFinding='imglocation';
                          $scope.CurrentLocality = JSON.stringify(error);
                    }, { enableHighAccuracy: true });//watch end
                }
            }
          else
            {
              $scope.showConfirm("Allow “POPii” to access your location while you use the app?",
                  "We ask for your location to determine what theater you’re in so we can deliver to you.",1);
            }
    }, onError);
    function onError(error){
        console.error("An onError occurred: "+error);
        $state.reload();
    };
    };

  if(parseInt(LocalDb.get('Step'),10)===1 || parseInt(LocalDb.get('IsSearched'),10)!==1)
          {
            //console.log(LocalDb.get('IsSearched'));
            $scope.IsFinding='imglocation';
            $scope.CurrentLocality ='Tap to search your theater';
          }
          
       
  $scope.setTheater=function(Theater)//:SET:
    {
      UsersService.getByTheaterID(Theater).then(function(successUsers){

         $scope.IsFinding='imglocation';
      $scope.CurrentLocality =Theater.TheaterName;
      console.log(JSON.stringify(Theater));
      $scope.currentSelection=LocalDb.getObject('currentSelection');
      $scope.currentSelection.TheaterName=Theater.TheaterName;
      $scope.currentSelection.TheaterID=Theater.TheaterID;
      $scope.currentSelection.EmployeeID=successUsers[0].EmployeeID;
      LocalDb.setObject('currentSelection',$scope.currentSelection);
      LocalDb.set('IsSearched',1);
      $scope.leaveAddChangeDialog(0);
      $scope.GetData();
      },function(error){});     
    }
    
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
        if(parseInt(LocalDb.get('Step'),10)===1 || parseInt(LocalDb.get('IsSearched'),10)!==1)
          {
            $scope.onTapGeoPin();
          }
          else
          {
            LocalDb.setObject('selectedProductType',objectFindByKey($rootScope.productTypes, 'ProductTypeID', ProductTypeID));
            $state.go('products', {id: ProductTypeID});
          }
      };
$scope.GetData();
}); //end device ready
});
controllers.controller('ProductsController@products', function($ionicHistory,LocalDb,UsersService,Products,$ionicPopup, $window,$scope, $state,$stateParams, $rootScope,$ionicModal,$ionicLoading,$ionicSideMenuDelegate,ProductsService,ProductSubTypeService,OrdersService) 
{
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
      LocalDb.set('Step',3);
    UsersService.init();
    $scope.IsCart=Products.cartProducts.length>0?true:false;
    $scope.cartProducts = Products.cartProducts;
    $rootScope.Order=$rootScope.Order||{};
    $scope.ProductTypeName=LocalDb.getObject('selectedProductType').ProductTypeName;
    $scope.ProductTypeDesc=LocalDb.getObject('selectedProductType').ProductTypeDesc;
    var InputPayLoad=LocalDb.getObject('currentSelection');
    //LocalDb.setObject('currentOrder',{});
    $scope.GetData=function()
        {
            //tes  LocalDb.getObject('selectedProductType')
            if(LocalDb.getObject('selectedProductType'))
                $ionicLoading.show({template: 'Loading '+$scope.ProductTypeName+' ...'});
            else
                $state.go('app.product-types');
            InputPayLoad.ProductTypeID=$state.params.id;
            ProductsService.getAllByProductType(InputPayLoad).then(function(successProducts)
            {
                //console.log(successProducts);
                $scope.productsitem=successProducts;
                $ionicLoading.hide();
            },function(error)
            {
                $scope.productsitem=[];
                $ionicLoading.hide();
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
    $scope.GetData();
      // Load the add / change dialog from the given template URL
    
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
    $scope.loadProductSubTypeMenu= function(item)
    {
        $rootScope.selectedProduct = objectFindByKey($scope.productsitem, 'ProductID', item.ProductID);
            // $ionicPopup.confirm({
            //              title: '',
            //              template: 'ADD '+$rootScope.selectedProduct.ProductName+' ?',
            //              buttons: [              
            //               {
            //                 text: 'YES',
            //                 type: 'button button-block button-dark bg-grey b',
            //                 onTap: function(res) {
            //                          if(res) {
                           
        $scope.modalProductSubTypes=[];
        

        $ionicLoading.show({template: 'Loading '+$rootScope.selectedProduct.ProductName+' Items ...'});
        ProductSubTypeService.getAllByProduct(item).then(function(successProductSubTypes)
        {
            $scope.products =Products.galleryProducts = [];//Products.galleryProducts;
        _.each(successProductSubTypes,function(itemProductSubType){
                      var prod         = {};
                      prod.id          = itemProductSubType.ProductSubTypeID;
                      prod.title       = $rootScope.selectedProduct.ProductName+" ("+itemProductSubType.ProductSubTypeName+")";
                      prod.images      = [$rootScope.selectedProduct.ProductImage];
                      prod.description = itemProductSubType.ProductSubTypeName;
                      prod.quantity    = 1;
                      prod.price       = parseFloat(itemProductSubType.ProductCost);
                      Products.galleryProducts.push(prod);               
            });
        $scope.products = Products.galleryProducts;
       
            $scope.modalProductSubTypes=successProductSubTypes;                        
            $ionicLoading.hide();
            LocalDb.set('Step',4);
            $scope.addDialogShow();
        },function(error)
        {
            $scope.ProductSubTypes=[];
            $ionicLoading.hide();
        });
           //               } else {
           //                 return 0;
           //               }
           //             }
           //    },
           //    { 
           //      text: 'No Thanks!',
           //      type: 'button button-block button-dark bg-grey b'
           //    }
           //  ]
           // });
    };
    $scope.saveEmpty = function(form) {
            $scope.form = angular.copy(form);
      };
    $scope.addDialogShow=function()
    {
      $ionicModal.fromTemplateUrl('templates/dialogs/sub-products-dialog.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.addDialogSB = modal;
        $scope.addDialogSB.show();
      });
    };
    $scope.leaveAddChangeDialog = function() {
        $scope.addDialogSB.remove();
        $scope.modalProductSubTypes=[];
    };
    $scope.back = function(){    
      $ionicHistory.goBack();
      };
    $scope.goToCart = function(){
      $scope.leaveAddChangeDialog();
      $state.go('checkout',{},{reload:true});
    };
});