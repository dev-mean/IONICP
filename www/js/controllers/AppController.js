controllers.controller('AppController@menu', function(LocalDb,UsersService,GeolocationService,Products,$ionicPopup, $scope,
 $state,$stateParams, $rootScope, $ionicHistory,$ionicLoading,$ionicSideMenuDelegate,$window) {
  'use strict';
  document.addEventListener("deviceready",function(){
  LocalDb.set('firstLoad',true);
  UsersService.init();
  $scope.IsCart=Products.cartProducts.length>0?true:false 
  if (LocalDb.getObject('user').loginMethod=== null || LocalDb.getObject('user').loginMethod===undefined) {
    UsersService.logout().then(
           function () 
           {
              LocalDb.set('Logout',true);
             $state.go('welcome',{reload:true});
           },
           function (_error) 
           { 
             LocalDb.set('Logout',true);
             $state.go('welcome',{reload:true});
         });  
  }
  if(LocalDb.get('Logout')===true)
  {
    $state.go('welcome',{reload:true});
  }
 $ionicSideMenuDelegate.canDragContent(true); 
 });
});
controllers.controller('AppController@movies', function(LocalDb,GeolocationService,MovieTheatersService,
UsersService,Products,ShowsService, $rootScope, $scope, $state,$stateParams,$ionicPopup,$ionicLoading,
$ionicSideMenuDelegate,$ionicScrollDelegate,$cordovaGeolocation) {
  'use strict';
  document.addEventListener("deviceready",function(){
     $ionicScrollDelegate.getScrollView().options.scrollingY = true;
  LocalDb.set('firstLoad',true);
  if(LocalDb.get('Logout')===true)
  {
    $state.go('welcome');
  }
    $scope.checkout=function()
    {
      $state.go('checkout');
    };
    $ionicLoading.show({
                template: '<img src="img/spiner.gif">'
            });
    GeolocationService.GetLocation().then(function(currentLocation){
      MovieTheatersService.getAllWithDistance(currentLocation).then(
                          function(successTheaters){
                            if(successTheaters.length>0)
                            {
$ionicLoading.hide();
$scope.MovieTheaters=successTheaters;
$scope.IsTheaters=true;
$scope.IsShows=false;
LocalDb.set('Step',5);
                            }
                            else
                            {
$scope.MovieTheaters=[];

var currentLocation=LocalDb.getObject('currentLocation');
InputPayLoad.latitude=currentLocation.latitude;
InputPayLoad.longitude=currentLocation.longitude; 
MovieTheatersService.getAllWithDistance(currentLocation).then(
  function(successMovieTheaters){
      $ionicLoading.hide();
      $scope.MovieTheaters=successMovieTheaters;
      $scope.IsTheaters=true;
      $scope.IsShows=false;
      LocalDb.set('Step',5);
  },
  function(error){
    $ionicLoading.hide();
              if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

  });
$scope.CurrentLocality ='No Theater found near by(50 mtr) your current location';
                            }
                          },
                          function(successTheaters,error){
                            $ionicLoading.hide();
              if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

                            $scope.MovieTheaters=[];
                            $scope.CurrentLocality ='Tap to search your theater';
                          });
    },function(error){});
  

  $scope.Title='Find A Theater';
  $scope.IsCart=Products.cartProducts.length>0?true:false;
  $scope.MovieTheaters=$scope.MovieTheaters||[];
  $ionicSideMenuDelegate.canDragContent(true);
  $scope.heading = {};
  $scope.message = null;
  $scope.IsTheaters=false;
  $scope.IsShows=false;
  $scope.GetData = function()
        {
          $ionicLoading.show({
                template: '<img src="img/spiner.gif">'
            });
            var InputPayLoad={};
            var currentLocation=LocalDb.getObject('currentLocation');
            InputPayLoad.latitude=currentLocation.latitude;
            InputPayLoad.longitude=currentLocation.longitude;            
            MovieTheatersService.getAllWithDistance(InputPayLoad).then(
                function(successMovieTheaters){ 
                  $ionicLoading.hide();
                  $scope.MovieTheaters=successMovieTheaters;
                  $scope.IsTheaters=true;
                  $scope.IsShows=false;
                  LocalDb.set('Step',5);
                },
                function(error){
                  $ionicLoading.hide();
                    $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error MovieTheater in " + JSON.stringify(error)});
                }).finally(function () {$scope.$broadcast('scroll.refreshComplete');}); 
        };
  $scope.GetData();
  $scope.loadShowTimes = function(Theater)
        {
          UsersService.getByTheaterID(Theater).then(function(successUsers){

         $scope.IsFinding='imglocation';
      $scope.CurrentLocality =Theater.TheaterName;
      //console.log(JSON.stringify(Theater));
      $scope.currentSelection=LocalDb.getObject('currentSelection');
      $scope.currentSelection.TheaterName=Theater.TheaterName;
      $scope.currentSelection.TheaterID=Theater.TheaterID;
      $scope.currentSelection.EmployeeID=successUsers[0].EmployeeID;
      LocalDb.setObject('currentSelection',$scope.currentSelection);
      LocalDb.set('IsSearched',1);
      $state.go('app.product-types');
      },function(error){});
            
        };
        $scope.reload=function()
        {
          $state.reload();
        };
        });
});
controllers.controller('AppController@showtime', function(LocalDb,ShowsService,Products, $rootScope,  $scope, $state,
  $stateParams,$ionicPopup,$ionicLoading,$ionicSideMenuDelegate) {
  'use strict';
  document.addEventListener("deviceready",function(){
  LocalDb.set('firstLoad',true);
  if(LocalDb.get('Logout')===true)
  {
    $state.go('welcome');
  }
    $scope.checkout=function()
    {
      $state.go('checkout');
    };
  $scope.IsCart=Products.cartProducts.length>0?true:false;
  $ionicSideMenuDelegate.canDragContent(true);
 $scope.Shows=$scope.Shows||[];
 $scope.GetData = function()
        {
          $ionicLoading.show({
                template: '<img src="img/spiner.gif">'
            });  
            var InputPayLoad={};
            InputPayLoad.TheaterID=LocalDb.getObject('currentSelection').TheaterID;
            ShowsService.getByTheaterID(InputPayLoad).then(
                function(successShows){ 
                    $scope.Shows=successShows;
                    $ionicLoading.hide();
                    LocalDb.set('Step',6);
                },
                function(error){
                  $ionicLoading.hide();
                    $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: "error MovieTheater in " + error});
                }).finally(function () {$scope.$broadcast('scroll.refreshComplete');}); 
        };
 $scope.GetData();
 $scope.loadFoods= function(ShowID){
    var currentSelection=LocalDb.getObject('currentSelection');
    currentSelection.ShowID=ShowID;
    LocalDb.setObject('currentSelection',currentSelection);
    //$state.go('app.product-types',{reload:true});
 };
 });
});
controllers.controller('AppController@rewards', function(LocalDb,Products, $rootScope,  $scope, $state,$stateParams,$ionicPopup,$ionicLoading,$ionicSideMenuDelegate) 
{
  LocalDb.set('firstLoad',true);
  if(LocalDb.get('Logout')===true)
  {
    $state.go('welcome');
  }
    $scope.checkout=function()
    {
      $state.go('checkout');
    };
});
controllers.controller('AppController@brightness-setting', function(LocalDb,Brightness,Products, $rootScope,  $scope, $state,
  $stateParams,$ionicPopup,$ionicLoading,$ionicSideMenuDelegate,$ionicPlatform) 
{
document.addEventListener("deviceready",function(){
  if(LocalDb.get('rangeValue')!==undefined)
  {
    console.log(LocalDb.get('rangeValue'));
    $scope.rangeValue=LocalDb.get('rangeValue');
  }
  LocalDb.set('firstLoad',true);
  if(LocalDb.get('Logout')===true)
  {
    $state.go('welcome');
  }
    $scope.checkout=function()
    {
      $state.go('checkout');
    };
      $scope.onRelease = function (rangeValue){
        console.log(LocalDb.get('rangeValue'));
        console.log('rangeValue'+rangeValue);
        Brightness.set(parseFloat(rangeValue));
      };
});
})
controllers.controller('AppController@test', function(LocalDb,Brightness,Products, $rootScope,  $scope, $state,
  $stateParams,$ionicPopup,$ionicLoading,$ionicSideMenuDelegate,$ionicPlatform,ProductTypesService) 
{
  $scope.currentSelection={TheaterID:'QXnb6ec6D3',ShowID:'PGrnC7OJeB',EmployeeID:'Y6ZJelKryF',UserID:'2cjIajcK8d',TheaterName:'Bluelight cinema 5'};
  ProductTypesService.getAllByTheaterID($scope.currentSelection).then(function(successProductTypes)
    {
      console.log(successProductTypes);
        $ionicLoading.hide();
        $rootScope.productTypes=successProductTypes;  
    },function(error)
    {
      console.log(JSON.stringify(error));
        $rootScope.productTypes=[];
        $ionicLoading.hide();
    }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
  });
});