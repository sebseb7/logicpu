registers: a,b,c,d
memory: 0-7fff (ram) ; 8000-ffff (rom)

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

call mem
ret

nop
hlt

outa            ; reg a -> debug display
cie             ; clear interupt enable
sie             ; set interrupt enable
reti            ; return from interrupt (address of interrupt handler need to be placed at 0xfffe)

```
