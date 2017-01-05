import './toc.scss';

angular.module('modules.toc', []);
angular.module('modules.toc').

directive('tocContent', function(){
    // This directive tkes in ngModel
    // It inspects this for h1,h2,h3 etc
    // These are used to created the TOC sections objects.
    return {
        restrict:'A',
        scope : {
            tocPrepend : '=?',
            tocAppend  : '=?',
            tocContent : '=',
            tocRefresh : '=?'
        },
        controller: function ($scope, $document, $timeout, $element){
            //$timeout(UpdateTOC,0)
            $scope.$watch('tocRefresh', function(){
                if($scope.tocRefresh){
                    $timeout(UpdateTOC,0)
                }
            })

            /////////////////////////////////////

            function UpdateTOC() {
                var tocContent = angular.copy($scope.tocPrepend) || [];
                angular.forEach($element[0].querySelectorAll('h2,h3'), function (element) {
					var id = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
					element.id = id;
                    var tocHeading = {
						id      : id,
                        level   : element.tagName, // Set level so it can be used as class (section/h1/h2)
                        label   : angular.element(element).text().slice(-1) === ':' ? angular.element(element).text().slice(0, -1) : angular.element(element).text(), // remove colon from end of text line if exists
                        element : element, // Set the element
                    }
                    if(tocHeading.label.length>2){ // Only push if the heading has content (aka a label)
					   tocContent.push(tocHeading)
                    }
                });
                // Add the tocAppend data
                tocContent = tocContent.concat($scope.tocAppend);
				$scope.tocContent = tocContent;
            }
        }
    }
}).

directive('tocNav', function(){
    return {
        restrict:'E',
        scope : {
            sections : '=',
        },
        template: require('./tpls/toc.html'),
        controller: function ($scope, $document){

        }
    }
});
