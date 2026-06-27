/** Frame set used by the engine to animate a character. */
export type CharacterFrames = {
  glide: string;
  rise: string;
  flap: string;
  dive: string;
};

export type Character = {
  id: string;
  name: string;
  /** Short flavour line shown on the select card. */
  tagline: string;
  locked: boolean;
  /** Front-facing portrait for the select carousel (playable chars only). */
  portrait?: string;
  /** Side frames for in-game animation (playable chars only). */
  frames?: CharacterFrames;
  /** Aspect ratio (w/h) of the side frames, for crisp draw sizing. */
  frameAspect?: number;
};

export const CHARACTERS: Character[] = [
  {
    id: "chento",
    name: "ChentoTrades",
    tagline: "Diamond hands. Iron nerves.",
    locked: false,
    portrait: "/game/chento/portrait.png",
    frames: {
      glide: "/game/chento/glide.png",
      rise: "/game/chento/rise.png",
      flap: "/game/chento/flap.png",
      dive: "/game/chento/dive.png",
    },
    // glide frame is 84x200 -> ~0.42; we standardise draw width on this.
    frameAspect: 84 / 200,
  },
  {
    id: "soon-1",
    name: "???",
    tagline: "Coming soon",
    locked: true,
  },
  {
    id: "soon-2",
    name: "???",
    tagline: "Coming soon",
    locked: true,
  },
  {
    id: "soon-3",
    name: "???",
    tagline: "Coming soon",
    locked: true,
  },
];

export const DEFAULT_CHARACTER = CHARACTERS[0];
