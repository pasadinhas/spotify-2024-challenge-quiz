import type { Track } from "@/lib/data";
import { Answer } from "@/app/types";
import OptionLayout from "@/app/components/OptionLayout";
import Option from "@/app/components/Option";
import SpotifyWidget from "@/app/components/SpotifyWidget";

type IndividualTrackQuizProps = {
  track: Track;
  options: string[];
  answers: Answer;
  setAnswerForCurrentPropertyTrack: (answer: string, track: Track) => void;
};

function IndividualTrackQuiz({
  track,
  options,
  answers,
  setAnswerForCurrentPropertyTrack,
}: IndividualTrackQuizProps) {
  if (!track) return null;

  return (
    <OptionLayout main={<SpotifyWidget songId={track.uri} />}>
      <Option
        track={track}
        option={options[0]}
        answers={answers}
        setAnswerForCurrentPropertyTrack={setAnswerForCurrentPropertyTrack}
      />
      <Option
        track={track}
        option={options[1]}
        answers={answers}
        setAnswerForCurrentPropertyTrack={setAnswerForCurrentPropertyTrack}
      />
      <Option
        track={track}
        option={options[2]}
        answers={answers}
        setAnswerForCurrentPropertyTrack={setAnswerForCurrentPropertyTrack}
      />
    </OptionLayout>
  );
}

export default IndividualTrackQuiz;
