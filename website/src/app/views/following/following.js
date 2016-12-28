angular.module('views.following', [
    'modules.following'
]);
angular.module('views.following').

config(function ($stateProvider) {
    $stateProvider.
    state('app.following', {
        url : '/following',
        abstract: 'true',
        authLevel: 'user',
        template: '<ui-view></ui-view>',
        layout: {
            size: 'sm',
            footer: true
        }
    }).
    state('app.following.all', {
        url : '',
        template: require('./tpls/following-all.html'),
    }).
    state('app.following.fields', {
        url : '/fields',
        template: require('./tpls/following.html'),
        controller: function($scope){
            $scope.type  = 'field';
            $scope.title = 'Fields'
        },
    }).
    state('app.following.organisations', {
        url : '/organisations',
        template: require('./tpls/following.html'),
        controller: function($scope){
            $scope.type  = 'organisation';
            $scope.title = 'Organisations'
        },

    }).
    state('app.following.projects', {
        url : '/projects',
        template: require('./tpls/following.html'),
        controller: function($scope){
            $scope.type  = 'project';
            $scope.title = 'Projects';
        },
    }).
    state('app.following.threads', {
        url : '/threads',
        template: require('./tpls/following.html'),
        controller: function($scope){
            $scope.type  = 'thread';
            $scope.title = 'Blogs and Questions';
        },
    }).
    state('app.following.users', {
        url : '/users',
        template: require('./tpls/following.html'),
        controller: function($scope){
            $scope.type = 'user';
            $scope.title = 'Users';
        },
    })
});
