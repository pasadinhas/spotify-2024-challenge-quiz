"use client";

import data from "./data.json";

type DataT = typeof data;

// const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ALPHABET = [
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
];

const CHALLENGE_FIRST_INDEX = 3 + 3 * 26 * 3;
const CHALLENGE_LAST_INDEX = CHALLENGE_FIRST_INDEX + ALPHABET.length * 3;

const CHALLENGE_DATA: { [key: string]: DataT } = {};

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
for (let i = CHALLENGE_FIRST_INDEX; i < CHALLENGE_LAST_INDEX && i < data.length; i += 1) {
  const letter = ALPHABET[Math.floor(i - CHALLENGE_FIRST_INDEX) % ALPHABET.length];

  // Assign the chunk to the corresponding letter in the map
  if (!CHALLENGE_DATA[letter]) {
    CHALLENGE_DATA[letter] = [];
  }

  CHALLENGE_DATA[letter].push(data[i]);
}

// Hack: add 2024
CHALLENGE_DATA["24"] = [];
CHALLENGE_DATA["24"].push(data[CHALLENGE_LAST_INDEX + 0]);
CHALLENGE_DATA["24"].push(data[CHALLENGE_LAST_INDEX + 1]);
CHALLENGE_DATA["24"].push(data[CHALLENGE_LAST_INDEX + 2]);

Object.keys(CHALLENGE_DATA).forEach(l => {
  CHALLENGE_DATA[l] = shuffle(CHALLENGE_DATA[l]);
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

Object.values(CHALLENGE_DATA).forEach(tracks =>
  tracks.forEach(track => {
    track.addedBy.data.name = DISPLAY_NAME[track.addedBy.data.username] ?? track.addedBy.data.name;
    track.addedBy.data.avatar = AVATARS[track.addedBy.data.username] ?? track.addedBy.data.avatar;
  }),
);

const Data = {
  Alphabet: [...ALPHABET, "24"], // Hack: add 2024
  ArtistChallengeData: CHALLENGE_DATA,
};

export default {
  ...Data,
};

export type Data = DataT;
