var app = angular.module('starter');

app.directive('showKeyEntry', ['$ionicModal', function($ionicModal) {

    return {
        restrict: 'E',
        scope: {
            externalScope : "="
        },
        replace: true,
        link: function($scope, $element, $attrs) {

            $ionicModal.fromTemplateUrl('partials/enterSecret.html', {
                scope: $scope.externalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal
            });

            $scope.externalScope.openModal = function() {
                $scope.modal.show()
            };

        }
    };
}]);