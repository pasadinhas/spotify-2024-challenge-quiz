"use client";

import { useEffect, useState } from "react";
import type { Track } from "@/lib/data";
import Data from "@/lib/data";
import type { Answers, Stats } from "@/app/types";
import ThreeColumns from "@/app/components/ThreeColumns";
import Controls from "@/app/components/Controls";
import Progress from "@/app/components/Progress";
import AnswersStats from "@/app/components/AnswerStats";
import IndividualTrackQuiz from "@/app/components/IndividualTrackQuiz";
import { computeStats } from "@/app/utils";

const { Letters, AlbumsChallengeData } = Data;

const LOCAL_STORAGE_ANSWERS_KEY = "spotify-2024-challenge-quiz.albums-answers";

function Page() {
  const emptyAnswersObject: Answers = {};
  const computeDefaultAnswers = () =>
    Letters.reduce((result, letter) => {
      result[letter] = {
        locked: false,
        selected: {},
      };
      return result;
    }, emptyAnswersObject);
  const [currentLetter, setCurrentLetter] = useState("A");
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

  const tracks = AlbumsChallengeData[currentLetter];
  const options = tracks.map(track => track.addedBy).sort();

  const stats: Stats = computeStats(Letters, AlbumsChallengeData, answers, options);

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
        <Progress
          data={Letters}
          current={currentLetter}
          setCurrent={setCurrentLetter}
          stats={stats}
        />
      </header>
      <main className="flex flex-col p-5 pb-10 lg:p-10 gap-10">
        <ThreeColumns>
          <IndividualTrackQuiz
            track={tracks[0]}
            options={options}
            answers={answers[currentLetter]}
            setAnswerForCurrentPropertyTrack={setAnswerForCurrentLetterTrack}
          />
          <IndividualTrackQuiz
            track={tracks[1]}
            options={options}
            answers={answers[currentLetter]}
            setAnswerForCurrentPropertyTrack={setAnswerForCurrentLetterTrack}
          />
          <IndividualTrackQuiz
            track={tracks[2]}
            options={options}
            answers={answers[currentLetter]}
            setAnswerForCurrentPropertyTrack={setAnswerForCurrentLetterTrack}
          />
        </ThreeColumns>
        <Controls
          data={Letters}
          current={currentLetter}
          setCurrent={setCurrentLetter}
          guess={guess}
          resetAnswers={() => setAndSaveAnswers(computeDefaultAnswers())}
        />
      </main>
      <footer>
        <AnswersStats options={options} stats={stats} />
      </footer>
    </>
  );
}

export default Page;
