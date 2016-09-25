var starter = angular.module('starter', ['ionic','openfb', 'starter.controllers','starter.services','starter.directives','ngCordova',
   'ui.bootstrap','angularValidator'])
var controllers = angular.module('starter.controllers', []);
starter.run(function(OpenFB,$window,$http,$rootScope,$state,$ionicPlatform,$ionicPopup,$ionicHistory,
$ionicLoading,$cordovaDevice,ParseConfiguration, stripeCheckout,Products,LocalDb,UsersService,
MovieTheatersService,ShowsService,OrdersService,Brightness) {
   var notificationOpenedCallback = function(jsonData) {
      alert("Notification received:\n" + JSON.stringify(jsonData));
      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    };
    // Update with your OneSignal AppId and googleProjectNumber before running.7a59f314-9998-4562-b671-705115b84989
    //

  document.addEventListener('deviceready', function() { 
    window.plugins.OneSignal.init("5ecdc830-bc95-42f8-826e-5930697d8c70",
                                   {googleProjectNumber: "925888155353"},
                                   notificationOpenedCallback);
   });

  Parse.initialize(ParseConfiguration.applicationId, ParseConfiguration.javascriptKey);

  $rootScope.$on('$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {
      console.log('event');
      console.log('$stateChangeError ' + JSON.stringify(error));
      if (error && error.error === "noUser") {
        event.preventDefault();      
          $window.localStorage.clear();    
          $window.localStorage = $rootScope =  {};           
          LocalDb.setObject('user',{});
          LocalDb.setObject('currentOrder',{});
          LocalDb.setObject('username',{});
          LocalDb.setObject('order',[]);
          LocalDb.setObject('currentSelection',{});
          LocalDb.setObject('currentLocation',{});
          LocalDb.set('Logout',false);
          $state.go('welcome', {});
      }
    });

  $ionicPlatform.ready(function() {
       Brightness.set(5);
// //     // After device ready, create a local alias
// var push = PushNotification.init({
//     android: {
//         senderID: "12345679"
//     },
//     ios: {
//         alert: "true",
//         badge: "true",
//         sound: "true"
//     },
//     windows: {}
// });

// push.on('registration', function(data) {
//     // data.registrationId
// });

// push.on('notification', function(data) {
//     // data.message,
//     // data.title,
//     // data.count,
//     // data.sound,
//     // data.image,
//     // data.additionalData
// });

// push.on('error', function(e) {
//     // e.message
// });

    UsersService.init();
    LocalDb.set('Logout',false);
    stripeCheckout.setStripeKey('pk_live_IyEpCqUP2N7aU37TmfbWeWIB');
    OpenFB.init('901441409944945');
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);      
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


  });
})
starter.value('ParseConfiguration', {
        applicationId: "Nw47gz5W9KvrZMxKCaFV6GGfwBw4kC4BkFz4EB7f",
        javascriptKey: "IxR9CyMXcCSgvzglLIBKMFUJMdPhtQEFljr4l3IJ",
        serverURL:'http://159.203.204.76:1337/parse'
    })
starter.value('OrderConfiguration',{
Received:{1:'We’ve received your order'},
Processed:{2:'Order being processed'},
InRoute:{3:'Your order is in route'},
Arrived:{4:'Your order has arrived'}
})
starter.config(['$ionicConfigProvider', function($ionicConfigProvider) {
  // always display 'back' instead of previous view title
  $ionicConfigProvider.backButton.previousTitleText(false);
  // make android look like iOS
  $ionicConfigProvider.tabs.position('bottom').style('standard');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.navBar.positionPrimaryButtons('left');
  $ionicConfigProvider.navBar.positionSecondaryButtons('right');
}])

starter.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  //For header content
  .state('welcome', {
                url: '/welcome',
                cache: false,
                templateUrl: 'templates/header/welcome.html',
                controller: 'UsersController@welcome'
              })
  .state('register', {
                url: "/register",
                cache: false,
                templateUrl: 'templates/header/register.html',
                controller: 'UsersController@register'
              })
  .state('forgot', {
                url: "/forgot",
                cache: false,
                templateUrl: 'templates/header/forgot.html',
                controller: 'UsersController@forgot'
              })
  //For Menus content
            .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'templates/menus/menu.html',
                    controller: 'AppController@menu'
                })//product-types is food
            .state('app.product-types', {
                        url: "/product-types",
                        views: {
                          'menuContent': {
                            templateUrl: "templates/menus/product-types.html",
                            controller: "ProductsController@food"
                          }
                        },
                      cache: false
                      })
            .state('products', {
                          url: "/products/:id",
                          cache: false,
                          templateUrl: "templates/menus/products.html",
                          controller: "ProductsController@products"
                        })
            .state('app.movies', {
                          url: '/movies',
                          cache: false,
                          views: {
                              'menuContent': {
                                  templateUrl: 'templates/menus/movies.html',
                                  controller: 'AppController@movies'
                              }}
                      })
            .state('app.showtime', {
                          url: '/showtime/:id',
                          cache: false,
                          views: {
                              'menuContent': {
                                  templateUrl: 'templates/menus/showtime.html',
                                  controller: 'AppController@showtime'
                              }}
                      })
            .state('app.payment-method', {
                        url: "/payment-method",
                        cache: false,
                        views: {
                          'menuContent': {
                            templateUrl: "templates/menus/payment-method.html",
                            controller: "UsersController@payment-method"
                          }
                        }
                      })
            .state('app.rewards', {
                          url: '/rewards',
                          cache: false,
                          views: {
                              'menuContent': {
                                  templateUrl: 'templates/menus/rewards.html',
                                  controller: 'AppController@rewards'
                              }}
                      })
            .state('app.brightness-setting', {
                          url: '/brightness-setting',
                          cache: false,
                          views: {
                              'menuContent': {
                                  templateUrl: 'templates/menus/brightness-setting.html',
                                  controller: 'AppController@brightness-setting'
                              }}
                      })
            .state('app.payhistory', {
                        url: "/payhistory",
                        cache: false,
                        views: {
                          'menuContent': {
                            templateUrl: "templates/menus/payhistory.html",
                            controller: "CartController@payhistory"
                          }
                        }
                      })
            .state('payhistory-details', {
                          url: "/payhistory-details",
                          cache: false,
                          templateUrl: "templates/menus/payhistory-details.html",
                          controller: "CartController@payhistory-details"
                        })
            .state('app.account-setting', {
                        url: "/account-setting",
                        cache: false,
                        views: {
                          'menuContent': {
                            templateUrl: "templates/menus/account-setting.html",
                            controller: "UsersController@account-setting"
                          }
                        }
                      })
            .state('checkout', {
                        url: "/checkout",
                        cache: false,
                            templateUrl: "templates/cart/checkout.html",
                            controller: "CartController@checkout"
                         
                      })
.state('geolocation', {
                url: '/geolocation',
                cache: false,
                templateUrl: 'templates/geolocation.html',
                controller: 'AppController@geolocation'
              })

.state('startup', {
                url: '/startup',
                cache: false,
                templateUrl: 'templates/tutorial/startup.html',
                controller: 'TutorialsController@startup'
              })
  .state('how-it-work1', {
                url: '/how-it-work1',
                cache: false,
                templateUrl: 'templates/tutorial/how-it-work1.html',
                controller: 'TutorialsController@how-it-work1'
              })
  .state('how-it-work2', {
                url: '/how-it-work2',
                cache: false,
                templateUrl: 'templates/tutorial/how-it-work2.html',
                controller: 'TutorialsController@how-it-work2'
              })
  .state('important-page', {
                url: '/important-page',
                cache: false,
                templateUrl: 'templates/tutorial/important-page.html',
                controller: 'TutorialsController@important-page'
              })
  .state('test', {
                url: '/test',
                cache: false,
                templateUrl: 'templates/header/test.html',
                controller: 'AppController@test'
              });
    $urlRouterProvider.otherwise('/startup');
}).filter('trustUrl', function ($sce) {
      
      return function(url) {
        if(undefined !== url){
        return $sce.trustAsResourceUrl(url);
        }
      };

    });
window.addEventListener('message', function(event){
            switch(event.data.action){
                case 'finishFbAuth':
                    openFB.oauthCallback(event.data.params.url);
                break;
            }
});