angular.module('modules.publish', [
	'modules.transition-overlay'
]);
angular.module('modules.publish').

directive('publishShareLink', function ($mdDialog, $location) {
	// This will pop to the share-link model
	// [publishShareLink] = id
    return {
        restrict: 'A',
        link : function (scope, element, attrs){
			element.bind('click', function (event) {
				$mdDialog.show({
					template: require('./tpls/publish-share-link-modal.html'),
					controller: function (data, $scope) {
						$scope.url = $location.absUrl();
						$scope.cancel = function () {
							$mdDialog.cancel();
						};
						$scope.confirm = function () {
							$mdDialog.hide();
						};
					},
					clickOutsideToClose: true,
					targetEvent: event,
					locals : {
						data  : attrs.publishShareLink,
					},
				})
			})
		}
    };
}).

directive('clickUnpublish', function () {
    return {
        restrict: 'A',
        scope   : {
            entity : '=',
            saveFn : '&',
        },
        link : function (scope, element, attrs){
			element.bind('click', function (event) {
                scope.entity.published = false;
                console.log(scope.saveFn);
                scope.saveFn();
			})
		}
    };
}).


service('PublishService', function ($mdDialog, $mdToast) {
	var service = this

    this.entity   = {}; // Blog || Project || Question || Discussion entity
	this.showEdit = ''; // If edit should be shown

    this.selectStubModal    = selectStubModal; //function(event, entity, stubPrefix)
    this.missingFieldsToast = missingFieldsToast; //function(form)

	/////////////////////////////////////////


    function missingFieldsToast(form){
        var toast = $mdToast.simple()
            .content('You must add missing fields.')
            .theme('warn')
            .highlightAction(false)

        if(form && !form.$visible){
            toast.action('Edit')
        }
        $mdToast.show(toast).then(function (response) {
            if (response == 'ok') {
                // If the form is not visible - we change to edit mode
                if(!form.$visible){
                    form.$edit();
                }
            }
        });
    }

    function selectStubModal(event, entity, stubPrefix){
        stubPrefix = stubPrefix || ''; // Default the stub prepend
        return $mdDialog.show({
            template: require('./tpls/select-stub-modal.html'),
            controller: function(entity, $scope, CoreLibrary, SearchService){
                $scope.checkAvailability = checkAvailability; //function(name)
                $scope.entity = entity;

                var urlMapping = ['project','job','organisation','field','blog'];
                $scope.type = entity.entityType;

                if(urlMapping.indexOf(entity.type || entity.entityType) != -1){
                    $scope.urlType = entity.type || entity.entityType;
                }
                else{
                    $scope.urlType = 'thread'
                }


                checkAvailability(entity.name)

                /////////////////////////////////////////

                function checkAvailability(name) {
                    if(name){
                        $scope.stub = CoreLibrary.stubify(stubPrefix+name);
                        if ($scope.stub) {
                            SearchService.search({ type : $scope.type, key : 'stub', value : $scope.stub, match : 'insensitive', published : true }).then(function (response) {
                                if (response.data.length === 0) {
                                    $scope.Form.title.$setValidity('notavailable', true);
                                } else {
                                    $scope.Form.title.$setValidity('notavailable', false);
                                }
                            });
                        }
                    }
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.save = function () {
                    if($scope.Form.$valid){
                        $mdDialog.hide($scope.stub);
                    }
                };
            },
            locals: {
                entity : entity
            },
            targetEvent: event,
        })
    }
});