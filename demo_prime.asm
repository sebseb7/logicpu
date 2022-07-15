.org 0x8000 ; ROM
	push a ; dividend      sp+5
	push a ; result        sp+4
	push a ; divisor       sp+3
	push a ; remainder     sp+2
	push a ; remainder_tmp sp+1
	push a ; counter       sp
start:
    ld a,3 ;
    st a,[sp + 5]
    st a,[sp + 4]
    ld a,2 ;
    st a,[sp + 3]
    ld a,0 ;
    st a,[sp + 2]
    st a,[sp + 1]
    ld a,8 ;
    st a,[sp]
step:
    lsh [sp + 4]
    ld a,[sp + 2]
    st a,[sp + 1]
    lshc [sp + 2]
    sub [sp],1
    jmpc [end]
    ld a,[sp + 2]
    sub [sp + 2],[sp + 3]
    jmpcc [step]
    st a,[sp + 2]
    jmp [step]

end:
    sub [sp + 1],1
    jmpc [next_div]
    sub [sp + 3],3
    jmpc [next_div_prime]
    add [sp + 3],2
    ld a,[sp + 5]
    st a,[sp + 4]
    ld a,0
    st a,[sp + 2]
    ld a,8
    st a,[sp]
    jmp [step]
next_div_prime:
    ld o,[sp + 5]
	
next_div:
    ld a,[sp + 5]
    add a,1
    jmpc [start]
    st a,[sp + 5]
    st a,[sp + 4]
    sub a,1
    st a,[sp + 3]
    ld a,0
    st a,[sp + 2]
    ld a,8
    st a,[sp]
    jmp [step]
				
