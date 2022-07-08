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
var1:
	.byte 0
spinner:
	.byte 0
counter2:
	.byte 0
counter3:
	.byte 0
ab:
	.byte 0
.org 0x8000 ; ROM
start:
	ld a,LSB(ab)
	ld b,BYTE1(ab)
	ld c,88
	st c,[ab]
	ld d,a,b
;	ld c,[sp - 1]
	ld c,88
	push c
	call [func]
	pop
	ld c,0
	ld b,12 ; 15

	jmp [busy]
func:
	ld a,[sp + 3]
	ld a,b,c
	ret

busy:
	ld a,b
	sub a,129
	jmpcc [busy]

	ld b,128

busy2:
	ld a,b
	sub a,129
	jmpcc [busy2]

	ld b,56

busy3:
	ld a,b
	sub a,129
	jmpcc [busy3]
	
	ld b,1 ; with cursor
	;ld b,12 ; without cursor

busy4:
	ld a,b
	sub a,129
	jmpcc [busy4]

	ld b,2

busy5:
	ld a,b
	sub a,129
	jmpcc [busy5]


	ld a,3 ; dividend/result
    st a,[dividend]
    st a,[result]
    ld a,2 ; divisor
    st a,[divisor]
    ld a,0 ; remainder
    st a,[remainder]
    st a,[spinner]
    st a,[counter2]
    st a,[counter3]
	ld a,8 ; loopcount
    st a,[counter]
	sub a,a
step:


	ld a,[counter2]
	sub a,1
	st a,[counter2]
	jmpcc [nospinner]
	ld a,[counter3]
	sub a,1
	st a,[counter3]
	jmpcc [nospinner]
	ld a,10
	st a,[counter3]

busy12:
	ld a,b
	sub a,129
	jmpcc [busy12]
	
	ld c,0
	ld b,148
busy13:
	ld a,b
	sub a,129
	jmpcc [busy13]
	ld c,1
	ld a,[spinner]
	sub a,1
	jmpc [spinnerzero]
	st a,[spinner]
	ld b,45
	jmp [busy14]
spinnerzero:
	ld a,1
	st a,[spinner]
	ld b,124
busy14:
	ld a,b
	sub a,129
	jmpcc [busy14]
	sub a,a

nospinner:
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
	
	ld a,b
	sub a,129
	jmpcc [next_div]
	
	ld c,0
	ld b,128
busy6:
	ld a,b
	sub a,129
	jmpcc [busy6]

	ld c,1
	
	ld a,[dividend]
	sub a,100
	jmpc [not100]
	sub a,100
	jmpc [not200]
	ld b,50
	sub a,100
	jmp [decades]
not100:
	ld b,48
	jmp [decades]
not200:
	ld b,49
decades:
	st a,[var1]
busy10:
	ld a,b
	sub a,129
	jmpcc [busy10]
	ld a,[var1]
	add a,100
	sub a,10
	jmpc [not10]
	sub a,10
	jmpc [not20]
	sub a,10
	jmpc [not30]
	sub a,10
	jmpc [not40]
	sub a,10
	jmpc [not50]
	sub a,10
	jmpc [not60]
	sub a,10
	jmpc [not70]
	sub a,10
	jmpc [not80]
	sub a,10
	jmpc [not90]
	ld b,57
	sub a,10
	jmp [decade]
not90:
	ld b,56
	jmp [decade]
not80:
	ld b,55
	jmp [decade]
not70:
	ld b,54
	jmp [decade]
not60:
	ld b,53
	jmp [decade]
not50:
	ld b,52
	jmp [decade]
not40:
	ld b,51
	jmp [decade]
not30:
	ld b,50
	jmp [decade]
not20:
	ld b,49
	jmp [decade]
not10:
	ld b,48
decade:
	st a,[var1]
busy9:
	ld a,b
	sub a,129
	jmpcc [busy9]
	ld a,[var1]
	add a,58
	ld b,a
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

				
