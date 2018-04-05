#!/usr/local/bin/python3

'''`````````````````````````````````````````````````````````````````````````````

(\_(\
( -.-)     Generate listing for warriors
c_(")(")

`````````````````````````````````````````````````````````````````````````````'''

from os import listdir
from os.path import isfile, join

path = 'warriors'
files = [f for f in listdir(path) if isfile(join(path, f)) and f != 'listing.txt']

f = open('warriors/listing.txt', 'w')
f.write('\n'.join(files))
f.close()