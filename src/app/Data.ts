"use client";

import data from "./data.json";

type DataT = typeof data;

const ARTIST_CHALLENGE_FIRST_INDEX = 3 + 2 * 26 * 3;
const ARTIST_CHALLENGE_LAST_INDEX = ARTIST_CHALLENGE_FIRST_INDEX + 26 * 3;

const ARTIST_CHALLENGE_DATA: { [key: string]: DataT } = {};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Iterate over the tracks and group them into chunks of three
for (
  let i = ARTIST_CHALLENGE_FIRST_INDEX;
  i < ARTIST_CHALLENGE_LAST_INDEX && i < data.length;
  i += 1
) {
  const letter = ALPHABET[Math.floor(i - ARTIST_CHALLENGE_FIRST_INDEX) % 26];

  // Assign the chunk to the corresponding letter in the map
  if (!ARTIST_CHALLENGE_DATA[letter]) {
    ARTIST_CHALLENGE_DATA[letter] = [];
  }

  ARTIST_CHALLENGE_DATA[letter].push(data[i]);
}

Object.keys(ARTIST_CHALLENGE_DATA).forEach(l => {
  ARTIST_CHALLENGE_DATA[l] = shuffle(ARTIST_CHALLENGE_DATA[l]);
});

const DISPLAY_NAME: { [username: string]: string } = {
  bukjir: "Carlos Carvalho",
};

const AVATARS: { [username: string]: DataT[0]["addedBy"]["data"]["avatar"] } = {
  bukjir: {
    sources: [
      {
        height: 96,
        url: "/spotify-2024-challenge-quiz/img/bukjir.jpg",
        width: 96,
      },
    ],
  },
  "1167349358": {
    sources: [
      {
        height: 96,
        url: "/spotify-2024-challenge-quiz/img/1167349358.jpg",
        width: 96,
      },
    ],
  },
  "1173496040": {
    sources: [
      {
        height: 96,
        url: "/spotify-2024-challenge-quiz/img/1173496040.jpg",
        width: 96,
      },
    ],
  },
};

Object.values(ARTIST_CHALLENGE_DATA).forEach(tracks =>
  tracks.forEach(track => {
    track.addedBy.data.name = DISPLAY_NAME[track.addedBy.data.username] ?? track.addedBy.data.name;
    track.addedBy.data.avatar = AVATARS[track.addedBy.data.username] ?? track.addedBy.data.avatar;
  }),
);

const Data = {
  Alphabet: ALPHABET,
  ArtistChallengeData: ARTIST_CHALLENGE_DATA,
};

export default {
  ...Data,
};

export type Data = DataT;
