const fs = require('fs');

const lines = {
	portb_in:       1, // 0 pc_out
	pc_in:        2, // pc_in
	pc_inc:       4,
	addr_inl:     8,
	ram_out:      16,
	ram_in:       32,
	halt:         64,
	ir_in:        128,
	a_out:        256,
	a_in:         512,
	b_out:        1024,
	b_in:         2048,
	alu_out:      4096,
	alu_in:       8192,
	t_reset:      16384,
	disp_in:      32768,
	c_out:        65536,
	z_out:        131072,
	s_out:        262144,
	flags_inv:    524288,
	alu_stc:      1048576,
	alu_clc:      2097152,
	alu_sel1:      4194304,
	rom_out:      8388608,
	
	addr_inh:     16777216,
	pc_abus_out:  33554432,
	sp_abus_out:  67108864,
	addr_abus_out:134217728,
	
	porta_in:    268435456,
	c29:          536870912,
	sp_dec:          1073741824,
	sp_inc:          2147483648,
}
const lines2 = {
	pc_outl:       1, // 0 pc_out
	pc_outh:        2, // pc_in
	alu_sel2:       4,
	c3:     8,
	c4:      16,
	c5:       32,
	c6:         64,
	c7:        128,
}

const instr = {
	hlt: {
		opcode: 0,
		steps: [
			lines.halt
		]
	},
	nop: {
		opcode: 1,
		steps: [
		]
	},
	ldai: {
		opcode: 2,
		steps: [
			lines.pc_abus_out +lines.rom_out + lines.pc_inc + lines.a_in,
		]
	},
	lda: {
		opcode: 3,
		steps: [
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.ram_out + lines.a_in,
		]
	},
	ldbi: {
		opcode: 4,
		steps: [
			lines.pc_abus_out +lines.rom_out + lines.pc_inc + lines.b_in,
		]
	},
	ldb: {
		opcode: 5,
		steps: [
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.ram_out + lines.b_in,
		]
	},
	addb: {
		opcode: 6,
		steps: [
			lines.b_out + lines.alu_in,
		]
	},
	outa: {
		opcode: 7,
		steps: [
			lines.a_out + lines.disp_in,
		]
	},
	lra: {
		opcode: 8,
		steps: [
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.rom_out + lines.a_in,
		]
	},
	lrb: {
		opcode: 9,
		steps: [
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.rom_out + lines.b_in,
		]
	},
	outalu: {
		opcode: 10, // a
		steps: [
			lines.alu_out + lines.disp_in,
		]
	},
	stralu: {
		opcode: 11, // b
		steps: [
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.alu_out + lines.ram_in,
		]
	},
	jmp: {
		opcode: 12, // c
		steps: [
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.pc_in,
		]
	},
	alu2a: {
		opcode: 13, // d
		steps: [
			lines.alu_out + lines.a_in,
		]
	},
	mvax: {
		opcode: 14, // e
		steps: [
			lines.porta_in + lines.a_out,
		]
	},
	mvay: {
		opcode: 15, // f
		steps: [
			lines.portb_in + lines.a_out,
		]
	},
	call: {
		opcode: 16, // 10
		steps: [
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inh,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec,
			lines.addr_abus_out + lines.pc_in,
		],
		steps2: [
			0,
			0,
			lines2.pc_outl,
			lines2.pc_outh,
			0,
		]
	},
	ret: {
		opcode: 17, // 11
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.ram_out + lines.sp_inc +lines.addr_inl,
			lines.sp_abus_out + lines.ram_out +lines.addr_inh,
			lines.addr_abus_out + lines.pc_in,
		],
		steps2: [
			0,
			0,
			0,
			0,
		]
	},
	subb: {
		opcode: 18, // 12
		steps: [
			lines.b_out + lines.alu_in + lines.alu_sel1,
		]
	},
	xorb: {
		opcode: 19, // 13
		steps: [
			lines.b_out + lines.alu_in,
		],
		steps2: [
			lines2.alu_sel2,
		]
	},
	andb: {
		opcode: 20, // 14
		steps: [
			lines.b_out + lines.alu_in + lines.alu_sel1,
		],
		steps2: [
			lines2.alu_sel2,
		]
	},
	jmpz: {
		opcode: 21, // 15
		steps: [
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.z_out + lines.pc_in,
		]
	},
	mvza: {
		opcode: 22, // 16
		steps: [
			lines.a_in + lines.alu_out,
		]
	},
	andi: {
		opcode: 23, // 17
		steps: [
			lines.pc_abus_out +lines.rom_out + lines.pc_inc + lines.alu_in + lines.alu_sel1,
		],
		steps2: [
			lines2.alu_sel2,
		]
	},
	subi: {
		opcode: 24, // 18
		steps: [
			lines.pc_abus_out +lines.rom_out + lines.pc_inc + lines.alu_in + lines.alu_sel1,
		],
		steps2: [
			0
		]
	},
}

function output() {
	console.log('v3.0 hex words addressed');
	var file = 'v3.0 hex words addressed\n';

	for (let i = 0; i < 256; i++) {
		const lineprefix = (i*8).toString(16).padStart(3, "0")+':';

		var found = false;
		for (let j of Object.keys(instr)){
			if(instr[j].opcode == i) {
				found = true;
			
				var lineops = ' '+((lines.pc_abus_out + lines.rom_out + lines.pc_inc +lines.ir_in).toString(16).padStart(8,'0'));

				for( let k = 0; k < 7;k++) {
					if(instr[j].steps.length > k)
					{
						lineops+= ' '+(instr[j].steps[k].toString(16).padStart(8,'0'));
					}
					else{
						lineops+= ' '+(lines.t_reset.toString(16).padStart(8,'0'));
					}
				}
				console.log(lineprefix+lineops);
				file+=lineprefix+lineops+'\n';

			}
		}
		if(! found) console.log(lineprefix+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		if(! found) file+=lineprefix+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
	}
	fs.writeFileSync('mc1',file);

}
function output2() {
	console.log('v3.0 hex words addressed');
	var file = 'v3.0 hex words addressed\n';

	for (let i = 0; i < 256; i++) {
		const lineprefix = (i*8).toString(16).padStart(3, "0")+':';

		var found = false;
		for (let j of Object.keys(instr)){
			if(instr[j].opcode == i) {
				found = true;
			
				var lineops = ' 00';

				for( let k = 0; k < 7;k++) {
					if(instr[j].steps2 && instr[j].steps2.length > k)
					{
						lineops+= ' '+(instr[j].steps2[k].toString(16).padStart(2,'0'));
					}
					else{
						lineops+= ' 00';
					}
				}
				console.log(lineprefix+lineops);
				file+=lineprefix+lineops+'\n';

			}
		}
		if(! found) console.log(lineprefix+' ff ff ff ff ff ff ff ff');
		if(! found) file+=lineprefix+' ff ff ff ff ff ff ff ff\n';
	}
	fs.writeFileSync('mc2',file);

}


output();
output2();
