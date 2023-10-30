function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    if (chunk.length === size) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

export default chunkArray;
