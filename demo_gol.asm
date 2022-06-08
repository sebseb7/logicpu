; ################
; # Game Of Life #
; ################


.org 0x0000 ; RAM
seed:
	.byte 0
random:
	.byte 0
board_a:
	.fill 64, 0
board_b:
	.fill 64, 0

.org 0x8000 ; ROM
	ld a,0
	st a,[seed]
	st b,[random]
	call [randomize_board]
start:
	call [draw]
	ld a,0
	ld b,0
	ld c,0
	ld d,0
	ld e,8
	ld f,0
	ld g,0

next_lutitem:
	ld ao,lut
	add aol,c
	addc aoh,d
	ld b,ao
	ld ao,board_a
	add aol,b
	addc aoh,0
	add a,ao
	add c,1
	addc d,0
	sub e,1
	jmpz [done]
	jmp [next_lutitem]
done:
	ld o,a
	ld o2,f
	ld e,8
	ld ao,board_a
	add aol,f
	addc aoh,0
	ld h,ao
	sub h,1
	jmpz [live]
	;dead
	ld ao,board_b
	add aol,f
	addc aoh,0
	add f,1
	ld h,3
	sub h,a
	jmpz [makelive]
	ld h,0
	st h,ao
	jmp [cont]
makelive:
	ld h,1
	st h,ao
	jmp [cont]
live:
	ld ao,board_b
	add aol,f
	addc aoh,0
	add f,1
	ld h,3
	sub h,a
	jmpz [makelive]
	ld h,2
	sub h,a
	jmpz [makelive]
	ld h,0
	st h,ao
cont:
	ld a,0
	ld g,64
	sub g,f
	jmpz [done2]
	ld e,8
	jmp [next_lutitem]
done2:

	call [draw_b]


	ld a,0
	ld b,0
	ld c,0
	ld d,0
	ld e,8
	ld f,0
	ld g,0

next_lutitem2:
	ld ao,lut
	add aol,c
	addc aoh,d
	ld b,ao
	ld ao,board_b
	add aol,b
	addc aoh,0
	add a,ao
	add c,1
	addc d,0
	sub e,1
	jmpz [done3]
	jmp [next_lutitem2]
done3:
	ld o,a
	ld e,8
	ld ao,board_b
	add aol,f
	addc aoh,0
	ld h,ao
	sub h,1
	jmpz [live2]
	;dead
	ld ao,board_a
	add aol,f
	addc aoh,0
	add f,1
	ld h,3
	sub h,a
	jmpz [makelive2]
	ld h,0
	st h,ao
	jmp [cont2]
makelive2:
	ld h,1
	st h,ao
	jmp [cont2]
live2:
	ld ao,board_a
	add aol,f
	addc aoh,0
	add f,1
	ld h,3
	sub h,a
	jmpz [makelive2]
	ld h,2
	sub h,a
	jmpz [makelive2]
	ld h,0
	st h,ao
cont2:
	ld a,0
	ld g,64
	sub g,f
	jmpz [done4]
	ld e,8
	jmp [next_lutitem2]
done4:
	jmp [start]


draw:
	ld a,8
	ld b,8
	ld ao,board_a
next_bit:
	add d,d
	ld c,ao
	add aol,1
	addc aoh,0
	add d,c
	sub b,1
	jmpz [fin]
	jmp [next_bit]
fin:
	sub a,1
	ld pa,a
	ld pb,d
	jmpz [ret]
	ld b,8
	jmp [next_bit]

draw_b:
	ld a,8
	ld b,8
	ld ao,board_b
next_bit2:
	add d,d
	ld c,ao
	add aol,1
	addc aoh,0
	add d,c
	sub b,1
	jmpz [fin2]
	jmp [next_bit2]
fin2:
	sub a,1
	ld pa,a
	ld pb,d
	jmpz [ret]
	ld b,8
	jmp [next_bit2]

randomize_board:
	ld a,65
	ld ao,board_a
randomize_next_cell:
	sub a,1
	ld o,a
	jmpz [ret]
	call [rand]
	ld b,[random]
	sub b,227
	jmpcc [set_cell_active]
	ld c,0
	st c,ao
	add aol,1
	addc aoh,0
	jmp [randomize_next_cell]
set_cell_active:
	ld c,1
	st c,ao
	add aol,1
	addc aoh,0
	jmp [randomize_next_cell]
	ret
ret:
	ret
rand:
	push a
	push b
	push c
	push d
	ld a,[seed]
	ld c,[random]
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
	st c,[random]
	st d,[seed]
	pop d
	pop c
	pop b
	pop a
	ret
lut: ; precomputed neighbours
	.byte 15,8,9,7,1,63,56,57
	.byte 8,9,10,0,2,56,57,58
	.byte 9,10,11,1,3,57,58,59
	.byte 10,11,12,2,4,58,59,60
	.byte 11,12,13,3,5,59,60,61
	.byte 12,13,14,4,6,60,61,62
	.byte 13,14,15,5,7,61,62,63
	.byte 14,15,8,6,0,62,63,56
	.byte 23,16,17,15,9,7,0,1
	.byte 16,17,18,8,10,0,1,2
	.byte 17,18,19,9,11,1,2,3
	.byte 18,19,20,10,12,2,3,4
	.byte 19,20,21,11,13,3,4,5
	.byte 20,21,22,12,14,4,5,6
	.byte 21,22,23,13,15,5,6,7
	.byte 22,23,16,14,8,6,7,0
	.byte 31,24,25,23,17,15,8,9
	.byte 24,25,26,16,18,8,9,10
	.byte 25,26,27,17,19,9,10,11
	.byte 26,27,28,18,20,10,11,12
	.byte 27,28,29,19,21,11,12,13
	.byte 28,29,30,20,22,12,13,14
	.byte 29,30,31,21,23,13,14,15
	.byte 30,31,24,22,16,14,15,8
	.byte 39,32,33,31,25,23,16,17
	.byte 32,33,34,24,26,16,17,18
	.byte 33,34,35,25,27,17,18,19
	.byte 34,35,36,26,28,18,19,20
	.byte 35,36,37,27,29,19,20,21
	.byte 36,37,38,28,30,20,21,22
	.byte 37,38,39,29,31,21,22,23
	.byte 38,39,32,30,24,22,23,16
	.byte 47,40,41,39,33,31,24,25
	.byte 40,41,42,32,34,24,25,26
	.byte 41,42,43,33,35,25,26,27
	.byte 42,43,44,34,36,26,27,28
	.byte 43,44,45,35,37,27,28,29
	.byte 44,45,46,36,38,28,29,30
	.byte 45,46,47,37,39,29,30,31
	.byte 46,47,40,38,32,30,31,24
	.byte 55,48,49,47,41,39,32,33
	.byte 48,49,50,40,42,32,33,34
	.byte 49,50,51,41,43,33,34,35
	.byte 50,51,52,42,44,34,35,36
	.byte 51,52,53,43,45,35,36,37
	.byte 52,53,54,44,46,36,37,38
	.byte 53,54,55,45,47,37,38,39
	.byte 54,55,48,46,40,38,39,32
	.byte 63,56,57,55,49,47,40,41
	.byte 56,57,58,48,50,40,41,42
	.byte 57,58,59,49,51,41,42,43
	.byte 58,59,60,50,52,42,43,44
	.byte 59,60,61,51,53,43,44,45
	.byte 60,61,62,52,54,44,45,46
	.byte 61,62,63,53,55,45,46,47
	.byte 62,63,56,54,48,46,47,40
	.byte 7,0,1,63,57,55,48,49
	.byte 0,1,2,56,58,48,49,50
	.byte 1,2,3,57,59,49,50,51
	.byte 2,3,4,58,60,50,51,52
	.byte 3,4,5,59,61,51,52,53
	.byte 4,5,6,60,62,52,53,54
	.byte 5,6,7,61,63,53,54,55
	.byte 6,7,0,62,56,54,55,48



