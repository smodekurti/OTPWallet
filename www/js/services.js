var app = angular.module('starter');

app.factory('keyService', function($localStorage){
  return{setKey:setKey,
         getKey:getKey,
         getAllKeys:getAllKeys,
         deleteKey:deleteKey,
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
        console.log(key);
        for(i=0;i<$localStorage.keys.length;i++){
            var storedKey = $localStorage.keys[i];
            if(storedKey.alias === key.alias){
                $localStorage.keys.pop();
                break;
            }
        }
    }
    
    function deleteAllKeys(){
        $localStorage.keys=[];
    }
    
    
});

app.factory('QRScanService', [function ($cordovaBarcodeScanner) {

  return {
    scan: function(success, fail) {
        $cordovaBarcodeScanner.scan(
        function (result) { success(result); },
        function (error) { fail(error); }
      );
    }
  };

}]);

app.factory('AccountCreateService', function() {

    return
    {

    }

});
