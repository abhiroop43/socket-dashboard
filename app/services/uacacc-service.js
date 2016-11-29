'use strict';

var UacaccService = angular.module('UacaccService', []).factory('UacaccDataOp', ['$http', function ($http) {
    var baseUrl = 'http://auhportal2016p1:10004';
    var UacaccDataOp = {};

    UacaccDataOp.getZoneDetails = function () {
        return $http.get(baseUrl + '/api/zone');
    }

    UacaccDataOp.getParkingSpaceDetails = function () {
        return $http.get(baseUrl + '/api/parkingspace');
    }

    return UacaccDataOp;
}]);
