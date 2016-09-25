angular.module('starter.directives', [])
.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
    return {
      require: '^form',
      restrict: 'A',
      link: function(scope, element, attrs, form) {
        form.$submitted = false;
        var fn = $parse(attrs.onValidSubmit);
        element.on('submit', function(event) {
          scope.$apply(function() {
            element.addClass('ng-submitted');
            form.$submitted = true;
            if (form.$valid) {
              if (typeof fn === 'function') {
                fn(scope, {$event: event});
              }
            }
          });
        });
      }
    }
 
  }])
  .directive('validated', ['$parse', function($parse) {
    return {
      restrict: 'AEC',
      require: '^form',
      link: function(scope, element, attrs, form) {
        var inputs = element.find("*");
        for(var i = 0; i < inputs.length; i++) {
          (function(input){
            var attributes = input.attributes;
            if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
              var field = form[attributes.name.value];
              if (field != void 0) {
                angular.element(input).bind('blur',function(){
                  scope.$apply(function(){
                    field.$blurred = true;
                  })
                });
                scope.$watch(function() {
                  return form.$submitted + "_" + field.$valid + "_" + field.$blurred;
                }, function() {console.log(arguments);
                  if (!field.$blurred && form.$submitted != true) return;
                  var inp = angular.element(input);
                  if (inp.hasClass('ng-invalid')) {
                    element.removeClass('has-success');
                    element.addClass('has-error');
                  } else {
                    element.removeClass('has-error').addClass('has-success');
                  }
                });
              }
            }
          })(inputs[i]);
        }
      }
    }
  }])
.directive('ionCart',['Products', function(Products){
    var link = function(scope, element, attr) {
      scope.$watch('products.length', function(newVal, oldVal){
        Products.updateTotal();
        scope.emptyProducts = newVal > 0 ? false : true; 
      });
      if(scope.products)
      scope.emptyProducts = scope.products.length ? false : true;
        else
      scope.emptyProducts = false;
      

      scope.addProduct = function(product) {
        Products.addOneProduct(product);
      };

      scope.removeProduct = function(product){
          product.purchaseQuantity <= 1 ? Products.removeProduct(product) : Products.removeOneProduct(product);
      };
    };

    return {
      restrict: 'AEC',
      templateUrl: 'templates/views/cart-item.html',
      link: link,
      scope: {
        products: '='
      }
    };
  }])
.directive('ionCartView',['Products', function(Products){
    var link = function(scope, element, attr) {
      scope.$watch('products.length', function(newVal, oldVal){
        Products.updateTotal();
        scope.emptyProducts = newVal > 0 ? false : true; 
      });
      if(scope.products)
      scope.emptyProducts = scope.products.length ? false : true;
        else
      scope.emptyProducts = false;
      

      scope.addProduct = function(product) {
        Products.addOneProduct(product);
      };

      scope.removeProduct = function(product){
          product.purchaseQuantity <= 1 ? Products.removeProduct(product) : Products.removeOneProduct(product);
      };
    };

    return {
      restrict: 'AEC',
      templateUrl: 'templates/views/cart-item-view.html',
      link: link,
      scope: {
        products: '='
      }
    };
  }])
.directive('ionProductImage',['$timeout', '$ionicModal', '$ionicSlideBoxDelegate', function($timeout, $ionicModal, $ionicSlideBoxDelegate){
    var link = function(scope, element, attr) {

      scope.closeModal = function() {
        scope.modal.hide();
        scope.modal.remove();
      };

      element.on('click', function(){
        $ionicModal.fromTemplateUrl('templates/views/partials/cart-image-modal.html', {
          animation: 'slide-left-right',
          scope: scope
        })
        .then(function(modal){
          scope.modal = modal;
          scope.modal.show();
          $timeout( function() {
            $ionicSlideBoxDelegate.update();
          });
        });

      });

    };

    return {
      restrict: 'A',
      link: link,
      scope: '='
    };
  }])

  // IONIC CHECKOUT DIRECTIVE
.directive('ionCartFooter',['$state',  function($state){
    var link = function(scope, element, attr) {

      element.addClass('bar bar-footer bar-dark');
      element.on('click', function(e){
        if (scope.path) {
          $state.go(scope.path);
        }
      });

      element.on('touchstart', function(){
        element.css({opacity: 0.8});
      });

      element.on('touchend', function(){
        element.css({opacity: 1});
      });
    };

    return {
      restrict: 'AEC',
      templateUrl: 'templates/views/cart-footer.html',
      scope: {
        path : '=path'
      },
      link: link
    };
  }])

  // IONIC PURCHASE DIRECTIVE
.directive('ionCheckout',['Products', function(Products){
    var link = function(scope, element, attr) {
      scope.$watch(function(){
        return Products.total;
      }, function(){
        scope.total = Products.total;
      });

      scope.checkout = Products.checkout;
      //*** Total sum of products in usd by default ***\\
      scope.total = Products.total;
      
      //*** Add address input fields when has-address attribute is on ion-purchase element ***\\
      if (element[0].hasAttribute('has-address')) {scope.hasAddressDir = true;}

      //*** Add email input field when has-email attribute is on ion-purchase element ***\\
      if (element[0].hasAttribute('has-email')) { scope.hasEmailDir = true; }

      //*** Add name input fields when has-name attribute is on ion-purchase element ***\\
      if (element[0].hasAttribute('has-name')) { scope.hasNameDir = true;}
      //Add card entry from saved card:TODO
    };

    return {
      restrict: 'AEC',
      templateUrl: 'templates/views/checkout.html',
      link: link
    };
  }])

.directive('ionGallery', ['Products',  function(Products){
    var link = function(scope, element, attr) {

      scope.addToCart = function(product){
        Products.addToCart(product);
      };
    };

    return {
      restrict: 'AEC',
      templateUrl: 'templates/views/gallery-item.html',
      link: link,
      scope: {
        products: '='
      }
    };

  }])

  //IONIC PURCHASE FOOTER DIRECTIVE
.directive('ionCheckoutFooter',['$compile', 'Products', 'stripeCheckout', 'CheckoutValidation','$ionicLoading',
   function($compile, Products, stripeCheckout, CheckoutValidation,$ionicLoading){
    var link = function(scope, element, attr) {
      scope.checkout = Products.checkout;
      scope.processCheckout = stripeCheckout.processCheckout;
      scope.stripeCallback = stripeCheckout.stripeCallback;

      element.addClass('bar bar-footer bar-dark');

      element.on('click', function(){
        $ionicLoading.show({
           content: 'Order processing...',
           animation: 'fade-in',
           showBackdrop: true,
           maxWidth: 200,
           showDelay: 0
           });
        if (CheckoutValidation.checkAll(scope.checkout)) {

          scope.processCheckout(scope.checkout, scope.stripeCallback);
          $ionicLoading.hide();
        } else {
          var ionPurchaseSpan = document.getElementsByTagName('ion-checkout')[0].children[0];
          angular.element(ionPurchaseSpan).html('You have invalid fields:').css({color: '#ED303C', opacity: 1});
          $ionicLoading.hide();
        }
      });

      element.on('touchstart', function(){
        element.css({opacity: 0.8});
      });

      element.on('touchend', function(){
        element.css({opacity: 1});
      });
    };

    return {
      restrict: 'AEC',
      templateUrl: 'templates/views/checkout-footer.html',
      link: link
    };
  }])


  //ADDITIONAL CONTENT DIRECTIVES

  //CHECKOUT CARD GROUP
.directive('checkoutCard',[ function(){
    var link = function(scope, element, attr) {

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/card-form.html'
    };

  }])

  // CARD NUM INPUT
.directive('cardNumInput',['$timeout', 'CheckoutValidation', function($timeout, CheckoutValidation){
    var link = function(scope, element, attr) {
      var input = element.children()[0].children[0];
      var icon = element.children()[0].children[1];
      scope.onNumBlur = function(){
        if (!scope.checkout.cc) {return;}
        angular.element(icon).removeClass('ion-card');
        angular.element(icon).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateCreditCardNumber(scope.checkout.cc)) {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };

      scope.onNumFocus = function(){
        angular.element(icon).removeClass('ion-checkmark-round ion-close-round');
        angular.element(icon).addClass('ion-card').css({color: '#333'});
      };
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/card-num-input.html'
    };
  }])

  // CARD EXPIRATION INPUT
.directive('cardExpInput',['$timeout', 'CheckoutValidation', function($timeout, CheckoutValidation){
    var link = function(scope, element, attr) {
      var input = element.children()[0].children[0];
      var icon = element.children()[0].children[1];
      scope.onExpBlur = function(){
        if (!scope.checkout.exp) {return;}
        angular.element(icon).addClass('ion-loading-d');
        $timeout(function(){
          if (!scope.checkout.exp || !CheckoutValidation.validateExpiry(scope.checkout.exp.slice(0,2), scope.checkout.exp.slice(3))) {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };

      scope.onExpFocus = function(){
        angular.element(icon).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/card-exp-input.html'
    };

  }])

  //CARD CVC INPUT
.directive('cardCvcInput',['$timeout', 'CheckoutValidation',  function($timeout, CheckoutValidation){
    var link = function(scope, element, attr) {
      var input = element.children()[0].children[0];
      var icon = element.children()[0].children[1];
      scope.onCvcBlur = function(){
        if (!scope.checkout.cvc) {return;}
        angular.element(icon).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateCVC(scope.checkout.cvc)) {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };

      scope.onCvcFocus = function(){
        angular.element(icon).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/card-cvc-input.html'
    };
  }])

  // ADDRESS GROUP

.directive('checkoutAddress',[ function(){
    var link = function(scope, element, attr) {

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/address.html'
    };

  }])

  //ADDRESS LINE ONE INPUT
.directive('addressOneInput',[ function(){
    var link = function(scope, element, attr) {

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/address-line-one.html'
    };
  }])

  // ADDRESS LINE TWO INPUT
.directive('addressTwoInput',[ function(){
    var link = function(scope, element, attr) {

      scope.onAddrTwoBlur = function(){

      };

      scope.onAddrTwoFocus = function(){

      };

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/address-line-two.html'
    };
  }])

  //CITY INPUT
.directive('cityInput',[ function(){
    var link = function(scope, element, attr) {
      scope.onCityBlur = function(){

      };

      scope.onCityFocus = function(){

      };

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/city-input.html'
    };
  }])

  // STATE INPUT
.directive('stateInput',[ function(){
    var link = function(scope, element, attr) {
      scope.onStateBlur = function(){

      };

      scope.onStateFocus = function(){

      };

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/state-input.html'
    };
  }])

  //ZIP INPUT
.directive('zipInput',['$timeout', 'CheckoutValidation',  function($timeout, CheckoutValidation){
    var link = function(scope, element, attr) {
      var icon = element.children()[0].children[1];
      scope.onZipBlur = function(){
        if (!scope.checkout.zipcode) {return;}
        angular.element(icon).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateZipcode(scope.checkout.zipcode)) {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };

      scope.onZipFocus = function(){
        angular.element(icon).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/zipcode-input.html'
    };
  }])

  //NAME GROUP

  .directive('checkoutName',[ function(){
    var link = function(scope, element, attr) {

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/name-input.html'
    };

  }])


  //FIRST NAME
  .directive('lastNameInput',[ function(){
    var link = function(scope, element, attr) {

    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/first-name-input.html'
    };

  }])

  //LAST NAME
  .directive('firstNameInput',[ function(){
    var link = function(scope, element, attr) {

    };
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/last-name-input.html'
    };
  }])
  .directive('checkoutEmail',['$timeout', 'CheckoutValidation', function($timeout, CheckoutValidation){
    var link = function(scope, element, attr) {
      var icon = element.children()[1].children[1];
      scope.onEmailBlur = function(){
        if (!scope.checkout.email) {return;}
        angular.element(icon).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateEmail(scope.checkout.email)) {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icon).removeClass('ion-loading-d');
            angular.element(icon).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };

      scope.onEmailFocus = function(){
        angular.element(icon).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'templates/views/partials/email-input.html'
    };
  }])
  // CUSTOMIZATION DIRECTIVES

  .directive('mouseDownUp', function(){
    var link = function(scope, element, attr) {

      element.on('touchstart', function(){
        element.css({opacity: 0.5});
      });

      element.on('touchend', function(){
        element.css({opacity: 1});
      });

    };

    return {
      restrict: 'AC',
      link: link
    };
  })
.directive('cartAdd', ['$timeout', function($timeout){
    var link = function(scope, element, attr){

      scope.addText = '';

      element.on('click', function(){
        scope.addText = 'Added.........';
        element.addClass('gallery-product-added');
        $timeout(function(){
          scope.addText = '';
          element.removeClass('gallery-product-added');
        }, 1000);
      });
    };

    return {
      restrict: 'AC',
      link: link,
      scope: true
    };
  }]);