;name Vampire 1

const EQU 2365

loc   MOV ptr, ptr     ; throw JMP pointer to core
      ADD #const, ptr  ; update pointer
      SUB #const, loc  ; update location
      JMP loc          ; loop back

ptr   JMP @0, trap     ; the pointer weapon

trap  SPL 1, -100      ; this is where the pointer points to
      MOV bomb, <-1    ; core-clear
      JMP trap
bomb  DAT #0 #0