angular.module('views.onboarding.select', [
]);
angular.module('views.onboarding.select').

config(function ($stateProvider) {
    $stateProvider.
    state('app.onboarding.select', {
        url: '',
        template: require('./tpls/onboarding-select.html'),
        controller: 'OnboardingSelectViewCtrl',
    })
}).

controller('OnboardingSelectViewCtrl', function ($scope, $state) {


});