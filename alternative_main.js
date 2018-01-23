const gps = require('gps');
const rpi_gpio = require('rpi-gpio');
const shell = require('shelljs');
const delay = require('delay');

//shell.echo('hello world');

//shell.ch('..');
shell.exec('sudo apt-get update');
shell.exec('sudo systemctl enable gpsd.sock ');
shell.exec('sudo systemctl start gpsd.sock');
shell.exec('sudo cgps -s ');

await delay(10000);

shell.exec('sudo systemctl stop gpsd.sock');
shell.exec('sudo systemctl disable gpsd.sock ');

