.org 0x7ffd
counter:
	.byte 0

.org 0x8000 ; ROM
	ld a,BYTE0(handler)
	push a
	ld a,BYTE1(handler)
	push a
	sie
	ld a,0 ; counter
	push a
loop:
	add a,1
	jmp [loop]
handler:
	push a
	push flags
	ld a,io
	sub a,2
	jmpc [less_than_one]
	add [counter],1
	ld o,[counter]
	pop flags
	pop a
	reti
less_than_one:
	sub [counter],1
	ld o,[counter]
	pop flags
	pop a
	reti
