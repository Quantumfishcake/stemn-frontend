angular.module('modules.app-version', []);
angular.module('modules.app-version').
run(function ($http, ErrorModalService, $timeout) {
//
//	// The 'appVersionPlaceholder' is overwritten as part of the grunt build
//	var appVersion = '%%appVersionPlaceholder%%';
//
//	// Get the config details from the server
//	$http.get('/api/v1/config').then(function(response) {
//		var config = response.data;
//		// If versions dont match, we are out of date
//		if(appVersion.indexOf('appVersionPlaceholder') > -1){
//			console.error('Grunt not setting App Version Placeholder');
//		} else {
//			if (config.version !== appVersion && config.environment !== 'development') {
//				console.log('local', appVersion, 'server', config.version);
//				$timeout(function(){
//					ErrorModalService.error(null, {
//						title : 'Old App Version',
//						body : '<p>Your browser has cached an old version of our website. You need to hard-refresh to get the new version.</p>',
//						cancelText  : 'Continue anyway',
//						confirmText : 'Get new version'
//					}).then(function(){
//						location.reload(true)
//					})
//				},3000)
//			}
//		}
//		// If we are in development but using production database, Warn modal.
//		if (config.environment === 'devlopment' && config.database === 'production') {
//			$timeout(function(){
//				ErrorModalService.error(null, {
//					title : 'You are running the production database',
//					body : '<p>Any changes you make will be reflected on the actual website!</p>',
//					confirmText : 'Proceed with caution'
//				})
//			},3000)
//		}
//	});
});