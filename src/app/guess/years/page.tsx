"use client";

import { useEffect, useState } from "react";
import Data, { Avatar, DisplayName, Track } from "../../Data";
import ThreeColumns from "../../components/ThreeColumns";
import OptionLayout from "../../components/OptionLayout";
import Image from "next/image";
const { Alphabet, ArtistChallengeData } = Data;

type Answers = { [letter: string]: Answer };

type Answer = {
  locked: Boolean;
  selected: { [trackId: string]: string };
};

const LOCAL_STORAGE_ANSWERS_KEY = "spotify-2024-challenge-quiz.years-answers";

function Page() {
  const emptyAnswersObject: Answers = {};
  const computeDefaultAnswers = () =>
    Alphabet.reduce((result, letter) => {
      result[letter] = {
        locked: false,
        selected: {},
      };
      return result;
    }, emptyAnswersObject);
  const [currentLetter, setCurrentLetter] = useState("81");
  const [answers, setAnswers] = useState<Answers>(computeDefaultAnswers());

  useEffect(() => {
    try {
      const locallySavedAnswers = localStorage.getItem(LOCAL_STORAGE_ANSWERS_KEY);
      if (locallySavedAnswers) {
        setAnswers(JSON.parse(locallySavedAnswers));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  function setAndSaveAnswers(answers: Answers) {
    try {
      localStorage.setItem(LOCAL_STORAGE_ANSWERS_KEY, JSON.stringify(answers));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    setAnswers({ ...answers });
  }

  const setAnswerForCurrentLetterTrack = (answer: string, track: Track) => {
    if (answers[currentLetter].locked) {
      console.debug(
        "Cannot change answers because they have already been submitted for: " + currentLetter,
      );
      return;
    }
    Object.keys(answers[currentLetter].selected).forEach(trackId => {
      if (answers[currentLetter].selected[trackId] == answer) {
        delete answers[currentLetter].selected[trackId];
      }
    });
    answers[currentLetter].selected[track.uri] = answer;
    setAndSaveAnswers(answers);
  };

  const tracks = ArtistChallengeData[currentLetter];
  const options = tracks.map(track => track.addedBy).sort();

  const stats: Stats = computeStats(ArtistChallengeData, answers, options);

  function guess() {
    const numberOfAnswers = Object.values(answers[currentLetter].selected).filter(Boolean).length;
    if (numberOfAnswers < options.length) {
      alert("Oops, you didn't select answers for all tracks.");
      return;
    }
    answers[currentLetter].locked = true;
    setAndSaveAnswers(answers);
  }

  return (
    <>
      <header className="grid justify-center p-5 pt-10 lg:p-10">
        <Progress currentLetter={currentLetter} setCurrentLetter={setCurrentLetter} stats={stats} />
      </header>
      <main className="flex flex-col p-5 pb-10 lg:p-10 gap-10">
        <ThreeColumns>
          <IndividualTrackQuiz
            track={tracks[0]}
            options={options}
            answers={answers[currentLetter]}
            setAnswerForCurrentLetterTrack={setAnswerForCurrentLetterTrack}
          />
          <IndividualTrackQuiz
            track={tracks[1]}
            options={options}
            answers={answers[currentLetter]}
            setAnswerForCurrentLetterTrack={setAnswerForCurrentLetterTrack}
          />
          <IndividualTrackQuiz
            track={tracks[2]}
            options={options}
            answers={answers[currentLetter]}
            setAnswerForCurrentLetterTrack={setAnswerForCurrentLetterTrack}
          />
        </ThreeColumns>
        <Controls
          currentLetter={currentLetter}
          setCurrentLetter={setCurrentLetter}
          guess={guess}
          resetAnswers={() => setAndSaveAnswers(computeDefaultAnswers())}
        ></Controls>
      </main>
      <footer>
        <AnswersStats options={options} stats={stats} />
      </footer>
    </>
  );
}

function AnswersStats({ options, stats }: { options: string[]; stats: Stats }) {
  return (
    <div className="flex justify-center gap-10 my-5 px-2 lg:px-5">
      {options.map(option => {
        const correct = stats.byOption[option].correct;
        const guessed = stats.byOption[option].guessed;
        const percentage = guessed == 0 ? 0 : Math.round((100 * correct) / guessed);
        return (
          <div
            key={option}
            className="flex flex-1 border border-dotted border-neutral-500 p-1 rounded-xl overflow-hidden"
          >
            <Image
              className="w-10 h-10 rounded-xl align-middle hidden lg:block"
              src={Avatar(option)}
              alt=""
              width={40}
              height={40}
            />
            <div className="grid text-sm">
              <span className="leading-5 ps-5">{DisplayName(option)}</span>
              <span className="leading-5 ps-5">
                {correct} / {guessed} ({percentage}%)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Controls({
  currentLetter,
  setCurrentLetter,
  guess,
  resetAnswers,
}: {
  currentLetter: string;
  setCurrentLetter: (letter: string) => void;
  guess: () => void;
  resetAnswers: () => void;
}) {
  const currentIndex = Alphabet.indexOf(currentLetter);
  const previousLetter = Alphabet[(currentIndex - 1) % Alphabet.length];
  const nextLetter = Alphabet[(currentIndex + 1) % Alphabet.length];
  const btnClasses = "rounded-xl border px-5 py-3 hover:outline outline-offset-2 ";
  const btnNeutralClasses = "border-neutral-500 outline-neutral-300";
  const btnDangerClasses = "border-red-500 outline-red-300";
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center gap-10">
        <button
          className={btnClasses + btnNeutralClasses}
          onClick={() => setCurrentLetter(previousLetter)}
        >
          «
        </button>
        <button className={btnClasses + btnNeutralClasses + " w-36"} onClick={guess}>
          Guess
        </button>
        <button
          className={btnClasses + btnNeutralClasses}
          onClick={() => setCurrentLetter(nextLetter)}
        >
          »
        </button>
      </div>
      <div className="flex justify-center">
        <button
          className={btnClasses + btnDangerClasses}
          onClick={() => {
            if (
              confirm(
                "This will delete all the answers you're previously given. Are you sure you want to delete them?",
              )
            ) {
              resetAnswers();
            }
          }}
        >
          Clear all answers
        </button>
      </div>
    </div>
  );
}

function Progress({
  currentLetter,
  setCurrentLetter,
  stats,
}: {
  currentLetter: string;
  setCurrentLetter: (_: string) => void;
  stats: Stats;
}) {
  return (
    <>
      <div className="block lg:hidden">
        <select
          className="bg-transparent w-36 rounded-xl border border-dotted border-neutral-500 text-center"
          value={currentLetter}
          onChange={e => setCurrentLetter(e.target.value)}
        >
          {Alphabet.map(letter => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden lg:block">
        {Alphabet.map(letter => {
          const selectedClasses =
            letter == currentLetter ? "outline outline-offset-2 outline-neutral-300" : "";
          const letterStats = stats.byLetter[letter];
          let backgroundColor = "";
          if (letterStats.locked && letterStats.correct == 0) {
            backgroundColor = "bg-red-500/50";
          } else if (letterStats.locked && letterStats.correct == letterStats.options) {
            backgroundColor = "bg-green-500/50";
          } else if (letterStats.locked) {
            backgroundColor = "bg-yellow-500/50";
          }
          return (
            <span
              key={letter}
              className={`p-2 h-10 font-bold text-center border border-dotted border-neutral-500 border-r-0 last:border-r aspect-square cursor-pointer ${selectedClasses} ${backgroundColor}`}
              onClick={() => setCurrentLetter(letter)}
            >
              {letter}
            </span>
          );
        })}
      </div>
    </>
  );
}

type IndividualTrackQuizProps = {
  track: Track;
  options: string[];
  answers: Answer;
  setAnswerForCurrentLetterTrack: (answer: string, track: Track) => void;
};
function IndividualTrackQuiz({
  track,
  options,
  answers,
  setAnswerForCurrentLetterTrack,
}: IndividualTrackQuizProps) {
  if (!track) return <></>;

  return (
    <OptionLayout main={<SpotifyWidget songId={track.uri} />}>
      <Option
        track={track}
        option={options[0]}
        answers={answers}
        setAnswerForCurrentLetterTrack={setAnswerForCurrentLetterTrack}
      />
      <Option
        track={track}
        option={options[1]}
        answers={answers}
        setAnswerForCurrentLetterTrack={setAnswerForCurrentLetterTrack}
      />
      <Option
        track={track}
        option={options[2]}
        answers={answers}
        setAnswerForCurrentLetterTrack={setAnswerForCurrentLetterTrack}
      />
    </OptionLayout>
  );
}

function SpotifyWidget({ songId }: { songId: string }) {
  return (
    <div className="relative">
      <iframe // this iframe is used just for the background color using blur
        className="absolute translate-y-full overflow-hidden blur-3xl -z-10 scale-y-[3] saturate-50 opacity-30"
        src={`https://open.spotify.com/embed/track/${songId.replace("spotify:track:", "")}?utm_source=generator`}
        width="100%"
        height="160"
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <iframe // this is the actual iframe that will show up
        className="rounded-xl"
        src={`https://open.spotify.com/embed/track/${songId.replace("spotify:track:", "")}?utm_source=generator`}
        width="100%"
        height="160"
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
}

type OptionProps = {
  track: Track;
  option: string;
  answers: Answer;
  setAnswerForCurrentLetterTrack: (answer: string, track: Track) => void;
};
function Option({ track, option, answers, setAnswerForCurrentLetterTrack }: OptionProps) {
  if (!option) return <></>;
  const selectedAnswer = answers.selected[track.uri];
  const correctAnswer = track.addedBy;
  const isThisOptionSelected = selectedAnswer == option;
  const isThisOptionCorrect = correctAnswer == option;
  const areAnswersLocked = answers.locked;

  let backgroundColor = "";

  if (areAnswersLocked && isThisOptionSelected && !isThisOptionCorrect) {
    backgroundColor = "bg-red-500/50";
  } else if (areAnswersLocked && isThisOptionCorrect) {
    backgroundColor = "bg-green-500/50";
  } else if (isThisOptionSelected) {
    backgroundColor = "bg-neutral-500/50";
  }

  return (
    <div
      className={`lg:p-5 p-2 flex cursor-pointer rounded-xl border border-dashed border-neutral-500 ${backgroundColor} outline-offset-4 outline-neutral-300 hover:outline`}
      onClick={() => setAnswerForCurrentLetterTrack(option, track)}
    >
      <Image
        className="w-10 h-10 rounded-xl align-middle"
        src={Avatar(option)}
        alt=""
        width={40}
        height={40}
      />
      <span className="leading-10 ps-5 text-center">{DisplayName(option)}</span>
    </div>
  );
}

type Stats = {
  totalAnswered: number;
  byLetter: { [letter: string]: { locked: Boolean; options: number; correct: number } };
  byOption: any;
};
function computeStats(
  data: { [groupBy: string]: Track[] },
  answers: Answers,
  options: string[],
): Stats {
  const totalAnswered = Object.values(answers).filter(answer => answer.locked).length;

  const defaultLetterStats: Stats["byLetter"] = {};
  const byLetter = Alphabet.reduce((result, letter) => {
    answers[letter].locked;
    result[letter] = {
      locked: answers[letter].locked,
      options: data[letter].length,
      correct: data[letter]
        .map(track => answers[letter].selected[track.uri] == track.addedBy)
        .filter(Boolean).length,
    };
    return result;
  }, defaultLetterStats);

  const defaultOptionStats: Stats["byOption"] = {};
  const lockedAnswers = Object.values(answers)
    .filter(answer => answer.locked)
    .map(answer => answer.selected)
    .reduce(Object.assign, {});
  const byOption = options.reduce((result, option) => {
    result[option] = {
      guessed: Object.values(answers)
        .filter(answer => answer.locked)
        .flatMap(answer => Object.values(answer.selected))
        .filter(name => name == option).length,
      correct: Object.values(data)
        .flatMap(e => e)
        .filter(
          track => lockedAnswers[track.uri] == option && lockedAnswers[track.uri] == track.addedBy,
        ).length,
    };
    return result;
  }, defaultOptionStats);

  return { totalAnswered, byLetter, byOption };
}

export default Page;
