// requirements
const fs = require('fs');
const net = require('net');
const util = require('util');

// load config file
var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
let data = '';
var ACTION = process.argv[2];
//var n_byte_being_sent = 0;

const client = net.createConnection({port: config.PORT_NUMBER, host: config.SERVER_IP}, () => {
    console.log("connected to " + config.SERVER_IP + ":" + config.PORT_NUMBER);

    if (ACTION == 'register') send_json({command: "newkey"});
    else if (ACTION == 'consume') push_records(process.argv[3]);
    else if (ACTION == 'fetch') pull_records();

});

client.on('data', (chunk) => {
    var chunky = chunk.toString();
    try {
        if (chunky.includes('"done"')) {
            if (!chunky.startsWith('{')) {
                var start_done = chunky.lastIndexOf('{');
                data += chunky.substring(0, start_done);
                chunky = chunky.substring(start_done, chunky.length + 1);
            }
        }

        var obj = JSON.parse(chunky);

        if (obj.command == 'done') {

            response = JSON.parse(data);
            console.log('\t***\t' + response.print + '\t***\t');

            if (ACTION == 'fetch') {
                fs.writeFileSync('./gps_db_fetch.json', JSON.stringify(response.result));
            } else if (ACTION == 'register') {
                fs.writeFileSync(config.CLIENT_KEY_FILENAME, response.result);

            }
            client.end();
        } else {
            data += chunk;
        }
    } catch(err) {
        data += chunk;
    }
})
.on('done', () => {
    process.stdout.write('sending done...');
    // while (client.bytesWritten < n_byte_being_sent) { a=2;}
    client.write(JSON.stringify({command: "done"}), () => {
        console.log('ok');
    });
})
.on('end', () => {
    console.log('disconnected from server');
})
.setTimeout(10000, () => {
    console.log('socket timed out due to inactivity...');
    client.end();
});

function pull_records() {
    obj = {command: "get"};

    // read in the local client key
    if (fs.existsSync(config.CLIENT_KEY_FILENAME)) {
        obj.client_key = fs.readFileSync(config.CLIENT_KEY_FILENAME).toString();
    } else {
        throw new Error("No client key found... first, issue node gps_client.js register");
    }

    send_json(obj);
}