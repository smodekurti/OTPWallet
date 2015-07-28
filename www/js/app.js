// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','angular-svg-round-progress','ngStorage','ngCordova'])


.config(function($stateProvider,$urlRouterProvider ){
 console.log("Config");
  $stateProvider
    .state('home', {
      url: '/home'  ,
      abstract: true,
      templateUrl: "partials/menu.html",
      controller: 'MenuController'
    })
    .state("home.startHere",
       {
        url: '/startHere',
        views:{
        'menuContent' :{
        templateUrl: 'partials/startHere.html',
        controller:'StartHereController'
            }
        }
    })
  . state("home.showTotp",
       {
        url: '/showTotp/:keyAlias',
        views:{
        'menuContent' :{
        templateUrl: 'partials/showTotp.html',
        controller:'TotpController'
            }
        }
    })
    .state("home.accountList",
       {
        url:'/accountList', 
        views:{
        'menuContent' :{
            templateUrl: 'partials/accountList.html',
            controller:'AccountListController'
            }
        }
    });
    
    //$urlRouterProvider.otherwise("/home/startHere");
    
    
})
.run(function($ionicPlatform,$state,keyService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

      $ionicPlatform.registerBackButtonAction(function (event) {
          event.preventDefault();
          navigator.app.backHistory();
      }, 100);
    
    var keys = keyService.getAllKeys();
 
      if(keys!=null && keys.length >0 ){
        $state.go("home.accountList");
      }
      else{
       $state.go("home.startHere");   
      }

    
  });
 
});
