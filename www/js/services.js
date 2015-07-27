var app = angular.module('starter');

app.factory('keyService', function($localStorage){
  return{setKey:setKey,
         getKey:getKey,
         getAllKeys:getAllKeys,
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
