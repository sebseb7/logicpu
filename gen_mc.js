const fs = require('fs');
// 0x70/112
// 0x7f/127
// 0xf0/240
// 0xff/255

var lines = {
	db_tar_sel0:  1,
	db_tar_sel1:  2,
	db_tar_sel2:  4,
	db_tar_sel3:  8,
	db_sel0:      16,
	db_sel1:      32,
	db_sel2:      64,
	db_sel3:      128,
	idx_in:       256,
	ab_sel0:      512,
	unused2:      1024,
	ab_sel1:      2048,
	misc_sel0:    4096,
	misc_sel1:    8192,
	misc_sel2:    16384,
	misc_sel3:    32768,
	c_jmp:        65536,
	z_jmp:        131072,
	s_jmp:        262144,
	alu_sel0:     524288,
	instb_cfg0:   1048576,
	instb_cfg1:   2097152,
	alu_sel1:     4194304,
	alu_sel2:     8388608,
	
	instb_cfg2:   16777216,
	db_sel4:      33554432,
	ab_sel2:      67108864,
	db_tar_sel4:  134217728,
	
	unused:       268435456,
	pc_in:        536870912,
	alu_bus_sel0: 1073741824,
	alu_bus_sel1: 2147483648,

    instb_li:     1048576,
	instb_lo:     2097152,
	instb_hi:     2097152+1048576,
	instb_ho:     16777216,

	sp_abus_out:  512,
	addr_abus_out:2048,
	pc_abus_out:  512+2048,
	idx_abus_out: 67108864,
	off_abus_out: 67108864+512,
	off2_abus_out: 67108864+2048,

	a_out:        16,
	b_out:        32,
	c_out:        16+32,
	d_out:        64,
	mem_out:      64+16,
	io_out:       64+32,
	alu_out:      64+32+16,
	flags_out:    128,
	irq_outl:     128+16,
	irq_outh:     128+32,
	pc_outh:      128+32+16,
	pc_outl:      128+64,
	idx_outl:     128+64+16,
	idx_outh:     128+64+32,
	off_outl:     128+64+32+16,
	off_outh:     33554432,

	a_in:		  1,
	b_in:		  2,
	c_in:         3,
	d_in:         4,
	ram_in:       5,
	porta_in:     6,
	portb_in:     7,
	disp_in:      8,
	ir_in:        9,
	ir2_in:       10,
	alu_op:       11,
	flags_in:     12,
	alu_in:       13,
	idx_inh:      14,
	idx_inl:      15,
	off_inh:      134217728,
	off_inl:      134217728+1,
	addr_inl:     134217728+2,
	addr_inh:     134217728+3,

	alu_bus_sel_a:0,
	alu_bus_sel_b:1073741824,
	alu_bus_sel_c:2147483648,
	alu_bus_sel_d:2147483648+1073741824,

	cie          :1<<12,
	sie          :2<<12,
	t_reset      :3<<12,
	halt         :4<<12,
	sp_inc       :5<<12,
	sp_dec       :6<<12,
	flags_inv    :7<<12,
	alu_stc      :8<<12,
	alu_ctc      :9<<12,
	pc_inc       :10<<12,

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
	st_a_ar_di: {
		opcode: 60,
		steps: [
			lines.off2_abus_out + lines.ram_in + lines.a_out,
		]
	},
	st_a_fpo_di: {
		opcode: 56,
		steps: [
			lines.off_abus_out + lines.ram_in + lines.a_out,
		]
	},
	st_ao: {
		opcode: 9,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.instb_li + lines.off_outh,
			lines.instb_hi + lines.off_outl,
		]
	},
	st_a: {
		opcode: 88,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.a_out + lines.ram_in,
		]
	},
	st_b: {
		opcode: 89,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.b_out + lines.ram_in,
		]
	},
	st_c: {
		opcode: 90,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.c_out + lines.ram_in,
		]
	},
	st_d: {
		opcode: 91,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.d_out + lines.ram_in,
		]
	},
	ld_ao: {
		opcode: 8,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.ir2_in,
			lines.instb_lo + lines.off_inh,
			lines.instb_ho + lines.off_inl,
		]
	},
	ldi_a: {
		opcode: 96, // 24 << 2
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.a_in,
		]
	},
	ldi_b: {
		opcode: 97,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.b_in,
		]
	},
	ldi_c: {
		opcode: 98,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.c_in,
		]
	},
	ldi_d: {
		opcode: 99,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.d_in,
		]
	},
	ld_a_fpo_di: {
		opcode: 64,
		steps: [
			lines.off_abus_out + lines.mem_out + lines.a_in,
		]
	},
	ld_a_fpo: {
		opcode: 68,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.off_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.off_inh,
			lines.off_abus_out + lines.mem_out + lines.a_in,
		]
	},	
	ld_a: {
		opcode: 100,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.a_in,
		]
	},
	ld_b: {
		opcode: 101,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.b_in,
		]
	},
	ld_c: {
		opcode: 102,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.c_in,
		]
	},
	ld_d: {
		opcode: 103,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.mem_out + lines.d_in,
		]
	},
	sub_a_a: {
		opcode: 208,
		steps: [
			lines.a_out + lines.alu_op  + lines.alu_sel0 + lines.alu_bus_sel_a,
			lines.a_in + lines.alu_out,
		]
	},
	sub_a_b: {
		opcode: 209,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_b,
			lines.a_in + lines.alu_out,
		]
	},
	sub_a_c: {
		opcode: 210,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_c,
			lines.a_in + lines.alu_out,
		]
	},
	sub_a_d: {
		opcode: 211,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_d,
			lines.a_in + lines.alu_out,
		]
	},
	sub_b_a: {
		opcode: 212,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_a,
			lines.b_in + lines.alu_out,
		]
	},
	sub_b_b: {
		opcode: 213,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_b,
			lines.b_in + lines.alu_out,
		]
	},
	sub_b_c: {
		opcode: 214,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_c,
			lines.b_in + lines.alu_out,
		]
	},
	sub_b_d: {
		opcode: 215,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_d,
			lines.b_in + lines.alu_out,
		]
	},
	sub_c_a: {
		opcode: 216,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_a,
			lines.c_in + lines.alu_out,
		]
	},
	sub_c_b: {
		opcode: 217,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_b,
			lines.c_in + lines.alu_out,
		]
	},
	sub_c_c: {
		opcode: 218,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_c,
			lines.c_in + lines.alu_out,
		]
	},
	sub_c_d: {
		opcode: 219,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_d,
			lines.c_in + lines.alu_out,
		]
	},
	sub_d_a: {
		opcode: 220,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_a,
			lines.d_in + lines.alu_out,
		]
	},
	sub_d_b: {
		opcode: 221,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_b,
			lines.d_in + lines.alu_out,
		]
	},
	sub_d_c: {
		opcode: 222,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_c,
			lines.d_in + lines.alu_out,
		]
	},
	sub_d_d: {
		opcode: 223,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_sel0 + lines.alu_bus_sel_d,
			lines.d_in + lines.alu_out,
		]
	},
	sub_a: {
		opcode: 84,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_a + lines.alu_sel0,
			lines.a_in + lines.alu_out,
		]
	},
	sub_b: {
		opcode: 85,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_b + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	sub_c: {
		opcode: 86,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_c + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	sub_d: {
		opcode: 87,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_d + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	rshc_a: {
		opcode: 36,
		steps: [
			lines.alu_op + lines.alu_bus_sel_a + lines.alu_sel1 + lines.alu_sel2 + lines.c_jmp,
			lines.a_in + lines.alu_out,
		]
	},
	rshc_b: {
		opcode: 37,
		steps: [
			lines.alu_op + lines.alu_bus_sel_b + lines.alu_sel1 + lines.alu_sel2 + lines.c_jmp,
			lines.d_in + lines.alu_out,
		]
	},
	rshc_c: {
		opcode: 38,
		steps: [
			lines.alu_op + lines.alu_bus_sel_c + lines.alu_sel1 + lines.alu_sel2 + lines.c_jmp,
			lines.c_in + lines.alu_out,
		]
	},
	rshc_d: {
		opcode: 39,
		steps: [
			lines.alu_op + lines.alu_bus_sel_d + lines.alu_sel1 + lines.alu_sel2 + lines.c_jmp,
			lines.d_in + lines.alu_out,
		]
	},
	rsh_a: {
		opcode: 40,
		steps: [
			lines.alu_op + lines.alu_bus_sel_a + lines.alu_sel1 + lines.alu_sel2,
			lines.a_in + lines.alu_out,
		]
	},
	rsh_b: {
		opcode: 41,
		steps: [
			lines.alu_op + lines.alu_bus_sel_b + lines.alu_sel1 + lines.alu_sel2,
			lines.d_in + lines.alu_out,
		]
	},
	rsh_c: {
		opcode: 42,
		steps: [
			lines.alu_op + lines.alu_bus_sel_c + lines.alu_sel1 + lines.alu_sel2,
			lines.c_in + lines.alu_out,
		]
	},
	rsh_d: {
		opcode: 43,
		steps: [
			lines.alu_op + lines.alu_bus_sel_d + lines.alu_sel1 + lines.alu_sel2,
			lines.d_in + lines.alu_out,
		]
	},
	and_a_di: {
		opcode: 32,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_a + lines.alu_sel1 + lines.alu_sel0,
			lines.a_in + lines.alu_out,
		]
	},
	and_b_di: {
		opcode: 33,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_b + lines.alu_sel1 + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	and_c_di: {
		opcode: 34,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_c + lines.alu_sel1 + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	and_d_di: {
		opcode: 35,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_d + lines.alu_sel1 + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	xor_a_di: {
		opcode: 44,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_a + lines.alu_sel1,
			lines.a_in + lines.alu_out,
		]
	},
	xor_b_di: {
		opcode: 45,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_b + lines.alu_sel1,
			lines.d_in + lines.alu_out,
		]
	},
	xor_c_di: {
		opcode: 46,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_c + lines.alu_sel1,
			lines.d_in + lines.alu_out,
		]
	},
	xor_d_di: {
		opcode: 47,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_d + lines.alu_sel1,
			lines.d_in + lines.alu_out,
		]
	},
	sub_a_di: {
		opcode: 80,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_a + lines.alu_sel0,
			lines.a_in + lines.alu_out,
		]
	},
	sub_b_di: {
		opcode: 81,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_b + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	sub_c_di: {
		opcode: 82,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_c + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	sub_d_di: {
		opcode: 83,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_d + lines.alu_sel0,
			lines.d_in + lines.alu_out,
		]
	},
	add_a: {
		opcode: 104,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_a,
			lines.a_in + lines.alu_out,
		]
	},
	add_b: {
		opcode: 105,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_b,
			lines.b_in + lines.alu_out,
		]
	},
	add_c: {
		opcode: 106,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_c,
			lines.c_in + lines.alu_out,
		]
	},
	add_d: {
		opcode: 107,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_d,
			lines.d_in + lines.alu_out,
		]
	},
	add_a_di: {
		opcode: 108,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_a,
			lines.a_in + lines.alu_out,
		]
	},
	add_b_di: {
		opcode: 109,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_b,
			lines.b_in + lines.alu_out,
		]
	},
	add_c_di: {
		opcode: 110,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_c,
			lines.c_in + lines.alu_out,
		]
	},
	add_d_di: {
		opcode: 111,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_d,
			lines.d_in + lines.alu_out,
		]
	},
	addc_a: {
		opcode: 48,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_a + lines.c_jmp,
			lines.a_in + lines.alu_out,
		]
	},
	addc_b: {
		opcode: 49,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_b + lines.c_jmp,
			lines.b_in + lines.alu_out,
		]
	},
	addc_c: {
		opcode: 50,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_c + lines.c_jmp,
			lines.c_in + lines.alu_out,
		]
	},
	addc_d: {
		opcode: 51,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out +lines.mem_out + lines.alu_op + lines.alu_bus_sel_d + lines.c_jmp,
			lines.d_in + lines.alu_out,
		]
	},
	addc_a_di: {
		opcode: 52,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_a + lines.c_jmp,
			lines.a_in + lines.alu_out,
		]
	},
	addc_b_di: {
		opcode: 53,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_b + lines.c_jmp,
			lines.b_in + lines.alu_out,
		]
	},
	addc_c_di: {
		opcode: 54,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_c + lines.c_jmp,
			lines.c_in + lines.alu_out,
		]
	},
	addc_d_di: {
		opcode: 55,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op + lines.alu_bus_sel_d + lines.c_jmp,
			lines.d_in + lines.alu_out,
		]
	},
	addc_a_a: {
		opcode: 176,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_bus_sel_a + lines.c_jmp,
			lines.a_in + lines.alu_out,
		]
	},
	addc_a_b: {
		opcode: 177,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_bus_sel_b + lines.c_jmp,
			lines.a_in + lines.alu_out,
		]
	},
	addc_a_c: {
		opcode: 178,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_bus_sel_c + lines.c_jmp,
			lines.a_in + lines.alu_out,
		]
	},
	addc_a_d: {
		opcode: 179,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_bus_sel_d + lines.c_jmp,
			lines.a_in + lines.alu_out,
		]
	},
	addc_b_a: {
		opcode: 180,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_bus_sel_a + lines.c_jmp,
			lines.b_in + lines.alu_out,
		]
	},
	addc_b_b: {
		opcode: 181,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_bus_sel_b + lines.c_jmp,
			lines.b_in + lines.alu_out,
		]
	},
	addc_b_c: {
		opcode: 182,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_bus_sel_c + lines.c_jmp,
			lines.b_in + lines.alu_out,
		]
	},
	addc_b_d: {
		opcode: 183,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_bus_sel_d + lines.c_jmp,
			lines.b_in + lines.alu_out,
		]
	},
	addc_c_a: {
		opcode: 184,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_bus_sel_a + lines.c_jmp,
			lines.c_in + lines.alu_out,
		]
	},
	addc_c_b: {
		opcode: 185,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_bus_sel_b + lines.c_jmp,
			lines.c_in + lines.alu_out,
		]
	},
	addc_c_c: {
		opcode: 186,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_bus_sel_c + lines.c_jmp,
			lines.c_in + lines.alu_out,
		]
	},
	addc_c_d: {
		opcode: 187,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_bus_sel_d + lines.c_jmp,
			lines.c_in + lines.alu_out,
		]
	},
	addc_d_a: {
		opcode: 188,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_bus_sel_a + lines.c_jmp,
			lines.d_in + lines.alu_out,
		]
	},
	addc_d_b: {
		opcode: 189,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_bus_sel_b + lines.c_jmp,
			lines.d_in + lines.alu_out,
		]
	},
	addc_d_c: {
		opcode: 190,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_bus_sel_c + lines.c_jmp,
			lines.d_in + lines.alu_out,
		]
	},
	addc_d_d: {
		opcode: 191,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_bus_sel_d + lines.c_jmp,
			lines.d_in + lines.alu_out,
		]
	},
	add_a_a: {
		opcode: 224,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_bus_sel_a,
			lines.a_in + lines.alu_out,
		]
	},
	add_a_b: {
		opcode: 225,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_bus_sel_b,
			lines.a_in + lines.alu_out,
		]
	},
	add_a_c: {
		opcode: 226,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_bus_sel_c,
			lines.a_in + lines.alu_out,
		]
	},
	add_a_d: {
		opcode: 227,
		steps: [
			lines.a_out + lines.alu_op + lines.alu_bus_sel_d,
			lines.a_in + lines.alu_out,
		]
	},
	add_b_a: {
		opcode: 228,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_bus_sel_a,
			lines.b_in + lines.alu_out,
		]
	},
	add_b_b: {
		opcode: 229,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_bus_sel_b,
			lines.b_in + lines.alu_out,
		]
	},
	add_b_c: {
		opcode: 230,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_bus_sel_c,
			lines.b_in + lines.alu_out,
		]
	},
	add_b_d: {
		opcode: 231,
		steps: [
			lines.b_out + lines.alu_op + lines.alu_bus_sel_d,
			lines.b_in + lines.alu_out,
		]
	},
	add_c_a: {
		opcode: 232,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_bus_sel_a,
			lines.c_in + lines.alu_out,
		]
	},
	add_c_b: {
		opcode: 233,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_bus_sel_b,
			lines.c_in + lines.alu_out,
		]
	},
	add_c_c: {
		opcode: 234,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_bus_sel_c,
			lines.c_in + lines.alu_out,
		]
	},
	add_c_d: {
		opcode: 235,
		steps: [
			lines.c_out + lines.alu_op + lines.alu_bus_sel_d,
			lines.c_in + lines.alu_out,
		]
	},
	add_d_a: {
		opcode: 236,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_bus_sel_a,
			lines.d_in + lines.alu_out,
		]
	},
	add_d_b: {
		opcode: 237,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_bus_sel_b,
			lines.d_in + lines.alu_out,
		]
	},
	add_d_c: {
		opcode: 238,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_bus_sel_c,
			lines.d_in + lines.alu_out,
		]
	},
	add_d_d: {
		opcode: 239,
		steps: [
			lines.d_out + lines.alu_op + lines.alu_bus_sel_d,
			lines.d_in + lines.alu_out,
		]
	},
	outa: {
		opcode: 7,
		steps: [
			lines.a_out + lines.disp_in,
		]
	},
	jmp: {
		opcode: 12, // c
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.pc_in,
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
	ret: {
		opcode: 17, // 11
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.idx_inh,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.idx_inl,
			lines.sp_abus_out + lines.mem_out + lines.sp_inc +lines.addr_inl,
			lines.sp_abus_out + lines.mem_out + lines.addr_inh,
			lines.addr_abus_out + lines.pc_in,
		]
	},
	jmpcc: {
		opcode: 10,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.c_jmp + lines.flags_inv + lines.pc_in,
		]
	},
	jmpz: {
		opcode: 21, // 15
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.addr_inh,
			lines.addr_abus_out + lines.z_jmp + lines.pc_in,
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
	push_a: {
		opcode: 76,
		steps: [
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.a_out,
		]
	},	
	push_b: {
		opcode: 77,
		steps: [
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.b_out,
		]
	},	
	push_c: {
		opcode: 78,
		steps: [
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.c_out,
		]
	},	
	push_d: {
		opcode: 79,
		steps: [
			lines.sp_abus_out + lines.ram_in + lines.sp_dec + lines.d_out,
		]
	},	
	pop_a: {
		opcode: 72,
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.a_in,
		]
	},	
	pop_b: {
		opcode: 73,
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.b_in,
		]
	},	
	pop_c: {
		opcode: 74,
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.c_in,	
		]
	},	
	pop_d: {
		opcode: 75,
		steps: [
			lines.sp_inc,
			lines.sp_abus_out + lines.mem_out + lines.d_in,
		]
	},
	pop: {
		opcode: 6,
		steps: [
			lines.sp_inc,
		]
	},	
	mvia: {
		opcode: 28, // 1c
		steps: [
			lines.a_in + lines.io_out,
		]
	},
	cie: {
		opcode: 29, // 1d
		steps: [
			lines.cie,
		]
	},
	sie: {
		opcode: 30, // 1e
		steps: [
			lines.sie,
		]
	},
	addi_a: {
		opcode: 92,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op,
			lines.a_in + lines.alu_out,
		]
	},
	addi_b: {
		opcode: 93,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op,
			lines.b_in + lines.alu_out,
		]
	},
	addi_c: {
		opcode: 94,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op,
			lines.c_in + lines.alu_out,
		]
	},
	addi_d: {
		opcode: 95,
		steps: [
			lines.pc_abus_out +lines.mem_out + lines.pc_inc + lines.alu_op,
			lines.d_in + lines.alu_out,
		]
	},
	ldi: {
		opcode: 2,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.idx_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.idx_inh,
		]
	},
	ldo: {
		opcode: 3,
		steps: [
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.off_inl,
			lines.pc_abus_out + lines.mem_out + lines.pc_inc +lines.off_inh,
		]
	},
	mv_a_a: {
		opcode: 192,
		steps: [
		]
	},
	mv_a_b: {
		opcode: 193,
		steps: [
			lines.a_in + lines.b_out,
		]
	},
	mv_a_c: {
		opcode: 194,
		steps: [
			lines.a_in + lines.c_out,
		]
	},
	mv_a_d: {
		opcode: 195,
		steps: [
			lines.a_in + lines.d_out,
		]
	},
	mv_b_a: {
		opcode: 196,
		steps: [
			lines.b_in + lines.a_out,
		]
	},
	mv_b_b: {
		opcode: 197,
		steps: [
		]
	},
	mv_b_c: {
		opcode: 198,
		steps: [
			lines.b_in + lines.c_out,
		]
	},
	mv_b_d: {
		opcode:199,
		steps: [
			lines.b_in + lines.d_out,
		]
	},
	mv_c_a: {
		opcode: 200,
		steps: [
			lines.c_in + lines.a_out,
		]
	},
	mv_c_b: {
		opcode: 201,
		steps: [
			lines.c_in + lines.b_out,
		]
	},
	mv_c_c: {
		opcode: 202,
		steps: [
		]
	},
	mv_c_d: {
		opcode: 203,
		steps: [
			lines.c_in + lines.d_out,
		]
	},
	mv_d_a: {
		opcode: 204,
		steps: [
			lines.d_in + lines.a_out,
		]
	},
	mv_d_b: {
		opcode: 205,
		steps: [
			lines.d_in + lines.b_out,
		]
	},
	mv_d_c: {
		opcode: 206,
		steps: [
			lines.d_in + lines.c_out,
		]
	},
	mv_d_d: {
		opcode: 207,
		steps: [
		]
	},
	
}

function output() {
	console.log('v3.0 hex words addressed');
	var file = 'v3.0 hex words addressed\n';

	for (let i = 0; i < 240; i++) {
		const lineprefix = (i*8).toString(16).padStart(3, "0")+':';
		//const lineprefix2 = (i*16+8).toString(16).padStart(3, "0")+':';

		var found = false;
		for (let j of Object.keys(instr)){
			if(instr[j].opcode == i) {
				found = true;
				
				console.log(j+' '+i+' '+i.toString(16)+' (sh2:'+(i>>2)+' '+(i>>2).toString(16)+') (sh4: '+(i>>4)+' '+(i>>4).toString(16)+')');

				var lineops = ' '+((lines.pc_abus_out + lines.mem_out + lines.pc_inc + lines.ir_in).toString(16).padStart(8,'0'));

				for( let k = 0; k < 7;k++) {
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
		if(! found) console.log('    '+i+' '+i.toString(16)+' (sh2:'+(i>>2)+' '+(i>>2).toString(16)+') (sh4: '+(i>>4)+' '+(i>>4).toString(16)+')');
		if(! found) console.log(lineprefix+' 0000aa59 ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		if(! found) file+=lineprefix+' 0000aa59 ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
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
		if(! found) console.log(lineprefix+' 0000aa59 ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		if(! found) file+=lineprefix+' 0000aa59 ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
		//if(! found) console.log(lineprefix2+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff');
		//if(! found) file+=lineprefix2+' ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff\n';
	}
	fs.writeFileSync('mc1',file);

}

output();
