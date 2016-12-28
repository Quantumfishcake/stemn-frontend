import './referrals.scss';

angular.module('views.referrals', []);
angular.module('views.referrals').

config(function ($stateProvider) {
    $stateProvider.
    state('app.referrals', {
        url: '/referrals',
        template: require('./referrals.html'),
        controller: function ($scope, HttpQuery, Authentication) {
            $scope.user = Authentication.currentUser;
            $scope.query = HttpQuery({
                url : '/api/v1/referrals/'+$scope.user.ref,
            });
            $scope.query.more();
        },
        authLevel: 'user',
        layout: {
            size: 'md',
            footer: true
        },
        seo: function(resolve){
            return {
                title : "Refer your friends, Win awesome prizes! - STEMN ",
            }
        }
    });
});
