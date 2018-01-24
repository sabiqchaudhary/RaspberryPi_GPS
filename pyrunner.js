/* Runs the program gps_interface.py. It will call the python shell using nodejs and run the program.*/



const PythonShell = require('python-shell');

PythonShell.run('gps_interface.py', function (err) {
  if (err) throw err;
  console.log('finished');
});