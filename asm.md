INFORMATION OUTDATED


8 bit registers: a,b,c,d,e,f,g,h,aoh,aol ; write only : o

16 bit registers:
- address-offset: ao

virtual registers:
- fpo = framepointer - ao (framepointer = stackpointer as of function entry)

memory: 0-7fff (ram) ; 8000-ffff (rom)

big endian

```assembly
ld reg8_a,reg8_b|fpo|ao|[mem]|value8       ;reg8_a = reg8_b|mem|value8
ld reg16,value16

st reg,fpo|ao|[mem]                     ;reg->mem

add reg_a,reg_b|[mem]|value8      ;reg_a = reg_a+reg_b|mem|value8 
addc reg_a,reg_b|[mem]|value8     ;add + carry
sub reg_a,reg_b|[mem]|value8      ;reg_a = reg_a-reg_b|mem|value8
subc reg_a,reg_b|[mem]|value8     ;sub + carry
xor reg_a,reg_b|[mem]|value8
and reg_a,reg_b|[mem]|value8
rsh reg_a
rshc reg_a

jmp [mem]
jmpz [mem]         ;zero
jmpcc [mem]         ;carry clear

push reg|count
pop ?reg|?count

call [mem]

nop
hlt

cie              ; clear interupt enable
sie              ; set interrupt enable
reti             ; return from interrupt (place interrupt handler address at 0xfffe-0xffff, big endian; all registers saved/restored via stack)
```

example interrupt handler:

```assembly
.org 0x0000 ; RAM

keyup:
	.byte 0
keydown:
	.byte 0
keyleft:
	.byte 0
keyright:
	.byte 0
keya:
	.byte 0
keyb:
	.byte 0

.org 0x8000 ; ROM

	sie
start:
	ld a,[keyup]
	outa
	jmp [start]

irq:
	cie ;stack overflow possible otherwise
	mvia
	sub a,1
	jmpz [key_up]
	mvia
	sub a,2
	jmpz [key_left]
	mvia
	sub a,4
	jmpz [key_right]
	mvia 
	sub a,8
	jmpz [key_b]
	mvia
	sub a,16
	jmpz [key_a]
	mvia
	sub a,32
	jmpz [key_down]
	sie
	reti
key_down:
	ld a,[keydown]
	add a,1
	st a,[keydown]
	sie
	reti
key_up:
	ld a,[keyup]
	add a,1
	st a,[keyup]
	sie
	reti
key_right:
	ld a,[keyright]
	add a,1
	st a,[keyright]
	sie
	reti
key_left:
	ld a,[keyleft]
	add a,1
	st a,[keyleft]
	sie
	reti
key_a:
	ld a,[keya]
	add a,1
	st a,[keya]
	sie
	reti
key_b:
	ld a,[keyb]
	add a,1
	st a,[keyb]
	sie
	reti

.org 0xfffe ; IRQ
   .2byte irq
```

8 bit signed division in 142 cycles:

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
