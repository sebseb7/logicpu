.org 0x7fff ; ROM

counter:
	.byte 0

.org 0x8000 ; ROM
	ld a,0 ; counter
	push a
	ld a,BYTE0(handler)
	push a
	ld a,BYTE1(handler)
	push a
	sie
	ld a,0
	st a,[counter]
loop:
	jmp [loop]
handler:
	ld a,io
	sub a,2
	jmpc [less_than_one]
	add [counter],1
	ld o,[counter]
	reti
less_than_one:
	sub [counter],1
	ld o,[counter]
	reti
