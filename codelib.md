8 bit unsigned division in 138 words, 141-205 cycles:

```assembly
; reg a dividend/result
; reg b divisor
; reg d remainder


    ld flags,0

    lshc a
    lshc d
    sub d,b
    jmpcc [cont]
    add d,b
    ld flags,0
    jmp [step]
cont:
    ld flags,4
step:
    lshc a
    lshc d
    sub d,b
    jmpcc [cont1]
    add d,b
    ld flags,0
    jmp [step1]
cont1:
     ld flags,4
step1:
    lshc a
    lshc d
    sub d,b
    jmpcc [cont2]
    add d,b
    ld flags,0
    jmp [step2]
cont2:
    ld flags,4
step2:
    lshc a
    lshc d
    sub d,b
    jmpcc [cont3]
    add d,b
    ld flags,0
    jmp [step3]
cont3:
    ld flags,4
step3:
    lshc a
    lshc d
    sub d,b
    jmpcc [cont4]
    add d,b
    ld flags,0
    jmp [step4]
cont4:
    ld flags,4
step4:
    lshc a
    lshc d
    sub d,b
    jmpcc [cont5]
    add d,b
    ld flags,0
    jmp [step5]
cont5:
    ld flags,4
step5:
    lshc a
    lshc d
    sub d,b
    jmpcc [cont6]
    add d,b
    ld flags,0
    jmp [step6]
cont6:
    ld flags,4
step6:
    lshc a
    lshc d
    sub d,b
    jmpcc [cont7]
    add d,b
    ld flags,0
    jmp [step7]
cont7:
    ld flags,4
step7:
    lshc a
```

16 bit unsigned division in 423 words, 672-684 cycles:

```assembly
.org 0x8000 ; ROM
    ld a,0 ; remainder low
    ld b,0 ; remainder high

    ld c,0 ; result/dividend low
    ld d,255 ; result/dividend high

    ld e,255 ; divisor low
    ld f,0 ; divisor high

    ld flags,0

    lshc c
    lshc d
    lshc a
    lshc b
    sub a,e
    subc b,f
    jmpcc [cont]
    add a,e
    addc b,f
    ld flags,0
    jmp [next]
cont:
    ld flags,4
next:
    lshc c
    lshc d
    lshc a
    lshc b
    sub a,e
    subc b,f
    jmpcc [cont1]
    add a,e
    addc b,f
    ld flags,0
    jmp [next1]
cont1:
    ld flags,4
next1:
    lshc c
    lshc d
    lshc a
    lshc b
    sub a,e
    subc b,f
    jmpcc [cont2]
    add a,e
    addc b,f
    ld flags,0
    jmp [next2]
cont2:
    ld flags,4
next2:
    lshc c
    lshc d
    lshc a
    lshc b
    sub a,e
    subc b,f
    jmpcc [cont3]
    add a,e
    addc b,f
    ld flags,0
    jmp [next3]
cont3:
    ld flags,4
next3:
    lshc c
    lshc d
    lshc a
    lshc b
    sub a,e
    subc b,f
    jmpcc [cont4]
    add a,e
    addc b,f
    ld flags,0
    jmp [next4]
cont4:
    ld flags,4
next4:
    lshc c
    lshc d
    lshc a
    lshc b
    sub a,e
    subc b,f
    jmpcc [cont5]
    add a,e
    addc b,f
    ld flags,0
    jmp [next5]
cont5:
    ld flags,4
next5:
    lshc c
    lshc d
    lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [cont6]
   	add a,e
	addc b,f
	ld flags,0
	jmp [next6]
cont6:
	ld flags,4
next6:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [cont7]
   	add a,e
	addc b,f
	ld flags,0
	jmp [next7]
cont7:
	ld flags,4
next7:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [cont8]
   	add a,e
	addc b,f
	ld flags,0
	jmp [next8]
cont8:
	ld flags,4
next8:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [cont9]
   	add a,e
	addc b,f
	ld flags,0
	jmp [next9]
cont9:
	ld flags,4
next9:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [conta]
   	add a,e
	addc b,f
	ld flags,0
	jmp [nexta]
conta:
	ld flags,4
nexta:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [contb]
   	add a,e
	addc b,f
	ld flags,0
	jmp [nextb]
contb:
	ld flags,4
nextb:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [contc]
   	add a,e
	addc b,f
	ld flags,0
	jmp [nextc]
contc:
	ld flags,4
nextc:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [contd]
   	add a,e
	addc b,f
	ld flags,0
	jmp [nextd]
contd:
	ld flags,4
nextd:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [conte]
   	add a,e
	addc b,f
	ld flags,0
	jmp [nexte]
conte:
	ld flags,4
nexte:
   	lshc c
    lshc d
	lshc a
	lshc b
	sub a,e
	subc b,f
	jmpcc [contf]
   	add a,e
	addc b,f
	ld flags,0
	jmp [nextf]
contf:
	ld flags,4
nextf:
    lshc c
    lshc d
```

8 bit unsigned multiply, 16 bit result, 84-116 cycles:

```assembly
.org 0x8000
    
    ld a,0 ; multiplicant
    ld b,0 ; multiplier / result low
    ld c,0 ; result high


    rsh b

    jmpcc [step0]
    add c,a
step0:
    rshc c
    rshc b

    jmpcc [step1]
    add c,a
step1:
    rshc c
    rshc b

    jmpcc [step2]
    add c,a
step2:
    rshc c
    rshc b

    jmpcc [step3]
    add c,a
step3:
    rshc c
    rshc b

    jmpcc [step4]
    add c,a
step4:
    rshc c
    rshc b

    jmpcc [step5]
    add c,a
step5:
    rshc c
    rshc b

    jmpcc [step6]
    add c,a
step6:
    rshc c
    rshc b

    jmpcc [step7]
    add c,a
step7:
    rshc c
    rshc b
```
