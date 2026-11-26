// news-image-20261126 entrypoint.
// Delivers the sealed front-page image (entry.png, same directory as this
// file) to the grader's output directory, byte for byte, every run.
// Node 22, standard library only, no network, no randomness.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1024 * 1024;
const SOURCE_NAME = "entry.png";

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function loadBundledImage(here: string): Buffer {
  const sourcePath = join(here, SOURCE_NAME);
  if (!existsSync(sourcePath)) {
    throw new Error(`bundled image missing: ${sourcePath}`);
  }
  const payload = readFileSync(sourcePath);
  if (payload.length === 0 || payload.length > MAX_BYTES) {
    throw new Error(`bundled image has unexpected size: ${payload.length} bytes`);
  }
  if (!payload.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    throw new Error("bundled image is not a PNG");
  }
  // IHDR follows the 8-byte signature: width and height are big-endian
  // uint32s at offsets 16 and 20. The sealed image is 1024x1024.
  const width = payload.readUInt32BE(16);
  const height = payload.readUInt32BE(20);
  if (width !== 1024 || height !== 1024) {
    throw new Error(`bundled image has unexpected dimensions: ${width}x${height}`);
  }
  return payload;
}

function deliver(payload: Buffer, outDir: string): string {
  mkdirSync(outDir, { recursive: true });
  const targetPath = join(outDir, SOURCE_NAME);
  writeFileSync(targetPath, payload);
  const written = readFileSync(targetPath);
  if (sha256(written) !== sha256(payload)) {
    throw new Error("output image differs from the bundled image");
  }
  return targetPath;
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const payload = loadBundledImage(here);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const targetPath = deliver(payload, outDir);
  console.log(`wrote ${targetPath} (${payload.length} bytes, sha256 ${sha256(payload)})`);
}

main();
