import './map.scss';
import 'ngGeolocation';

angular.module('views.map', [
    'modules.mapbox',
    'modules.maps',
    'ngGeolocation',
    'modules.prompt-overlay'
]);
angular.module('views.map').

config(function ($stateProvider) {
    $stateProvider.
    state('app.map', {
        url: '/map?type&c',
        template: require('./tpls/map.html'),
        controller: 'MapViewCtrl',
        layout: {
            size: 'lg',
            horizontalMenu: false,
            topBanner: false,
            chat: false
        },
    });
}).

controller('MapViewCtrl', function ($scope, Authentication, SearchService, CoreLibrary, $timeout, LayoutOptions, $geolocation, $location, $state, OrganisationModalService) {
    // Initialise Map objects
    var map, markerLayer;
    var mapCenter = [30, 0];
    var zoom = 4;

    // Formatting
    LayoutOptions.header.landing = true;
    $state.current.reloadOnSearch = false;

    // Initialise Query
    $scope.query = {
        type : 'project'
    };

    setDisplayLimit();
    processStateParams();

    $scope.setType = setType; //function(type)
    $scope.panToMarker = panToMarker; //function([lat,lng])
    $scope.geolocate = geolocate; //function()
    $scope.newOrganisation = newOrganisation; //function(event)
    $scope.$state = $state;
    $scope.$watch('$state.params', processStateParams); //Process Params whenever they change

    $scope.callback = function (mapboxMap) {
        map = mapboxMap;
        markerLayer = L.geoJson().addTo(map);
        markerLayer.on('mouseover', changeZIndex);
        var southWest = L.latLng(40.712, -74.227),
        northEast = L.latLng(40.774, -74.125),
        bounds = L.latLngBounds(southWest, northEast);
        map.zoomControl.removeFrom(map); // Remove zoom control
        map.setView(mapCenter, zoom); // Center Map
        getResults(); //initialise to get data
        map.on('move', _.debounce(getResults, 150));
        markerLayer.on('layeradd', function(e) {
          var marker = e.layer;
          var feature = marker.feature;
          marker.setIcon(L.icon(feature.properties.icon));
        });
    };


    ////////////////////////////////////////////////////////

    function getResults(){
        var _bounds = map.getBounds();
        var bounds = {
            northeast : {
                latitude  : _bounds._northEast.lat,
                longitude : _bounds._northEast.lng,
            },
            southwest: {
                latitude  : _bounds._southWest.lat,
                longitude : _bounds._southWest.lng,
            }
        }
        SearchService.search({
            type: $scope.query.type,
            location: bounds,
            select: ['_id', 'location', 'picture', 'name', 'blurb', 'stub'],
            size: 50
        }).then(function (response) {
            var currentIds = _.map(markerLayer._layers, 'feature.properties.id');

            // Determine which marks are new (they don't yet exist on the map)
            var newData = [];
            _.forEach(response.data, function(marker){
                if(currentIds.indexOf(marker._id) === -1){
                    // If it does not exist, we need to add it to the geoJson
                    newData.push(marker)
                }
            })
            var newGeoJson = toGeoJson(newData, $scope.query.type);
            markerLayer.addData(newGeoJson);
            setCenterUrlParam()


            // Remove
            markerLayer.eachLayer(function(layer) {
                var content = '<div class="marker-title">' + layer.feature.properties.title + '<\/div>' +
                '<div class="marker-description">'+ CoreLibrary.stringTruncate(layer.feature.properties.description, 140) + '<\/div>' +
                '<a class="text-green capitalise" href="'+CoreLibrary.getHref(layer.feature.properties.type,layer.feature.properties.stub)+'">Go To '+layer.feature.properties.type+'<\/a>';
                layer.bindPopup(content);
            });

            // Assign to scope
            $scope.results = $scope.results || [];
            CoreLibrary.assignArray($scope.results, response.data, '_id');
        });


    }

    function toGeoJson(results, type){
        var geoJson = [];
        _.forEach(results, function(item){
            var cropParam = type == 'project' ? '&crop=true' : '';
            geoJson.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": addLocationNoise(item._id, item.location[0].coords)
                },
                "properties": {
                    "id"   : item._id,
                    "stub" : item.stub,
                    "title": item.name,
                    "type" : type,
                    "description": item.blurb,
                    "icon": {
                        "iconId": 'marker-asffsafas',
                        "iconUrl": (item.picture || "/assets/images/default/user-1.png")+'?size=thumb' + cropParam,
                        "iconSize": [50, 50], // size of the icon
                        "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
                        "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
                        "className": "marker"
                    }
                }
            })
        })
        return geoJson;
    }

    function getEntityUrl(stub, type){

    }

    function addLocationNoise(id, coords){
        // Generate offset from the last 4 characters of hexadecimal id from -1 to +1
        var offset1 = ((parseInt(id.substr(20, 4),16)/Math.pow(16, 4) )-0.5)*2;
        var offset2 = ((parseInt(id.substr(16, 4),16)/Math.pow(16, 4) )-0.5)*2;
        return [
            coords[1] + offset1/2000,
            coords[0] + offset2/2000
        ]
    }

    function geolocate() {
        $geolocation.getCurrentPosition({
            timeout: 60000,
            enableHighAccuracy: true
        }).then(function (position) {


            L.circle([position.coords.latitude, position.coords.longitude], position.coords.accuracy, {
                color: '#136AEC',
                fillColor: '#136AEC',
                fillOpacity: 0.15,
                weight: 1,
                opacity: 0.5
            }).addTo(map);

            L.circleMarker([position.coords.latitude, position.coords.longitude], {
                color: '#136AEC',
                fillColor: '#136AEC',
                fillOpacity: 1,
                weight: 2,
                opacity: 0.9,
                radius: 5
            }).addTo(map);
//            var userIcon = L.icon({
//                iconUrl: Authentication.currentUser.picture,
//                iconSize: [50, 50],
//                iconAnchor: [25, 25],
//                popupAnchor: [0, -25],
//                className  : "marker"
//            });
//            L.marker([position.coords.latitude, position.coords.longitude], {icon: userIcon}).addTo(map);

            mapCenter = [position.coords.latitude, position.coords.longitude];
            zoom = 13;
            if(map){map.setView(mapCenter, zoom)}
        });
    }
    function panToMarker(latlng, id) {
        markerLayer.eachLayer(function(marker) {
            if (marker.feature.properties.id === id) {
                changeZIndex(marker._icon);
                marker.openPopup();
            }
        });

        map.setView(latlng, 15);
    }

    function setType(type){
        $scope.query.type = type;
        markerLayer.clearLayers();
        getResults();
    }

    var markerZIndex = 1000;
    function changeZIndex(eventOrElement){
        var markerEl = eventOrElement.layer ? angular.element(eventOrElement.layer._icon) : angular.element(eventOrElement);
        markerEl.css({
            'z-index'  : markerZIndex
        })
        markerZIndex++; //Iterate z-index
    }

    function processStateParams(){
        var validTypes = ['project', 'organisation', 'job']
        if(validTypes.indexOf($state.params.type)!=-1){
            $scope.query.type = $state.params.type;
        }
        if($state.params.c){
            var splitCenter = $state.params.c.split(':');
            mapCenter = [splitCenter[0], splitCenter[1]]
            zoom = splitCenter[2];
            if(map){
                map.setView(mapCenter, zoom); // Center Map
            }
        }
    }
    function setDisplayLimit(){
        // Sets a number of results so they full approx half the screen
        var resultHeight = 105;
        var windowHeight = window.innerHeight;
        $scope.displayLimit = Math.floor((windowHeight*0.5) / resultHeight);
    }

    var changeCounter = 0;
    function setCenterUrlParam(){
        // Dont set in first change
        if(changeCounter>=1){
            var center = map.getCenter();
            var centerString = center.lat+':'+center.lng+':'+map.getZoom();
            $location.search('c', centerString)
        }
        changeCounter++
    }

    function newOrganisation (event) {
        OrganisationModalService.organisationNewModal(event).then(function (result) {
            $state.go('app.organisation.settings.overview', {
                stub: result.stub,
            });
        })
    }
});