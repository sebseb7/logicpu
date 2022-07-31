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
	ab_sel2:      2**11,

	unused:       2**12,
	alu_sel0:     2**13,
	alu_sel1:     2**14,
	alu_sel2:     2**15,

	c_jmp:        2**16,
	z_jmp:        2**17,
	n_jmp:        2**18,
	o_jmp:        2**19,

	unused:       2**20,
	instb_o:      2**21,
	instb_hi:     2**22,
	instb_ho:     (2**23)+(2**21),

	misc_sel0:    2**24,
	misc_sel1:    2**25,
	misc_sel2:    2**26,
	ir_in:        2**27,
	
	unused:       2**28,
	pc_in:        2**29,
	t_reset:      2**30,
	t_reset_pf:   2**31,

	addr_abus_out:0,
	sp_abus_out:  1<<9,
	pc_abus_out:  2<<9,
	spo_abus_out: 3<<9,
	irq_abus_out: 4<<9,
	irq_abus_out2:5<<9,
	unused_1:     6<<9,
	unused_2:     7<<9,

	mem_out:      0,
	a_out:        1<<4,
	b_out:        2<<4,
	c_out:        3<<4,
	d_out:        4<<4,
	e_out:        5<<4,
	f_out:        6<<4,
	g_out:        7<<4,

	h_out:        8<<4,
	flags_out:    9<<4,
	dd_out:       10<<4,
	alu_out:      11<<4,
	pc_outh:      12<<4,
	pc_outl:      13<<4,
	io_out:       14<<4,
	unused:       15<<4,

	a_in:		  1,
	b_in:		  2,
	c_in:         3,
	d_in:         4,
	e_in:		  5,
	f_in:		  6,
	g_in:         7,

	h_in:         8,
	flags_in:     9,
	unused:       10,
	porta_in:     11,
	portb_in:     12,
	disp_in:      13,
	disp2_in:     14,
	ir2_in:       15,

	unused:     0 + (2**8),
	//alu_in:     1 + (2**8),
	op_in:        1 + (2**8),
	unused:       2 + (2**8),
	unused:       3 + (2**8),
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
	jmpc: {
		opcode: 3,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.c_jmp + lines.t_reset,
		]
	},
	jmpcc: {
		opcode: 4,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.c_jmp + lines.flags_inv + lines.t_reset,
		]
	},
	jmpz: {
		opcode: 5,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.z_jmp + lines.t_reset,
		]
	},
	jmpzc: {
		opcode: 6,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.z_jmp + lines.flags_inv + lines.t_reset,
		]
	},
	jmpo: {
		opcode: 7,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.o_jmp + lines.t_reset,
		]
	},
	jmpoc: {
		opcode: 8,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.o_jmp + lines.flags_inv + lines.t_reset,
		]
	},
	jmpn: {
		opcode: 9,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.n_jmp + lines.t_reset,
		]
	},
	jmpnc: {
		opcode: 10,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.n_jmp + lines.flags_inv + lines.t_reset,
		]
	},
	ret: {
		opcode: 11, 
		steps: [
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.addr_inl,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.addr_inh,
			lines.addr_abus_out + lines.pc_in + lines.t_reset,
		]
	},
	cie: {
		opcode: 12,
		steps: [
			lines.cie + lines.prefetch,
		]
	},
	sie: {
		opcode: 13,
		steps: [
			lines.sie + lines.prefetch,
		]
	},
	push_r: {
		opcode: 14,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in + lines.sp_dec,
			lines.sp_abus_out + lines.ram_in + lines.instb_ho + lines.t_reset,
		]
	},
	pop_r: {
		opcode: 16,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.sp_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset + lines.sp_inc,
		]
	},
	pop: {
		opcode: 17,
		steps: [
			lines.sp_inc + lines.prefetch,
		]
	},
	pop_ra: {
		opcode: 18,
		steps: [
			lines.sp_abus_out + lines.mem_out + lines.a_in + lines.t_reset + lines.sp_inc,
		]
	},

	call: {
		opcode: 19,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh + lines.sp_dec,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outl,
			lines.sp_abus_out + lines.ram_in + lines.pc_outh,
			lines.addr_abus_out + lines.pc_in + lines.t_reset,
		]
	},
	reti: {
		opcode: 20,
		steps: [
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.addr_inl + lines.sie,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc + lines.addr_inh, 
			lines.addr_abus_out + lines.pc_in + lines.t_reset,
		]
	},
	ld_r_i:{
		opcode: 32,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	ld_r_r:{
		opcode: 33,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_hi + lines.instb_o + lines.prefetch,
		]
	},
	ld_r_a:{
		opcode: 34,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	ld_r_spo:{
		opcode: 35,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	ld_r_r16:{
		opcode: 36,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.addr_inl,
			lines.instb_ho + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.addr_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	ld_r_spo_spo:{
		opcode: 37,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	ld_r_a_i:{
		opcode: 38,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.addr_abus_out + lines.mem_out + lines.instb_hi + lines.t_reset,
		]
	},
	ld_ra_i:{
		opcode: 40,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.a_in + lines.t_reset,
		]
	},
	ld_rfl_i:{
		opcode: 41,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.flags_in + lines.alu_add + lines.t_reset,
		]
	},
	ld_ra_a:{
		opcode: 42,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.a_in + lines.t_reset,
		]
	},
	ld_ra_spo:{
		opcode: 43,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.a_in + lines.t_reset,
		]
	},
	ld_ra_r16:{
		opcode: 44,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.addr_inl,
			lines.instb_ho + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.a_in + lines.t_reset,
		]
	},
	ld_ra_a_i:{
		opcode: 45,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.addr_abus_out + lines.mem_out + lines.a_in + lines.t_reset,
		]
	},
	st_r_a:{
		opcode: 48,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.ram_in + lines.instb_ho + lines.t_reset,
		]
	},
	st_r_spo:{
		opcode: 49,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.ram_in + lines.instb_ho + lines.t_reset,
		]
	},
	st_ra_a:{
		opcode: 56,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.ram_in + lines.a_out + lines.t_reset,
		]
	},
	st_ra_spo:{
		opcode: 57,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.ram_in + lines.a_out + lines.t_reset,
		]
	},

	add_r_r:{
		opcode: 64,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	add_r_i:{
		opcode: 65,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	add_r_a:{
		opcode: 66,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	add_r_spo:{
		opcode: 67,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	add_a_i:{
		opcode: 69,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.addr_abus_out + lines.mem_out + lines.alu_add,
			lines.addr_abus_out + lines.alu_out + lines.ram_in + lines.t_reset,
		]
	},
	add_spo_spo:{
		opcode: 71,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.op_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.alu_add,
			lines.spo_abus_out + lines.alu_out + lines.ram_in + lines.t_reset,
		]
	},
	add_spo_i:{
		opcode: 72,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.spo_abus_out + lines.mem_out + lines.alu_add,
			lines.spo_abus_out + lines.alu_out + lines.ram_in + lines.t_reset,
		]
	},
	add_ra_i:{
		opcode: 73,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.a_out + lines.alu_add,
			lines.a_in + lines.alu_out + lines.prefetch
		]
	},
	add_ra_a:{
		opcode: 74,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.a_out + lines.alu_add,
			lines.a_in + lines.alu_out + lines.prefetch
		]
	},
	add_ra_spo:{
		opcode: 75,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.op_in,
			lines.a_out + lines.alu_add,
			lines.a_in + lines.alu_out + lines.prefetch
		]
	},


	addc_r_r:{
		opcode: 80,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_add + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	addc_r_i:{
		opcode: 81,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_add + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//addc_r_a

	sub_r_r:{
		opcode: 96,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_sub,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	sub_r_i:{
		opcode: 97,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	sub_r_a:{
		opcode: 98,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	sub_a_i:{
		opcode: 101,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.addr_abus_out + lines.mem_out + lines.alu_sub,
			lines.addr_abus_out + lines.alu_out + lines.ram_in + lines.t_reset,
		]
	},
	sub_a_a:{
		opcode: 102,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.alu_sub,
			lines.addr_abus_out + lines.alu_out + lines.ram_in + lines.t_reset,
		]
	},
	sub_spo_spo:{
		opcode: 103,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.op_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.alu_sub,
			lines.spo_abus_out + lines.alu_out + lines.ram_in + lines.t_reset,
		]
	},
	sub_spo_i:{
		opcode: 104,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.spo_abus_out + lines.mem_out + lines.alu_sub,
			lines.spo_abus_out + lines.alu_out + lines.ram_in + lines.t_reset,
		]
	},

	sub_ra_i:{
		opcode: 105,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.a_out + lines.alu_sub,
			lines.a_in + lines.alu_out + lines.prefetch
		]
	},
	sub_ra_a:{
		opcode: 106,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.a_out + lines.alu_sub,
			lines.a_in + lines.alu_out + lines.prefetch
		]
	},

	subc_r_r:{
		opcode: 112,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	subc_r_i:{
		opcode: 113,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	subc_r_a:{
		opcode: 114,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},

	//xor_r_r
	xor_r_i:{
		opcode: 129,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_xor,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//xor_r_a

	//and_r_r
	and_r_i:{
		opcode: 145,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_and,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	//and_r_a
	
	or_r_i:{
		opcode: 161,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_or,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},

	rsh_r:{
		opcode: 176,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_ho + lines.alu_rsh,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	rsh_spo:{
		opcode: 178,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.alu_rsh,
			lines.spo_abus_out + lines.ram_in + lines.alu_out + lines.t_reset
		]
	},
	rshc_r:{
		opcode: 192,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_ho + lines.alu_rsh + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	lsh_r:{
		opcode: 208,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_ho + lines.op_in,
			lines.instb_ho + lines.alu_add,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	lsh_a:{
		opcode: 209,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.addr_abus_out + lines.mem_out + lines.alu_add,
			lines.addr_abus_out + lines.ram_in + lines.alu_out + lines.t_reset
		]
	},
	lsh_spo:{
		opcode: 210,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.op_in,
			lines.spo_abus_out + lines.mem_out + lines.alu_add,
			lines.spo_abus_out + lines.ram_in + lines.alu_out + lines.t_reset
		]
	},
	lsh_ra:{
		opcode: 211,
		steps: [
			lines.a_out + lines.op_in,
			lines.a_out + lines.alu_add,
			lines.a_in + lines.alu_out + lines.prefetch
		]
	},
	lshc_r:{
		opcode: 224,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_ho + lines.op_in,
			lines.instb_ho + lines.alu_add + lines.alu_c,
			lines.instb_hi + lines.alu_out + lines.prefetch
		]
	},
	lshc_a:{
		opcode: 225,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.addr_abus_out + lines.mem_out + lines.alu_add + lines.alu_c,
			lines.addr_abus_out + lines.ram_in + lines.alu_out + lines.t_reset
		]
	},
	lshc_spo:{
		opcode: 226,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.op_in,
			lines.spo_abus_out + lines.mem_out + lines.alu_add + lines.alu_c,
			lines.spo_abus_out + lines.ram_in + lines.alu_out + lines.t_reset
		]
	},
	lshc_ra:{
		opcode: 227,
		steps: [
			lines.a_out + lines.op_in,
			lines.a_out + lines.alu_add + lines.alu_c,
			lines.a_in + lines.alu_out + lines.prefetch
		]
	},
	
	cmp_r_r:{
		opcode: 240,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.instb_o + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.prefetch
		]
	},
	cmp_r_i:{
		opcode: 241,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.prefetch
		]
	},
	cmp_r_a:{
		opcode: 242,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.ir2_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.instb_ho + lines.alu_sub + lines.prefetch
		]
	},
	cmp_a_i:{
		opcode: 243,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.addr_abus_out + lines.mem_out + lines.alu_sub + lines.t_reset
		]
	},
	cmp_a_a:{
		opcode: 244,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.alu_sub + lines.t_reset
		]
	},
	cmp_spo_spo:{
		opcode: 245,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.op_in,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.spo_abus_out + lines.mem_out + lines.alu_sub + lines.t_reset
		]
	},
	cmp_spo_i:{
		opcode: 247,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.spo_abus_out + lines.mem_out + lines.alu_sub + lines.t_reset
		]
	},

	cmp_ra_i:{
		opcode: 248,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.op_in,
			lines.a_out + lines.alu_sub + lines.prefetch
		]
	},
	cmp_ra_a:{
		opcode: 249,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.op_in,
			lines.a_out + lines.alu_sub + lines.prefetch
		]
	},

	irq: {
		opcode: 255,
		steps: [
			lines.sp_dec,
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.pc_outl,
			lines.sp_abus_out + lines.ram_in + lines.pc_outh + lines.cie,
			lines.irq_abus_out  + lines.mem_out + lines.addr_inl,
			lines.irq_abus_out2 + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.pc_in + lines.t_reset,
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
				
				console.log(j+' '+i+' '+i.toString(16));

				var lineops = ' '+fetch;

				for( let k = 0; k < 7;k++) {
					var mc = BigInt(0);
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
		if(! found) console.log('    '+i+' '+i.toString(16));
		if(! found) console.log(lineprefix+' '+fetch+' '+hlt+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		if(! found) file+=lineprefix+' '+fetch+' '+hlt+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
	}
	fs.writeFileSync('mc1',file);

}

output();

/*
var bank = bankD;

const port = new SerialPort({
  path: 'COM8',
  baudRate: 500000,
});
const { ReadlineParser } = require('@serialport/parser-readline')

var currAddr = 0;
//var mode = 'erase';
var mode = 'compare';
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', function(data){
	//console.log(data);
	if(data == 'BOOT'){
		console.log('connected to programmer, erasing');
		//var cmd = 'WR'+currAddr.toString(16).padStart(4,'0')+'ff\n';
		//var cmd = 'WR'+currAddr.toString(16).padStart(4,'0')+bankA[currAddr].toString(16).padStart(2,'0')+'\n';
		var cmd = 'RD'+currAddr.toString(16).padStart(4,'0')+'\n';
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
