registers: a,b,c,d

memory: 0-7fff (ram) ; 8000-ffff (rom)

big endian

```assembly
ld reg,mem      ;mem->reg
ldi reg,val     ;val->reg
st reg,mem      ;reg->mem

add reg_a,reg_b ;reg_a = reg_a+reg_b
sub reg_a,reg_b ;reg_a = reg_a-reg_b
subi reg,value  ;reg=reg-value
addi reg,value  ;reg=reg+value

mv reg_a,reg_b  ;reg_a->reg_b (mv a,a == nop)
jmp mem
jmpz mem

push reg
pop reg

call mem
ret

nop
hlt

outa            ; reg a -> debug display
cie             ; clear interupt enable
sie             ; set interrupt enable
reti            ; return from interrupt (place interrupt handler address at 0xfffe-0xffff, big endian)
mvia            ; inputs from interrupt -> register a

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

start:
	ld a,keyup
	outa a
	jmp start

irq:
	cie
	mvia
	subi a,1
	jmpz key_up
	mvia
	subi a,2
	jmpz key_left
	mvia
	subi a,4
	jmpz key_right
	mvia 
	subi a,8
	jmpz key_b
	mvia
	subi a,16
	jmpz key_a
	mvia
	subi a,32
	jmpz key_down
	sie
	reti
key_down:
	ld a,keydown
	addi a,1
	st a,keydown
	sie
	reti
key_up:
	ld a,keyup
	addi a,1
	st a,keyup
	sie
	reti
key_right:
	ld a,keyright
	addi a,1
	st a,keyright
	sie
	reti
key_left:
	ld a,keyleft
	addi a,1
	st a,keyleft
	sie
	reti
key_a:
	ld a,keya
	addi a,1
	st a,keya
	sie
	reti
key_b:
	ld a,keyb
	addi a,1
	st a,keyb
	sie
	reti

.org 0xfffe ; IRQ
   .byte irq
```
