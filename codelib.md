8 bit signed division in 138 words, 141-205 cycles:

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
