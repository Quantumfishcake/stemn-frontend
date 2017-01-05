import basicTpl       from 'ngtemplate!./tpls/project-create-modal.basic.html';
import permissionsTpl from 'ngtemplate!./tpls/project-create-modal.permissions.html';

angular.module('modules.project.project-create-modal', [
]);
angular.module('modules.project.project-create-modal').

service('ProjectCreateModalService', function ($mdDialog, $timeout) {
    this.newProject = function (event, data) {
        /********************************************************************
        We pass data into the modal to tell it which fields, orgs and project
        that it should automaticaly tag.
        We MUST include the thread type
            data = {
                fields        : [],
                organisations : [],
                projects      : [],
            }
        ********************************************************************/
        return $mdDialog.show({
            template: require('./tpls/project-create-modal.html'),
            controller: 'ProjectCreateModalCtrl',
            targetEvent: event,
            locals: {
                data: data
            }
        })
    }
}).

controller('ProjectCreateModalCtrl', function (data, $scope, $state, $mdDialog, ProjectCreateModalService, LicenseData, NewCreationsService, CoreLibrary) {
    $scope.forms = {};
    $scope.project = data || {};

    $scope.project.permissions             = $scope.project.permissions || {};
    $scope.project.permissions.projectType = $scope.project.permissions.projectType || 'public';
    $scope.project.license                 = $scope.project.license || 'CC BY';
    $scope.project.stub                    = CoreLibrary.getRandomString(30);

    $scope.activeTab = {};
    $scope.tabs = [
        {
            label: 'General',
            path: basicTpl,
            click: function(){
                $scope.activeTab.label = this.label;
                $scope.activeTab.path  = this.path;
            }
        },{
            label: 'Permissions',
            path: permissionsTpl,
            click: function(){
                $scope.activeTab.label = this.label;
                $scope.activeTab.path  = this.path;
            }
        }
    ];
    $scope.tabs[0].click();


    $scope.steps = {
        'General' : {
            nextText : 'Next',
            nextFn : function(){
                $scope.tabs[1].click();
            },
            isDisabled: function(){
                return $scope.forms.generalForm && $scope.forms.generalForm.$invalid;
            }
        },
        'Permissions' : {
            nextText : 'Create Project',
            nextFn : function(){
                if(!$scope.submitted){
                    $scope.submitted = true;
                    NewCreationsService.create('project', $scope.project);
                }
            },
        },
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
});