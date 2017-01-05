import './edit-toolbar.scss';
angular.module('modules.edit-toolbar', [
]);
angular.module('modules.edit-toolbar').


directive('editToolbar', function () {
    // This will run the function when Ctrl+Enter is pressed on the element
    return {
        restrict: 'A',
        scope: {
            saveFn: '&?',
            editFn: '&?',
            endEditFn: '&?',
            data: '=?', // form model data
        },
        controller: function ($scope, $element, $compile, $dynamicFooter, $q, $stateParams, $timeout, $state, $location, TopBannerService, LayoutOptions) {
            $scope.form = $element.inheritedData('$formController');
            $scope.form.$edit = edit;
            $scope.form.$cancel = cancel;
            $scope.form.$save = save;
            $scope.form.$endEdit = endEdit; // like cancel but no data revert
            //			$scope.$on('$destroy', onDestroy);

            ////////////////////////////////////////////////

            var initialFormData, loadingOverlayEl // Copy of the data inital data fields

            function edit() {
                LayoutOptions.overlay.loading = true;
                // Run the edit function (this often a $state.go function for multi-tab pages)
                $scope.editFn();
                // This is in a timeout so the loading overlay show before the laggy display re-render
                $timeout(function () {
                    $scope.form.$visible = true;
                    $dynamicFooter.enabled = false;
                    initialFormData = _.clone($scope.data, true);
                    $element.addClass('edit-active')
                    TopBannerService.hideBanner();
                    // Timeout remove overlay so it happens after re-render
                    $timeout(function () {
                        LayoutOptions.overlay.loading = false
                    }, 0)
                }, 0)
            }

            function cancel() {
                formReset();
                endEdit();
            }

            function save() {
                $q.when($scope.saveFn()).then(function (result) {
                    endEdit();
                })
            }

            function endEdit() {
                LayoutOptions.overlay.loading = true;
                $timeout(function () {
                    $scope.form.$visible = false;
                    $dynamicFooter.enabled = true;
                    $element.removeClass('edit-active')
                    $scope.form.$setPristine();
                    // Remove any edit params from location
                    $state.current.reloadOnSearch = false;
                    $location.search('edit', null);
                    $scope.endEditFn();
                    $timeout(function () {
                        $state.current.reloadOnSearch = undefined;
                    });
                    $timeout(function () {
                        LayoutOptions.overlay.loading = false
                    }, 0)
                }, 0)
            }

            function onDestroy() {
                endEdit();
            }

            function formReset() {
                $scope.data = initialFormData;
            }

            // State Params activation ------------------------------------------------
            // This will active the form if the $stateParams.edit is the same as the
            // form name.
            // The form name is split at '.' to get the actual name:
            // 'forms.formgroup.formname' becomes 'formname'
            $timeout(function () {
                var formNameSplit = $scope.form.$name.split('.');
                var formName = formNameSplit[formNameSplit.length - 1]
                if ($stateParams.edit == formName) {
                    $scope.form.$edit();
                }
            });

        }
    };
}).

directive('saveButton', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            entity: '=',
            saveFn: '&',
            buttonClass: '@'
        },
        template: require('./tpls/save-button.html'),
        controller: function ($scope, $interval, XxhashService) {

            var currentHash, previousHash;
            $scope.save = save; //function()
            $scope.status = 'unsaved';


            $interval(checkForChange, 1000);

            function checkForChange() {
                var entity = _.clone($scope.entity, true);
                if(entity.sectionData){
                    entity.sectionData.sections = _.map(entity.sectionData.sections, function(section){
                        return {content: section.content}
                    })
                }
                currentHash = XxhashService(JSON.stringify(entity), 0xABCD).toString();
                if(currentHash != previousHash){
                    $scope.status = 'unsaved';
                }
                else{
                    $scope.status = 'saved';
                }
            }

            function save(){
                previousHash = currentHash;
                $scope.status = 'saving';
                $scope.saveFn().then(function(response){
                    $scope.status = 'saved';
                })
            }

        }
    };
}).

directive('editToolbar', function () {
    return {
        restrict: 'E',
        transclude: true,
        template: require('./tpls/edit-toolbar.html'),
    };
});