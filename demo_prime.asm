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
.org 0x8000 ; ROM
start:
	ld df,0
	ld dd,12 ; 15
busy:
	ld a,dd
	sub a,129
	jmpcc [busy]

	ld dd,128

busy2:
	ld a,dd
	sub a,129
	jmpcc [busy2]

	ld dd,56

busy3:
	ld a,dd
	sub a,129
	jmpcc [busy3]
	
	ld dd,1 ; with cursor
	;ld dd,12 ; without cursor

busy4:
	ld a,dd
	sub a,129
	jmpcc [busy4]

	ld dd,2

busy5:
	ld a,dd
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


	sub [counter2],1
	jmpcc [nospinner]
	sub [counter3],1
	jmpcc [nospinner]
	ld a,10
	st a,[counter3]

busy12:
	ld a,dd
	sub a,129
	jmpcc [busy12]
	
	ld df,0
	ld dd,148
busy13:
	ld a,dd
	sub a,129
	jmpcc [busy13]
	ld df,1
	ld a,[spinner]
	sub a,1
	jmpc [spinnerzero]
	st a,[spinner]
	ld dd,45
	jmp [busy14]
spinnerzero:
	ld a,1
	st a,[spinner]
	ld dd,124
busy14:
	ld a,dd
	sub a,129
	jmpcc [busy14]

nospinner:
	lsh [result]
    ld a,[remainder]
    st a,[remainder_tmp]
	lshc [remainder]
    sub [counter],1
    jmpc [end]
    ld a,[remainder]
	sub [remainder],[divisor]
	jmpcc [nospinner]
    st a,[remainder]
   	jmp [nospinner]

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
   	jmp [step]
divisible:
   	jmp [next_div]
next_div_prime:
	ld o,[dividend]
	
	ld a,dd
	sub a,129
	jmpcc [next_div]
	
	ld df,0
	ld dd,128
busy6:
	ld a,dd
	sub a,129
	jmpcc [busy6]

	ld df,1
	
	ld a,[dividend]
	sub a,100
	jmpc [not100]
	sub a,100
	jmpc [not200]
	ld dd,50
	sub a,100
	jmp [decades]
not100:
	ld dd,48
	jmp [decades]
not200:
	ld dd,49
decades:
	st a,[var1]
busy10:
	ld a,dd
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
	ld dd,57
	sub a,10
	jmp [decade]
not90:
	ld dd,56
	jmp [decade]
not80:
	ld dd,55
	jmp [decade]
not70:
	ld dd,54
	jmp [decade]
not60:
	ld dd,53
	jmp [decade]
not50:
	ld dd,52
	jmp [decade]
not40:
	ld dd,51
	jmp [decade]
not30:
	ld dd,50
	jmp [decade]
not20:
	ld dd,49
	jmp [decade]
not10:
	ld dd,48
decade:
	st a,[var1]
busy9:
	ld a,dd
	sub a,129
	jmpcc [busy9]
	ld a,[var1]
	add a,58
	ld dd,a
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
   	jmp [step]

repeat:
	jmp [start]

				
