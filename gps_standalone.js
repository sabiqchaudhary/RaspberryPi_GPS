/*var serialport = require('serialport');
var nmea = require('nmea');
 
var port = new serialport.SerialPort('/dev/cu.usbserial', {
                baudrate: 4800,
                parser: serialport.parsers.readline('\r\n')});
    
port.on('data', function(line) {
    console.log(nmea.parse(line));
});
*/
//include the module
var serialgps = require('serialgps');
 
//create a new instance. arguments are serial port and baud rate
var gps = new serialgps('/dev/ttyUSB0',9600);
 
//monitor for data
gps.on('data', function(data) {
    console.log(data);
});
