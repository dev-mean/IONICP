angular.module('starter.filters', [])
.filter('ProductSubTypeSum', ['$window', function($window) {
  return function(input) {
  //var result=$window.parseInt(rate)*$window.parseInt(qty);
    return input;
  };
});