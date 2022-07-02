const fs = require('fs');
const { SerialPort } = require('serialport');

const port = new SerialPort({
  path: 'COM8',
  baudRate: 500000,
});
const { ReadlineParser } = require('@serialport/parser-readline')


var rom = fs.readFileSync('demo_prime.bin');

console.log(rom.length);

var currAddr = 0;
//var mode = 'compare'; // erase ; compare
var mode = 'erase'; // erase ; compare
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', function(data){
	if(data == 'BOOT' || data == 'DONE'){
		if(currAddr == rom.length && mode == 'erase'){
			currAddr = 0;
			mode = 'write';
			console.log('erased');
		}
		if(currAddr == rom.length && mode == 'write'){
			currAddr = 0;
			mode = 'compare';
			console.log('done writing');
		}

		if(mode == 'erase'){
			var cmd = 'WR'+currAddr.toString(16).padStart(4,'0')+'ff\n';
			currAddr++;
			port.write(cmd);
		}
		if(mode == 'write'){
			var cmd = 'WR'+currAddr.toString(16).padStart(4,'0')+rom[currAddr].toString(16).padStart(2,'0')+'\n';
			currAddr++;
			port.write(cmd);
		}
		if(mode == 'compare'){
			var cmd = 'RD'+currAddr.toString(16).padStart(4,'0')+'\n';
			port.write(cmd);
		}
	}else{
		var red = data.padStart(2,'0');
		if(red != rom[currAddr].toString(16).toUpperCase().padStart(2,'0')){
			console.log('mismatch at '+currAddr.toString(16),red,rom[currAddr].toString(16).toUpperCase().padStart(2,'0'));
		}
		if(currAddr < (rom.length-1)){
			currAddr++;
			var cmd = 'RD'+currAddr.toString(16).padStart(4,'0')+'\n';
			port.write(cmd);
		}else{
			mode = 'finished';
			console.log('compare completed');
			port.close();
		}

	}
})

port.on('open', async () => {
	console.log('serial port opened');
})




