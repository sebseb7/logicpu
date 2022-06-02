.org 0x0000 ; RAM

seed1:
	.byte 0
seed2:
	.byte 0

.org 0x8000 ; ROM

start:
	call [rand]
	ld o,a
	jmp [start]

rand:
	; https://www.elmerproductions.com/sp/peterb/insideBoulderdash.html
	ld a,[seed1]
	ld c,[seed2]
	ld d,a
	rsh a
	rshc a
	and a,0x80
	ld b,c
	rsh c
	rshc c
	and c,0x80
	add c,b
	addc c,0x13
	rsh b
	and b,0x7f
	addc d,a
	addc d,b
	st c,[seed2]
	st d,[seed1]

	ld a,c
	ret



