var app = angular.module('starter');

app.factory('keyService', function($localStorage){
  return{setKey:setKey,
         getKey:getKey,
         getAllKeys:getAllKeys,
         deleteKey:deleteKey,
         deleteKeyByAlias:deleteKeyByAlias,
         deleteAllKeys:deleteAllKeys
        };
    
    function setKey(keyInfo){
        var keys = null;
        var alias = keyInfo.alias;
        if($localStorage.keys ==null){
            $localStorage.keys = [];
        }
        $localStorage.keys.push(keyInfo);
    }
    
    
    function getKey(alias){
        var keys = [];
        keys = $localStorage.keys;
        
        for(i=0; i< keys.length;i++){
            var key = $localStorage.keys[i];
            
            if(key.alias === alias){
                return key;
            }
        }
        return null;
        
    }
    
    function getAllKeys(){
        return $localStorage.keys;

    }

    function deleteKey(key) {

        for(i=0;i<$localStorage.keys.length;i++){
            var storedKey = $localStorage.keys[i];
            if(storedKey.alias === key.alias){
                $localStorage.keys.splice(i,1);
                break;
            }
        }
    }

    function deleteKeyByAlias(alias) {

        for(i=0;i<$localStorage.keys.length;i++){
            var storedKey = $localStorage.keys[i];
            if(storedKey.alias === alias){
                $localStorage.keys.splice(i,1);
                break;
            }
        }
    }
    
    function deleteAllKeys(){
        $localStorage.keys=[];
    }
    
    
});

app.factory('QRScanService', [function () {

  return {
    scan: function(success, fail) {
      cordova.plugins.barcodeScanner.scan(
        function (result) { success(result); },
        function (error) { fail(error); }
      );
    }
  };

}]);

app.factory('AccountCreateService', function() {


});


app.factory('TotpFactory',function($timeout,keyService){

    var timeout = null;
    function fetchTotp(keyAlias, callback){
        stop();
        //console.log(keyAlias);

    //Real TOTP SecretKey --- JBSWY3DPEHPK3PXP


        timeout = $timeout(function(){
            var secretKey = keyService.getKey(keyAlias).secret;

            var totp = getTotp(secretKey);
            totp = totp.substring(0,3) + " " + totp.substring(3,6);

            var epoch = Math.round(new Date().getTime() / 1000.0);
            var countDown = 30 - (epoch % 30);
            callback(totp, countDown);
            if (epoch % 30 == 0){
                reset();
                fetchTotp(keyAlias,callback);
            }else{
                fetchTotp(keyAlias,callback);
            }
        }, 1);

        return null;

    }

    function stop(){
        if(timeout ===null) {
            $timeout.cancel(timeout);
        }
    }

    function reset(){
        stop();
        count = 1;
    }

    return { fetchTotp : fetchTotp };

});

app.factory("UtilActionService",function($ionicActionSheet,
                                         QRScanService,
                                         $ionicPopup,
                                         keyService){


    return {showActions:showActions,
            upsertKeys:upsertKeys};

    function showActions(optionList){

    }

});