.org 0x8000
	ld df,0
	ld dd,63 ; display on ; 63 on ; 62 off
	ld dd,192 ; start line (c0 to ff 192-255) (scrolls the display)
	ld df,2
	ld dd,63 ; display on ; 63 on ; 62 off
	ld dd,192 ; start line (c0 to ff 192-255) (scrolls the display)
restart:
	ld a,0
	push a
	ld a,0
	push a
next_row:
	call [draw_row]
	add [sp+1],1
	cmp [sp+1],8
	jmpc [next_row]

	ld a,0
loop:
	add a,1
	jmpcc [loop]

	ld a,0
loop2:
	add a,1
	jmpcc [loop2]

	ld a,0
loop3:
	add a,1
	jmpcc [loop3]

	ld a,0
loop4:
	add a,1
	jmpcc [loop4]
	ld a,0
loop5:
	add a,1
	jmpcc [loop5]

	ld a,0
loop6:
	add a,1
	jmpcc [loop6]

	ld a,0
loop7:
	add a,1
	jmpcc [loop7]

	ld a,0
loop8:
	add a,1
	jmpcc [loop8]

	ld a,0
	st a,[sp+1]
	add [sp],2
	cmp [sp],24
	jmpc [next_row]

	
	pop
	pop



	jmp [restart]


draw_row:

	ld a,184
	add a,[sp+3]

	ld df,0
	ld dd,a
	ld dd,64

	ld df,2
	ld dd,a
	ld dd,64

	ld df,1
	ld a,0
	push a

	cmp [sp+4],7
	jmpcc [row_7]
	cmp [sp+4],6
	jmpcc [row_6]
	cmp [sp+4],5
	jmpcc [row_5]
	cmp [sp+4],4
	jmpcc [row_4]
	cmp [sp+4],3
	jmpcc [row_3]
	cmp [sp+4],2
	jmpcc [row_2]
	cmp [sp+4],1
	jmpcc [row_1]
	ld a,0
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	push a

	jmp [next_col]

row_1:
	ld a,64
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	push a
	jmp [next_col]
row_2:
	ld a,128
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	push a
	jmp [next_col]
row_3:
	ld a,192
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	push a
	jmp [next_col]
row_4:
	ld a,0
	push a
	ld a,BYTE1(nyan)
	add a,1
	add a,[sp+4]
	push a
	jmp [next_col]
row_5:
	ld a,64
	push a
	ld a,BYTE1(nyan)
	add a,1
	add a,[sp+4]
	push a
	jmp [next_col]
row_6:
	ld a,128
	push a
	ld a,BYTE1(nyan)
	add a,1
	add a,[sp+4]
	push a
	jmp [next_col]
row_7:
	ld a,192
	push a
	ld a,BYTE1(nyan)
	add a,1
	add a,[sp+4]
	push a





next_col:
	ld dd,[sp],[sp+1]
	nop
	nop
	nop
	nop
	nop
	nop
	ld dd,[sp],[sp+1]
	add [sp+1],1
	add [sp+2],1
	cmp [sp+2],32
	jmpc [next_col]


	pop
	pop
	pop


	ld df,3
	ld a,0
	push a

	cmp [sp+4],7
	jmpcc [row_7b]
	cmp [sp+4],6
	jmpcc [row_6b]
	cmp [sp+4],5
	jmpcc [row_5b]
	cmp [sp+4],4
	jmpcc [row_4b]
	cmp [sp+4],3
	jmpcc [row_3b]
	cmp [sp+4],2
	jmpcc [row_2b]
	cmp [sp+4],1
	jmpcc [row_1b]
	ld a,32
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	push a
	jmp [next_colb]

row_1b:
	ld a,96
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	push a
	jmp [next_colb]
row_2b:
	ld a,160
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	push a
	jmp [next_colb]
row_3b:
	ld a,224
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	push a
	jmp [next_colb]
row_4b:
	ld a,32
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	add a,1
	push a
	jmp [next_colb]
row_5b:
	ld a,96
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	add a,1
	push a
	jmp [next_colb]
row_6b:
	ld a,160
	push a
	ld a,BYTE1(nyan)
	add a,1
	add a,[sp+4]
	push a
	jmp [next_colb]
row_7b:
	ld a,224
	push a
	ld a,BYTE1(nyan)
	add a,[sp+4]
	add a,1
	push a



next_colb:
	ld dd,[sp],[sp+1]
	nop
	nop
	nop
	nop
	nop
	nop
	ld dd,[sp],[sp+1]
	add [sp+1],1
	add [sp+2],1
	cmp [sp+2],32
	jmpc [next_colb]


	pop
	pop
	pop

	ret




.org 0x8200
nyan:
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,240,240,252
    .byte 252,252,252,252,252,12,240,252
    .byte 252,252,252,252,252,252,252,252
    .byte 252,252,252,252,252,252,252,252
    .byte 252,240,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,63
    .byte 63,63,63,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,15,243,243,207,63,255,255
    .byte 255,255,0,192,240,240,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,240
    .byte 195,15,252,240,3,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 63,192,255,255,255,255,252,252
    .byte 252,252,255,255,255,255,192,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,252,240,243,195,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 0,255,255,255,243,48,255,255
    .byte 63,243,255,51,240,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,15,15,15,15,3
    .byte 3,3,3,3,243,240,51,15
    .byte 15,15,207,207,15,15,15,15
    .byte 15,12,3,15,207,204,12,12
    .byte 12,204,204,12,15,3,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,3,0,0,192,0
    .byte 0,3,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0


    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,240,240,252
    .byte 252,252,252,252,252,12,240,252
    .byte 252,252,252,252,252,252,252,252
    .byte 252,252,252,252,252,252,252,252
    .byte 252,240,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,15,243,243,207,63,255
    .byte 255,255,0,0,192,240,240,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,15
    .byte 243,243,15,63,63,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,63,192,255,255,255,255,252
    .byte 252,252,252,255,255,255,255,192
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 252,243,243,207,207,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,0,255,255,255,243,48,255
    .byte 255,63,243,255,51,240,255,255
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,15,15,15,15,3
    .byte 3,3,3,3,3,240,243,15
    .byte 15,15,207,207,15,15,15,15
    .byte 15,15,12,3,15,207,204,12
    .byte 12,12,204,204,12,15,3,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 3,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 240,240,240,240,240,252,252,252
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,48,192,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,192,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,63,207,207,63,255,255
    .byte 255,255,0,0,0,192,192,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,0,255,255,255,252,243
    .byte 243,243,240,252,255,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,15
    .byte 207,243,243,51,48,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,0,255,255,255,207,195,255
    .byte 255,255,207,255,207,195,255,255
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 15,15,15,15,15,3,3,3
    .byte 3,3,3,3,3,3,15,15
    .byte 12,12,12,12,15,0,207,63
    .byte 63,63,63,63,63,63,63,63
    .byte 63,60,51,15,63,63,48,51
    .byte 51,48,51,51,48,63,15,3
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,3,3
    .byte 0,0,0,3,3,0,0,0
    .byte 0,0,0,0,0,0,3,3
    .byte 0,0,0,3,3,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0


    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 12,192,0,0,0,192,12,0
    .byte 240,240,240,240,240,252,252,252
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,48,192,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,192,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,3,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,63,207,207,63,255,255
    .byte 255,255,0,0,0,192,192,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,0,255,255,255,252,243
    .byte 243,243,240,252,255,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,63
    .byte 207,243,51,60,60,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,0,255,255,255,207,195,255
    .byte 255,255,207,255,207,195,255,255
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 15,15,15,15,15,3,3,3
    .byte 3,3,3,3,3,3,15,12
    .byte 3,3,12,15,15,192,207,63
    .byte 63,63,63,63,63,63,63,63
    .byte 63,60,51,15,63,63,48,51
    .byte 51,48,51,51,48,63,15,3
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,3,3,0
    .byte 0,0,3,3,0,0,0,0
    .byte 0,0,0,0,0,3,3,0
    .byte 0,0,3,3,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,12
    .byte 0,0,0,0,0,12,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,240,240,252
    .byte 252,252,252,252,252,60,204,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,192,0,0,0,0,0,0
    .byte 0,0,3,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,63,207,207,63,255,255,255
    .byte 255,255,0,0,192,192,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,15,51
    .byte 243,243,195,207,15,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,0,255,255,255,252,243,243
    .byte 243,243,252,255,255,255,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,252
    .byte 243,243,243,195,204,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 0,255,255,255,207,195,255,255
    .byte 255,207,255,207,195,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,15,15,15,15,3
    .byte 3,3,3,195,195,192,15,63
    .byte 63,63,63,63,63,63,63,63
    .byte 60,51,15,63,63,48,51,51
    .byte 48,51,51,48,63,15,3,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,3,3,0,0,0
    .byte 3,3,0,0,0,0,0,0
    .byte 0,0,0,3,3,0,0,0
    .byte 3,3,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,12,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,240,240,252
    .byte 252,252,252,252,252,60,204,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,192,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,15,243,243,207,63,255,255
    .byte 255,255,0,192,240,240,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,15
    .byte 243,243,15,63,63,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 63,192,255,255,255,255,252,252
    .byte 252,252,255,255,255,255,192,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 252,243,243,207,207,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 0,255,255,255,243,48,255,255
    .byte 63,243,255,51,240,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,15,15,15,15,3
    .byte 3,3,3,195,243,192,15,63
    .byte 63,63,63,63,63,63,63,63
    .byte 63,60,51,15,15,12,12,12
    .byte 12,204,12,12,15,3,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,3,3,0,0,0
    .byte 3,3,0,0,0,0,0,0
    .byte 0,0,0,3,3,0,0,0
    .byte 3,3,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,12
    .byte 51,12,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 240,240,240,240,240,252,252,252
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,0,240,252
    .byte 252,252,252,252,252,252,252,252
    .byte 252,252,252,252,252,252,252,252
    .byte 252,240,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,63
    .byte 63,63,63,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,15,243,243,207,63,255,255
    .byte 255,255,0,192,240,240,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,240
    .byte 3,15,252,240,3,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 63,192,255,255,255,255,252,252
    .byte 252,252,255,255,255,255,192,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,252,240,243,195,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 0,255,255,255,243,48,255,255
    .byte 63,243,255,51,240,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 15,15,15,15,15,3,3,3
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,15,243,240,51,15
    .byte 15,15,207,207,15,15,15,15
    .byte 15,12,3,15,207,204,12,12
    .byte 12,204,204,12,15,3,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,48,0,12,0,48,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 3,48,0,192,0,48,3,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 12,12,243,12,12,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 240,240,240,240,240,252,252,252
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,0,240,252
    .byte 252,252,252,252,252,252,252,252
    .byte 252,252,252,252,252,252,252,252
    .byte 252,240,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,15,243,243,207,63,255
    .byte 255,255,0,0,192,240,240,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,15
    .byte 243,243,15,63,63,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,63,192,255,255,255,255,252
    .byte 252,252,252,255,255,255,255,192
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 252,243,243,207,207,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,0,255,255,255,243,48,255
    .byte 255,63,243,255,51,240,255,255
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 15,15,15,15,15,3,3,3
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,15,15,240,243,15
    .byte 15,15,207,207,15,15,15,15
    .byte 15,15,12,3,15,207,204,12
    .byte 12,12,204,204,12,15,3,0
    .byte 0,0,12,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,3
    .byte 0,0,192,0,0,3,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,12,12
    .byte 0,204,0,12,12,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,240,240,252
    .byte 252,252,252,252,252,60,204,240
    .byte 240,243,240,240,240,240,240,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,192,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,63,207,207,63,255,255
    .byte 255,255,0,0,0,192,192,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,0,255,255,255,252,243
    .byte 243,243,240,252,255,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,15
    .byte 207,243,243,51,48,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,0,255,255,255,207,195,255
    .byte 255,255,207,255,207,195,255,255
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,15,15,15,15,3
    .byte 0,0,0,0,3,0,207,63
    .byte 63,63,63,63,63,63,63,63
    .byte 63,60,51,15,63,63,48,51
    .byte 51,48,51,51,48,63,15,3
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,3,3
    .byte 0,0,0,3,3,0,0,0
    .byte 0,0,0,0,0,0,3,3
    .byte 0,3,0,3,3,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

   .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,12,192,0
    .byte 0,0,192,12,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,240,240,252
    .byte 255,252,252,252,252,60,204,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,192,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,63,207,207,63,255,255
    .byte 255,255,0,0,0,192,192,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,0,255,255,255,252,243
    .byte 243,243,240,252,255,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,63
    .byte 207,243,51,60,60,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,0,255,255,255,207,195,255
    .byte 255,255,207,255,207,195,255,255
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,15,15,15,15,0
    .byte 3,3,0,3,3,192,207,63
    .byte 63,63,63,63,63,63,63,63
    .byte 63,60,51,15,63,63,48,51
    .byte 51,48,51,51,48,63,15,3
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,3,3,0
    .byte 0,0,3,3,0,0,0,0
    .byte 3,3,60,3,0,3,3,0
    .byte 0,0,3,3,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

    .byte 0,0,0,0,12,0,0,0
    .byte 0,0,12,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 240,240,240,240,240,252,252,255
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,48,192,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,192,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,63,207,207,63,255,255,255
    .byte 255,255,0,0,192,192,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,15,51
    .byte 243,243,195,207,15,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,0,255,255,255,252,243,243
    .byte 243,243,252,255,255,255,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,252
    .byte 243,243,243,195,207,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 0,255,255,255,207,195,255,255
    .byte 255,207,255,207,195,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 15,15,15,15,15,3,3,3
    .byte 3,3,3,3,3,3,15,15
    .byte 15,15,15,207,195,192,15,63
    .byte 63,63,63,63,63,63,63,63
    .byte 60,51,15,63,63,48,51,51
    .byte 48,51,51,48,63,15,3,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,3,3,0,3,0
    .byte 3,243,0,3,3,0,0,0
    .byte 0,0,0,3,3,0,0,0
    .byte 3,3,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0

    .byte 12,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 240,240,240,240,240,252,252,252
    .byte 252,252,252,252,252,252,240,240
    .byte 240,240,240,240,240,48,192,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,240,240,240,240,240,240,240
    .byte 240,192,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 255,15,243,243,207,63,255,255
    .byte 255,255,0,192,240,240,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,15
    .byte 243,243,15,63,63,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 63,192,255,255,255,255,252,252
    .byte 252,252,255,255,255,255,192,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 255,255,255,255,255,255,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 252,243,243,207,207,0,255,255
    .byte 255,255,255,255,255,255,255,255
    .byte 0,255,255,255,243,48,255,255
    .byte 63,243,255,51,240,255,255,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 15,15,15,15,15,3,3,3
    .byte 3,3,3,3,3,3,63,15
    .byte 15,15,63,207,243,192,15,63
    .byte 63,63,63,63,63,63,63,63
    .byte 63,60,51,15,15,12,12,12
    .byte 12,204,12,12,15,3,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,3,48,0
    .byte 192,0,48,3,3,0,0,0
    .byte 3,3,0,0,0,0,0,0
    .byte 0,0,0,3,3,0,0,0
    .byte 3,3,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
    .byte 0,0,0,0,0,0,0,0
