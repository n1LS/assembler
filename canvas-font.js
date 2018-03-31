const font8x8 = [
    // bold font
    /* 0x00 */ 0x00, 0x00, 0x7c, 0x44, 0x00, 0x66, 0x66, 0x00, 
    /* 0x01 */ 0xaa, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 
    /* 0x02 */ 0x00, 0x02, 0x02, 0x02, 0x02, 0x44, 0x38, 0x00, 
    /* 0x03 */ 0x00, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x00, 
    /* 0x04 */ 0x00, 0x04, 0x1e, 0x14, 0xf0, 0x14, 0x1e, 0x04, 
    /* 0x05 */ 0x00, 0x00, 0x10, 0x10, 0x7c, 0x10, 0x10, 0x00, 
    /* 0x06 */ 0x00, 0x00, 0x00, 0x00, 0x7c, 0x00, 0x00, 0x00, 
    /* 0x07 */ 0x00, 0x04, 0x7e, 0x04, 0x70, 0x50, 0x70, 0x00, 
    /* 0x08 */ 0x00, 0x04, 0x7e, 0x04, 0x50, 0x20, 0x50, 0x00, 
    /* 0x09 */ 0x00, 0x00, 0x7e, 0x00, 0x00, 0x7e, 0x00, 0x00, 
    /* 0x0a */ 0x70, 0x04, 0x7e, 0x04, 0x50, 0x20, 0x50, 0x00, 
    /* 0x0b */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x0c */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x0d */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x0e */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x0f */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x10 */ 0x00, 0x00, 0x00, 0x60, 0x90, 0x95, 0x92, 0x65, 
    /* 0x11 */ 0x3e, 0x41, 0x5d, 0x55, 0x5d, 0x2a, 0x49, 0x7f, 
    /* 0x12 */ 0x00, 0xff, 0x00, 0x00, 0x10, 0x38, 0x7c, 0x00, 
    /* 0x13 */ 0x00, 0x00, 0x7c, 0x38, 0x10, 0x00, 0x00, 0xaa, 
    /* 0x14 */ 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x15 */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xaa, 
    /* 0x16 */ 0x00, 0x00, 0x05, 0x15, 0x35, 0x15, 0x02, 0x00, 
    /* 0x17 */ 0x00, 0x00, 0x40, 0x44, 0x46, 0x44, 0x70, 0x00, 
    /* 0x18 */ 0x00, 0x08, 0x00, 0x08, 0x00, 0x08, 0x00, 0x08, 
    /* 0x19 */ 0x00, 0x00, 0x00, 0x08, 0x1c, 0x3e, 0x00, 0x00, 
    /* 0x1a */ 0x00, 0x00, 0x00, 0x3e, 0x1c, 0x08, 0x00, 0x00, 
    /* 0x1b */ 0x00, 0x00, 0x04, 0x0c, 0x1c, 0x0c, 0x04, 0x00, 
    /* 0x1c */ 0x00, 0x00, 0x10, 0x18, 0x1c, 0x18, 0x10, 0x00, 
    /* 0x1d */ 0x00, 0x00, 0x12, 0x26, 0x4e, 0x26, 0x12, 0x00, 
    /* 0x1e */ 0x00, 0x00, 0x48, 0x64, 0x72, 0x64, 0x48, 0x00, 
    /* 0x1f */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x54, 
    /* 0x20 */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x21 */ 0x00, 0x0c, 0x0c, 0x0c, 0x0c, 0x0c, 0x00, 0x0c, 
    /* 0x22 */ 0x00, 0x36, 0x36, 0x24, 0x00, 0x00, 0x00, 0x00, 
    /* 0x23 */ 0x04, 0x06, 0x2c, 0x74, 0x26, 0x2c, 0x74, 0x20, 
    /* 0x24 */ 0x00, 0x08, 0x3e, 0x68, 0x3e, 0x0b, 0x7e, 0x08, 
    /* 0x25 */ 0x00, 0x43, 0xa6, 0x4c, 0x18, 0x32, 0x65, 0xc2, 
    /* 0x26 */ 0x00, 0x3c, 0x66, 0x66, 0x3c, 0x6c, 0x66, 0x3b, 
    /* 0x27 */ 0x00, 0x18, 0x18, 0x10, 0x00, 0x00, 0x00, 0x00, 
    /* 0x28 */ 0x00, 0x03, 0x06, 0x0c, 0x0c, 0x0c, 0x06, 0x03, 
    /* 0x29 */ 0x00, 0x60, 0x30, 0x18, 0x18, 0x18, 0x30, 0x60, 
    /* 0x2a */ 0x00, 0x00, 0x0c, 0x2d, 0x1e, 0x2d, 0x0c, 0x00, 
    /* 0x2b */ 0x00, 0x00, 0x0c, 0x0c, 0x3f, 0x0c, 0x0c, 0x00, 
    /* 0x2c */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x10, 
    /* 0x2d */ 0x00, 0x00, 0x00, 0x00, 0x3f, 0x00, 0x00, 0x00, 
    /* 0x2e */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x60, 0x60, 
    /* 0x2f */ 0x00, 0x01, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 
    /* 0x30 */ 0x00, 0x1e, 0x33, 0x63, 0x6b, 0x6b, 0x63, 0x3e, 
    /* 0x31 */ 0x00, 0x0c, 0x1c, 0x0c, 0x0c, 0x0c, 0x0c, 0x1e, 
    /* 0x32 */ 0x00, 0x3e, 0x63, 0x03, 0x3e, 0x60, 0x60, 0x7f, 
    /* 0x33 */ 0x00, 0x3e, 0x63, 0x03, 0x1e, 0x03, 0x63, 0x3e, 
    /* 0x34 */ 0x00, 0x66, 0x66, 0x66, 0x7e, 0x06, 0x06, 0x06, 
    /* 0x35 */ 0x00, 0x7f, 0x60, 0x7e, 0x03, 0x03, 0x63, 0x3e, 
    /* 0x36 */ 0x00, 0x1e, 0x30, 0x60, 0x7e, 0x63, 0x63, 0x3e, 
    /* 0x37 */ 0x00, 0x7f, 0x03, 0x03, 0x06, 0x0c, 0x0c, 0x0c, 
    /* 0x38 */ 0x00, 0x3e, 0x63, 0x63, 0x3e, 0x63, 0x63, 0x3e, 
    /* 0x39 */ 0x00, 0x3e, 0x63, 0x63, 0x3f, 0x03, 0x03, 0x3e, 
    /* 0x3a */ 0x00, 0x00, 0x30, 0x30, 0x00, 0x30, 0x30, 0x00, 
    /* 0x3b */ 0x00, 0x00, 0x30, 0x30, 0x00, 0x30, 0x30, 0x10, 
    /* 0x3c */ 0x00, 0x06, 0x0c, 0x18, 0x30, 0x18, 0x0c, 0x06, 
    /* 0x3d */ 0x00, 0x00, 0x00, 0x7f, 0x00, 0x7f, 0x00, 0x00, 
    /* 0x3e */ 0x00, 0x30, 0x18, 0x0c, 0x06, 0x0c, 0x18, 0x30, 
    /* 0x3f */ 0x00, 0x3e, 0x41, 0x01, 0x06, 0x08, 0x00, 0x08, 
    /* 0x40 */ 0x00, 0x1c, 0x22, 0x49, 0x54, 0x4b, 0x22, 0x1c, 
    /* 0x41 */ 0x00, 0x1e, 0x33, 0x63, 0x63, 0x7f, 0x63, 0x63, 
    /* 0x42 */ 0x00, 0x3e, 0x63, 0x63, 0x7e, 0x63, 0x63, 0x7e, 
    /* 0x43 */ 0x00, 0x1e, 0x33, 0x60, 0x60, 0x60, 0x63, 0x3e, 
    /* 0x44 */ 0x00, 0x3c, 0x66, 0x63, 0x63, 0x63, 0x63, 0x7e, 
    /* 0x45 */ 0x00, 0x3e, 0x60, 0x60, 0x7c, 0x60, 0x60, 0x7f, 
    /* 0x46 */ 0x00, 0x3f, 0x60, 0x60, 0x7c, 0x60, 0x60, 0x60, 
    /* 0x47 */ 0x00, 0x1e, 0x33, 0x60, 0x67, 0x63, 0x63, 0x3f, 
    /* 0x48 */ 0x00, 0x23, 0x63, 0x63, 0x7f, 0x63, 0x63, 0x63, 
    /* 0x49 */ 0x00, 0x3f, 0x0c, 0x0c, 0x0c, 0x0c, 0x0c, 0x3f, 
    /* 0x4a */ 0x00, 0x03, 0x03, 0x03, 0x03, 0x03, 0x66, 0x3c, 
    /* 0x4b */ 0x00, 0x63, 0x63, 0x66, 0x7c, 0x66, 0x63, 0x63, 
    /* 0x4c */ 0x00, 0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x7f, 
    /* 0x4d */ 0x00, 0x63, 0x77, 0x7f, 0x6b, 0x63, 0x63, 0x63, 
    /* 0x4e */ 0x00, 0x63, 0x73, 0x7b, 0x6f, 0x67, 0x63, 0x63, 
    /* 0x4f */ 0x00, 0x1e, 0x33, 0x63, 0x63, 0x63, 0x63, 0x3e, 
    /* 0x50 */ 0x00, 0x3e, 0x63, 0x63, 0x63, 0x7e, 0x60, 0x60, 
    /* 0x51 */ 0x00, 0x1e, 0x33, 0x63, 0x63, 0x6d, 0x66, 0x3b, 
    /* 0x52 */ 0x00, 0x7e, 0x63, 0x63, 0x7e, 0x63, 0x63, 0x63, 
    /* 0x53 */ 0x00, 0x1f, 0x30, 0x30, 0x1e, 0x03, 0x03, 0x7e, 
    /* 0x54 */ 0x00, 0x3f, 0x0c, 0x0c, 0x0c, 0x0c, 0x0c, 0x0c, 
    /* 0x55 */ 0x00, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0x1e, 
    /* 0x56 */ 0x00, 0x63, 0x63, 0x63, 0x63, 0x63, 0x36, 0x1c, 
    /* 0x57 */ 0x00, 0x63, 0x63, 0x63, 0x6b, 0x7f, 0x77, 0x22, 
    /* 0x58 */ 0x00, 0x63, 0x63, 0x36, 0x1c, 0x36, 0x63, 0x63, 
    /* 0x59 */ 0x00, 0x63, 0x63, 0x63, 0x3f, 0x03, 0x63, 0x3e, 
    /* 0x5a */ 0x00, 0x7e, 0x06, 0x0c, 0x18, 0x30, 0x60, 0x7f, 
    /* 0x5b */ 0x00, 0x0f, 0x0c, 0x0c, 0x0c, 0x0c, 0x0c, 0x0f, 
    /* 0x5c */ 0x00, 0x40, 0x60, 0x30, 0x18, 0x0c, 0x06, 0x03, 
    /* 0x5d */ 0x00, 0x78, 0x18, 0x18, 0x18, 0x18, 0x18, 0x78, 
    /* 0x5e */ 0x00, 0x0c, 0x1e, 0x33, 0x00, 0x00, 0x00, 0x00, 
    /* 0x5f */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7f, 
    /* 0x60 */ 0x00, 0x60, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x61 */ 0x00, 0x00, 0x00, 0x1e, 0x03, 0x3f, 0x63, 0x3f, 
    /* 0x62 */ 0x00, 0x60, 0x60, 0x7c, 0x66, 0x63, 0x63, 0x7e, 
    /* 0x63 */ 0x00, 0x00, 0x00, 0x1e, 0x30, 0x60, 0x60, 0x3f, 
    /* 0x64 */ 0x00, 0x03, 0x03, 0x1f, 0x33, 0x63, 0x63, 0x3e, 
    /* 0x65 */ 0x00, 0x00, 0x00, 0x3e, 0x63, 0x7f, 0x60, 0x3e, 
    /* 0x66 */ 0x00, 0x3e, 0x63, 0x60, 0x60, 0x60, 0x78, 0x60, 
    /* 0x67 */ 0x00, 0x00, 0x00, 0x3f, 0x63, 0x3f, 0x03, 0x3e, 
    /* 0x68 */ 0x00, 0x60, 0x60, 0x7c, 0x66, 0x63, 0x63, 0x63, 
    /* 0x69 */ 0x00, 0x18, 0x00, 0x38, 0x18, 0x18, 0x18, 0x7e, 
    /* 0x6a */ 0x00, 0x03, 0x00, 0x03, 0x03, 0x03, 0x66, 0x3c, 
    /* 0x6b */ 0x00, 0x60, 0x60, 0x63, 0x66, 0x7c, 0x66, 0x63, 
    /* 0x6c */ 0x00, 0x60, 0x60, 0x60, 0x60, 0x60, 0x63, 0x3e, 
    /* 0x6d */ 0x00, 0x00, 0x00, 0x16, 0x3f, 0x6b, 0x63, 0x63, 
    /* 0x6e */ 0x00, 0x00, 0x00, 0x7c, 0x66, 0x63, 0x63, 0x63, 
    /* 0x6f */ 0x00, 0x00, 0x00, 0x1e, 0x33, 0x63, 0x63, 0x3e, 
    /* 0x70 */ 0x00, 0x00, 0x00, 0x7e, 0x63, 0x63, 0x7e, 0x60, 
    /* 0x71 */ 0x00, 0x00, 0x00, 0x1f, 0x33, 0x63, 0x3f, 0x03, 
    /* 0x72 */ 0x00, 0x00, 0x00, 0x1e, 0x33, 0x60, 0x60, 0x60, 
    /* 0x73 */ 0x00, 0x00, 0x00, 0x3e, 0x60, 0x3e, 0x03, 0x7e, 
    /* 0x74 */ 0x00, 0x60, 0x60, 0x78, 0x60, 0x60, 0x63, 0x3e, 
    /* 0x75 */ 0x00, 0x00, 0x00, 0x63, 0x63, 0x63, 0x33, 0x1e, 
    /* 0x76 */ 0x00, 0x00, 0x00, 0x63, 0x63, 0x36, 0x1c, 0x08, 
    /* 0x77 */ 0x00, 0x00, 0x00, 0x63, 0x63, 0x6b, 0x7f, 0x36, 
    /* 0x78 */ 0x00, 0x00, 0x00, 0x63, 0x36, 0x1c, 0x36, 0x63, 
    /* 0x79 */ 0x00, 0x00, 0x00, 0x63, 0x63, 0x3f, 0x03, 0x3e, 
    /* 0x7a */ 0x00, 0x00, 0x00, 0x7f, 0x03, 0x3e, 0x60, 0x7f, 
    /* 0x7b */ 0x00, 0x03, 0x04, 0x04, 0x08, 0x04, 0x04, 0x03, 
    /* 0x7c */ 0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 
    /* 0x7d */ 0x00, 0x60, 0x10, 0x10, 0x08, 0x10, 0x10, 0x60, 
    /* 0x7e */ 0x00, 0x00, 0x00, 0x06, 0x49, 0x30, 0x00, 0x00, 
    /* 0x7f */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    // regular font
    /* 0x80 */ 0x00, 0x1f, 0x20, 0x40, 0x47, 0x48, 0x48, 0x48, 
    /* 0x81 */ 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 
    /* 0x82 */ 0x00, 0xf8, 0x04, 0x02, 0xe2, 0x12, 0x12, 0x12, 
    /* 0x83 */ 0x48, 0x48, 0x48, 0x47, 0x40, 0x20, 0x1f, 0x00, 
    /* 0x84 */ 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 
    /* 0x85 */ 0x12, 0x12, 0x12, 0xe2, 0x02, 0x04, 0xf8, 0x00, 
    /* 0x86 */ 0x48, 0x48, 0x48, 0x48, 0x48, 0x48, 0x48, 0x48, 
    /* 0x87 */ 0x12, 0x12, 0x12, 0x12, 0x12, 0x12, 0x12, 0x12, 
    /* 0x88 */ 0x00, 0x18, 0x24, 0x24, 0x66, 0x7e, 0xe7, 0xff, 
    /* 0x89 */ 0x00, 0x00, 0x18, 0x24, 0x42, 0xe7, 0x24, 0x3c, 
    /* 0x8a */ 0x00, 0x0f, 0x10, 0x22, 0x41, 0x22, 0x10, 0x0f, 
    /* 0x8b */ 0x00, 0xe0, 0x20, 0xa0, 0x20, 0xa0, 0x20, 0xe0, 
    /* 0x8c */ 0x00, 0x3c, 0x66, 0xff, 0xc7, 0xe7, 0x66, 0x3c, 
    /* 0x8d */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x8e */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 
    /* 0x8f */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 
    /* 0x90 */ 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 
    /* 0x91 */ 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 
    /* 0x92 */ 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 
    /* 0x93 */ 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
    /* 0x94 */ 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
    /* 0x95 */ 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
    /* 0x96 */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x97 */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x98 */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x99 */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x9a */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x9b */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x9c */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x9d */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x9e */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0x9f */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0xa0 */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0xa1 */ 0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x08, 
    /* 0xa2 */ 0x00, 0x14, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0xa3 */ 0x04, 0x06, 0x2c, 0x74, 0x26, 0x2c, 0x74, 0x20, 
    /* 0xa4 */ 0x00, 0x08, 0x3e, 0x48, 0x3e, 0x09, 0x7e, 0x08, 
    /* 0xa5 */ 0x00, 0x21, 0x52, 0x24, 0x08, 0x12, 0x25, 0x42, 
    /* 0xa6 */ 0x00, 0x3c, 0x42, 0x42, 0x3c, 0x44, 0x42, 0x39, 
    /* 0xa7 */ 0x00, 0x08, 0x08, 0x08, 0x00, 0x00, 0x00, 0x00, 
    /* 0xa8 */ 0x00, 0x01, 0x02, 0x04, 0x04, 0x04, 0x02, 0x01, 
    /* 0xa9 */ 0x00, 0x40, 0x20, 0x10, 0x10, 0x10, 0x20, 0x40, 
    /* 0xaa */ 0x00, 0x00, 0x08, 0x2a, 0x1c, 0x2a, 0x08, 0x00, 
    /* 0xab */ 0x00, 0x00, 0x08, 0x08, 0x3e, 0x08, 0x08, 0x00, 
    /* 0xac */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x10, 
    /* 0xad */ 0x00, 0x00, 0x00, 0x00, 0x3e, 0x00, 0x00, 0x00, 
    /* 0xae */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x60, 0x60, 
    /* 0xaf */ 0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 
    /* 0xb0 */ 0x00, 0x1e, 0x21, 0x49, 0x49, 0x49, 0x41, 0x3e, 
    /* 0xb1 */ 0x00, 0x04, 0x0c, 0x14, 0x04, 0x04, 0x04, 0x1f, 
    /* 0xb2 */ 0x00, 0x3e, 0x41, 0x01, 0x3e, 0x40, 0x40, 0x7f, 
    /* 0xb3 */ 0x00, 0x3e, 0x41, 0x01, 0x1e, 0x01, 0x41, 0x3e, 
    /* 0xb4 */ 0x00, 0x42, 0x42, 0x42, 0x7e, 0x02, 0x02, 0x02, 
    /* 0xb5 */ 0x00, 0x7f, 0x40, 0x7e, 0x01, 0x01, 0x41, 0x3e, 
    /* 0xb6 */ 0x00, 0x1e, 0x20, 0x40, 0x7e, 0x41, 0x41, 0x3e, 
    /* 0xb7 */ 0x00, 0x7f, 0x01, 0x01, 0x02, 0x04, 0x04, 0x04, 
    /* 0xb8 */ 0x00, 0x3e, 0x41, 0x41, 0x3e, 0x41, 0x41, 0x3e, 
    /* 0xb9 */ 0x00, 0x3e, 0x41, 0x41, 0x3f, 0x01, 0x01, 0x3e, 
    /* 0xba */ 0x00, 0x00, 0x30, 0x30, 0x00, 0x30, 0x30, 0x00, 
    /* 0xbb */ 0x00, 0x00, 0x30, 0x30, 0x00, 0x30, 0x30, 0x10, 
    /* 0xbc */ 0x00, 0x04, 0x08, 0x10, 0x20, 0x10, 0x08, 0x04, 
    /* 0xbd */ 0x00, 0x00, 0x00, 0x7f, 0x00, 0x7f, 0x00, 0x00, 
    /* 0xbe */ 0x00, 0x20, 0x10, 0x08, 0x04, 0x08, 0x10, 0x20, 
    /* 0xbf */ 0x00, 0x3e, 0x41, 0x01, 0x06, 0x08, 0x00, 0x08, 
    /* 0xc0 */ 0x00, 0x1c, 0x22, 0x49, 0x54, 0x4b, 0x22, 0x1c, 
    /* 0xc1 */ 0x00, 0x1e, 0x21, 0x41, 0x7f, 0x41, 0x41, 0x41, 
    /* 0xc2 */ 0x00, 0x3e, 0x41, 0x41, 0x7e, 0x41, 0x41, 0x7e, 
    /* 0xc3 */ 0x00, 0x1f, 0x20, 0x40, 0x40, 0x40, 0x40, 0x3f, 
    /* 0xc4 */ 0x00, 0x3c, 0x42, 0x41, 0x41, 0x41, 0x41, 0x7e, 
    /* 0xc5 */ 0x00, 0x3f, 0x40, 0x40, 0x7c, 0x40, 0x40, 0x7f, 
    /* 0xc6 */ 0x00, 0x3f, 0x40, 0x40, 0x78, 0x40, 0x40, 0x40, 
    /* 0xc7 */ 0x00, 0x1e, 0x21, 0x40, 0x47, 0x41, 0x41, 0x3e, 
    /* 0xc8 */ 0x00, 0x41, 0x41, 0x41, 0x7f, 0x41, 0x41, 0x41, 
    /* 0xc9 */ 0x00, 0x7c, 0x10, 0x10, 0x10, 0x10, 0x10, 0x7c, 
    /* 0xca */ 0x00, 0x3f, 0x01, 0x01, 0x01, 0x01, 0x42, 0x3c, 
    /* 0xcb */ 0x00, 0x41, 0x41, 0x42, 0x7c, 0x42, 0x41, 0x41, 
    /* 0xcc */ 0x00, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x7f, 
    /* 0xcd */ 0x00, 0x41, 0x63, 0x55, 0x49, 0x41, 0x41, 0x41, 
    /* 0xce */ 0x00, 0x41, 0x61, 0x51, 0x49, 0x45, 0x43, 0x41, 
    /* 0xcf */ 0x00, 0x1e, 0x21, 0x41, 0x41, 0x41, 0x41, 0x3e, 
    /* 0xd0 */ 0x00, 0x3e, 0x41, 0x41, 0x41, 0x7e, 0x40, 0x40, 
    /* 0xd1 */ 0x00, 0x1e, 0x21, 0x41, 0x41, 0x45, 0x42, 0x3d, 
    /* 0xd2 */ 0x00, 0x7e, 0x41, 0x41, 0x7e, 0x41, 0x41, 0x41, 
    /* 0xd3 */ 0x00, 0x1e, 0x20, 0x20, 0x1e, 0x01, 0x01, 0x7e, 
    /* 0xd4 */ 0x00, 0x7f, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 
    /* 0xd5 */ 0x00, 0x41, 0x41, 0x41, 0x41, 0x41, 0x21, 0x1e, 
    /* 0xd6 */ 0x00, 0x41, 0x41, 0x41, 0x41, 0x22, 0x14, 0x08, 
    /* 0xd7 */ 0x00, 0x41, 0x41, 0x41, 0x49, 0x55, 0x63, 0x41, 
    /* 0xd8 */ 0x00, 0x41, 0x41, 0x22, 0x1c, 0x22, 0x41, 0x41, 
    /* 0xd9 */ 0x00, 0x41, 0x22, 0x14, 0x08, 0x08, 0x08, 0x08, 
    /* 0xda */ 0x00, 0x7f, 0x02, 0x04, 0x08, 0x10, 0x20, 0x7f, 
    /* 0xdb */ 0x00, 0x07, 0x04, 0x04, 0x04, 0x04, 0x04, 0x07, 
    /* 0xdc */ 0x00, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01, 
    /* 0xdd */ 0x00, 0x70, 0x10, 0x10, 0x10, 0x10, 0x10, 0x70, 
    /* 0xde */ 0x00, 0x08, 0x14, 0x22, 0x00, 0x00, 0x00, 0x00, 
    /* 0xdf */ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7f, 
    /* 0xe0 */ 0x00, 0x40, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 
    /* 0xe1 */ 0x00, 0x00, 0x00, 0x1e, 0x01, 0x3f, 0x41, 0x3f, 
    /* 0xe2 */ 0x00, 0x40, 0x40, 0x7c, 0x42, 0x41, 0x41, 0x7e, 
    /* 0xe3 */ 0x00, 0x00, 0x00, 0x1e, 0x20, 0x40, 0x40, 0x3f, 
    /* 0xe4 */ 0x00, 0x01, 0x01, 0x3f, 0x41, 0x41, 0x41, 0x3e, 
    /* 0xe5 */ 0x00, 0x00, 0x00, 0x3e, 0x41, 0x7f, 0x40, 0x3e, 
    /* 0xe6 */ 0x00, 0x3c, 0x42, 0x40, 0x40, 0x40, 0x70, 0x40, 
    /* 0xe7 */ 0x00, 0x00, 0x00, 0x3f, 0x41, 0x3f, 0x01, 0x3e, 
    /* 0xe8 */ 0x00, 0x40, 0x40, 0x7c, 0x42, 0x41, 0x41, 0x41, 
    /* 0xe9 */ 0x00, 0x08, 0x00, 0x38, 0x08, 0x08, 0x08, 0x7f, 
    /* 0xea */ 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x42, 0x3c, 
    /* 0xeb */ 0x00, 0x40, 0x40, 0x41, 0x42, 0x7c, 0x42, 0x41, 
    /* 0xec */ 0x00, 0x40, 0x40, 0x40, 0x40, 0x40, 0x41, 0x3e, 
    /* 0xed */ 0x00, 0x00, 0x00, 0x16, 0x29, 0x49, 0x41, 0x41, 
    /* 0xee */ 0x00, 0x00, 0x00, 0x7c, 0x42, 0x41, 0x41, 0x41, 
    /* 0xef */ 0x00, 0x00, 0x00, 0x1e, 0x21, 0x41, 0x41, 0x3e, 
    /* 0xf0 */ 0x00, 0x00, 0x00, 0x7e, 0x41, 0x41, 0x7e, 0x40, 
    /* 0xf1 */ 0x00, 0x00, 0x00, 0x1f, 0x21, 0x41, 0x3f, 0x01, 
    /* 0xf2 */ 0x00, 0x00, 0x00, 0x1e, 0x21, 0x40, 0x40, 0x40, 
    /* 0xf3 */ 0x00, 0x00, 0x00, 0x3e, 0x40, 0x3e, 0x01, 0x7e, 
    /* 0xf4 */ 0x00, 0x40, 0x40, 0x70, 0x40, 0x40, 0x41, 0x3e, 
    /* 0xf5 */ 0x00, 0x00, 0x00, 0x41, 0x41, 0x41, 0x21, 0x1e, 
    /* 0xf6 */ 0x00, 0x00, 0x00, 0x41, 0x41, 0x22, 0x14, 0x08, 
    /* 0xf7 */ 0x00, 0x00, 0x00, 0x41, 0x41, 0x49, 0x55, 0x22, 
    /* 0xf8 */ 0x00, 0x00, 0x00, 0x41, 0x22, 0x1c, 0x22, 0x41, 
    /* 0xf9 */ 0x00, 0x00, 0x00, 0x41, 0x41, 0x3f, 0x01, 0x3e, 
    /* 0xfa */ 0x00, 0x00, 0x00, 0x7f, 0x02, 0x0c, 0x10, 0x7f, 
    /* 0xfb */ 0x00, 0x08, 0x08, 0x3e, 0x1c, 0x49, 0x63, 0x7f, 
    /* 0xfc */ 0x00, 0x08, 0x1c, 0x3e, 0x08, 0x6b, 0x63, 0x7f, 
    /* 0xfd */ 0x00, 0x00, 0x00, 0x0e, 0x08, 0x0e, 0x02, 0x0e, 
    /* 0xfe */ 0x00, 0x20, 0x24, 0x26, 0x1f, 0x06, 0x04, 0x00, 
    /* 0xff */ 0x00, 0x00, 0x36, 0x7f, 0x7f, 0x3e, 0x1c, 0x08,
]
 1
var row_height = 8

function draw_char(ctx, x, y, char, offset) {
    var num = 0

    for (var dy = 0; dy < 8; dy++) {
        val = font8x8[offset + char * 8 + dy]
        const ddy = y + dy

        for (var dx = 0; dx < 9; dx++) {
            if (val & 0x80) {
                num++
            }
            else {
                if (num > 0) {
                    const ddx = x + dx - num
                    ctx.fillRect(ddx, ddy, num, 1)
                    num = 0;
                }
            }

            val <<= 1
        }
    }
}

function draw_symbol(ctx, x, y, symbol) {
    draw_char(ctx, x, y, symbol, 0x00)
}

function draw_text(ctx, x, y, text, color) {
    
    ctx.fillStyle = color;

    for (var n = 0; n < text.length; n++) {
        draw_char(ctx, x + n * 8, y, text.charCodeAt(n), 0x00)
    }
}
