export interface ChunkOptions {
  maxLength: number;
}

export function chunkText(
  text: string,
  options: ChunkOptions
): string[] {
  const { maxLength } = options;

  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > maxLength) {
    let splitIndex = remaining.lastIndexOf(".", maxLength);

    if (splitIndex === -1) {
      splitIndex = remaining.lastIndexOf("?", maxLength);
    }

    if (splitIndex === -1) {
      splitIndex = remaining.lastIndexOf("!", maxLength);
    }

    if (splitIndex === -1) {
      splitIndex = remaining.lastIndexOf(",", maxLength);
    }

    if (splitIndex === -1) {
      splitIndex = remaining.lastIndexOf(" ", maxLength);
    }

    if (splitIndex === -1) {
      splitIndex = maxLength;
    }

    chunks.push(remaining.slice(0, splitIndex + 1).trim());

    remaining = remaining.slice(splitIndex + 1).trim();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks;
}