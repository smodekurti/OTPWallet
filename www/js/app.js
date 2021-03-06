// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','angular-svg-round-progress','ngStorage','ngCordova','ngMessages','ionic-toast'])


.config(function($stateProvider,$urlRouterProvider ,$ionicConfigProvider){
        $ionicConfigProvider.views.transition('none');
        $ionicConfigProvider.navBar.alignTitle("center");
        $ionicConfigProvider.maxCache = 0;

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
        controller:'AccountListController'
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
    //
    
})
.run(function($ionicPlatform,$state,keyService,$localStorage) {
  $ionicPlatform.ready(function() {

      window.plugins.nativepagetransitions.globalOptions.duration = 1000;
      window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
      window.plugins.nativepagetransitions.globalOptions.androiddelay = 10;
      window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
      window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 1;
      // these are used for slide left/right only currently
      window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
      window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;

      //$localStorage.$reset();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


    
    var keys = keyService.getAllKeys();
 
      if(keys!=null && keys.length >0 ){
        $state.go("home.accountList");
      }
      else{
       $state.go("home.startHere");   
      }

    
  });
 
});
