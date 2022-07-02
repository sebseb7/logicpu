dividend:
    .byte 0
result:
    .byte 0
divisor:
    .byte 0
remainder:
    .byte 0
remainder_tmp:
    .byte 0
counter:
    .byte 0

.org 0x8000 ; ROM
start:
	ld a,3 ; dividend/result
    st a,[dividend]
    st a,[result]
    ld a,2 ; divisor
    st a,[divisor]
    ld a,0 ; remainder
    st a,[remainder]
	ld a,8 ; loopcount
    st a,[counter]
	sub a,a
step:
    ld a,[result]
    addc a,a
    st a,[result]
    ld a,[remainder]
    st a,[remainder_tmp]
    addc a,a
    st a,[remainder]
    ld a,[counter]
    sub a,1
    jmpc [end]
    st a,[counter]
    ld a,[remainder]
	sub a,[divisor]
	jmpcc [cont]
    add a,[divisor]
    st a,[remainder]
    sub a,a
   	jmp [step]
cont:
    st a,[remainder]
	ld a,255
    add a,255
	jmp [step]

end:
    ld a,[remainder_tmp]
 	sub a,1
	jmpc [divisible]
    ld a,[divisor]
 	sub a,3
	jmpc [next_div_prime]
	add a,2
    st a,[divisor]
    ld a,[dividend]
    st a,[result]
    ld a,0
    st a,[remainder]
	ld a,8
    st a,[counter]
	sub a,a
   	jmp [step]
divisible:
   	jmp [next_div]
next_div_prime:
	ld o,[dividend]
next_div:
	ld a,[dividend]
	add a,1
	jmpc [repeat]
    st a,[dividend]
    st a,[result]
	sub a,1
    st a,[divisor]
    ld a,0
    st a,[remainder]
	ld a,8
    st a,[counter]
	sub a,a
   	jmp [step]

repeat:
	jmp [start]

				
