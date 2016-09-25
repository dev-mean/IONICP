function getDistance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}
angular.module('starter.services', [])
.factory('ProductTypesService', ['$q','$cordovaDevice',
        function ($q,$cordovaDevice) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                   document.addEventListener("deviceready", function () { uuid=$cordovaDevice.getUUID();});
                }
            return {
              getAll: function () 
                {
                        var q = $q.defer();
                        var ProductTypes = Parse.Object.extend("ProductTypes");
                        var myProductTypes = new Parse.Query(ProductTypes);                      
                        //myProductTypes.equalTo("EmployeeID", productTypesPayload.EmployeeID);
                        myProductTypes.ascending("SNo");
                        myProductTypes.find({
                            success:function (successProductTypes)
                            {
                                if(successProductTypes.length>0)
                                {
                                  var productTypes=[];
                                  for(var i=0;i<successProductTypes.length;i++)
                                  {
 
                                   productTypes.push({
                                   id:i+1,
                                   ProductTypeID:successProductTypes[i].id,
                                   ProductTypeName:successProductTypes[i].get('ProductTypeName'),
                                   ProductTypeDesc:successProductTypes[i].get('ProductTypeDesc'),
                                   ProductTypeImage:successProductTypes[i].get('ProductTypeImage')?successProductTypes[i].get('ProductTypeImage').url():''
                                  });            
                                  }
                                     q.resolve(productTypes);
                                }
                                else
                                q.resolve([]);
                            }, 
                            error:function(result,error)
                            {
                                q.reject(JSON.stringify(error));
                            } 
                        }); 
                        return q.promise;
                },
              getAllByTheaterID: function (ProductTypesPayload) 
                {

                        var q = $q.defer();
                        
                        // var productTypes=[];
                        //           for(var i=0;i<5;i++)
                        //           {
 
                        //            productTypes.push({
                        //            id:i+1,
                        //            ProductTypeID:'ID'+i,
                        //            ProductTypeName:'ProductTypeName'+i,
                        //            ProductTypeDesc:'ProductTypeDesc'+i,
                        //            ProductTypeImage:''
                        //           });            
                        //           }
                        // q.resolve(productTypes);

                        var ProductTypes = Parse.Object.extend("ProductTypes");
                        var myProductTypes = new Parse.Query(ProductTypes);                      
                        myProductTypes.equalTo("TheaterID", ProductTypesPayload.TheaterID);
                        myProductTypes.ascending("SNo");
                        myProductTypes.find({
                            success:function (successProductTypes)
                            {

                                if(successProductTypes.length>0)
                                {
                                  var productTypes=[];
                                  for(var i=0;i<successProductTypes.length;i++)
                                  {
 
                                   productTypes.push({
                                   id:i+1,
                                   ProductTypeID:successProductTypes[i].id,
                                   ProductTypeName:successProductTypes[i].get('ProductTypeName'),
                                   ProductTypeDesc:successProductTypes[i].get('ProductTypeDesc'),
                                   ProductTypeImage:successProductTypes[i].get('ProductTypeImage')?successProductTypes[i].get('ProductTypeImage').url():''
                                  });            
                                  }
                                     q.resolve(productTypes);
                                }
                                else
                                q.resolve([]);
                            }, 
                            error:function(result,error)
                            {
                                q.reject(JSON.stringify(error));
                            } 
                        }); 
                        return q.promise;
                }
            };
        }
])
.factory('ProductsService', ['$q','$cordovaDevice',
        function ($q,$cordovaDevice) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                    document.addEventListener("deviceready", function () {uuid=$cordovaDevice.getUUID();});
                }
            return {
                
                getAllByProductType: function (productsPayload) 
                {
                  //console.log(ProductTypeID);
                     var q = $q.defer();
                        var Products = Parse.Object.extend("Products");
                        var myProducts = new Parse.Query(Products);
                        myProducts.equalTo("ProductTypeID", productsPayload.ProductTypeID);
                        myProducts.ascending("ProductName");
                        myProducts.find({
                            success:function (successProducts)
                            {
                                if(successProducts.length>0)
                                {
                                  var products=[];
                                  for(var i=0;i<successProducts.length;i++)
                                  {
 
                                     products.push({
                                     id:i,
                                     ProductID:successProducts[i].id,
                                     ProductName:successProducts[i].get('ProductName'),
                                     ProductDesc:successProducts[i].get('ProductDesc'),
                                     ProductImage:successProducts[i].get('ProductImage')?successProducts[i].get('ProductImage').url():''
                                  });            
                                  }
                                     q.resolve(products);
                                }
                                else
                                q.resolve([]);
                            },//success find products
                            error:function(result,error)
                            {
                                q.reject(JSON.stringify(error));
                            }//error find products
                        });//find products
                        return q.promise;
                }
          };
        }
])
.factory('ProductSubTypeService', ['$q','$cordovaDevice',
        function ($q,$cordovaDevice) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                   document.addEventListener("deviceready", function () { uuid=$cordovaDevice.getUUID();});
                }
            return {
                getAllByProduct: function (productSubTypesPayload) 
                {
                 // console.log(productSubTypesPayload.ProductID);
                     var q = $q.defer();
                        var ProductSubTypes = Parse.Object.extend("ProductSubTypes");
                        var myProductSubTypes = new Parse.Query(ProductSubTypes);
                        myProductSubTypes.equalTo("ProductID", productSubTypesPayload.ProductID);
                        myProductSubTypes.ascending("ProductSubTypeName");
                        myProductSubTypes.find({
                            success:function (successProductSubTypes)
                            {
                                if(successProductSubTypes.length>0)
                                {
                                  var productSubTypes=[];
                                  for(var i=0;i<successProductSubTypes.length;i++)
                                  {
 
                                   productSubTypes.push({
                                   id:i,
                                   ProductSubTypeID:successProductSubTypes[i].id,
                                   ProductSubTypeName:successProductSubTypes[i].get('ProductSubTypeName'),
                                   ProductSubTypeDesc:successProductSubTypes[i].get('ProductSubTypeDesc'),
                                   ProductCost:successProductSubTypes[i].get('ProductCost'),
                                   ProductQty:0,
                                   Extras:successProductSubTypes[i].get('Extras') 
                                  });            
                                  }
                                     q.resolve(productSubTypes);
                                }
                                else
                                q.resolve([]);
                            },//success find productSubTypes
                            error:function(result,error)
                            {
                                q.reject(JSON.stringify(error));
                            }//error find productSubTypes
                        });//find productSubTypes
                        return q.promise;
                }
          };
        }
])
.factory('MovieTheatersService', ['$q','$cordovaDevice',
        function ($q,$cordovaDevice) 
        {

          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                    document.addEventListener("deviceready", function () {uuid=$cordovaDevice.getUUID();});
                }
            return {                
              getAllWithDistance: function (movieTheatersPayload) 
              {
                      var q = $q.defer();
                      //var userlocation = new Parse.GeoPoint({latitude: 36.9717108, longitude:-121.9688898});
                      var userlocation = new Parse.GeoPoint({latitude: movieTheatersPayload.latitude, longitude:movieTheatersPayload.longitude});
                      var MovieTheaters = Parse.Object.extend("MovieTheaters");
                      var myMovieTheaters = new Parse.Query(MovieTheaters);
                      myMovieTheaters.descending("location");
                      //myMovieTheaters.ascending("TheaterName");
                      //myMovieTheaters.withinMiles("location", userlocation, 100.000*1000);//.020*1000=20 meter
                      //myMovieTheaters.limit(10);
                      myMovieTheaters.find({
                      success:function (successMovieTheaters)
                      {
                          if(successMovieTheaters.length>0)
                          {
                            var movieTheaters=[];
                            for(var i=0;i<successMovieTheaters.length;i++)
                            {
                              var theaterLoc=successMovieTheaters[i].get('location');
                              var latLngB={};
                              latLngB.latitude=theaterLoc.latitude;
                              latLngB.longitude=theaterLoc.longitude;
                              var DistanceFromCurrent=getDistance(movieTheatersPayload.latitude,movieTheatersPayload.longitude,theaterLoc.latitude,theaterLoc.longitude,'K');
                                DistanceFromCurrent=DistanceFromCurrent.toFixed(2);
                                movieTheaters.push({
                                id:i+1,
                                TheaterID:successMovieTheaters[i].id,
                                CompanyName:successMovieTheaters[i].get('CompanyName'),
                                EmployeeID:successMovieTheaters[i].get('EmployeeID'),
                                TheaterName:successMovieTheaters[i].get('TheaterName'),
                                location:successMovieTheaters[i].get('location'),
                                Address:successMovieTheaters[i].get('Address'),
                                Image:successMovieTheaters[i].get('pic')?successMovieTheaters[i].get('pic').url():'',
                                Distance:DistanceFromCurrent
                            });            
                            }
                               q.resolve(movieTheaters);
                          }
                          else
                          q.resolve([]);
                      }, 
                      error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      } 
                        }); 
                        return q.promise;
              },
              getAllWithOutDistance: function (movieTheatersPayload) 
              {
                      var q = $q.defer();
                      var MovieTheaters = Parse.Object.extend("MovieTheaters");
                      var myMovieTheaters = new Parse.Query(MovieTheaters);
                      myMovieTheaters.ascending("location");
                      //myMovieTheaters.withinKilometers("location", userlocation, 1.000*1000);//.020*1000=20 meter
                      myMovieTheaters.limit(10);
                      myMovieTheaters.find({
                      success:function (successMovieTheaters)
                      {
                          if(successMovieTheaters.length>0)
                          {
                            var movieTheaters=[];
                            for(var i=0;i<successMovieTheaters.length;i++)
                            {
                                movieTheaters.push({
                                id:i+1,
                                TheaterID:successMovieTheaters[i].id,
                                EmployeeID:successMovieTheaters[i].get('EmployeeID'),
                                CompanyName:successMovieTheaters[i].get('CompanyName'),
                                TheaterName:successMovieTheaters[i].get('TheaterName'),
                                location:successMovieTheaters[i].get('location'),
                                Address:successMovieTheaters[i].get('Address'),
                                Image:successMovieTheaters[i].get('pic')?successMovieTheaters[i].get('pic').url():''
                            });            
                            }
                               q.resolve(movieTheaters);
                          }
                          else
                          q.resolve([]);
                      }, 
                      error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      } 
                        }); 
                        return q.promise;
              },
              getByID: function (movieTheatersPayload) 
              {
                      var q = $q.defer();
                      var MovieTheaters = Parse.Object.extend("MovieTheaters");
                      var myMovieTheaters = new Parse.Query(MovieTheaters);
                      myMovieTheaters.get(movieTheatersPayload.TheaterID,{
                      success:function (successMovieTheater)
                      {
                        
                        q.resolve({
                                TheaterID:successMovieTheater.id,
                                EmployeeID:successMovieTheater.get('EmployeeID'),
                                CompanyName:successMovieTheater.get('CompanyName'),
                                TheaterName:successMovieTheater.get('TheaterName'),
                                location:successMovieTheater.get('location'),
                                Address:successMovieTheater.get('Address'),
                                Image:successMovieTheater.get('pic')?successMovieTheater.get('pic').url():''
                            });
                      }, 
                      error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      } 
                        }); 
                        return q.promise;
              },
              getByLocation: function (movieTheatersPayload) 
                {
                  var q = $q.defer();
                  var userlocation = new Parse.GeoPoint({latitude: movieTheatersPayload.latitude, longitude:movieTheatersPayload.longitude});
                  var query = new Parse.Query("MovieTheaters");
                  query.withinKilometers("location", userlocation, 0.050);//.050*1000=50 meter
                  //query.limit(50);
                  //var myCollection = query.find();
                  query.find({
                    success: function(successMovieTheaters) {
                       if(successMovieTheaters.length>0)
                          {
                            var movieTheaters=[];
                            for(var i=0;i<successMovieTheaters.length;i++)
                            {                                
                                movieTheaters.push({
                                id:i+1,
                                TheaterID:successMovieTheaters[i].id,
                                EmployeeID:successMovieTheaters[i].get('EmployeeID'),
                                CompanyName:successMovieTheaters[i].get('CompanyName'),
                                TheaterName:successMovieTheaters[i].get('TheaterName'),
                                location:successMovieTheaters[i].get('location'),
                                Address:successMovieTheaters[i].get('Address'),
                                Image:successMovieTheaters[i].get('pic')?successMovieTheaters[i].get('pic').url():''
                            });            
                            }
                               q.resolve(movieTheaters);
                          }
                          else
                          q.resolve([]);
                        }, 
                    error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      } 
                    }); 
                  return q.promise;
                },
              getByLocationWithDistance: function (movieTheatersPayload) 
                {
                  var q = $q.defer();
                  var userlocation = new Parse.GeoPoint({latitude: movieTheatersPayload.latitude, longitude:movieTheatersPayload.longitude});
                  var query = new Parse.Query("MovieTheaters");
                  query.withinKilometers("location", userlocation, 0.050);//.050*1000=50 meter
                  //query.limit(50);
                  //var myCollection = query.find();
                  query.find({
                    success: function(successMovieTheaters) {
                       if(successMovieTheaters.length>0)
                          {
                            var movieTheaters=[];
                            for(var i=0;i<successMovieTheaters.length;i++)
                            {
                              var theaterLoc=successMovieTheaters[i].get('location');
                              var latLngB={};
                              latLngB.latitude=theaterLoc.latitude;
                              latLngB.longitude=theaterLoc.longitude;
                              var DistanceFromCurrent=getDistance(movieTheatersPayload.latitude,movieTheatersPayload.longitude,theaterLoc.latitude,theaterLoc.longitude,'K');
                              DistanceFromCurrent=DistanceFromCurrent.toFixed(2);                    
                                movieTheaters.push({
                                id:i+1,
                                TheaterID:successMovieTheaters[i].id,
                                EmployeeID:successMovieTheaters[i].get('EmployeeID'),
                                CompanyName:successMovieTheaters[i].get('CompanyName'),
                                TheaterName:successMovieTheaters[i].get('TheaterName'),
                                location:successMovieTheaters[i].get('location'),
                                Address:successMovieTheaters[i].get('Address'),
                                Image:successMovieTheaters[i].get('pic')?successMovieTheaters[i].get('pic').url():'',
                                Distance:DistanceFromCurrent
                            });            
                            }
                               q.resolve(movieTheaters);
                          }
                          else
                          q.resolve([]);
                        }, 
                    error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      } 
                    }); 
                  return q.promise;
                }
          };
        }
])
.factory('ShowsService', ['$q','$cordovaDevice',
        function ($q,$cordovaDevice) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                   document.addEventListener("deviceready", function () { uuid=$cordovaDevice.getUUID();});
                }
            return {                
              getAll: function () 
              {
                      var q = $q.defer();
                      var Shows = Parse.Object.extend("Shows");
                      var myShows = new Parse.Query(Shows);
                      myShows.find({
                      success:function (successShows)
                      {
                          if(successShows.length>0)
                          {
                            var shows=[];
                            for(var i=0;i<successShows.length;i++)
                            {
                                
                                shows.push({
                                id:i+1,
                                ShowID:successShows[i].id,
                                TheaterID:successShows[i].get('TheaterID'),
                                MovieName:successShows[i].get('MovieName'),
                                YoutubeCode:successShows[i].get('YoutubeCode'),
                                YoutubeURL:"https://www.youtube-nocookie.com/embed/"+successShows[i].get('YoutubeCode')+"?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1",
                                ShowTime:successShows[i].get('ShowTime'),
                                Image:successShows[i].get('ShowImage')?successShows[i].get('ShowImage').url():''
                            });            
                            }
                               q.resolve(shows);
                          }
                          else
                          q.resolve([]);
                      },
                      error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      }
                    });
                        return q.promise;
              },
              getByID: function (showsPayload) 
              {
                      var q = $q.defer();
                      var Shows = Parse.Object.extend("Shows");
                      var myShows = new Parse.Query(Shows);
                      myShows.get(showsPayload.ShowID,{
                      success:function (successShow)
                      {
                            q.resolve({
                                ShowID:successShow.id,
                                TheaterID:successShow.get('TheaterID'),
                                MovieName:successShow.get('MovieName'),
                                YoutubeCode:successShow.get('YoutubeCode'),
                                YoutubeURL:"https://www.youtube-nocookie.com/embed/"+successShow.get('YoutubeCode')+"?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1",
                                ShowTime:successShow.get('ShowTime'),
                                Image:successShow.get('ShowImage')?successShow.get('ShowImage').url():''
                            });
                      },
                      error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      }
                    });
                        return q.promise;
              },
              getForSearch: function (showsPayload) 
              {
                      var q = $q.defer();
                      var Shows = Parse.Object.extend("Shows");
                      var myShows = new Parse.Query(Shows);
                      myShows.equalTo("TheaterID", showsPayload.TheaterID);
                      myShows.find({
                      success:function (successShows)
                      {
                          if(successShows.length>0)
                          {
                            var shows=[];
                            for(var i=0;i<successShows.length;i++)
                            {                                
                                shows.push({name:successShows[i].get('MovieName'),id:successShows[i].id});            
                            }
                               q.resolve(shows);
                          }
                          else
                          q.resolve([]);
                      },
                      error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      }
                    });
                        return q.promise;
              },
              getByTheaterID: function (showsPayload) 
              {
                      var q = $q.defer();
                      var Shows = Parse.Object.extend("Shows");
                      var myShows = new Parse.Query(Shows);
                      myShows.equalTo("TheaterID", showsPayload.TheaterID);
                      myShows.find({
                      success:function (successShows)
                      {
                          if(successShows.length>0)
                          {
                            var shows=[];
                            for(var i=0;i<successShows.length;i++)
                            {
                                
                                shows.push({
                                id:i+1,
                                ShowID:successShows[i].id,
                                TheaterID:successShows[i].get('TheaterID'),
                                MovieName:successShows[i].get('MovieName'),
                                YoutubeCode:successShows[i].get('YoutubeCode'),
                                YoutubeURL:"https://www.youtube-nocookie.com/embed/"+successShows[i].get('YoutubeCode')+"?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1",
                                ShowTime:successShows[i].get('ShowTime'),
                                Image:successShows[i].get('ShowImage')?successShows[i].get('ShowImage').url():''
                            });            
                            }
                               q.resolve(shows);
                          }
                          else
                          q.resolve([]);
                      },
                      error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      }
                    });
                        return q.promise;
              }
          };
        }
])
.factory('PromoCodesService', ['$q','$cordovaDevice',
        function ($q,$cordovaDevice) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                   document.addEventListener("deviceready", function () { uuid=$cordovaDevice.getUUID();});
                }
            return {
                      getDiscount: function (promoCodesPayload) 
                        {
                                var q = $q.defer();
                                var PromoCodes = Parse.Object.extend("PromoCodes");
                                var myPromoCodes = new Parse.Query(PromoCodes);
                                myPromoCodes.equalTo("PromoCode", promoCodesPayload.PromoCode);
                                myPromoCodes.find({
                                success:function (successPromoCodes)
                                {
                                    if(successPromoCodes.length>0)
                                    {
                                      var successPromoCode=successPromoCodes[0];                                      
                                      q.resolve({
                                        AmountType:successPromoCode.get('AmountType'),
                                        Value:successPromoCode.get('Value'),
                                        });
                                    }
                                    else
                                      q.resolve({
                                        AmountType:'#',
                                        Value:0.0,
                                        });
                                },
                                error:function(result,error)
                                {
                                    q.reject(JSON.stringify(error));
                                }
                              });
                                  return q.promise;
                        }
                    };
        }
])
.factory('LocationHistoryUUIDService',
        function ($q,$cordovaDevice) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                  document.addEventListener("deviceready", function () {  uuid=$cordovaDevice.getUUID();});
                }
            return {                
              addToHistory: function (payLoadLocationHistoryUUID) 
              {                
                var q = $q.defer();
                var Location=new Parse.GeoPoint({latitude: payLoadLocationHistoryUUID.latitude, longitude:payLoadLocationHistoryUUID.longitude}); 
                var LocationHistoryUUID = Parse.Object.extend("LocationHistoryUUID");
                var queryLocationHistoryUUID = new Parse.Query(LocationHistoryUUID);
                queryLocationHistoryUUID.equalTo("UUID", uuid);
                queryLocationHistoryUUID.equalTo("UserID", payLoadLocationHistoryUUID.uid);
                queryLocationHistoryUUID.find({
                success:function (successLocationHistoryUUIDs)
                  {
                    if(successLocationHistoryUUIDs.length>0)
                      {
                        var successLocationHistoryUUID=successLocationHistoryUUIDs[0];
                        successLocationHistoryUUID.set("Location",Location);
                        successLocationHistoryUUID.set("UUID",uuid);
                        successLocationHistoryUUID.set("UserID",payLoadLocationHistoryUUID.uid);
                        successLocationHistoryUUID.save();
                        q.resolve(successLocationHistoryUUID.id);
                      }
                    else
                      {
                        var myLocationHistoryUUID = new LocationHistoryUUID();                                                             
                        myLocationHistoryUUID.set("Location",Location);
                        myLocationHistoryUUID.set("UUID",uuid);
                        myLocationHistoryUUID.set("UserID",payLoadLocationHistoryUUID.uid);
                        myLocationHistoryUUID.save(null,{
                          success:function (successmyLocationHistoryUUID)
                            {
                              q.resolve(successmyLocationHistoryUUID.id);
                            },
                          error:function(result,error)
                            {
                              q.reject(0);
                            } 
                        });
                      }
                  },
                error:function(result,error)
                  {
                    q.reject(JSON.stringify(error));
                  }
                });
                
                return q.promise;
              }
          };
        }
)
.factory('UsersService',function ($q,$state,$cordovaDevice,$window,$rootScope,ParseConfiguration,LocalDb,
  GeolocationService,$ionicPopup,$ionicHistory,$ionicPlatform) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                    document.addEventListener("deviceready", function () {uuid=$cordovaDevice.getUUID();});
                }
          var parseInitialized = false;
            return {
               init: function () 
                {
                  $ionicPlatform.ready(function() {
                  try
                  {
                    if (parseInitialized === false) {
                        Parse.serverURL = ParseConfiguration.serverURL;
                        Parse.initialize('Nw47gz5W9KvrZMxKCaFV6GGfwBw4kC4BkFz4EB7f', 'IxR9CyMXcCSgvzglLIBKMFUJMdPhtQEFljr4l3IJ');
                        parseInitialized = true;
                        document.addEventListener("deviceready", function () {
                                          if(parsePlugin!==undefined)
                                            {
                                              parsePlugin.initialize('Nw47gz5W9KvrZMxKCaFV6GGfwBw4kC4BkFz4EB7f', 'IxR9CyMXcCSgvzglLIBKMFUJMdPhtQEFljr4l3IJ', 
                                                function(data)
                                                  {
                                                    console.log("SUCCESS -> " + data);
                                                  },
                                                function(e)
                                                  {
                                                    console.log("ERROR -> " + e);
                                                  });
                                            }
                                          else
                                            q.reject('parsePlugin not found');
                        });
                    }
                    var currentUser = Parse.User.current();
                    if (currentUser) {
                        return $q.when(currentUser);
                    } else {
                        return $q.reject({error: "noUser"});
                    }
                  }catch(e)
                  {
                    $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title: 'Please check you network connection(Parse)!!'+JSON.stringify(e)});  
                    window.location.reload();
                  }
                  });
                },
                login: function (payLoadUser) 
                {
                      var q = $q.defer();
                      Parse.User.logIn(('' + payLoadUser.username).toLowerCase(), payLoadUser.password, {
                        success: function(userlogIn) {            
                            if(userlogIn.get('accountType')===1)
                              {
                                var user={};
                                user.id=userlogIn.id;
                                user.username=userlogIn.get("username");
                                user.email=userlogIn.get("email");
                                user.UUID=userlogIn.get("UUID");
                                user.accountType=userlogIn.get("accountType");
                                user.loginMethod=userlogIn.get("loginMethod");
                                user.TheaterID=userlogIn.get("TheaterID");
                                user.firstName=userlogIn.get("firstName");
                                user.lastName=userlogIn.get("lastName");
                                // user.age=userlogIn.get("age");
                                // user.address=userlogIn.get("address");
                                // user.city=userlogIn.get("city");
                                // user.state=userlogIn.get("state");
                                // user.country=userlogIn.get("country");
                                // user.zip=userlogIn.get("zip");
                                //user.addressLocation=userlogIn.get("addressLocation");
                                user.profilePic=userlogIn.get("profilePic")?userlogIn.get('profilePic').url():'';
                                user.fb_id=userlogIn.get("fb_id");
                                user.fb_token=userlogIn.get("fb_token");
                                user.fb_token_expiry=userlogIn.get("fb_token_expiry");
                                user.icon=userlogIn.get("icon");
                                user.twitterToken=userlogIn.get("twitterToken");
                                user.twitterToken_secret=userlogIn.get("twitterToken_secret");
                                user.twitter_id=userlogIn.get("twitter_id");
                                user.status=userlogIn.get("status");
                                LocalDb.setObject('user',user);
                                
                              q.resolve('You are successfully logged in to the POPii!!');
                            }
                            else
                            {
                              q.reject('User not authorized to access POPii App!!');
                            }
                          },
                        error: function(user, err)
                        {
                          if (err.code === 101) 
                          {
                            q.reject('Please enter valid username/password');
                          }
                          else
                          {
                            q.reject('An unexpected error has ' + 'occurred, please try again.'+JSON.stringify(err));
                          }
                        }
                      });
                    return q.promise;
                },
                getByID: function (payLoadUser) 
                {
                  var q = $q.defer();
                  var Users = Parse.Object.extend("_User");
                  var myUsers = new Parse.Query(Users);
                  myUsers.get(payLoadUser.UserID,{
                    success:function (successUser)
                      {
                          q.resolve({
                              "accountType": successUser.get("accountType"),
                              "TheaterID": successUser.get("TheaterID"),
                             // "addressLocation": successUser.get("addressLocation"),
                              "firstName": successUser.get("firstName"),
                              "lastName": successUser.get("lastName"),
                              "email": successUser.get("email")//,
                              // "phone": successUser.get("phone"),
                              // "age":successUser.get("age"),
                              // "address":successUser.get("address"),
                              // "city":successUser.get("city"),
                              // "state":successUser.get("state"),
                              // "zip":successUser.get("zip")
                            });
                      }, 
                    error:function(result,error)
                      {
                          q.reject(JSON.stringify(error));
                      } 
                    }); 
                  return q.promise;
                },
                getByTheaterID: function (payLoadUser) 
                {
                  //console.log(JSON.stringify(payLoadUser));
                  var q = $q.defer();
                  var Users = Parse.Object.extend("_User");
                  var myUsers = new Parse.Query(Users);
                  myUsers.equalTo("TheaterID", payLoadUser.TheaterID);
                  myUsers.equalTo("accountType", 2);
                  myUsers.find({
                            success:function (successUsers)
                            {
                              console.log(successUsers);
                                if(successUsers.length>0)
                                {
                                  var resultUsers=[];
                                  for(var i=0;i<successUsers.length;i++)
                                  { 
                                    var successUser=successUsers[i];
                                    resultUsers.push({
                                      "EmployeeID":successUser.id,
                                      "accountType": successUser.get("accountType"),
                                      "TheaterID": successUser.get("TheaterID"),
                                      "addressLocation": successUser.get("addressLocation"),
                                      "firstName": successUser.get("firstName"),
                                      "lastName": successUser.get("lastName"),
                                      "email": successUser.get("email")//,
                                      // "phone": successUser.get("phone"),
                                      // "age":successUser.get("age"),
                                      // "address":successUser.get("address"),
                                      // "city":successUser.get("city"),
                                      // "state":successUser.get("state"),
                                      // "zip":successUser.get("zip")
                                    });            
                                  }
                                     q.resolve(resultUsers);
                                }
                                else
                                q.resolve([]);
                            }, 
                            error:function(result,error)
                            {
                                q.reject(JSON.stringify(error));
                            } 
                        }); 
                  return q.promise;
                },
                getUsersByLocation: function (payLoadUser) 
                {
                        var q = $q.defer();
                        var Users = Parse.Object.extend("_User");
                        var myUsers = new Parse.Query(Users);
                        var point = new Parse.GeoPoint({latitude:  payLoadUser.latitude, longitude:payLoadUser.longitude});
                        //myUsers.near("addressLocation",point);
                        myUsers.equalTo("accountType", parseInt(payLoadUser.accountType));
                        myUsers.find({
                            success:function (successUsers)
                            {
                              //console.log(successUsers);
                                if(successUsers.length>0)
                                {
                                  var resultUsers=[];
                                  for(var i=0;i<successUsers.length;i++)
                                  { 
                                    resultUsers.push(successUsers[i].id);            
                                  }
                                     q.resolve(resultUsers);
                                }
                                else
                                q.resolve([]);
                            }, 
                            error:function(result,error)
                            {
                                q.reject(JSON.stringify(error));
                            } 
                        }); 
                        return q.promise;
                },
                register:function(payLoadUser)
                {
                  console.log(JSON.stringify(payLoadUser));
                  var q = $q.defer();              
                            var user = new Parse.User();
                            user.set("username",payLoadUser.username);
                            user.set("email",payLoadUser.email);
                            user.set("password",payLoadUser.password);
                            user.set("UUID",uuid);//
                            user.set("accountType",1);//
                            user.set("loginMethod",'parse');//
                            user.set("TheaterID",' ');//
                            user.set("firstName",payLoadUser.firstName);
                            user.set("lastName",payLoadUser.lastName);
                            user.set("dob",payLoadUser.dob);
                            user.set("zip",payLoadUser.zip);
                            // user.set("age",payLoadUser.age);
                            // user.set("address",payLoadUser.address);
                            // user.set("city",payLoadUser.city);
                            // user.set("state",payLoadUser.state);
                            // user.set("country",payLoadUser.country);
                            // user.set("zip",payLoadUser.zip);
                            //user.set("addressLocation",null);//
                            //user.set("profilePic",payLoadUser.profilePic);//
                            user.set("fb_id",'fb_id');//
                            user.set("fb_token",'fb_token');//
                            user.set("fb_token_expiry",'fb_token_expiry');//
                            user.set("icon",'icon');//
                            user.set("twitterToken",'twitterToken');//
                            user.set("twitterToken_secret",'twitterToken_secret');//
                            user.set("twitter_id",'twitter_id');//
                            user.set("status",1);//
                            user.signUp(null, {
                                    success: function(userlogIn) {
                                         var user={};var user={};
                                         user.id=userlogIn.id;
                                         user.username=userlogIn.get("username");
                                        user.email=userlogIn.get("email");
                                        user.UUID=userlogIn.get("UUID");
                                        user.accountType=userlogIn.get("accountType");
                                        user.loginMethod=userlogIn.get("loginMethod");
                                        user.TheaterID=userlogIn.get("TheaterID");
                                        user.firstName=userlogIn.get("firstName");
                                        user.lastName=userlogIn.get("lastName");
                                        user.dob=userlogIn.get("dob");
                                        user.zip=userlogIn.get("zip");
                                        // user.age=userlogIn.get("age");
                                        // user.address=userlogIn.get("address");
                                        // user.city=userlogIn.get("city");
                                        // user.state=userlogIn.get("state");
                                        // user.country=userlogIn.get("country");
                                        // user.zip=userlogIn.get("zip");
                                        //user.addressLocation=userlogIn.get("addressLocation");
                                        user.profilePic=userlogIn.get("profilePic")?userlogIn.get('profilePic').url():'';
                                        user.fb_id=userlogIn.get("fb_id");
                                        user.fb_token=userlogIn.get("fb_token");
                                        user.fb_token_expiry=userlogIn.get("fb_token_expiry");
                                        user.icon=userlogIn.get("icon");
                                        user.twitterToken=userlogIn.get("twitterToken");
                                        user.twitterToken_secret=userlogIn.get("twitterToken_secret");
                                        user.twitter_id=userlogIn.get("twitter_id");
                                        user.status=userlogIn.get("status");
                                         LocalDb.setObject('user',user);
                                        
                                        q.resolve('Successfully signed up');
                                    },
                                    error: function(user, error) {
                                         q.reject(error.message);
                                    }
                                });
                    return q.promise;
                },
                registerByFB:function(payLoadUser)
                {
                  var q=$q.defer();
                        var UserProfile = Parse.Object.extend("_User");
                        var myUserProfile = new Parse.Query(UserProfile);
                        myUserProfile.equalTo("fb_id", payLoadUser.id);
                        //myUserProfile.equalTo("fb_token",$window.sessionStorage['fbtoken']);
                        myUserProfile.equalTo("accountType", 1);
                        myUserProfile.find({
                            success:function (successUsers)
                            {                              
                              //console.log(JSON.stringify(successUsers));
                                if(successUsers.length>0)
                                {
                                    Parse.User.logIn('' + payLoadUser.id,'' + payLoadUser.id, {
                                    success: function(userlogIn) {
                                    var user={};
                                     user.id=userlogIn.id;
                                     user.username=userlogIn.get("username");
                                            user.email=userlogIn.get("email");
                                            user.UUID=userlogIn.get("UUID");
                                            user.accountType=userlogIn.get("accountType");
                                            user.loginMethod=userlogIn.get("loginMethod");
                                            user.TheaterID=userlogIn.get("TheaterID");
                                            user.firstName=userlogIn.get("firstName");
                                            user.lastName=userlogIn.get("lastName");
                                            // user.age=userlogIn.get("age");
                                            // user.address=userlogIn.get("address");
                                            // user.city=userlogIn.get("city");
                                            // user.state=userlogIn.get("state");
                                            // user.country=userlogIn.get("country");
                                            // user.zip=userlogIn.get("zip");
                                            //user.addressLocation=userlogIn.get("addressLocation");
                                            user.profilePic=userlogIn.get("profilePic")?userlogIn.get('profilePic').url():'';
                                            user.fb_id=userlogIn.get("fb_id");
                                            user.fb_token=userlogIn.get("fb_token");
                                            user.fb_token_expiry=userlogIn.get("fb_token_expiry");
                                            user.icon=userlogIn.get("icon");
                                            user.twitterToken=userlogIn.get("twitterToken");
                                            user.twitterToken_secret=userlogIn.get("twitterToken_secret");
                                            user.twitter_id=userlogIn.get("twitter_id");
                                            user.status=userlogIn.get("status");
                                     LocalDb.setObject('user',user);
                                     
                                    q.resolve('You have successfully signed in!!');
                                  },error:function(result,error)
                                  {
                                    q.reject(JSON.stringify(error));
                                  }
                                });
                                }//found user in parse
                                else
                                {
                                    var user = new Parse.User();
                                    if(!payLoadUser.email)
                                    {
                                      payLoadUser.email=payLoadUser.id+'@mail.com';
                                    }
                                    user.set("username",payLoadUser.id);
                                    user.set('password', payLoadUser.id);
                                    user.set("email",payLoadUser.email);
                                    user.set("UUID",uuid);//
                                    user.set("accountType",1);//
                                    user.set("loginMethod",'facebook');//
                                    user.set("TheaterID",' ');//
                                    user.set('firstName', payLoadUser.name.split(' ')[0]);
                                    user.set('lastName', payLoadUser.name.split(' ')[1]);
                                    // user.set("age",'age');
                                    // user.set("address",'address');
                                    // user.set("city",'city');
                                    // user.set("state",'state');
                                    // user.set("country",'country');
                                    // user.set("zip",'zip');
                                    //user.set("addressLocation",null);//
                                    user.set("profilePic",null);//
                                    user.set('icon', 'https://graph.facebook.com/'+ payLoadUser.id +'/picture?width=400&height=400');
                                    user.set('fb_id', payLoadUser.id);
                                    user.set('fb_token', $window.sessionStorage['fbtoken']);
                                    user.set('fb_token_expiry', $window.sessionStorage['expires_in']);
                                    user.set("twitterToken",'twitterToken');//
                                    user.set("twitterToken_secret",'twitterToken_secret');//
                                    user.set("twitter_id",'twitter_id');//
                                    user.set("status",1);//                                    
                                    user.signUp(null, {
                                       success: function(userlogIn) {
                                         var user={};                                         
                                            user.id=userlogIn.id;
                                            user.email=userlogIn.get("email");
                                            user.UUID=userlogIn.get("UUID");
                                            user.accountType=userlogIn.get("accountType");
                                            user.loginMethod=userlogIn.get("loginMethod");
                                            user.TheaterID=userlogIn.get("TheaterID");
                                            user.firstName=userlogIn.get("firstName");
                                            user.lastName=userlogIn.get("lastName");
                                            // user.age=userlogIn.get("age");
                                            // user.address=userlogIn.get("address");
                                            // user.city=userlogIn.get("city");
                                            // user.state=userlogIn.get("state");
                                            // user.country=userlogIn.get("country");
                                            // user.zip=userlogIn.get("zip");
                                            //user.addressLocation=userlogIn.get("addressLocation");
                                            user.profilePic=userlogIn.get("profilePic")?userlogIn.get('profilePic').url():'';
                                            user.fb_id=userlogIn.get("fb_id");
                                            user.fb_token=userlogIn.get("fb_token");
                                            user.fb_token_expiry=userlogIn.get("fb_token_expiry");
                                            user.icon=userlogIn.get("icon");
                                            user.twitterToken=userlogIn.get("twitterToken");
                                            user.twitterToken_secret=userlogIn.get("twitterToken_secret");
                                            user.twitter_id=userlogIn.get("twitter_id");
                                            user.status=userlogIn.get("status");
                                     LocalDb.setObject('user',user);
                                     
                                         q.resolve('You have successfully signed up');
                                       },
                                       error: function(user, error) {
                                          q.reject(JSON.stringify(error));
                                       }
                                   });//SignUp
                                }

                              },
                              error:function(successUsers,error)
                              {
                                q.reject(JSON.stringify(error));
                              }
                            });///find end
                      return q.promise;
                },
                saveProfileForFB:function(payLoadUser)
                {
                  var q = $q.defer();
                  var UserProfile = Parse.Object.extend("_User");
                            var myUserProfile = new Parse.Query(UserProfile);
                                
                            myUserProfile.get(payLoadUser.id,{
                              success:function (successUser)
                                {
                                  //console.log(successUser);
                                    successUser.set("email",payLoadUser.email);
                                    successUser.set("UUID",uuid);//
                                    successUser.set("accountType",1);//
                                    successUser.set("loginMethod",'parse');//
                                    successUser.set("TheaterID",' ');//
                                    successUser.set("firstName",payLoadUser.firstName);
                                    successUser.set("lastName",payLoadUser.lastName);
                                    // successUser.set("age",payLoadUser.age);
                                    // successUser.set("address",payLoadUser.address);
                                    // successUser.set("city",payLoadUser.city);
                                    // successUser.set("state",payLoadUser.state);
                                    // successUser.set("country",payLoadUser.country);
                                    // successUser.set("zip",payLoadUser.zip);
                                    //successUser.set("addressLocation",null);//
                                    //successUser.set("profilePic",profilePic);//
                                    successUser.set('fb_id', payLoadUser.fb_id);
                                    successUser.set('fb_token', $window.sessionStorage['fbtoken']);
                                    successUser.set('fb_token_expiry', $window.sessionStorage['expires_in']);                                
                                    successUser.set("icon",'icon');//
                                    successUser.set("twitterToken",'twitterToken');//
                                    successUser.set("twitterToken_secret",'twitterToken_secret');//
                                    successUser.set("twitter_id",'twitter_id');//
                                    successUser.set("status",1);//
                                    successUser.save();
                                    q.resolve('Your profile saved successfully!!');
                                },
                                error:function(result,error)
                                {
                                     q.reject(JSON.stringify(error));
                                }
                                });
                                 return q.promise;
                },
                saveProfileWithPhoto:function(payLoadUser)
                {
                  var q = $q.defer();
                  var profilePic = new Parse.File(uuid+payLoadUser.username, {base64: payLoadUser.imageData});
                    profilePic.save().then(
                      function()
                        {
                            var UserProfile = Parse.Object.extend("_User");
                            var myUserProfile = new Parse.Query(UserProfile);
                                //console.log('update');
                            myUserProfile.get(payLoadUser.id,{
                              success:function (successUser)
                                {
                                    successUser.set("email",payLoadUser.email);
                                    successUser.set("UUID",uuid);//
                                    successUser.set("accountType",1);//
                                    successUser.set("loginMethod",'parse');//
                                    successUser.set("TheaterID",' ');//
                                    successUser.set("firstName",payLoadUser.firstName);
                                    successUser.set("lastName",payLoadUser.lastName);
                                    // successUser.set("age",payLoadUser.age);
                                    // successUser.set("address",payLoadUser.address);
                                    // successUser.set("city",payLoadUser.city);
                                    // successUser.set("state",payLoadUser.state);
                                    // successUser.set("country",payLoadUser.country);
                                    // successUser.set("zip",payLoadUser.zip);
                                    //successUser.set("addressLocation",null);//
                                    successUser.set("profilePic",profilePic);//
                                    successUser.set("fb_id",'fb_id');//
                                    successUser.set("fb_token",'fb_token');//
                                    successUser.set("fb_token_expiry",'fb_token_expiry');//
                                    successUser.set("icon",'icon');//
                                    successUser.set("twitterToken",'twitterToken');//
                                    successUser.set("twitterToken_secret",'twitterToken_secret');//
                                    successUser.set("twitter_id",'twitter_id');//
                                    successUser.set("status",1);//
                                    successUser.save();
                                    q.resolve('Your profile saved successfully!!');
                                },
                                error:function(result,error)
                                {
                                   q.reject(JSON.stringify(error));
                                }
                                });   
                        },function(error)
                        {
                           q.reject(JSON.stringify(error));
                        }
                        );
                        return q.promise;  
                },
                saveProfileWithOutPhoto:function(payLoadUser)
                {
                 // console.log('save without photo')
                  var q = $q.defer();
                  var UserProfile = Parse.Object.extend("User");
                  var myUserProfile = new Parse.Query(UserProfile);
                    myUserProfile.get(payLoadUser.id,{
                                 success:  function (successUser)
                                    {
                                        successUser.set("email",payLoadUser.email);
                                        successUser.set("UUID",uuid);//
                                        successUser.set("accountType",1);//
                                        successUser.set("loginMethod",'parse');//
                                        successUser.set("TheaterID",' ');//
                                        successUser.set("firstName",payLoadUser.firstName);
                                        successUser.set("lastName",payLoadUser.lastName);
                                        // successUser.set("age",payLoadUser.age);
                                        // successUser.set("address",payLoadUser.address);
                                        // successUser.set("city",payLoadUser.city);
                                        // successUser.set("state",payLoadUser.state);
                                        // successUser.set("country",payLoadUser.country);
                                        // successUser.set("zip",payLoadUser.zip);
                                        //successUser.set("addressLocation",null);//
                                        //successUser.set("profilePic",profilePic);//
                                        successUser.set("fb_id",'fb_id');//
                                        successUser.set("fb_token",'fb_token');//
                                        successUser.set("fb_token_expiry",'fb_token_expiry');//
                                        successUser.set("icon",'icon');//
                                        successUser.set("twitterToken",'twitterToken');//
                                        successUser.set("twitterToken_secret",'twitterToken_secret');//
                                        successUser.set("twitter_id",'twitter_id');//
                                        successUser.set("status",1);//
                                        successUser.save();
                                        q.resolve('Your profile saved successfully!!');
                                    },
                                    error:function(result,error)
                                    {
                                       q.reject(JSON.stringify(error));
                                    }});
                  return q.promise;
                },
                
                logout: function (_callback) {
                    var defered = $q.defer();
                    Parse.User.logOut();
                    defered.resolve();
                    return defered.promise;
                },
                passwordReset: function (_email) {
                    var defered = $q.defer();
                    Parse.User.requestPasswordReset(_email, {
                        success: function (result) {
                            defered.resolve(result);
                        },
                        error: function (error) {
                            defered.reject(error);
                        }
                    });
                    return defered.promise;
                },
                passwordRequirementTest: function(_password){
                    // Checks if the password has atleast 1 Uppercase letter
                    // 1 number 
                    // the min-length will be taken care of by the validation
                    if(_password.length < 6)
                        return false;
                    re = /[0-9]/;
                    if(!re.test(_password)) {
                        $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:"Error: password must contain at least one number (0-9)!"});
                        return false;
                    }
                    re = /[A-Z]/;
                    if(!re.test(_password)) {
                        $ionicPopup.alert({okType: 'button button-block button-dark bg-grey b',title:"Error: password must contain at least one uppercase letter (A-Z)!"});
                        return false;
                    }
                    return true;
                }
          };
        }
)
.factory("GeolocationService", function ($q, $log,$cordovaDevice,$ionicPopup,
  $ionicLoading,LocalDb) {
    

    return {
    GetLocation:function()
    {
      showConfirm = function(titleText,desc,settingCode) {
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
                   ////console.log('You are sure');
                   if(settingCode===1)
                    {         
                      if (navigator.userAgent.match(/android/i)||navigator.userAgent.toLowerCase().match(/iphone/) ||
                                navigator.userAgent.toLowerCase().match(/ipad/) ||
                                navigator.userAgent.match(/ipod/i)) {
                        cordova.plugins.diagnostic.switchToLocationSettings(); 
                        return 1;                       
                      }
                      // else if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                      //           navigator.userAgent.toLowerCase().match(/ipad/) ||
                      //           navigator.userAgent.match(/ipod/i)) {
                      //   cordova.plugins.diagnostic.switchToSettings(function(){
                      //   cordova.plugins.diagnostic.requestLocationAuthorization(function(){
                      //       //console.log("Successfully requested location authorization always");
                      //       return 1;
                      //   }, function(error){
                      //       console.error(error);
                      //       $state.reload();
                      //   }, "always");
                      //   }, function(error){
                      //       console.error(error);
                      //       $state.reload();
                      //   });
                      // }
                    }
                 } else {
                   return 0;
                 }
               }
      }
    ]});
    };
      var q = $q.defer();
    document.addEventListener("deviceready", function () {
      // if (navigator.userAgent.match(/android/i)) {
      //         cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
      //         if(!enabled)
      //           $scope.showConfirm("Allow “POPii” to access your location while you use the app?",
      //             "We ask for your location to determine what theater you’re in so we can deliver to you.",1);
      //         }, onError);        
      //     }
      // else
       if (navigator.userAgent.match(/android/i)||navigator.userAgent.toLowerCase().match(/iphone/) ||
                navigator.userAgent.toLowerCase().match(/ipad/) ||
                navigator.userAgent.match(/ipod/i)) {
              cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
                if(!enabled)
                {
                  $ionicLoading.hide();
                  showConfirm("Allow “POPii” to access your location while you use the app?",
                    "We ask for your location to determine what theater you’re in so we can deliver to you.",1);
                }
                else
                  navigator.geolocation.getCurrentPosition(
                function (position) 
                  {
                    var currentLocation={latitude:37.323494,longitude:-122.047409};
                    if(position!==undefined)
                      {
                        if(position.coords!==undefined)
                          {
                            if(position.coords.latitude!==undefined || position.coords.longitude!==undefined)
                            {
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
                                q.resolve(currentLocation);
                            }else
                              q.reject('latitude or longitude undefined');
                          }else
                              q.reject('coords undefined');
                    }
                    else
                      q.reject('position undefined');
                  },
                function (position,error) 
                  {
                    q.reject(JSON.stringify(error));
                  }, { enableHighAccuracy: true });
                  }, onError);
              function onError(error){
                    q.reject(JSON.stringify(error));
                  };
        }
    });
return q.promise;
  }
  
};
})
.factory('LocalDb', function($window,LocationHistoryUUIDService) {
  return {
    set: function(key, value) {
     //console.log('set:'+value);
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      //console.log('get:'+$window.localStorage[key]);
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      if(key==='currentLocation')
      {
        if(value.latitude && value.longitude)
        {
          //var uid='guest';
          //if($window.localStorage['user']!==undefined)
          //{
          //  uid=$window.localStorage['user'].id;
          //}
          //var payLoad={};
          //payLoad.uid=uid;
          //payLoad.latitude=value.latitude;
          //payLoad.longitude=value.longitude;
          //LocationHistoryUUIDService.addToHistory(payLoad).then(function(result){console.log(result);},function(){});
        }
      }
      //console.log('setObject:'+key+' # '+ JSON.stringify(value));
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      //console.log('getObject:'+key+' # '+$window.localStorage[key]);
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
})
.factory('TwitterService',
  function ($q,$http, $cordovaDevice,$cordovaOauthUtility) 
    {
      return {
        login: function (payLoadTwitter)
          {
            var deferred = $q.defer();
            //var payLoadTwitter.clientKey = "3gjfCjbi7uoOtUZjrsvG469Mm";
            //var payLoadTwitter.clientSecret = "gSglly8uDcIeTn5EXNIEcvpuu4oSwdGtiQvrqPIt4vGXpiw9GP";
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
              //console.log('onDeviceReady');
              if (typeof jsSHA !== "undefined") {
                var oauthObject = {
                  realm:"https://api.twitter.com/",
                  oauth_consumer_key: payLoadTwitter.clientKey,
                  oauth_nonce: $cordovaOauthUtility.createNonce(10),
                  oauth_signature_method: "HMAC-SHA1",
                  oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                  oauth_version: "1.0"
                };
                var signatureObj = $cordovaOauthUtility.createSignature("POST", "https://api.twitter.com/oauth/request_token", oauthObject, {oauth_callback:payLoadTwitter.callback_url}, payLoadTwitter.clientSecret);
                var opt={
                  headers: {
                    "Authorization": signatureObj.authorization_header
                    ,"Content-Type": 'application/x-www-form-urlencoded'
                  }
                };
                //console.log(JSON.stringify(opt));
                //$http.defaults.headers.post.Authorization = signatureObj.authorization_header;
                $http.post('https://api.twitter.com/oauth/request_token',"oauth_callback=" + encodeURIComponent(payLoadTwitter.callback_url),
                  {
                    headers: {
                      "Authorization": signatureObj.authorization_header
                      ,"Content-Type": 'application/x-www-form-urlencoded',
                      "Accept":'*/*',
                      "Access-Control-Allow-Origin":"*"
                    }}
                    ).success(function (data, status, headers, config) {
                      //console.log('http requestTokenResult');
                    }).error(function (data, status, headers, config) {
                      // console.log('http requestTokenResult error');
                      deferred.reject({data:data, status: status, headers:headers, config:config});
                      });//http oken req end
                  }
                  else 
                  {
                    deferred.reject("Missing jsSHA JavaScript library");
                  }
                  }//on device ready
                  return deferred.promise;
                }
              };
    }
)
.factory('PaymentMethodService',
        function ($q,$cordovaDevice) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                    document.addEventListener("deviceready", function () {uuid=$cordovaDevice.getUUID();});
                }
            return { 
            saveCreditCard:function(payLoadPayment)
                {
                  var q = $q.defer();
                  var PaymentMethod = Parse.Object.extend("PaymentMethod");
                  var queryPaymentMethod = new Parse.Query(PaymentMethod);
                  queryPaymentMethod.equalTo("UserID", payLoadPayment.UserID);
                  queryPaymentMethod.find({
                                success: function (successPaymentMethods)
                                  {
                                    if(successPaymentMethods.length>0)
                                      {
                                        var successPaymentMethod=successPaymentMethods[0];
                                            successPaymentMethod.set("creditCardName", payLoadPayment.creditCardName);  
                                            successPaymentMethod.set("creditCardNumber", payLoadPayment.creditCardNumber);
                                            successPaymentMethod.set("creditCardCvc", payLoadPayment.creditCardCvc);  
                                            successPaymentMethod.set("creditCardExpMonth",payLoadPayment.creditCardExpMonth);  
                                            successPaymentMethod.set("creditCardExpYear", payLoadPayment.creditCardExpYear);
                                            successPaymentMethod.save();
                                            q.resolve('Your Payment Setting saved successfully!!');
                                        
                                        }
                                        else
                                          {
                                            var myPaymentMethod = new PaymentMethod(); 
                                            myPaymentMethod.set("UserID", payLoadPayment.UserID); 
                                            myPaymentMethod.set("creditCardName", payLoadPayment.creditCardName);  
                                            myPaymentMethod.set("creditCardNumber", payLoadPayment.creditCardNumber);
                                            myPaymentMethod.set("creditCardCvc", payLoadPayment.creditCardCvc);  
                                            myPaymentMethod.set("creditCardExpMonth",payLoadPayment.creditCardExpMonth);  
                                            myPaymentMethod.set("creditCardExpYear", payLoadPayment.creditCardExpYear);
                                            myPaymentMethod.save(null,{
                                              success:function (successmyPaymentMethod)
                                                {
                                                  q.resolve('Your Payment Setting added successfully!!');
                                                },
                                              error:function(result,error)
                                                {
                                                  q.reject(0);
                                                } 
                                            });                                      
                                          }
                                  },
                                error:function(result,error)
                                  {
                                     q.reject(JSON.stringify(error));
                                  }
                                });
                  return q.promise;
                },
            getCreditCard:function(payLoadPayment)
                {
                  var q = $q.defer();
                  var PaymentMethod = Parse.Object.extend("PaymentMethod");
                  var queryPaymentMethod = new Parse.Query(PaymentMethod);
                  queryPaymentMethod.equalTo("UserID", payLoadPayment.UserID);
                  queryPaymentMethod.find({
                                success: function (successPaymentMethods)
                                  {
                                    //console.log(JSON.stringify(successPaymentMethods));
                                    if(successPaymentMethods.length>0)
                                      {
                                        var successPaymentMethod=successPaymentMethods[0];
                                        var resultCreditCard={};
                                        resultCreditCard.creditCardName = successPaymentMethod.get("creditCardName");  
                                        resultCreditCard.creditCardNumber = successPaymentMethod.get("creditCardNumber");
                                        resultCreditCard.creditCardCvc =   successPaymentMethod.get("creditCardCvc");  
                                        resultCreditCard.creditCardExpMonth = successPaymentMethod.get("creditCardExpMonth");  
                                        resultCreditCard.creditCardExpYear = successPaymentMethod.get("creditCardExpYear");                                    
                                        q.resolve(resultCreditCard);
                                      }
                                      else
                                        q.resolve({});
                                  },
                                error:function(result,error)
                                  {
                                     q.reject(JSON.stringify(error));
                                  }
                                });
                  return q.promise;
                },
                deleteCreditCard:function(payLoadPayment)
                {
                  var q = $q.defer();
                  var PaymentMethod = Parse.Object.extend("PaymentMethod");
                  var queryPaymentMethod = new Parse.Query(PaymentMethod);
                  queryPaymentMethod.equalTo("UserID", payLoadPayment.UserID);
                  queryPaymentMethod.find({
                                success: function (successPaymentMethods)
                                  {
                                    if(successPaymentMethods.length>0)
                                      {
                                        var successPaymentMethod=successPaymentMethods[0];
                                            successPaymentMethod.destroy({
                                              success:function (successmyPaymentMethod)
                                                {
                                                  q.resolve('Your Payment Setting deleted successfully!!');
                                                },
                                              error:function(result,error)
                                                {
                                                  q.reject(0);
                                                } 
                                            });
                                        
                                        }},
                                error:function(result,error)
                                  {
                                     q.reject(JSON.stringify(error));
                                  }
                                });
                  return q.promise;
                }

              };
        }
)
.factory('OrdersService', ['$q','$cordovaDevice',
        function ($q,$cordovaDevice) 
        {
          var uuid='system';
                if (navigator.userAgent.toLowerCase().match(/iphone/) ||
                    navigator.userAgent.toLowerCase().match(/ipad/) ||
                    navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/android/i)) {
                    document.addEventListener("deviceready", function () {uuid=$cordovaDevice.getUUID();});
                }
            return {                
                getAllByUser: function (payLoadOrder) 
                {
                 // console.log(payLoadOrder);
                     var q = $q.defer();
                        var Orders = Parse.Object.extend("Orders");
                        var myOrders = new Parse.Query(Orders);
                        myOrders.equalTo("UserID", payLoadOrder.UserID);
                        //myOrders.limit(3);
                        myOrders.descending("OrderNumber");
                        myOrders.ascending("TheaterName");
                        myOrders.find({
                            success:function (successOrders)
                            {
                                if(successOrders.length>0)
                                {
                                  var orders=[];
                                  for(var i=0;i<successOrders.length;i++)
                                  {
                                    orders.push({
                                      OrderID:successOrders[i].id,
                                      TheaterID:successOrders[i].get('TheaterID'),
                                      TheaterName:successOrders[i].get('TheaterName'),
                                      TheaterImage:successOrders[i].get('TheaterImage'), 
                                      EmployeeID:successOrders[i].get('EmployeeID'),
                                      UserID:successOrders[i].get('UserID'),
                                      UserFullName:successOrders[i].get('UserFullName'),
                                      ShowID:successOrders[i].get('ShowID'),                             
                                      MovieName:successOrders[i].get('MovieName'),
                                      MovieImage:successOrders[i].get('MovieImage'),
                                      ShowTime:successOrders[i].get('ShowTime'), 
                                      OrderNumber:successOrders[i].get('OrderNumber'),                            
                                      OrderItems:successOrders[i].get('OrderItems'),
                                      OrderStatus:successOrders[i].get('OrderStatus'),
                                      TaxAmount:successOrders[i].get('TaxAmount'),
                                      DiscountAmount:successOrders[i].get('DiscountAmount'),
                                      TotalAmount:successOrders[i].get('TotalAmount'), 
                                      PaymentMethod:successOrders[i].get('PaymentMethod'),
                                      Token:successOrders[i].get('Token'),
                                      paymentHistory:successOrders[i].get('paymentHistory'),
                                      deliveryType:successOrders[i].get('deliveryType'),
                                      deliveryTime:successOrders[i].get('deliveryTime'),
                                      deviceID:successOrders[i].get('uuid'),
                                      updatedAt:successOrders[i].get('updatedAt')
                                    });            
                                  }
                                     q.resolve(orders);
                                }
                                else
                                q.resolve([]);
                            },//success find orders
                            error:function(result,error)
                            {
                                q.reject(JSON.stringify(error));
                            }//error find orders
                        });//find orders
                        return q.promise;
                },
                getByOrderID: function(payLoadOrder) 
                {
                  //  console.log(payLoadOrder);
                     var q = $q.defer();
                        var Orders = Parse.Object.extend("Orders");
                        var myOrders = new Parse.Query(Orders);
                        myOrders.get(payLoadOrder.order_id,{
                            success:function (successOrder)
                            {
                                if(successOrder)
                                {
                                  var order={
                                      OrderID:successOrder.id,                                   
                                      TheaterID:successOrder.get('TheaterID'),
                                      TheaterName:successOrder.get('TheaterName'),
                                      TheaterImage:successOrder.get('TheaterImage'), 
                                      EmployeeID:successOrder.get('EmployeeID'),
                                      UserID:successOrder.get('UserID'),
                                      UserFullName:successOrder.get('UserFullName'),
                                      ShowID:successOrder.get('ShowID'),                             
                                      MovieName:successOrder.get('MovieName'),
                                      MovieImage:successOrder.get('MovieImage'),
                                      ShowTime:successOrder.get('ShowTime'), 
                                      OrderNumber:successOrder.get('OrderNumber'),                            
                                      OrderItems:successOrder.get('OrderItems'),
                                      OrderStatus:successOrder.get('OrderStatus'),
                                      TaxAmount:successOrder.get('TaxAmount'),
                                      DiscountAmount:successOrder.get('DiscountAmount'),
                                      TotalAmount:successOrder.get('TotalAmount'), 
                                      PaymentMethod:successOrder.get('PaymentMethod'),
                                      Token:successOrder.get('Token'),
                                      paymentHistory:successOrder.get('paymentHistory'),
                                      deliveryType:successOrder.get('deliveryType'),
                                      deliveryTime:successOrder.get('deliveryTime'),
                                      deviceID:successOrder.get('uuid'),
                                      updatedAt:successOrder.get('updatedAt')
                                  };           
                                  q.resolve(order); 
                                  }
                                  else
                                q.resolve(null);                                
                            },//success find orders
                            error:function(result,error)
                            {
                                q.reject(JSON.stringify(error));
                            }//error find orders
                        });//find orders
                        return q.promise;
                },
                changeStatus: function (payLoadOrder) 
                {
                    var q = $q.defer();
                    var Orders = Parse.Object.extend("Orders");
                              var getOrder = new Parse.Query(Orders);
                              getOrder.get(payLoadOrder.OrderID,{
                                    success: function (successOrder)
                                    {
                                     successOrder.set("OrderStatus",payLoadOrder.OrderStatus);
                                     successOrder.save(); 
                                     q.resolve(successOrder.get("OrderNumber"));
                                    },
                                    error:function(result,error)
                                    {
                                     q.reject(JSON.stringify(error));
                                    }
                                    }); 
                               return q.promise;
                },
                placeOrder: function (payLoadOrder) 
                {
                  var q = $q.defer();
                  if(payLoadOrder.EmployeeID && payLoadOrder.UserID)
                  {
                    
                    var Orders = Parse.Object.extend("Orders");
                    var queryOrders = new Parse.Query(Orders);
                    queryOrders.equalTo("EmployeeID", payLoadOrder.EmployeeID);
                    queryOrders.descending("OrderNumber");
                    queryOrders.first({
                      success:function (findOrder)
                        {
                          var order_no=1;
                          //
                          if(findOrder)
                          {
                            
                            if(findOrder.get("OrderNumber"))
                            {
                              order_no=parseInt(findOrder.get("OrderNumber"),10);
                              order_no++;
                            }
                            //console.log(findOrder);
                          }
                          var myOrders = new Orders();
                              
                              myOrders.set("TheaterID",payLoadOrder.TheaterID);
                              myOrders.set("TheaterName",payLoadOrder.TheaterName);
                              myOrders.set("TheaterImage",payLoadOrder.TheaterImage); 
                              myOrders.set("EmployeeID",payLoadOrder.EmployeeID);
                              myOrders.set("UserID",payLoadOrder.UserID);
                              myOrders.set("UserFullName",payLoadOrder.UserFullName);
                              myOrders.set("ShowID",payLoadOrder.ShowID);                             
                              myOrders.set("MovieName",payLoadOrder.MovieName);
                              myOrders.set("MovieImage",payLoadOrder.MovieImage);                              
                              myOrders.set("ShowTime",payLoadOrder.ShowTime); 
                              myOrders.set("OrderNumber",order_no);                            
                              myOrders.set("OrderItems",payLoadOrder.OrderItems);
                              myOrders.set("OrderStatus",payLoadOrder.OrderStatus);
                              myOrders.set("TaxAmount",""+payLoadOrder.TaxAmount);
                              myOrders.set("DiscountAmount",""+payLoadOrder.DiscountAmount)
                              myOrders.set("TotalAmount",""+payLoadOrder.TotalAmount); ;
                              myOrders.set("PaymentMethod",payLoadOrder.PaymentMethod);
                              myOrders.set("Token",payLoadOrder.Token);
                              myOrders.set("paymentHistory",payLoadOrder.paymentHistory);
                              myOrders.set("deliveryType",payLoadOrder.deliveryType);
                              myOrders.set("deliveryTime",payLoadOrder.deliveryTime);
                              myOrders.set("deviceID",uuid);
                              
                              console.log(order_no);
                              myOrders.save(null,{
                                  success:function (successOrder)
                                  {
                                    console.log(JSON.stringify(successOrder));
                                    var order={
                                      OrderID:successOrder.id,                                   
                                      TheaterID:successOrder.get('TheaterID'),
                                      TheaterName:successOrder.get('TheaterName'),
                                      TheaterImage:successOrder.get('TheaterImage'), 
                                      EmployeeID:successOrder.get('EmployeeID'),
                                      UserID:successOrder.get('UserID'),
                                      UserFullName:successOrder.get('UserFullName'),
                                      ShowID:successOrder.get('ShowID'),                             
                                      MovieName:successOrder.get('MovieName'),
                                      MovieImage:successOrder.get('MovieImage'),
                                      ShowTime:successOrder.get('ShowTime'), 
                                      OrderNumber:successOrder.get('OrderNumber'),                            
                                      OrderItems:successOrder.get('OrderItems'),
                                      OrderStatus:successOrder.get('OrderStatus'),
                                      TaxAmount:successOrder.get('TaxAmount'),
                                      DiscountAmount:successOrder.get('DiscountAmount'),
                                      TotalAmount:successOrder.get('TotalAmount'), 
                                      PaymentMethod:successOrder.get('PaymentMethod'),
                                      Token:successOrder.get('Token'),
                                      paymentHistory:successOrder.get('paymentHistory'),                                      
                                      deliveryType:successOrder.get('deliveryType'),
                                      deliveryTime:successOrder.get('deliveryTime'),
                                      deviceID:successOrder.get('uuid'),
                                      updatedAt:successOrder.get('updatedAt')
                                    };  
                                    q.resolve({msg:'You are successfully place the order!!',order:order});
                                  }, 
                                  error:function(successOrder,error)
                                  {
                                    //console.log('error#JK: ');
                                    //console.log(JSON.stringify(error));
                                     q.reject(JSON.stringify(error));
                                  } 
                              });      
                        },error:function(result,error){q.reject(JSON.stringify(error));}});
                                                  
                  }
                  else
                  {
                        q.resolve('payLoadItem is empty!!');
                  }
                        return q.promise;
                }
          };
        }
])
.service('Brightness',function(LocalDb,$ionicPlatform){

    function success(result){console.log('brightness success');console.log(result);};
      function error(error){console.log('brightness error');console.log(error);};
      this.set = function(rangeValue){
        //$ionicPlatform.ready(function() {
        document.addEventListener("deviceready", function () {
          screen.lockOrientation('portrait');
          var brightness = cordova.plugins.brightness;
          if(LocalDb.get('rangeValue')!==undefined ||LocalDb.get('rangeValue')!==null  )
            if(rangeValue!==LocalDb.get('rangeValue'))
              LocalDb.set('rangeValue',rangeValue);
          var brightnessFactor=LocalDb.get('rangeValue')/100;
          console.log(brightness);
          brightness.setBrightness(brightnessFactor, success, error);
          brightness.setKeepScreenOn(false);
     }); 
    }.bind(this);

    
})
.service('Products',['$http', function($http){

    this.galleryProducts = [];
    this.cartProducts = [];
    this.checkout = {};
    this.TaxAmount=0.0;
    this.addToCart = function(product){
      var productInCart = false;
      this.cartProducts.forEach(function(prod, index, prods){
        if (prod.id === product.id) {
          productInCart = prod;
          return;
        }
      });

      if (productInCart) {
        this.addOneProduct(productInCart);
      } else {
        product.purchaseQuantity = 0;
        this.addOneProduct(product);
        this.cartProducts.push(product);
      }
    };

    this.removeProduct = function(product) {
      this.cartProducts.forEach(function(prod, i, prods){
        if (product.id === prod.id) {
          this.cartProducts.splice(i, 1);
          this.updateTotal();
        }
      }.bind(this));
    };

    this.addOneProduct = function(product) {
      --product.quantity;
      ++product.purchaseQuantity;

      this.updateTotal();
    };

    this.removeOneProduct = function(product) {
      ++product.quantity;
      --product.purchaseQuantity;
      this.updateTotal();
    };

    this.cartTotal = function() {
      var total = 0;
      this.cartProducts.forEach(function(prod, index, prods){
        total += prod.price * prod.purchaseQuantity;
      });
      return formatTotal(total);
    };

    var formatTotal = function(total) {
      return total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

    this.updateTotal = function(){
      this.total = this.cartTotal();
    }.bind(this);

    this.updateTotal();

    this.getProducts = function(callback){
      $http.get('/admin/panel/products')
      .success(function(products){
        this.galleryProducts = products;
        if (callback) {callback();}
      }.bind(this));
    };
}])
.service('CheckoutValidation', function(){

    this.validateCreditCardNumber = function(cc){
      return Stripe.card.validateCardNumber(cc);
    };

    this.validateExpiry = function(month, year){
      return Stripe.card.validateExpiry(month, year);
    };

    this.validateCVC = function(cvc){
      return Stripe.card.validateCVC(cvc);
    };

    this.validateEmail = function(email) {
      var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailReg.test(email);
    };

    this.validateZipcode = function(zipcode) {
      var zipReg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
      return zipReg.test(zipcode);
    };

    this.checkAll = function(checkoutDetails) {
      if (Object.keys(checkoutDetails).length === 0) { return false; }
      for (var input in checkoutDetails) {
        /* Check validation for credit card number */
        if (input === 'cc' && !this.validateCreditCardNumber(checkoutDetails[input])) {
          return false;
        }
        /* Check validation for expiration date on credit card */
        if (input === 'exp' && !this.validateExpiry(checkoutDetails[input].slice(0,2), checkoutDetails[input].slice(3))) {
          return false;
        }
        /* Check validation for cvc number on credit card */
        if (input === 'cvc' && !this.validateCVC(checkoutDetails[input])) {
          return false;
        }

        if (input === 'email' && !this.validateEmail(checkoutDetails[input])) {
          return false;
        }

        if (input === 'zipcode' && !this.validateZipcode(checkoutDetails[input])) {
          return false;
        }
      }
      return true;
    }.bind(this);
})
.service('stripeCheckout',['$state','Products','CheckoutValidation' ,'$http','$ionicPopup', function($state,Products, CheckoutValidation, $http,$ionicPopup){
    
     this.setStripeKey = function(key){
      Stripe.setPublishableKey(key);
    };

    this.setStripeTokenCallback = function(status, response){
      
    };

    this.processCheckout = function(checkoutDetails, callback){
      var cc    = checkoutDetails.cc;
      var month = checkoutDetails.month;
      var year  = checkoutDetails.year;
      var cvc   = checkoutDetails.cvc;

      Stripe.card.createToken({
        number    : cc,
        cvc       : cvc,
        exp_month : month,
        exp_year  : year
      }, callback);
    };

    this.stripeCallback = function(status, response){
      this.setStripeTokenCallback(status, response);
    }.bind(this);

    // var pay = function(response) {
    //   var token = response.id;
    //   url = '/stripe/pay';
    //   $http.post(url, {stripeToken: token});
    // };
}])
.service('Geo',function(LocalDb){
  this.currentLocation={latitude:0.0,longitude:0.0};
  this.watchPosition = function () {
     document.addEventListener("deviceready", function () {
     this.watching = navigator.geolocation.watchPosition(
              function (position) {
                if(position.coords.latitude===undefined || position.coords.longitude===undefined )
                {
                  currentLocation.latitude=0.0;
                  currentLocation.longitude=0.0;
                  if(currentLocation.latitude!==position.coords.latitude && currentLocation.longitude!==position.coords.longitude)
                  {
                    currentLocation.latitude=position.coords.latitude;
                    currentLocation.longitude=position.coords.longitude;
                    LocalDb.setObject('currentLocation',currentLocation);
                  }
                }
               else
                {
                currentLocation=LocalDb.getObject('currentLocation');
                if(currentLocation.latitude!==position.coords.latitude && currentLocation.longitude!==position.coords.longitude)
                {
                  currentLocation.latitude=position.coords.latitude;
                  currentLocation.longitude=position.coords.longitude;
                  LocalDb.setObject('currentLocation',currentLocation);
                }
              }
            },
              function (error) {
                this.stopWatchingPosition();
                this.watchPosition();                                    
                this.position = {};
              }, { enableHighAccuracy: true });
    });
  
     
  this.stopWatchingPosition = function () {
            if (this.watching) {
                navigator.geolocation.clearWatch(this.watching);
                this.watching = null;
            }
        }
this.onError=function (error){
console.error("An error occurred: "+error);
};

};//main function end watch 
});