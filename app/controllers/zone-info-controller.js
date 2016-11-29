'use strict';

uacaccDashboard.controller('ZoneInfoController', ZoneInfoController);

function ZoneInfoController($scope) {
    $scope.zone1 = {};
    $scope.zone2 = {};
    $scope.zone3 = {};
    $scope.zone1.airports = ['OBBI', 'OTBD', 'OTHH', 'OISL',
        'OEDR', 'OIBK', 'OIKB', 'OIKQ',
        'OISS', 'OOMS', 'OOSA', 'OOSH'];
    $scope.zone2.airports = ['OEDF', 'OERK', 'ORMM', 'OERY',
        'OKBK', 'OOSA', 'OEAH'];
    $scope.zone3.airports = ['OEJN', 'OEMA', 'OIIE', 'OJAI',
        'ORER', 'ORBI', 'OPKC'];
}