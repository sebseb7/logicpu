const fs = require('fs');
// 0x70/112
// 0x7f/127
// 0xf0/240
// 0xff/255

var lines = {
	db_tar_sel0:  2**0,
	db_tar_sel1:  2**1,
	db_tar_sel2:  2**2,
	db_tar_sel3:  2**3,

	db_tar_sel4:  2**4,
	ab_sel0:      2**5,
	ab_sel1:      2**6,
	ab_sel2:      2**7,

	db_sel0:      2**8,
	db_sel1:      2**9,
	db_sel2:      2**10,
	db_sel3:      2**11,

	db_sel4:      2**12,
	alu_sel0:     2**13,
	alu_sel1:     2**14,
	alu_sel2:     2**15,

	c_jmp:        2**16,
	z_jmp:        2**17,
	s_jmp:        2**18,
	pc_inc:       2**19,

	instb_li:     2**20,
	instb_lo:     2**21,
	instb_hi:     2**22,
	instb_ho:     2**23,

	misc_sel0:    2**24,
	misc_sel1:    2**25,
	misc_sel2:    2**26,
	misc_sel3:    2**27,
	
	idx_in:       2**28,
	pc_in:        2**29,
	unused2:      2**30,
	unused3:      2**31,

	sp_abus_out:  1<<5,
	addr_abus_out:2<<5,
	pc_abus_out:  3<<5,
	idx_abus_out: 4<<5,
	off_abus_out: 5<<5,
	off2_abus_out:6<<6,

	a_out:        1<<8,
	b_out:        2<<8,
	c_out:        3<<8,
	d_out:        4<<8,
	off_outl:     5<<8,
	off_outh:     6<<8,
	alu_out:      7<<8,
	flags_out:    8<<8,
	irq_outl:     9<<8,
	irq_outh:     10<<8,
	pc_outh:      11<<8,
	pc_outl:      12<<8,
	idx_outl:     13<<8,
	idx_outh:     14<<8,
	mem_out:      15<<8,
	io_out:       16<<8,

	a_in:		  1,
	b_in:		  2,
	c_in:         3,
	d_in:         4,
	off_inl:      5,
	off_inh:      6,
	ram_in:       7,
	disp_in:      8,
	ir_in:        9,
	ir2_in:       10,
	alu_op:       11,
	flags_in:     12,
	alu_in:       13,
	idx_inh:      14,
	idx_inl:      15,
	porta_in:     16,
	portb_in:     17,
	addr_inl:     18,
	addr_inh:     19,
	op_in:        20,
	
	cie          :1<<24,
	sie          :2<<24,
	t_reset      :3<<24,
	halt         :4<<24,
	sp_inc       :5<<24,
	sp_dec       :6<<24,
	flags_inv    :7<<24,
	alu_stc      :8<<24,
	alu_ctc      :9<<24,

	alu_add:     0<<13,
	alu_sub:     1<<13,
	alu_xor:     2<<13,
	alu_and:     3<<13,
	alu_unused1: 4<<13,
	alu_unused2: 5<<13,
	alu_rsh:     6<<13,
	alu_unused3: 7<<13,

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
	jmp: {
		opcode: 2,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.pc_in,
		]
	},
	jmpcc: {
		opcode: 3,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.c_jmp + lines.flags_inv + lines.pc_in,
		]
	},
	jmpz: {
		opcode: 4,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.z_jmp + lines.pc_in,
		]
	},
	ret: {
		opcode: 5, 
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.idx_inh,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.idx_inl,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.addr_inl,
			lines.sp_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.pc_in,
		]
	},
	cie: {
		opcode: 6,
		steps: [
			lines.cie,
		]
	},
	sie: {
		opcode: 7,
		steps: [
			lines.sie,
		]
	},
	ld_r_i:{
		opcode: 8,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.instb_hi,
		]
	},
	ld_r_r:{
		opcode: 9,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.instb_hi + lines.instb_lo,
		]
	},
	ld_r_a:{
		opcode: 10,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.a_in + lines.instb_hi,
		]
	},
	//ld_r_fpo
	//ld_r_ao
	st_r_a:{
		opcode: 13,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.addr_inh,
			lines.addr_abus_out + lines.ram_in + lines.instb_ho,
		]
	},
	//st_r_fpo
	//st_r_ao

	add_r_i:{
		opcode: 16,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.op_in,
			lines.instb_ho + lines.alu_op,
			lines.instb_hi + lines.alu_out
		]
	},
	add_r_r:{
		opcode: 17,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.instb_lo + lines.op_in,
			lines.instb_ho + lines.alu_op,
			lines.instb_hi + lines.alu_out
		]
	},
	//add_r_a
	//add_r_fpo
	//add_r_ao

	addc_r_i:{
		opcode: 21,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.op_in,
			lines.instb_ho + lines.alu_op + lines.c_jmp,
			lines.instb_hi + lines.alu_out
		]
	},
	addc_r_r:{
		opcode: 22,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.instb_lo + lines.op_in,
			lines.instb_ho + lines.alu_op + lines.c_jmp,
			lines.instb_hi + lines.alu_out
		]
	},
	//addc_r_a
	//addc_r_fpo
	//addc_r_ao

	sub_r_i:{
		opcode: 26,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.alu_op,
			lines.instb_hi + lines.alu_out
		]
	},
	//sub_r_r
	//sub_r_a
	//sub_r_fpo
	//sub_r_ao

	//subc_r_i
	//subc_r_r
	//subc_r_a
	//subc_r_fpo
	//subc_r_ao

	xor_r_i:{
		opcode: 36,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.op_in,
			lines.instb_ho + lines.alu_xor + lines.alu_op,
			lines.instb_hi + lines.alu_out
		]
	},
	//xor_r_r
	//xor_r_a
	//xor_r_fpo
	//xor_r_ao

	and_r_i:{
		opcode: 41,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.op_in,
			lines.instb_ho + lines.alu_and + lines.alu_op,
			lines.instb_hi + lines.alu_out
		]
	},
	//and_r_r
	//and_r_a
	//and_r_fpo
	//and_r_ao

	rsh:{
		opcode: 46,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.instb_ho + lines.alu_op + lines.alu_rsh,
			lines.instb_hi + lines.alu_out
		]
	},
	rshc:{
		opcode: 47,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.instb_ho + lines.alu_op + lines.alu_rsh + lines.c_jmp,
			lines.instb_hi + lines.alu_out
		]
	},

	push: {
		opcode: 48,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.instb_ho,
		]
	},
	pop: {
		opcode: 49,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir2_in + lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.instb_hi,
		]
	},

	ld_r16_i:{
		opcode: 239,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.off_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.off_inh,
		]
	},



	call: {
		opcode: 125,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outl,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outh,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.idx_outl,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.idx_outh,
			lines.sp_abus_out + lines.idx_in,
			lines.addr_abus_out + lines.pc_in,
		]
	},
	reti: {
		opcode: 126,
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.addr_inl,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.addr_inh,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.alu_in,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.d_in,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.c_in,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.b_in,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.a_in,
			lines.sp_abus_out + lines.mem_out + lines.flags_in,
			lines.addr_abus_out + lines.pc_in,
		]
	},
	irq: {
		opcode: 127,
		steps: [
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.flags_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.a_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.b_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.c_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.d_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.alu_out,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outl,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outh,
			lines.irq_outl +lines.addr_inl,
			lines.irq_outh +lines.addr_inh,
			lines.addr_abus_out + lines.pc_in,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.pc_in,
		]
	},
	
}

function output() {
	console.log('v3.0 hex words addressed');
	var file = 'v3.0 hex words addressed\n';
	
	var fetch = ((lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir_in).toString(16).padStart(8,'0'));
	var hlt = ((lines.halt).toString(16).padStart(8,'0'));

	for (let i = 0; i < 240; i++) {
		const lineprefix = (i*8).toString(16).padStart(3, "0")+':';
		//const lineprefix2 = (i*16+8).toString(16).padStart(3, "0")+':';

		var found = false;
		for (let j of Object.keys(instr)){
			if(instr[j].opcode == i) {
				found = true;
				
				console.log(j+' '+i+' '+i.toString(16)+' (sh2:'+(i>>2)+' '+(i>>2).toString(16)+') (sh4: '+(i>>4)+' '+(i>>4).toString(16)+')');

				var lineops = ' '+fetch;

				for( let k = 0; k < 7;k++) {
					if(instr[j].steps.length > k)
					{
						lineops+= ' '+(instr[j].steps[k].toString(16).padStart(8,'0'));
						//console.log(instr[j].steps[k]);
					}
					else{
						lineops+= ' '+(lines.t_reset.toString(16).padStart(8,'0'));
					}
				}
			/*	var lineops2='';

				for( let k = 7; k < 15;k++) {
					if(instr[j].steps.length > k)
					{
						lineops2+= ' '+(instr[j].steps[k].toString(16).padStart(8,'0'));
					}
					else{
						lineops2+= ' '+(lines.t_reset.toString(16).padStart(8,'0'));
					}
				}*/
				console.log(lineprefix+lineops);
				file+=lineprefix+lineops+'\n';
			//	console.log(lineprefix2+lineops2);
			//	file+=lineprefix2+lineops2+'\n';

			}
		}
		if(! found) console.log('    '+i+' '+i.toString(16)+' (sh2:'+(i>>2)+' '+(i>>2).toString(16)+') (sh4: '+(i>>4)+' '+(i>>4).toString(16)+')');
		if(! found) console.log(lineprefix+' '+fetch+' '+hlt+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		if(! found) file+=lineprefix+' '+fetch+' '+hlt+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
		//if(! found) console.log(lineprefix2+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		//if(! found) file+=lineprefix2+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
	}
	for (let i = 240; i < 256; i++) {
		var m = i & 0x7f;
		const lineprefix = (i*8).toString(16).padStart(3, "0")+':';
		//const lineprefix2 = (i*16+8).toString(16).padStart(3, "0")+':';

		var found = false;
		for (let j of Object.keys(instr)){
			if(instr[j].opcode == m) {
				found = true;
				
				console.log(j+' '+m+' '+m.toString(16)+' (sh2:'+(m>>2)+' '+(m>>2).toString(16)+') (sh4: '+(m>>4)+' '+(m>>4).toString(16)+') (steps 8 to 15)');

				var lineops = '';

				for( let k = 7; k < 15;k++) {
					if(instr[j].steps.length > k)
					{
						lineops+= ' '+(instr[j].steps[k].toString(16).padStart(8,'0'));
					}
					else{
						lineops+= ' '+(lines.t_reset.toString(16).padStart(8,'0'));
					}
				}
			/*	var lineops2='';

				for( let k = 7; k < 15;k++) {
					if(instr[j].steps.length > k)
					{
						lineops2+= ' '+(instr[j].steps[k].toString(16).padStart(8,'0'));
					}
					else{
						lineops2+= ' '+(lines.t_reset.toString(16).padStart(8,'0'));
					}
				}*/
				console.log(lineprefix+lineops);
				file+=lineprefix+lineops+'\n';
			//	console.log(lineprefix2+lineops2);
			//	file+=lineprefix2+lineops2+'\n';

			}
		}
		if(! found) console.log('    '+m+' '+m.toString(16)+' (sh2:'+(m>>2)+' '+(m>>2).toString(16)+') (sh4: '+(m>>4)+' '+(m>>4).toString(16)+') (steps 8 to 15)');
		if(! found) console.log(lineprefix+' '+fetch+' '+hlt+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		if(! found) file+=lineprefix+' '+fetch+' '+hlt+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
		//if(! found) console.log(lineprefix2+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		//if(! found) file+=lineprefix2+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
	}
	fs.writeFileSync('mc1',file);

}

output();
