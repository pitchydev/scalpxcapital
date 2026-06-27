export type LoadedSprites = Record<string, HTMLImageElement>;

/** Preloads a map of {key: url} into decoded HTMLImageElements. */
export function loadSprites(urls: Record<string, string>): Promise<LoadedSprites> {
  const entries = Object.entries(urls);
  return Promise.all(
    entries.map(
      ([key, src]) =>
        new Promise<[string, HTMLImageElement]>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve([key, img]);
          img.onerror = () => reject(new Error(`Failed to load sprite: ${src}`));
          img.src = src;
        }),
    ),
  ).then((pairs) => Object.fromEntries(pairs));
}
