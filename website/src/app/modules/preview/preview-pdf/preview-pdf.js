angular.module('modules.preview.pdf', []);

angular.module('modules.preview.pdf').
directive('previewPdf', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            fileUrl : '@',
        },
        template: require('./tpls/preview-pdf.html'),
        controller: function($scope){
            console.log($scope.fileUrl);
            $scope.loading = true;
            window.pdfLoadCompleteCallback = function(){
                $scope.loading = false;
                $scope.$apply();
            }
        }
    };
});