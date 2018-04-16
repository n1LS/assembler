#!/usr/local/bin/python3

'''`````````````````````````````````````````````````````````````````````````````

(\_(\
( -.-)     Stoopit simple js preprocessor.
c_(")(")

`````````````````````````````````````````````````````````````````````````````'''

import sys
import os

if len(sys.argv) < 2:
    print("I need a filename passed as param #1.")
    exit(1)

filename = sys.argv[1]
f = open(filename, "r")
lines = f.read().split("\n")
f.close()

l = 0

print("Parsing " + filename + "\n")

key = "//@import "

while l < len(lines):
    line = lines[l]

    if line.startswith(key):
        del lines[l]

        print("+ importing " + line[len(key):])
        i = open(line[len(key):], "r").read().split("\n")

        lines = lines[:l] + i + lines[l:]
    else:
        l += 1

code = "\n".join(lines)

replacements = {
    "\"": "\\\"",
    "$":  "\$",
    "`":  "\`",
}

for key, value in replacements.items():
    code = code.replace(key, value)

print("\nRunning code:")

os.system("node -p \"" + code + "\"")