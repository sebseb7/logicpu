8 bit gp registers: a,b,c,d
16 bit registers:
- address-offset: ao
virtual registers:
- fpo = framepointer - ao (framepointer = stackpointer as of function entry)
- ar = 0x0 + ao

memory: 0-7fff (ram) ; 8000-ffff (rom)

big endian

```assembly
ld reg_a,reg_b|fpo|ar|[[offset]]|[mem]|value       ;reg_a = reg_b|mem|value (2 cycles; 4 cycles if op2 == mem) 
st reg,fpo|ar|[[offset]]|[mem]                     ;reg->mem (4 cycles)
ld reg16,reg,reg
st reg16,reg,reg

add reg_a,reg_b|[mem]|value      ;reg_a = reg_a+reg_b|mem|value (3 cycles; 5 cycles if op2 == mem)
addc reg_a,reg_b|[mem]|value     ;add + carry (3 cycles; 5 cycles if op2 == mem)
sub reg_a,reg_b|[mem]|value      ;reg_a = reg_a-reg_b|mem|value (3 cycles; 5 cycles if op2 == mem)
subc reg_a,reg_b|[mem]|value     ;sub + carry (3 cycles; 5 cycles if op2 == mem)
nand reg_a,reg_b|[mem]|value     ;sub + carry (3 cycles; 5 cycles if op2 == mem)
rsh reg

jmp [mem]          ;(4 cylces)
jmpz [mem]         ;zero (4 cycles)
jmpc [mem]         ;carry (4 cycles)

push reg           ;(2 cylces)
pop ?reg          ;(2 cycles + 1 cycle when register parameter presend)

call [mem]         ;(6 cycles)
ret              ;(5 cycles)

nop              ;(1 cycle)
hlt              ;(2 cycles)  

outa             ; reg a -> debug display (2 cycles)
cie              ; clear interupt enable (2 cycles)
sie              ; set interrupt enable (2 cycles)
reti             ; return from interrupt (place interrupt handler address at 0xfffe-0xffff, big endian; all registers saved/restored via stack; 11 cycles, entering interrupt: 15 cycles)
mvia             ; inputs from interrupt -> register a (2 cycles)

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
