import './banner-header.scss';

angular.module('modules.banner-header', []);
angular.module('modules.banner-header').
directive('bannerheader', function ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            colour    : "=",
            text      : "@?",
            image     : "@?",
            angle     : "=?",    // 90deg || 0deg etc
            showClose    : '=?', // true || false - Shows or hides the close button
            showBlur     : '=?', // true || false - Enables Blur on scroll
            showLightbox : '=?'  // true || false - Enables lightbox for Image
        },
        link: function (scope, element, attrs) {
            // Watch the scroll position. Blur the image as scroll occurs
            if (scope.showBlur){
                var windowEl = angular.element($window);
                var blurOnScroll = function () {
                    var scrollPosition = windowEl.scrollTop();
                    var opacityVal = (scrollPosition / 400);
                    element.css({
                        'opacity' : 1,
                        '-webkit-filter' : 'blur('+20*opacityVal+'px)',
                        'filter' : 'blur('+20*opacityVal+'px)',
                    });
                }
                windowEl.on('scroll', scope.$apply.bind(scope, blurOnScroll));
                blurOnScroll();
            }
        },

        controller : function($scope){
            $scope.angle = $scope.angle || '90deg';

            // If showLightbox is true, set the lightbox image src
            if($scope.showLightbox){
                $scope.lightboxImage = $scope.image;
            }
        },
        template: require('./banner-header.html'),
    };
}).
directive('blurOnScroll', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var coeff
            if(attrs.blurOnScroll){
                coeff = parseInt(attrs.blurOnScroll)
            }
            else{
                coeff = 400
            }
            // Watch the scroll position. Blur the image as scroll occurs
            var windowEl = angular.element($window);
            var blurOnScroll = function () {
				// Only if window bigger thatn 600px
				if($window.innerWidth >= 600){
					var scrollPosition = windowEl.scrollTop();
					var opacityVal = (scrollPosition / coeff);
					element.css({
						'opacity' : 1,
						'-webkit-filter' : 'blur('+10*opacityVal+'px)',
						'filter' : 'blur('+10*opacityVal+'px)',
					});
				}
            }
            windowEl.on('scroll', scope.$apply.bind(scope, blurOnScroll));
            blurOnScroll();
        }
    };
}).
directive('parralaxOnScroll', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var coeff
            if(attrs.parralaxOnScroll){
                coeff = parseInt(attrs.parralaxOnScroll)
            }
            else{
                coeff = 3
            }
            // Watch the scroll position. Blur the image as scroll occurs
            var windowEl = angular.element($window);
            var blurOnScroll = function () {
				// Only if window bigger thatn 600px
				if($window.innerWidth >= 600){
					var scrollPosition = windowEl.scrollTop();
					var val = (scrollPosition / coeff);
					element.css({
						'transform' : 'translateY('+val+'px)'
					});
				}
            }
            windowEl.on('scroll', scope.$apply.bind(scope, blurOnScroll));
            blurOnScroll();
        }
    };
});