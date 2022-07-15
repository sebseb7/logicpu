const execSync = require('child_process').execSync;
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.static('pub'));
app.get('/', function(req, res) {
	res.sendFile(__dirname+'/index.html');
});

app.use(express.json());
app.post('/assemble', function (req, res) {
	
	fs.writeFileSync(__dirname+"/code.asm", Buffer.from(req.body.asm));
	var result;
	var bin;
	try {
		result = execSync('/usr/local/bin/bespokeasm compile -s 32768 -e 65535 -c isa.yaml code.asm -p');
		bin = fs.readFileSync(__dirname+"/code.bin");

	}
	catch (err){
		result = err.stderr;
	}
	res.send({bin:bin,debug:result.toString()});
	res.end();
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

