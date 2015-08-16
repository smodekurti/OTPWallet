function showActionSheet(displayOptions,scope,$ionicModal,QRScanService,$ionicActionSheet){

    var hideSheet = $ionicActionSheet.show({
        buttons: [
            {text: '<i class="icon fa fa-qrcode fa-fw"></i> Scan Barcode'},
            {text: '<i class="icon fa fa-pencil-square-o fa-fw"></i>  Enter Key Manually'}
        ],
        titleText: 'Setup Options',
        cancelText: 'Cancel',
        cancel: function () {
            // add cancel code..
        },
        buttonClicked: function (index) {
            switch (index) {
                case 0:

                    QRScanService.scan(function (result) {
                        if (result.cancelled) {
                            // this is a super hack. When QR scan gets cancelled by
                            // clicking the back button on android, the app quits...
                            // doing a blank modal to catch the back button press event
                            $ionicModal.fromTemplate('').show().then(function () {
                                $ionicPopup.alert({
                                    title: 'QR Scan Cancelled',
                                    template: 'No Code could be scanned since user canceled scanning!'
                                });
                            });
                        }
                        else {
                            var secretParam = extractUrlValue('secret', result.text);

                            $scope.newKey.secret = secretParam;
                            $scope.modal.show().then(function (modal) {
                                //console.log("In Scope Modal");
                            });
                        }
                    }, function (error) {
                        $ionicPopup.alert({
                            title: 'Unable to scan the QR code',
                            template: 'Too bad, something went wrong.'
                        });
                    });

                    break;
                case 1:
                    $scope.newKey = {};
                    $scope.modal.show().then(function (modal) {

                    });
            }
            return true;
        }
    });
}