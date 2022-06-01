8 bit registers: a,b,c,d,aoh,aol ; write only : o

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
rshc reg_a			; ror

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
