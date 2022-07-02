const fs = require('fs');
const { SerialPort } = require('serialport');

// 0x70/112
// 0x7f/127
// 0xf0/240
// 0xff/255

var lines = {
	db_tar_sel0:  2**0,
	db_tar_sel1:  2**1,
	db_tar_sel2:  2**2,
	db_tar_sel3:  2**3,

	db_sel0:      2**4,
	db_sel1:      2**5,
	db_sel2:      2**6,
	db_sel3:      2**7,
	
	db_tar_sel4:  2**8,
	ab_sel0:      2**9,
	ab_sel1:      2**10,
	ab_sel2:      2**11,

	db_sel4:      2**12,
	alu_sel0:     2**13,
	alu_sel1:     2**14,
	alu_sel2:     2**15,

	c_jmp:        2**16,
	z_jmp:        2**17,
	n_jmp:         2**18,
	o_jmp:        2**19,

	unused:       2**20,
	instb_o:      2**21,
	instb_hi:     2**22,
	instb_ho:     (2**23)+(2**21),

	misc_sel0:    2**24,
	misc_sel1:    2**25,
	misc_sel2:    2**26,
	ir_in:        2**27,
	
	idx_in:       2**28,
	pc_in:        2**29,
	t_reset:      2**30,
	t_reset_pf:   2**31,

	addr_abus_out:0,
	sp_abus_out:  1<<9,
	irq_abus_out: 2<<9,
	pc_abus_out:  3<<9,
	idx_abus_out: 4<<9,
	off_abus_out: 5<<9,
	off2_abus_out:6<<9,

	mem_out:      0,
	a_out:        1<<4,
	b_out:        2<<4,
	c_out:        3<<4,
	d_out:        4<<4,
	e_out:        5<<4,
	f_out:        6<<4,
	g_out:        7<<4,

	h_out:        8<<4,
	off_outl:     9<<4,
	off_outh:     10<<4,
	alu_out:      11<<4,
	flags_out:    12<<4,
	unused:       13<<4,
	unused:       14<<4,
	pc_outh:      15<<4,

	pc_outl:      (0<<4) + (2**12),
	idx_outl:     (1<<4) + (2**12),
	idx_outh:     (2<<4) + (2**12),
	//mem_out:      (3<<4) + (2**12),
	io_out:       (4<<4) + (2**12),

	a_in:		  1,
	b_in:		  2,
	c_in:         3,
	d_in:         4,
	e_in:		  5,
	f_in:		  6,
	g_in:         7,

	h_in:         8,
	off_inl:      9,
	off_inh:      10,
	porta_in:     11,
	portb_in:     12,
	disp_in:      13,
	disp2_in:     14,
	ir2_in:       15,

	flags_in:     0 + (2**8),
	//alu_in:     1 + (2**8),
	op_in:        1 + (2**8),
	idx_inh:      2 + (2**8),
	idx_inl:      3 + (2**8),
	ram_in:       4 + (2**8),
	unused:       5 + (2**8),
	addr_inl:     6 + (2**8),
	addr_inh:     7 + (2**8),

	
	cie          :1<<24,
	sie          :2<<24,
	flags_inv    :3<<24,
	halt         :4<<24,
	sp_inc       :5<<24,
	sp_dec       :6<<24,
	alu_c        :7<<24,

	alu_none:    0<<13,
	alu_or:      1<<13,
	alu_and:     2<<13,
	alu_xor:     3<<13,
	alu_unused:  4<<13,
	alu_sub:     5<<13,
	alu_add:     6<<13,
	alu_rsh:     7<<13,

}
	
lines['prefetch'] = lines.pc_abus_out + lines.ir_in + lines.t_reset_pf + lines.t_reset;

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
			lines.prefetch
		]
	},
	jmp: {
		opcode: 2,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.pc_in + lines.t_reset,
		]
	},
	jmpcc: {
		opcode: 3,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.c_jmp + lines.flags_inv + lines.t_reset,
		]
	},
	jmpc: {
		opcode: 120,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.c_jmp + lines.t_reset,
		]
	},
	jmpz: {
		opcode: 4,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.z_jmp + lines.t_reset,
		]
	},
	jmpzc: {
		opcode: 121,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.z_jmp + lines.flags_inv + lines.t_reset,
		]
	},
	jmpo: {
		opcode: 122,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.o_jmp + lines.t_reset,
		]
	},
	jmpoc: {
		opcode: 123,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.o_jmp + lines.flags_inv + lines.t_reset,
		]
	},
	ret: {
		opcode: 5, 
		steps: [
			lines.sp_inc,
		//	lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.idx_inh,
		//	lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.idx_inl,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.addr_inl,
			lines.sp_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.pc_in + lines.t_reset,
		]
	},
	cie: {
		opcode: 6,
		steps: [
			lines.cie + lines.prefetch,
		]
	},
	sie: {
		opcode: 7,
		steps: [
			lines.sie + lines.prefetch,
		]
	},
	ld_r_i:{
		opcode: 8,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	ld_r_r:{
		opcode: 9,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_hi + lines.instb_o + lines.prefetch,
		]
	},
	ld_r_a:{
		opcode: 10,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	//ld_r_fpo
	ld_r_ao:{
		opcode: 12,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.off2_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	st_r_a:{
		opcode: 13,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.ram_in + lines.instb_ho + lines.t_reset,
		]
	},
	//st_r_fpo
	st_r_ao:{
		opcode: 15,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.off2_abus_out + lines.ram_in + lines.instb_ho + lines.t_reset,
		]
	},

	add_r_i:{
		opcode: 16,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	add_r_r:{
		opcode: 17,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	add_r_a:{
		opcode: 18,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//add_r_a
	//add_r_fpo

	add_r_ao:{
		opcode: 20,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.off2_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	addc_r_i:{
		opcode: 21,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_add + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	addc_r_r:{
		opcode: 22,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_add + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//addc_r_a
	//addc_r_fpo
	//addc_r_ao

	sub_r_i:{
		opcode: 26,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	sub_r_r:{
		opcode: 27,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_sub,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	sub_r_a:{
		opcode: 28,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//sub_r_fpo
	//sub_r_ao

	subc_r_i:{
		opcode: 31,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	subc_r_r:{
		opcode: 32,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	subc_r_a:{
		opcode: 33,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//subc_r_fpo
	//subc_r_ao

	xor_r_i:{
		opcode: 36,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_xor,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//xor_r_r
	//xor_r_a
	//xor_r_fpo
	//xor_r_ao

	and_r_i:{
		opcode: 41,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_and,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//and_r_r
	//and_r_a
	//and_r_fpo
	//and_r_ao

	rsh:{
		opcode: 46,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_ho + lines.alu_rsh,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	rshc:{
		opcode: 47,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_ho + lines.alu_rsh + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	
	or_r_i:{
		opcode: 52,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_or,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},

	push: {
		opcode: 49,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.instb_ho + lines.t_reset,
		]
	},
	pop: {
		opcode: 50,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in + lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},

	ld_r16_i:{
		opcode: 239,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.off_inl,
			lines.pc_abus_out + lines.mem_out + lines.off_inh + lines.t_reset,
		]
	},

	call: {
		opcode: 125,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outl,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outh,
	//		lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.idx_outl,
	//		lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.idx_outh,
	//		lines.sp_abus_out + lines.idx_in,
			lines.addr_abus_out + lines.pc_in + lines.t_reset,
		]
	},
	reti: {
		opcode: 126,
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.addr_inl,
			lines.sp_abus_out + lines.mem_out + lines.addr_inh, //		lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.addr_inh,
/*			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.alu_in,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.d_in,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.c_in,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.b_in,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.a_in,
			lines.sp_abus_out + lines.mem_out + lines.flags_in + lines.alu_add,*/
			lines.addr_abus_out + lines.pc_in + lines.t_reset,
		]
	},
	irq: {
		opcode: 127,
		steps: [
			/*lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.flags_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.a_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.b_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.c_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.d_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.alu_out,*/
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outl,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outh,
			lines.irq_abus_out + lines.pc_in + lines.t_reset,
		]
	},
	
}

var bankA = [];
var bankB = [];
var bankC = [];
var bankD = [];


function output() {

	for(var i = 0;i<2048;i++){
		bankA[i] = 0;
		bankB[i] = 0;
		bankC[i] = 0;
		bankD[i] = 0;
	}

	console.log('v3.0 hex words addressed');
	var file = 'v3.0 hex words addressed\n';
	
	var mc = BigInt(lines.pc_abus_out + lines.ir_in);
	mc = mc ^ BigInt(lines.alu_sel0);
	mc = mc ^ BigInt(lines.alu_sel1);
	mc = mc ^ BigInt(lines.alu_sel2);
	var fetch = (mc.toString(16).padStart(8,'0'));
	mc = BigInt(lines.halt);
	mc = mc ^ BigInt(lines.alu_sel0);
	mc = mc ^ BigInt(lines.alu_sel1);
	mc = mc ^ BigInt(lines.alu_sel2);
	var hlt = (mc.toString(16).padStart(8,'0'));

	for (let i = 0; i < 256; i++) {
		const lineprefix = (i*8).toString(16).padStart(3, "0")+':';
		//const lineprefix2 = (i*16+8).toString(16).padStart(3, "0")+':';

		var found = false;
		for (let j of Object.keys(instr)){
			if(instr[j].opcode == i) {
				found = true;
				
				console.log(j+' '+i+' '+i.toString(16)+' (sh2:'+(i>>2)+' '+(i>>2).toString(16)+') (sh4: '+(i>>4)+' '+(i>>4).toString(16)+')');

				var lineops = ' '+fetch;

				for( let k = 0; k < 7;k++) {
					var mc = 0;
					if(instr[j].steps.length > k)
					{
						mc =  BigInt(instr[j].steps[k]);
					}
					else{
						mc = BigInt(lines.t_reset);
					}
					mc = mc ^ BigInt(lines.alu_sel0);
					mc = mc ^ BigInt(lines.alu_sel1);
					mc = mc ^ BigInt(lines.alu_sel2);
					lineops+= ' '+(mc.toString(16).padStart(8,'0'));
				}
				
				for( let k = 0; k < 8;k++) {
					var mc = BigInt(lines.prefetch);
					if(k == 0){
						mc = BigInt(lines.pc_abus_out + lines.ir_in);
					}else if(instr[j].steps.length > k-1)
					{
						mc = BigInt(instr[j].steps[k-1]);
					}
					var addr = (k<<8) + i;
					mc = mc ^ BigInt(lines.t_reset);
					mc = mc ^ BigInt(lines.ir_in);
					mc = mc ^ BigInt(lines.alu_sel0);
					mc = mc ^ BigInt(lines.alu_sel1);
					mc = mc ^ BigInt(lines.alu_sel2);
					bankA[addr] = mc & BigInt(0xff);
					bankB[addr] = (mc>>BigInt(8)) & BigInt(0xff);
					bankC[addr] = (mc>>BigInt(16)) & BigInt(0xff);
					bankD[addr] = (mc>>BigInt(24)) & BigInt(0xff);
				}
				console.log(lineprefix+lineops);
				file+=lineprefix+lineops+'\n';

			}
		}
		if(! found) {
			for( let k = 0; k < 8;k++) {
				var mc = BigInt(lines.prefetch);
				if(k == 0){
					mc = BigInt(lines.pc_abus_out + lines.ir_in);
				}
				var addr = (k<<8) + i;
				mc = mc ^ BigInt(lines.t_reset);
				mc = mc ^ BigInt(lines.ir_in);
				mc = mc ^ BigInt(lines.alu_sel0);
				mc = mc ^ BigInt(lines.alu_sel1);
				mc = mc ^ BigInt(lines.alu_sel2);
				bankA[addr] = mc & BigInt(0xff);
				bankB[addr] = (mc>>BigInt(8)) & BigInt(0xff);
				bankC[addr] = (mc>>BigInt(16)) & BigInt(0xff);
				bankD[addr] = (mc>>BigInt(24)) & BigInt(0xff);
			}
		}
		if(! found) console.log('    '+i+' '+i.toString(16)+' (sh2:'+(i>>2)+' '+(i>>2).toString(16)+') (sh4: '+(i>>4)+' '+(i>>4).toString(16)+')');
		if(! found) console.log(lineprefix+' '+fetch+' '+hlt+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		if(! found) file+=lineprefix+' '+fetch+' '+hlt+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
	}
	fs.writeFileSync('mc1',file);

}

output();

/* var vank = bankB;

const port = new SerialPort({
  path: 'COM8',
  baudRate: 500000,
});
const { ReadlineParser } = require('@serialport/parser-readline')

var currAddr = 0;
var mode = 'erase';
//var mode = 'compare';
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', function(data){
	//console.log(data);
	if(data == 'BOOT'){
		console.log('connected to programmer, erasing');
		var cmd = 'WR'+currAddr.toString(16).padStart(4,'0')+'ff\n';
		//var cmd = 'WR'+currAddr.toString(16).padStart(4,'0')+bankA[currAddr].toString(16).padStart(2,'0')+'\n';
		//var cmd = 'RD'+currAddr.toString(16).padStart(4,'0')+'\n';
		currAddr++;
		port.write(cmd);
		//console.log(cmd);
	}
	else if(data == 'DONE'){
		if(currAddr == 2048 && mode == 'erase'){
			currAddr = 0;
			console.log('erase done, writing');
			mode = 'write';
		}
		if(currAddr == 2048 && mode == 'write'){
			currAddr = 0;
			mode = 'compare';
			var cmd = 'RD'+currAddr.toString(16).padStart(4,'0')+'\n';
			port.write(cmd);
			//console.log(cmd);
			console.log('writing done, comparing');
		}

		if(mode == 'erase'){
			var cmd = 'WR'+currAddr.toString(16).padStart(4,'0')+'ff\n';
			currAddr++;
			port.write(cmd);
			//console.log(cmd);
		}
		if(mode == 'write'){
			var cmd = 'WR'+currAddr.toString(16).padStart(4,'0')+bank[currAddr].toString(16).padStart(2,'0')+'\n';
			currAddr++;
			port.write(cmd);
			//console.log(cmd);
		}

	}else{

		var red = data.padStart(2,'0');
		if(red != bank[currAddr].toString(16).toUpperCase().padStart(2,'0')){
			console.log('mismatch at '+currAddr.toString(16),red,bank[currAddr].toString(16).toUpperCase().padStart(2,'0'));
		}
		if(currAddr < 2047){
			currAddr++;
			var cmd = 'RD'+currAddr.toString(16).padStart(4,'0')+'\n';
			port.write(cmd);
			//console.log(cmd);
		}else{
			mode = 'finished';
			console.log('completed');
			port.close();
		}
	}
})

port.on('open', async () => {
	console.log('port opened');
})

*/
