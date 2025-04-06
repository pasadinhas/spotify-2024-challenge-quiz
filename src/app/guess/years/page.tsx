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

const { Years, YearsChallengeData } = Data;

const LOCAL_STORAGE_ANSWERS_KEY = "spotify-2024-challenge-quiz.years-answers";

function Page() {
  const emptyAnswersObject: Answers = {};
  const computeDefaultAnswers = () =>
    Years.reduce((result, year) => {
      result[year] = {
        locked: false,
        selected: {},
      };
      return result;
    }, emptyAnswersObject);
  const [currentYear, setCurrentYear] = useState("81");
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

  const setAnswerForCurrentYearTrack = (answer: string, track: Track) => {
    if (answers[currentYear].locked) {
      console.debug(
        "Cannot change answers because they have already been submitted for: " + currentYear,
      );
      return;
    }
    Object.keys(answers[currentYear].selected).forEach(trackId => {
      if (answers[currentYear].selected[trackId] == answer) {
        delete answers[currentYear].selected[trackId];
      }
    });
    answers[currentYear].selected[track.uri] = answer;
    setAndSaveAnswers(answers);
  };

  const tracks = YearsChallengeData[currentYear];
  const options = tracks.map(track => track.addedBy).sort();

  const stats: Stats = computeStats(Years, YearsChallengeData, answers, options);

  function guess() {
    const numberOfAnswers = Object.values(answers[currentYear].selected).filter(Boolean).length;
    if (numberOfAnswers < options.length) {
      alert("Oops, you didn't select answers for all tracks.");
      return;
    }
    answers[currentYear].locked = true;
    setAndSaveAnswers(answers);
  }

  return (
    <>
      <header className="grid justify-center p-5 pt-10 lg:p-10">
        <Progress data={Years} current={currentYear} setCurrent={setCurrentYear} stats={stats} />
      </header>
      <main className="flex flex-col p-5 pb-10 lg:p-10 gap-10">
        <ThreeColumns>
          <IndividualTrackQuiz
            track={tracks[0]}
            options={options}
            answers={answers[currentYear]}
            setAnswerForCurrentPropertyTrack={setAnswerForCurrentYearTrack}
          />
          <IndividualTrackQuiz
            track={tracks[1]}
            options={options}
            answers={answers[currentYear]}
            setAnswerForCurrentPropertyTrack={setAnswerForCurrentYearTrack}
          />
          <IndividualTrackQuiz
            track={tracks[2]}
            options={options}
            answers={answers[currentYear]}
            setAnswerForCurrentPropertyTrack={setAnswerForCurrentYearTrack}
          />
        </ThreeColumns>
        <Controls
          data={Years}
          current={currentYear}
          setCurrent={setCurrentYear}
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
