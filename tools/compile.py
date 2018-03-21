#!/usr/local/bin/python3

'''`````````````````````````````````````````````````````````````````````````````

(\_(\
( -.-)     Stoopit simple js preprocessor.
c_(")(")

`````````````````````````````````````````````````````````````````````````````'''

import sys

if len(sys.argv) < 2:
    print("I need a filename passed as param #1.")
    exit(1)

filename = sys.argv[1]
f = open(filename, "r")
lines = f.read().split("\n")
f.close()

l = 0

print("* Parsing " + filename)

while l < len(lines):
    line = lines[l]
    
    if line.startswith("//:@import "):
        del lines[l]
        
        print("* importing " + line[11:])
        i = open(line[11:], "r").read().split("\n")
        
        lines = lines[:l] + i + lines[l:]
    else:
        l += 1

print()

f = open("out.js", "w")
f.write("\n".join(lines))
f.close()