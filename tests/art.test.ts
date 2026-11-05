import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';

// The icons and the share image in public/. Sources in art/.

type Png = { width: number; height: number; colorType: number; bitDepth: number; data: Buffer };

// Reads the header and the inflated pixel rows of a PNG.
function readPng(file: string): Png {
  const png = readFileSync(file);
  const idat: Buffer[] = [];
  let offset = 8;
  let header = { width: 0, height: 0, bitDepth: 0, colorType: 0 };
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    const body = png.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      header = { width: body.readUInt32BE(0), height: body.readUInt32BE(4), bitDepth: body[8], colorType: body[9] };
    }
    if (type === 'IDAT') idat.push(body);
    offset += length + 12;
  }
  return { ...header, data: inflateSync(Buffer.concat(idat)) };
}

// The alpha bytes of an 8-bit RGBA or grey-alpha PNG, with the row filters undone.
function alphaBytes({ width, height, colorType, data }: Png): number[] {
  const channels = colorType === 6 ? 4 : 2;
  const stride = width * channels;
  const rows: Buffer[] = [];
  for (let y = 0; y < height; y++) {
    const start = y * (stride + 1);
    const filter = data[start];
    const row = Buffer.from(data.subarray(start + 1, start + 1 + stride));
    const up = y > 0 ? rows[y - 1] : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? row[x - channels] : 0;
      const b = up[x];
      const c = x >= channels ? up[x - channels] : 0;
      const p = a + b - c;
      const pa = Math.abs(p - a);
      const pb = Math.abs(p - b);
      const pc = Math.abs(p - c);
      const paeth = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      const add = [0, a, b, (a + b) >> 1, paeth][filter];
      row[x] = (row[x] + add) & 0xff;
    }
    rows.push(row);
  }
  return rows.flatMap((row) => [...row].filter((_, x) => x % channels === channels - 1));
}

describe('favicon.svg', () => {
  const svg = readFileSync('public/favicon.svg', 'utf8');

  it('crops to the rounded square, not the 1024 icon grid', () => {
    const viewBox = svg.match(/<svg[^>]*viewBox="([^"]+)"/)?.[1];

    expect(viewBox).toBeDefined();
    expect(viewBox).not.toBe('0 0 1024 1024');
    expect(viewBox!.split(/\s+/).slice(0, 2)).toEqual(['100', '100']);
  });

  it('has no guilloche waves, which do not read at 16px', () => {
    expect(svg).not.toMatch(/stroke-opacity/);
    expect(svg.match(/<path\b/g) ?? []).toHaveLength(1);
  });

  it('keeps the burgundy and the burgundy-ink', () => {
    expect(svg).toContain('#5E1B2B');
    expect(svg).toContain('#F4E8EA');
  });
});

describe('apple-touch-icon.png', () => {
  const png = readPng('public/apple-touch-icon.png');

  it('is 180 by 180', () => {
    expect([png.width, png.height]).toEqual([180, 180]);
  });

  it('has no transparent pixel, so iOS adds no black margin', () => {
    expect(png.bitDepth).toBe(8);
    if (png.colorType === 4 || png.colorType === 6) {
      expect(alphaBytes(png).every((alpha) => alpha === 255)).toBe(true);
    } else {
      expect([0, 2]).toContain(png.colorType);
    }
  });
});

describe('og.png', () => {
  const png = readPng('public/og.png');

  it('is 1200 by 630', () => {
    expect([png.width, png.height]).toEqual([1200, 630]);
  });
});
