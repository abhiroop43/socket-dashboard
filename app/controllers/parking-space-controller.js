'use strict';

uacaccDashboard.controller('ParkingSpaceController', ParkingSpaceController);

function ParkingSpaceController($scope, UacaccDataOp) {
    $scope.ps = {};
    $scope.ps.parkingSpaces = [];

    UacaccDataOp.getParkingSpaceDetails()
        .success(function (parkingSpaces) {
            //console.log('Parking spaces returned from service', parkingSpaces);
            bindParkingSpaces($scope, parkingSpaces);
            //console.log('Update Parking Space Data', $scope.ps.parkingSpaces);
        })
        .error(function (err) {
            console.warn('Error occurred while getting parking spaces', err);
        });

    //real-time update using sockets//
    var socket = io();
    socket.on('ps_details', function (parkingSpaces) {
        //console.log('Parking spaces returned from socket', parkingSpaces);
        bindParkingSpaces($scope, parkingSpaces);
        $scope.$digest();
    });
}

function bindParkingSpaces($scope, parkingSpacesData) {

    for (var i = 0; i < parkingSpacesData.length; i++) {
        //format last update time//
        var lastUpdate = moment(parkingSpacesData[i].lastUpdateOn).format('MM/DD/YYYY HH:mm:ss');
        parkingSpacesData[i].lastUpdateOn = lastUpdate;

        if (parkingSpacesData[i].mediumSpace < 4 && parkingSpacesData[i].mediumSpace > 0) {
            parkingSpacesData[i].mediumCssClass = 'bg-warning';
        }
        if (parkingSpacesData[i].mediumSpace <= 0) {
            parkingSpacesData[i].mediumCssClass = 'bg-danger';
        }
        if (parkingSpacesData[i].mediumSpace >= 4) {
            parkingSpacesData[i].mediumCssClass = 'bg-success';
        }

        if (parkingSpacesData[i].heavySpace < 4 && parkingSpacesData[i].heavySpace > 0) {
            parkingSpacesData[i].heavyCssClass = 'bg-warning';
        }
        if (parkingSpacesData[i].heavySpace <= 0) {
            parkingSpacesData[i].heavyCssClass = 'bg-danger';
        }
        if (parkingSpacesData[i].heavySpace >= 4) {
            parkingSpacesData[i].heavyCssClass = 'bg-success';
        }

        if (parkingSpacesData[i].superSpace < 4 && parkingSpacesData[i].superSpace > 0) {
            parkingSpacesData[i].superCssClass = 'bg-warning';
        }
        if (parkingSpacesData[i].superSpace <= 0) {
            parkingSpacesData[i].superCssClass = 'bg-danger';
        }
        if (parkingSpacesData[i].superSpace >= 4) {
            parkingSpacesData[i].superCssClass = 'bg-success';
        }
    }

    $scope.ps.parkingSpaces = parkingSpacesData;
}