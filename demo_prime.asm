; 21 sec
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
step:
    lsh [result]
    ld a,[remainder]
    st a,[remainder_tmp]
    lshc [remainder]
    sub [counter],1
    jmpc [end]
    ld a,[remainder]
    sub [remainder],[divisor]
    jmpcc [step]
    st a,[remainder]
   	jmp [step]

end:
    sub [remainder_tmp],1
    jmpc [next_div]
    sub [divisor],3
    jmpc [next_div_prime]
    add [divisor],2
    ld a,[dividend]
    st a,[result]
    ld a,0
    st a,[remainder]
    ld a,8
    st a,[counter]
   	jmp [step]
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
   	jmp [step]

repeat:
	jmp [start]
				
