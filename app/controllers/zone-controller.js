'use strict';

uacaccDashboard.controller("ZoneController", ZoneController);

function ZoneController($scope, UacaccDataOp) {
    $scope.zones = {};
    $scope.zones.title = 'Zone Departures Stopped';
    $scope.zones.zone1Data = [];
    $scope.zones.zone2Data = [];
    $scope.zones.zone3Data = [];

    //initial call to data//
    UacaccDataOp.getZoneDetails()
        .success(function (zones) {
            bindDataToView($scope, zones);
            //$scope.$digest();
        })
        .error(function (err) {
            console.warn('Error occurred', err);
        });


    //real-time update using sockets//
    var socket = io();
    socket.on('zone_details', function (msg) {
        //console.log('Socket message', msg);
        bindDataToView($scope, msg);
        $scope.$digest();
    });
}

function bindDataToView($scope, msg) {
    $scope.zones.zone1Data = [];
    $scope.zones.zone2Data = [];
    $scope.zones.zone3Data = [];
    for (var i = 0; i < msg.length; i++) {
        if (msg[i].isStarted === true) {
            msg[i].cssClass = 'bg-success';
        }
        else {
            msg[i].cssClass = 'bg-danger';
        }
        switch (msg[i].zoneNumber) {
            case 1:
                $scope.zones.zone1Data.push(msg[i]);
                break;
            case 2:
                $scope.zones.zone2Data.push(msg[i]);
                break;
            case 3:
                $scope.zones.zone3Data.push(msg[i]);
                break;
            default:
                break;
        }
    }
    // console.log('Zone 1: ', $scope.zones.zone1Data);
    // console.log('Zone 2: ', $scope.zones.zone2Data);
    // console.log('Zone 3: ', $scope.zones.zone3Data);
    // $scope.$digest();
}