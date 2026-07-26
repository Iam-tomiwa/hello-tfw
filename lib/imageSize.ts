/**
 * Minimal intrinsic-size reader for the formats we serve from public/.
 * Enough to give next/image a real aspect ratio, without pulling in a
 * dependency just to read a few header bytes.
 */

export interface Size {
  width: number;
  height: number;
}

const FALLBACK: Size = { width: 1000, height: 1000 };

function png(buf: Buffer): Size | null {
  if (buf.length < 24 || buf.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function gif(buf: Buffer): Size | null {
  if (buf.length < 10 || buf.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

function jpeg(buf: Buffer): Size | null {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null;

  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    // SOF0-SOF15, excluding DHT (c4), JPG (c8) and DAC (cc)
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isStartOfFrame) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2); // skip this segment
  }
  return null;
}

function webp(buf: Buffer): Size | null {
  if (buf.length < 30 || buf.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;

  const chunk = buf.toString("ascii", 12, 16);

  if (chunk === "VP8X") {
    // 24-bit little-endian, stored as (dimension - 1)
    const w = buf.readUIntLE(24, 3) + 1;
    const h = buf.readUIntLE(27, 3) + 1;
    return { width: w, height: h };
  }

  if (chunk === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }

  if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return null;
}

/**
 * MP4 dimensions live in the `tkhd` box as 16.16 fixed-point. Boxes nest as
 * moov > trak > tkhd, so walk the tree rather than scanning blindly.
 */
function mp4(buf: Buffer): Size | null {
  if (buf.length < 16 || buf.toString("ascii", 4, 8) !== "ftyp") return null;

  const findBox = (start: number, end: number, type: string): number | null => {
    let i = start;
    while (i + 8 <= end) {
      const size = buf.readUInt32BE(i);
      if (size < 8) return null;
      if (buf.toString("ascii", i + 4, i + 8) === type) return i;
      i += size;
    }
    return null;
  };

  const moov = findBox(0, buf.length, "moov");
  if (moov === null) return null;
  const moovEnd = moov + buf.readUInt32BE(moov);

  const trak = findBox(moov + 8, moovEnd, "trak");
  if (trak === null) return null;
  const trakEnd = trak + buf.readUInt32BE(trak);

  const tkhd = findBox(trak + 8, trakEnd, "tkhd");
  if (tkhd === null) return null;

  const payload = tkhd + 8;
  const version = buf[payload];
  // width/height sit after the 36-byte display matrix
  const offset = payload + (version === 1 ? 88 : 76);
  if (offset + 8 > buf.length) return null;

  const width = buf.readUInt32BE(offset) >> 16;
  const height = buf.readUInt32BE(offset + 4) >> 16;
  return width && height ? { width, height } : null;
}

/** Reads intrinsic dimensions from a header buffer, falling back to a square. */
export function imageSize(buf: Buffer): Size {
  return png(buf) ?? gif(buf) ?? jpeg(buf) ?? webp(buf) ?? mp4(buf) ?? FALLBACK;
}
