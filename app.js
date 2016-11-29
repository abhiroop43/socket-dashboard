var express = require('express'),
    debug = true,
    http = require('http'),
    _ = require('underscore'),
    zoneDetailsRefreshTimer = 10000,
    parkingSpaceRefreshTimer = 10000;

var app = express();
// var http = require('http').Server(app);
var io = require('socket.io').listen(app.listen(3000), { log: debug });
var apiHost = "auhportal2016p1";
var clients = {};


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/index.html');
});
app.use('/app', express.static(__dirname + '/app'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/dist', express.static(__dirname + '/dist'));

io.sockets.on('connection', function (socket) {
    console.log('Client ' + socket.id + ' is connected');

    // Add the client to the list of connected clients
    clients[socket.id] = true;

    // Broadcast to everyone the list of connected clients
    io.sockets.emit('connected_clients', _.size(clients));

    // get the zones//
    socket.on('ready', function () {
        getZoneDetails(function (data) {
            console.log('Send zones to client ' + socket.id);
            socket.emit('zone_details', data);
        });
        getParkingSpaceDetails(function (data) {
            console.log('Send parking space details to client ' + socket.id);
            socket.emit('ps_details', data);
        });
    });

    // When a client is disconnecting, inform other clients
    socket.on('disconnect', function () {
        delete clients[socket.id];
        console.log('Client "' + socket.id + '" disconnected');
        io.sockets.emit('connected_clients', _.size(clients));
    });

});

//Get Parking Space details every minute
setInterval(function () {
    // Do nothing if there is no client
    if (_.size(clients) == 0) {
        return;
    }

    console.log('Getting Zone Details...');

    // Get the current courses and broadcast them to all clients
    getZoneDetails(function (data) {
        io.sockets.emit('zone_details', data);
    });
}, zoneDetailsRefreshTimer); // every minute

//Get Zone details every minute
setInterval(function () {
    // Do nothing if there is no client
    if (_.size(clients) == 0) {
        return;
    }

    console.log('Getting Parking Space Details...');

    // Get the current courses and broadcast them to all clients
    getParkingSpaceDetails(function (data) {
        io.sockets.emit('ps_details', data);
    });
}, parkingSpaceRefreshTimer); // every minute


function getZoneDetails(callback) {
    var options = {
        protocol: 'http:',
        hostname: apiHost,
        port: 10004,
        path: '/api/zone',
        method: 'GET',
        headers: { "Accept": "application/json" }
    };

    var req = http.request(options, function (res) {
        console.log('-----------------------------------------');
        //console.log('Response: ' + res);
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        var output = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(output);
            if (callback != undefined) {
                callback(obj);
            }
        });
    });

    req.on('error', function (e) {
        console.log('problem with request get zone details: ' + e.message);
    });

    req.end();
}

function getParkingSpaceDetails(callback) {
    var options = {
        protocol: 'http:',
        hostname: apiHost,
        port: 10004,
        path: '/api/parkingspace',
        method: 'GET',
        headers: { "Accept": "application/json" }
    };

    var req = http.request(options, function (res) {
        console.log('-----------------------------------------');
        //console.log('Response: ' + res);
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        var output = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(output);
            if (callback != undefined) {
                callback(obj);
            }
        });
    });

    req.on('error', function (e) {
        console.log('problem with request get parking space: ' + e.message);
    });

    req.end();
}