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

```
