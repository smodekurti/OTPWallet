angular.module('starter')
.controller("TotpController", function($scope,
                                       $timeout,
                                       roundProgressService,
                                       $stateParams,
                                       keyService){
   
    $scope.current =        0;
    $scope.max =            30;
    $scope.uploadCurrent =  0;
    $scope.stroke =         15;
    $scope.radius =         100;
    $scope.isSemi =         false;
    $scope.rounded =        true;
    $scope.clockwise =      true;
    $scope.currentColor =   '#DE1B1B';
    $scope.bgColor =        '#614385';
    $scope.iterations =     0;
    $scope.currentAnimation = 'easeOutBack';
    var count =1;
    $scope.keyAlias = $stateParams.keyAlias;
        console.log($stateParams.keyAlias);
    $scope.secretKey = keyService.getKey($scope.keyAlias).secret;
    
    $scope.start = function(){
        //Real TOTP SecretKey --- JBSWY3DPEHPK3PXP
       var totp = getTotp($scope.secretKey);
        //var totp = getTotp('JBSWY3DPEHPK3PXP');
        $scope.currentTotp = totp;
        timeout = $timeout(function(){
            var epoch = Math.round(new Date().getTime() / 1000.0);
            var countDown = 30 - (epoch % 30);
            $scope.current = countDown;
            if (epoch % 30 == 0){
                $scope.reset();
                $scope.start();
            }else{
                $scope.uploadCurrent = count++;
                $scope.start();    
            }
        }, 1000);

    };

    $scope.stop = function(){
        $timeout.cancel(timeout);
    };

    $scope.reset = function(){
        $scope.stop();
        $scope.currentTotp = null;
        $scope.uploadCurrent = 0;
        count = 1;
    };

    $scope.animations = [];

    angular.forEach(roundProgressService.animations, function(value, key){
        $scope.animations.push(key);
    });

    $scope.getFontSize = function(){
        return $scope.radius/($scope.isSemi ? 3.5 : 3) + 'px';
    };

    $scope.getColor = function(){
        return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
    };
    
})
.controller("MenuController",function($scope,$ionicSideMenuDelegate){
 $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
    
})
.controller("MainController",function($scope,$ionicSideMenuDelegate){
 $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
    
})
.controller("StartHereController",function($scope,$ionicSideMenuDelegate,
                                            $ionicActionSheet
                                           ,$state,
                                           $ionicModal,
                                           keyService,
                                           $timeout,
                                           QRScanService, $ionicPopup){

     
    $ionicModal.fromTemplateUrl(
                   'partials/enterSecret.html', 
                   function($ionicModal) 
                   {
                        $scope.modal = $ionicModal;
                   }, 
                   {
                        scope: $scope,
                        animation: 'slide-in-up'
                   });
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    
 
    
    $scope.newKey  = {alias:'',
                      secret:'',
                      timeBased:true
                     };
    
    $scope.createAccount = function(){
        keyService.setKey($scope.newKey);
        $scope.modal.hide();
        $state.go('home.showTotp', {"keyAlias" : $scope.newKey.alias});
        
    }
    
    function extractUrlValue(key, url)
    {
        if (typeof(url) === 'undefined')
            url = window.location.href;
        var match = url.match('[?&]' + key + '=([^&]+)');
        return match ? match[1] : null;
    }
                      
    $scope.showSetupOptions = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Scan Barcode' },
       { text: 'Enter Key Manually' }
     ],
     titleText: 'Setup Options',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
         switch(index){
             case 0:
                 
                QRScanService.scan(function(result) {
                  if (result.cancelled) {
                    // this is a super hack. When QR scan gets cancelled by
                    // clicking the back button on android, the app quits...
                    // doing a blank modal to catch the back button press event
                    $ionicModal.fromTemplate('').show().then(function() {
                      $ionicPopup.alert({
                        title: 'QR Scan Cancelled',
                        template: 'You cancelled it!'
                      });
                    });
                  } else {
                   var secretParam = extractUrlValue('secret',result.text);  
                   
                    $scope.newKey.secret = secretParam;
                    $scope.modal.show().then(function(modal){
                        //console.log("In Scope Modal");
                    });
                  }
                }, function(error) {
                  $ionicPopup.alert({
                    title: 'Unable to scan the QR code',
                    template: 'Too bad, something went wrong.'
                  });
                });
  
               break;
             case 1:
                 $scope.newKey = {};
                 $scope.modal.show().then(function(modal){

                 });
         }
         return true;
     }
   });

   // For example's sake, hide the sheet after two seconds
   /*
    $timeout(function() {
     hideSheet();
   }, 2000);
   */
 };
    
})
.controller("AccountListController", function($scope,
                                               $state, 
                                               $ionicSideMenuDelegate,
                                               $ionicListDelegate,
                                               keyService){
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.shouldShowDelete=false;
    $scope.listCanSwipe=true;
    $scope.keys = keyService.getAllKeys();
    if($scope.keys.length ===0){
            $state.go("home.startHere");
    }
    
    $scope.deleteAllAccounts = function(){
        console.log("I am in deleteAllAccounts");
        keyService.deleteAllKeys();
        $scope.keys = keyService.getAllKeys();
        if($scope.keys.length ===0){
            $state.go("home.startHere");
        }
    }

    $scope.swipedLeft=function(){
        $ionicListDelegate.showDelete(true);
        $scope.shouldShowDelete = true;

    };
    $scope.deleteAccount=function(account){
       keyService.deleteKey(account);
       $scope.keys = keyService.getAllKeys();
       $scope.showDelete();
        if($scope.keys.length ===0){
            $state.go("home.startHere");
        }
    };

    $scope.showDelete = function(){
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        $ionicListDelegate.showDelete($scope.shouldShowDelete);
    }
    
    
});