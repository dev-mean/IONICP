controllers.controller('UsersController@welcome', 
 function(OpenFB,LocalDb,UsersService,GeolocationService,MovieTheatersService,TwitterService,$window,
  $rootScope,$scope, $state,$stateParams,$ionicPopup,$ionicLoading, $ionicHistory,$cordovaOauth,$cordovaDevice,
 $ionicSideMenuDelegate,$http,$ionicPlatform,Products,Brightness,$q) 
  {
    document.addEventListener("deviceready", function () {
    //screen.lockOrientation('landscape');
    screen.lockOrientation('portrait');
    Brightness.set(0.75);
  if(LocalDb.get('Logout')==='false')
  {
    if(LocalDb.getObject('user').id!==undefined)
    {
      $state.go('app.product-types');
    }
  }
  else
  {
    console.log(JSON.stringify('logout'));
    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });        
    $window.localStorage.clear();    
    $window.localStorage = $rootScope =  {};           
    LocalDb.setObject('user',{});
    LocalDb.setObject('currentOrder',{});
    LocalDb.setObject('username',{});
    LocalDb.setObject('order',[]);
    LocalDb.setObject('currentSelection',{});
    LocalDb.setObject('currentLocation',{});
    Products.galleryProducts = [];
    Products.cartProducts = [];
    Products.checkout = {};
    Products.total=0.0;  
        UsersService.logout().then(
           function () 
           {
           console.log(LocalDb.get('Logout'));
           },
           function (_error) 
           { 
            console.log(LocalDb.get('Logout'));
           });      
  }
 var InputPayLoad={TheaterID:'QXnb6ec6D3',ShowID:'PGrnC7OJeB',EmployeeID:'Y6ZJelKryF',UserID:'2cjIajcK8d',TheaterName:'Bluelight cinema 5'};
    LocalDb.setObject('currentSelection',InputPayLoad);
    LocalDb.set('firstLoad',true);
    LocalDb.set('IsSearched',false);
    LocalDb.set('Logout',true);
    var currentLocation={};
    currentLocation.latitude=37.323494;
    currentLocation.longitude=-122.047409;
    LocalDb.setObject('currentLocation',currentLocation);
    LocalDb.set('CheckShowTime',0);
    $scope.error = {};
    $scope.myCustomValidator = function(text){      
                    return true;
                };
            $scope.passwordValidator = function(password) {

                if(!password){return;}
                
                if (password.length < 6) {
                    return "at least 6 characters";
                }

                if (!password.match(/[A-Z]/)) {
                     return "at least one capital letter";
                }
                if (!password.match(/[a-z]/)) {
                     return "at least one small letter";
                }
                if (!password.match(/[0-9]/)) {
                     return "at least one number";
                }

                return true;
            };
    $scope.user = {
    username: '',
    password: ''
    };
    $scope.login = function(form) 
    {
      document.addEventListener("deviceready", function () {
      if(form.$valid) 
        {
           $ionicLoading.show({template: '<img src="img/spiner.gif">'});
           UsersService.init(true);
           UsersService.login($scope.user).then(function(successUser)
           {
              $rootScope.user=LocalDb.getObject('user');
                                //if(parsePlugin!==undefined)
                                //  {
                                    // var q = $q.defer();
                                    // parsePlugin.getInstallationId(
                                    // function(InstallationId) {                                      
                                    // var _Installation = Parse.Object.extend("_Installation");
                                    // var my_Installation = new Parse.Query(_Installation);
                                    // //my_Installation.equalTo("user_id", user.id);
                                    // my_Installation.equalTo("installationId", InstallationId);
                                    // my_Installation.find({
                                    //   success: function (success_Installations)
                                    //     {
                                    //       if(success_Installations.length>0)
                                    //         {
                                    //           var uuid=$cordovaDevice.getUUID();
                                    //           var success_Installation=success_Installations[0];
                                    //           success_Installation.set("user_id",LocalDb.getObject('user').id);
                                    //           success_Installation.set("appIdentifier",uuid);
                                    //           success_Installation.save();
                                    //         }
                                    //     },
                                    //   error:function(success_Installations,error)
                                    //     {
                                    //       q.reject(error);
                                    //     }
                                    // });
                                    // }, function(e){
                                    //   q.reject(e);
                                    // });
                                //  }
                                //  else
                                //    q.reject('parsePlugin not found');                                
              $ionicLoading.hide();
              LocalDb.set('Step',1);
              $scope.currentSelection=LocalDb.getObject('currentSelection');
              console.log('currentSelection'+JSON.stringify($scope.currentSelection));
              $state.go('app.product-types');
           },function(error)
           {
              LocalDb.set('Logout',true);
              $ionicLoading.hide();
              if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});
           });        
         }
         });
    };
    $scope.forgot = function() 
    {
      $state.go('forgot');
    };
    $scope.facebookLogin = function () 
    {
      facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
    };
    $scope.twitterLogin = function () 
      {
        $state.go('geolocation');
    };
    $scope.parseRegister = function() {
    $state.go('register');
    };
    });

 //This is the success callback from the login method
                var fbLoginSuccess = function(response) {
                    if (!response.authResponse){
                      fbLoginError("Cannot find the authResponse");
                      facebookConnectPlugin.logout(function(){},function(fail){});
                      return;
                    }

                    var authResponse = response.authResponse;

                    getFacebookProfileInfo(authResponse)
                    .then(function(profileInfo) {
                    console.log(profileInfo.email);
                      $scope.creds = {
                                  facebookID: profileInfo.id,
                                  first_name: profileInfo.name.split(' ')[0],
                                  last_name: profileInfo.name.split(' ')[1],
                                  email: profileInfo.email,
                                  username: profileInfo.email,
                                  password: profileInfo.id
                        };
                        UsersService.init(true);
                        UsersService.registerByFB(result.data).then(function(successUser)
                          { 
                            $ionicLoading.hide();
                            LocalDb.set('Step',1);
                            $scope.currentSelection=LocalDb.getObject('currentSelection');
                            console.log('FBcurrentSelection'+JSON.stringify($scope.currentSelection));
                            $state.go('app.product-types');
                          },function(error)
                          {
                          LocalDb.set('Logout',true);
                          $ionicLoading.hide();
                          if(error.code===100)
                          error="Please check your network connections!!";
                          $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

                          });
                    }, function(fail){
                      //fail get profile info
                      console.log('profile info fail', fail);
                      facebookConnectPlugin.logout(function(){},function(fail){});
                    });
                  };


                  //This is the fail callback from the login method
                var fbLoginError = function(error){
                    console.log('fbLoginError');
                    console.log(JSON.stringify(error));
                     facebookConnectPlugin.logout(function(){},function(fail){});
                    $ionicLoading.hide();
                  };

                  //this method is to get the user profile info from the facebook api
                var getFacebookProfileInfo = function (authResponse) {
                    var info = $q.defer();

                    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
                      function (response) {
                        console.log(JSON.stringify(response));
                        info.resolve(response);
                      },
                      function (response) {
                        console.log(JSON.stringify(response));
                        info.reject(response);
                      }
                    );
                    return info.promise;
                  };  
});
controllers.controller('UsersController@register', 
 function(LocalDb,UsersService,$ionicPopup, $scope, $state,$stateParams, $rootScope,$ionicLoading,
  $ionicHistory,$ionicSideMenuDelegate,$cordovaCamera,Brightness) {
 'use strict';
 $scope.dob={}; 
 $scope.dob.D=0;
 $scope.dob.M=0;
 $scope.dob.Y=0;
 $scope.years=[];
 $scope.days=[];
  for (var i = 2007; i > 1916; i--) {
    $scope.years.push({id: i, name: ''+i});
  }
$scope.daysgeneration =function()
{    
  $scope.ldom=0;
  $scope.days=[];
  if(parseInt($scope.dob.M,10)===2)
  {
    $scope.ldom=29;
  }
  else 
  {
    if(parseInt($scope.dob.M,10)%2!==0)
    {
      $scope.ldom=31;
    }else if(parseInt($scope.dob.M,10)%2===0)
    {
      $scope.ldom=30;
    }
  }
  for (var i = 1; i <= $scope.ldom; i++) {
    $scope.days.push({id: i, name: ''+i});
  }
};

 LocalDb.set('firstLoad',true);
 document.addEventListener("deviceready", function () {
      //screen.lockOrientation('landscape');
      Brightness.set(1);
      screen.lockOrientation('portrait');
      $scope.myCustomValidator = function(text){      
                    return true;
                };
      $scope.myZipValidator = function(text){ 

                    return true;
                };
      $scope.zipValidator = function(zip) {

                if(!zip){return;}
                
                if (zip.length < 5) {
                    return "at least 5 characters";
                }

                if (zip.match(/[A-Z]/)) {
                     return "only numbers";
                }
                if (zip.match(/[a-z]/)) {
                     return "only numbers";
                }
                if (!zip.match(/[0-9]/)) {
                     return "at least one number";
                }

                return true;
            };
            $scope.passwordValidator = function(password) {

                if(!password){return;}
                
                if (password.length < 6) {
                    return "at least 6 characters";
                }

                if (!password.match(/[A-Z]/)) {
                     return "at least one capital letter";
                }
                if (!password.match(/[a-z]/)) {
                     return "at least one small letter";
                }
                if (!password.match(/[0-9]/)) {
                     return "at least one number";
                }

                return true;
            };
 $ionicSideMenuDelegate.canDragContent(false);
 $scope.user = {
        username:"",
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail:"",
        password: "",
        confirmPassword: "",
        dob:"",
        zip:""        
      };
 
 $scope.pass=true;
 
 $scope.onRegisterTapped = function() {
    $scope.user.dob = $scope.dob.D.id+'/'+$scope.dob.M+'/'+$scope.dob.Y.id;
    if($scope.user.dob==="")
      return;
    $scope.user.username=$scope.user.email;
    $ionicLoading.show({
                template: '<img src="img/spiner.gif">'
            });
    UsersService.init(true);
    UsersService.register($scope.user).then(
      function(successUser)
       {
          $rootScope.user=LocalDb.getObject('user');
          $ionicLoading.hide();
          $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: successUser});
          LocalDb.setObject('currentOrder',{});
          LocalDb.setObject('order',[]);
          LocalDb.set('Logout',false);
          LocalDb.set('Step',1);
          $state.go('app.product-types');
       },
      function(error)
       {
          LocalDb.set('Logout',true);
          $ionicLoading.hide();
              if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

       });  
 };
  $scope.back = function() {
  $state.go('welcome');
  };
  });
});
controllers.controller('UsersController@forgot', 
 function(LocalDb,UsersService,$scope, $state,$rootScope,$cordovaDialogs,$ionicLoading,$ionicPopup,Brightness) {
  'use strict';
  LocalDb.set('firstLoad',true);
  document.addEventListener("deviceready", function () {
      //screen.lockOrientation('landscape');
      screen.lockOrientation('portrait');
  Brightness.set(1);
 $scope.user=$scope.user||{};
 $scope.state=$scope.state||{};
 $scope.error=$scope.error||{};
  $scope.onResetTapped = function(invalid) {
  if(invalid===false) 
  {
   UsersService.passwordReset($scope.user.email).then(
    function(successUser)
     {
        $ionicLoading.hide();
        $scope.state.success = true;
     },
    function(err) 
     {
       $ionicLoading.hide();
       if (err.code === 125) {
        $scope.error.message = 'Email address '+$scope.user.email+' does not exist';
       }
       else if(err.code === 205)
       {
        $scope.error.message = 'no user found with email '+$scope.user.email;
       }
       else {
        $scope.error.message = 'An unknown error has occurred, please try again';
       }
       $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: $scope.error.message});
     });
  }

  };
 $scope.onLoginTapped = function(forgot) {
  $state.go("welcome");
 };
 $scope.back = function() {
  $state.go('welcome');
  };
});
});
controllers.controller('UsersController@account-setting',
 function($window,$scope, $state, $stateParams, $rootScope,
  $ionicHistory,$ionicSideMenuDelegate,$ionicLoading, 
	 $ionicPopup,$cordovaDialogs,$cordovaCamera, 
	 LocalDb,UsersService,OpenFB,Products,$ionicModal) 
 {
 'use strict';
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
 document.addEventListener("deviceready", function () {
 LocalDb.set('firstLoad',true);
 if(LocalDb.get('Logout')===true)
  {
    $state.go('welcome');
  }
  $scope.checkout=function()
    {
      $state.go('checkout');
    };
    LocalDb.set('Step',7);
      //screen.lockOrientation('landscape');
      screen.lockOrientation('portrait');

 $scope.IsCart=Products.cartProducts.length>0?true:false;
 $ionicSideMenuDelegate.canDragContent(true);
 //$scope.countries=Countries.getAll();
 $scope.IsContainer=true;
 $scope.imgURI = '';
 var CurrentUser=LocalDb.getObject('user');
 if(CurrentUser.loginMethod==='facebook')
  $scope.IsContainer=false;
 else
  $scope.IsContainer=true;
 $scope.IsContainerChange = function () {
 if(CurrentUser.loginMethod==='facebook')
  $scope.IsContainer=false;
 else
  $scope.IsContainer=true;
 };
 $scope.user = {
  id:CurrentUser.id,
  username:CurrentUser.username,
  firstName: CurrentUser.firstName,
  lastName: CurrentUser.lastName,
  
  email: CurrentUser.email,
  confirmEmail: CurrentUser.email,
  password: '',
  confirmPassword: '',
  // age: CurrentUser.age,
  // address: CurrentUser.address,
  // city: CurrentUser.city,
  // state: CurrentUser.state,
  // zip: CurrentUser.zip,
  profilePic: ($scope.IsContainer===true)?CurrentUser.profilePic:CurrentUser.icon
 };


 $scope.onCameraTapped = function() {
  var options = {
   quality: 75,
   destinationType: Camera.DestinationType.DATA_URL,
   sourceType: Camera.PictureSourceType.CAMERA,
   allowEdit: true,
   encodingType: Camera.EncodingType.JPEG,
   targetWidth: 300,
   targetHeight: 300,
   popoverOptions: CameraPopoverOptions,
   saveToPhotoAlbum: false
  };
 
   $cordovaCamera.getPicture(options).then(function (imageData) {
   $scope.imgURI = "data:image/jpeg;base64," + imageData;
   $scope.user.imageData = imageData;
   //$scope.IsContainer=true;
   }, function (err) {
   // An error occured. Show a message to the user
   });
 };

 $scope.onGalleryTapped = function() {
  var options = {
   quality: 75,
   destinationType: Camera.DestinationType.DATA_URL,
   sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
   allowEdit: true,
   encodingType: Camera.EncodingType.JPEG,
   targetWidth: 300,
   targetHeight: 300,
   popoverOptions: CameraPopoverOptions,
   saveToPhotoAlbum: false
  };
 
   $cordovaCamera.getPicture(options).then(function (imageData) {
   $scope.imgURI = "data:image/jpeg;base64," + imageData;
   $scope.user.imageData = imageData;
   //$scope.IsContainer=true;
   }, function (err) {
   // An error occured. Show a message to the user
   });
 };

  $scope.onPhotoTapped= function() {
     $ionicPopup.confirm({
               title: 'Please choose source!!',
               template: '',
               buttons: [              
                {
                  text: 'Cemera',
                  type: 'button button-block button-dark bg-grey b',
                  onTap: function(res) {
                           if(res) 
                           {                   
                              $scope.onCameraTapped();
                           }                         
                         }
                },
                {
                  text: 'Gallery',
                  type: 'button button-block button-dark bg-grey b',
                  onTap: function(res) {
                           if(res) 
                           {                
                             $scope.onGalleryTapped();
                           }
                         }
                }
              ]
             });
  };
 $scope.onSaveTapped = function(profile) {
  $ionicLoading.show({template: '<img src="img/spiner.gif">'});
  UsersService.init();
 if(CurrentUser.loginMethod==='facebook')
 {
 UsersService.saveProfileForFB($scope.user).then(function(successUser)
 {
  $ionicLoading.hide();
  $ionicPopup.alert({ 
  title: successUser,
  okType: 'button button-block button-dark bg-grey b'
  });
 },function(error)
 {
  $ionicLoading.hide();
              if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});
  
 });
 }
 else
 {
  if($scope.user.imageData)
  {
   UsersService.saveProfileWithPhoto($scope.user).then(function(successUser)
  {
   $ionicLoading.hide();
   $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: successUser});
  },function(error)
  {
   $ionicLoading.hide();
              if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

  });
  }
  
  else
  {
   UsersService.saveProfileWithOutPhoto($scope.user).then(function(successUser)
  {
   $ionicLoading.hide();
   $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: successUser});
  },function(error)
  {
   $ionicLoading.hide();
              if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

  });
  }
 }
 };
  $scope.onLogoutTapped = function()
  {
    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    UsersService.logout().then(
           function () 
           {             
             if(LocalDb.getObject('user').loginMethod==='facebook')
              {
                OpenFB.logout();
              }  
              LocalDb.set('Logout',true);
             $state.go('welcome',{reload:true});
           },
           function (_error) 
           {                      
             if(LocalDb.getObject('user').loginMethod==='facebook')
              {
                OpenFB.logout();
              }  
              LocalDb.set('Logout',true);
             $state.go('welcome',{reload:true});
         });            
  };
}); 
});
controllers.controller('UsersController@payment-method',
 function($scope, $state, $stateParams, $rootScope,
  $ionicHistory,$ionicSideMenuDelegate,$ionicLoading, 
   $ionicPopup,$cordovaDialogs,$cordovaCamera, 
   LocalDb,UsersService,PaymentMethodService,Products) {
 'use strict';
 document.addEventListener("deviceready", function () {
 LocalDb.set('firstLoad',true);
 if(LocalDb.get('Logout')===true)
  {
    $state.go('welcome');
  }
   $scope.checkout=function()
    {
      $state.go('checkout');
    };
    LocalDb.set('Step',8);
      //screen.lockOrientation('landscape');
      screen.lockOrientation('portrait');
    

 $scope.IsContainer=true;
 $scope.IsCart=Products.cartProducts.length>0?true:false;
 $scope.isCreditFormShown=false;
 $ionicSideMenuDelegate.canDragContent(true);
 $scope.card = {};
 var currentUser = LocalDb.getObject('user');
  if(currentUser.loginMethod==='facebook')
    $scope.IsContainer=false;
  else
    $scope.IsContainer=true;
 $scope.fullName=currentUser.firstName+" "+currentUser.lastName;
 $scope.profilePic=($scope.IsContainer===true)?currentUser.profilePic:currentUser.icon;
 //console.log($scope.profilePic);
 var InputPayLoad={}; 
 InputPayLoad.UserID=currentUser.id;
 $ionicLoading.show({template: '<img src="img/spiner.gif">'});
 PaymentMethodService.getCreditCard(InputPayLoad).then(function(successCreditCard)
  {
    if(successCreditCard.creditCardNumber!==undefined)
    {
      $scope.card.name=successCreditCard.creditCardName;
      $scope.card.number=successCreditCard.creditCardNumber;
      $scope.card.cvc=successCreditCard.creditCardCvc;
      $scope.card.exp_month=successCreditCard.creditCardExpMonth;
      $scope.card.exp_year=successCreditCard.creditCardExpYear;
      if($scope.card.number!==undefined || $scope.card.number!==null )
      if($scope.card.number==='' ||$scope.card.number===' ')
        $scope.card.last4='XXXX';
      else
        $scope.card.last4=$scope.card.number.substring(12,16);
    }
    else
      $scope.card.last4='XXXX';
  $ionicLoading.hide();
  },function(error)
  {
   $ionicLoading.hide();
                 if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

  });
 $scope.onEditSaveTapped = function(credit) {
  $ionicLoading.show({template: '<img src="img/spiner.gif">'});
  InputPayLoad={};
  InputPayLoad.creditCardName=credit.name; 
  InputPayLoad.creditCardNumber=credit.number;
  InputPayLoad.creditCardCvc=credit.cvc; 
  InputPayLoad.creditCardExpMonth=credit.exp_month; 
  InputPayLoad.creditCardExpYear=credit.exp_year;
  InputPayLoad.UserID=currentUser.id;
  PaymentMethodService.saveCreditCard(InputPayLoad).then(function(successMessage)
  {
    $ionicLoading.hide();
    $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:successMessage});
    $scope.isCreditFormShown=true;
    if($stateParams.id===1)
      $state.go('checkout');
    else
    $state.reload();

  },function(error)
  {
   $ionicLoading.hide();
   $scope.isCreditFormShown=true;
                 if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

  });
 };

 $scope.onDeleteTapped = function() 
 {
  $ionicLoading.show({template: '<img src="img/spiner.gif">'});
    InputPayLoad={};
    InputPayLoad.UserID=currentUser.id;
    PaymentMethodService.deleteCreditCard(InputPayLoad).then(function(successMessage)
    {
      $ionicLoading.hide();
      $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:successMessage});
      $scope.isCreditFormShown=true;
      $state.reload();
    },function(error)
    {
     $ionicLoading.hide();
     $scope.isCreditFormShown=true;
                   if(error.code===100)
                error="Please check your network connections!!";
                $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: JSON.stringify(error)});

    });

  };
  });
});