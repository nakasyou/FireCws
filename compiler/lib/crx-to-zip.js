/// <reference types="./crx-to-zip.d.ts" />

// Mit License
/*!
 * https://github.com/peerigon/unzip-crx/blob/da7c616820e582b6d214e1c6ce6129940882a288/LICENSE
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 Peerigon
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * @license MIT
 * https://github.com/peerigon/unzip-crx/blob/da7c616820e582b6d214e1c6ce6129940882a288/src/index.js
 */
function crxToZip(buf) {
  function calcLength(a, b, c, d) {
      let length = 0;

      length += a << 0;
      length += b << 8;
      length += c << 16;
      length += d << 24 >>> 0;
      return length;
  }

  // 50 4b 03 04
  // This is actually a zip file
  if (buf[0] === 80 && buf[1] === 75 && buf[2] === 3 && buf[3] === 4) {
      return buf;
  }

  // 43 72 32 34 (Cr24)
  if (buf[0] !== 67 || buf[1] !== 114 || buf[2] !== 50 || buf[3] !== 52) {
      throw new Error("Invalid header: Does not start with Cr24");
  }

  // 02 00 00 00
  // or
  // 03 00 00 00
  const isV3 = buf[4] === 3;
  const isV2 = buf[4] === 2;

  if ((!isV2 && !isV3) || buf[5] || buf[6] || buf[7]) {
      throw new Error("Unexpected crx format version number.");
  }

  if (isV2) {
      const publicKeyLength = calcLength(buf[8], buf[9], buf[10], buf[11]);
      const signatureLength = calcLength(buf[12], buf[13], buf[14], buf[15]);

      // 16 = Magic number (4), CRX format version (4), lengths (2x4)
      const zipStartOffset = 16 + publicKeyLength + signatureLength;

      return buf.slice(zipStartOffset, buf.length);
  }
  // v3 format has header size and then header
  const headerSize = calcLength(buf[8], buf[9], buf[10], buf[11]);
  const zipStartOffset = 12 + headerSize;

  return buf.slice(zipStartOffset, buf.length);
}

export default crxToZip
