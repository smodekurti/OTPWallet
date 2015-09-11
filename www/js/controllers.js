angular.module('starter')
.controller("TotpController", function($scope,
                                       $rootScope,
                                       $timeout,
                                       $cordovaClipboard,
                                       roundProgressService,
                                       $stateParams,
                                       keyService,
                                       TotpFactory,
                                       $ionicPopup,
                                       $ionicModal,
                                        $state){

    $scope.current =        0;
    $scope.max =            30;
    $scope.uploadCurrent =  0;
    $scope.stroke =         3;
    $scope.radius =         125;
    $scope.isSemi =         false;
    $scope.rounded =        false;
    $scope.clockwise =      true;
    $scope.currentColor =   '#0074d6';
    $scope.bgColor =        '#dde';
    $scope.iterations =     0;
    $scope.currentAnimation = 'linearEase';
    var count =1;
    $scope.keyAlias = $stateParams.keyAlias;
    //$scope.secretKey = keyService.getKey($scope.keyAlias).secret;
    count = 0;

    TotpFactory.fetchTotp($scope.keyAlias, function(totp, countDown){
        $scope.currentTotp = totp;
        $scope.current = countDown;
        $scope.increment=countDown;
        if(countDown <5){
            $scope.currentColor = 'red';
        }
        else{
            $scope.currentColor =   '#0074d6';
        }

    });

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
    $scope.editOrNew = true;



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


    /*
        UI Driven methods start here
    */
    $scope.copyToClipboard = function(copyText){

        $cordovaClipboard
            .copy(copyText)
            .then(function () {
                //alert('Text Copied');
            }, function () {
                // error
                //alert('Tex Cannot be copied');
            });
    }



    $scope.edit=function(alias){
        var key = keyService.getKey(alias);


        $scope.modal.show().then(function(modal){
            //console.log("In Scope Modal");
            $scope.newKey=key;
        });

        $scope.createOrUpdateAccount = function(){

            var base32String = null;
            try {
                if($scope.newKey.alias == null || $scope.newKey.alias=="") {
                    $scope.newKey.alias="";
                    throw "No Alias";
                }
                base32String = Base32Decode($scope.newKey.secret);
                keyService.setKey($scope.newKey);
                $rootScope.$broadcast("keysUpdated","KeysUpdated");
                $scope.modal.hide();
                $state.go('home.accountList', {"keyAlias" : $scope.newKey.alias});
            }
            catch(err)
            {

                $ionicPopup.show({
                    template: "<style>.popup { width:500px; border-radius:2em; }</style><p>Secret Key entered is invalid. Please enter a valid Secret Key.<p/>" + err,
                    title: 'Invalid Secret key',
                    scope: $scope,
                    buttons: [
                        {
                            text: '<b>OK</b>',
                            type: 'button-balanced'
                        }
                    ]
                });
                $scope.newKey.secret="";

                return true;
            }


        }
    };

    $scope.delete=function(alias){
        console.log(alias);
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Totp Key',
            template: 'Are you sure you want to delete this key ?'
        });
        confirmPopup.then(function(res) {
            if(res) {

                keyService.deleteKeyByAlias(alias);
                $scope.keys = keyService.getAllKeys();
                if($scope.keys.length ===0){
                    $state.go("home.startHere");
                }
                else{
                    $state.go("home.accountList");
                }
            } else {

            }
        });
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
.controller("StartHereController",function($scope,
                                           $ionicSideMenuDelegate,
                                           $ionicActionSheet,
                                           $state,
                                           $ionicModal,
                                           keyService,
                                           $timeout,
                                           QRScanService, $ionicPopup,$rootScope){




})
.controller("AccountListController", function($scope,
                                               $state,
                                               $ionicSideMenuDelegate,
                                               $ionicActionSheet,
                                               $ionicListDelegate,
                                               $ionicModal,
                                               $rootScope,
                                               QRScanService,
                                               $ionicPopup,
                                               roundProgressService,
                                               keyService,
                                               TotpFactory){

    $ionicSideMenuDelegate.canDragContent(false);

    $scope.shouldShowDelete=false;
    $scope.listCanSwipe=true;


    $scope.current =        0;
    $scope.max =            30;
    $scope.uploadCurrent =  0;
    $scope.stroke =         15;
    $scope.radius =          35;
    $scope.isSemi =         false;
    $scope.rounded =        false;
    $scope.clockwise =      true;
    $scope.currentColor =   '#0074d6';
    $scope.bgColor =        '#dde';
    $scope.iterations =     1;
    $scope.currentAnimation = 'linearEase';

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


    $scope.keys = keyService.getAllKeys();
    updateTotp();

    $rootScope.$on("keysUpdated", function(){

        $scope.keys = keyService.getAllKeys();
        updateTotp();
    })


    function updateTotp(){
        if($scope.keys ==null || $scope.keys.length ===0){
            $state.go("home.startHere");
        }
        else {
            for (i=0; i< $scope.keys.length;i++) {
                var key = $scope.keys[i];

                //console.log("Key Al : " + keyAl);
                if (key != null) {
                    var keyAl = key.alias;
                    TotpFactory.fetchTotp(keyAl, function (totp, countDown) {
                        //console.log(key);
                        $scope.keys[i].currentTotp = totp;
                        $scope.keys[i].current = countDown;
                        if(countDown <6){
                            $scope.currentColor = 'red';
                        }
                        else{
                            $scope.currentColor =   '#0074d6';
                        }
                    });
                }
            }
        }
    }

    $scope.swipedLeft=function(){
        $ionicListDelegate.showDelete(true);
        $scope.shouldShowDelete = true;

    };

    $scope.deleteAllAccounts = function(){
        //console.log("I am in deleteAllAccounts");
        keyService.deleteAllKeys();
        $scope.keys = keyService.getAllKeys();
        if($scope.keys.length ===0){
            $state.go("home.startHere");
        }
    }

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

    $scope.newKey  = {alias:'',secret:'',timeBased:'true'};
    $scope.editOrNew = 'false';
    /* Modal Popup Definitions*/

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

    $scope.createOrUpdateAccount = function(){

        var base32String = null;
        try {
            if($scope.newKey.alias == null || $scope.newKey.alias=="") {
                $scope.newKey.alias="";
                throw "No Alias";
            }
            base32String = Base32Decode($scope.newKey.secret);
            keyService.setKey($scope.newKey);
            $rootScope.$broadcast("keysUpdated","KeysUpdated");
            $scope.modal.hide();
            $state.go('home.showTotp', {"keyAlias" : $scope.newKey.alias});
        }
        catch(err)
        {

            $ionicPopup.show({
                template: "<style>.popup { width:500px; border-radius:2em; }</style><p>Secret Key entered is invalid. Please enter a valid Secret Key.<p/>" + err,
                title: 'Invalid Secret key',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>OK</b>',
                        type: 'button-balanced'
                    }
                ]
            });
            $scope.newKey.secret="";

            return true;
        }


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
                { text: '<i class="icon fa fa-qrcode fa-fw"></i> Scan Barcode' },
                { text: '<i class="icon fa fa-pencil-square-o fa-fw"></i>  Enter Key Manually' }
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
                                        template: 'No Code could be scanned since user canceled scanning!'
                                    });
                                });
                            }
                            else {
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


    };


});