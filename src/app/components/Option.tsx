import Image from "next/image";
import type { Track } from "@/lib/data";
import type { Answer } from "@/app/types";
import { getDisplayName, getAvatar } from "@/lib/data";

type OptionProps = {
  track: Track;
  option: string;
  answers: Answer;
  setAnswerForCurrentPropertyTrack: (answer: string, track: Track) => void;
};

function Option({ track, option, answers, setAnswerForCurrentPropertyTrack }: OptionProps) {
  if (!option) return null;
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
      onClick={() => setAnswerForCurrentPropertyTrack(option, track)}
    >
      <Image
        className="w-10 h-10 rounded-xl align-middle"
        src={getAvatar(option)}
        alt=""
        width={40}
        height={40}
      />
      <span className="leading-10 ps-5 text-center">{getDisplayName(option)}</span>
    </div>
  );
}

export default Option;
