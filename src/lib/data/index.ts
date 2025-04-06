import data from "./data.json";

export type Track = {
  addedAt: string;
  addedBy: string;
  uri: string;
};

const DisplayNames: { [username: string]: string } = {
  "spotify:user:bukjir": "Carlos Carvalho",
  "spotify:user:1167349358": "Daniel Sil",
  "spotify:user:1173496040": "Miguel Pasadinhas",
};

export function getDisplayName(username: string) {
  return DisplayNames[username];
}

const Avatars: { [username: string]: string } = {
  "spotify:user:bukjir": "/spotify-2024-challenge-quiz/img/bukjir.jpg",
  "spotify:user:1167349358": "/spotify-2024-challenge-quiz/img/1167349358.jpg",
  "spotify:user:1173496040": "/spotify-2024-challenge-quiz/img/1173496040.jpg",
};

export function getAvatar(username: string) {
  return Avatars[username];
}

// const YEARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const YEARS = [
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

const YEARS_CHALLENGE_FIRST_INDEX = 3 + 3 * 26 * 3;
const YEARS_CHALLENGE_LAST_INDEX = YEARS_CHALLENGE_FIRST_INDEX + YEARS.length * 3;

const YEARS_CHALLENGE_DATA: { [key: string]: Track[] } = {};

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
  let i = YEARS_CHALLENGE_FIRST_INDEX;
  i < YEARS_CHALLENGE_LAST_INDEX && i < data.length;
  i += 1
) {
  const letter = YEARS[Math.floor(i - YEARS_CHALLENGE_FIRST_INDEX) % YEARS.length];

  // Assign the chunk to the corresponding letter in the map
  if (!YEARS_CHALLENGE_DATA[letter]) {
    YEARS_CHALLENGE_DATA[letter] = [];
  }

  YEARS_CHALLENGE_DATA[letter].push(data[i]);
}

// Hack: add 2024
YEARS_CHALLENGE_DATA["24"] = [];
YEARS_CHALLENGE_DATA["24"].push(data[YEARS_CHALLENGE_LAST_INDEX + 0]);
YEARS_CHALLENGE_DATA["24"].push(data[YEARS_CHALLENGE_LAST_INDEX + 1]);
YEARS_CHALLENGE_DATA["24"].push(data[YEARS_CHALLENGE_LAST_INDEX + 2]);

Object.keys(YEARS_CHALLENGE_DATA).forEach(l => {
  YEARS_CHALLENGE_DATA[l] = shuffle(YEARS_CHALLENGE_DATA[l]);
});

const Data = {
  Years: [...YEARS, "24"], // Hack: add 2024
  YearsChallengeData: YEARS_CHALLENGE_DATA,
};

export default Data;
