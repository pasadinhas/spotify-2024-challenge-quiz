import type { Track } from "@/lib/data";
import type { Answers, Stats } from "@/app/types";

export function computeStats(
  properties: string[],
  data: { [groupBy: string]: Track[] },
  answers: Answers,
  options: string[],
): Stats {
  const totalAnswered = Object.values(answers).filter(answer => answer.locked).length;

  const defaultPropertyStats: Stats["byProperty"] = {};
  const byProperty = properties.reduce((result, property) => {
    answers[property].locked;
    result[property] = {
      locked: answers[property].locked,
      options: data[property].length,
      correct: data[property]
        .map(track => answers[property].selected[track.uri] == track.addedBy)
        .filter(Boolean).length,
    };
    return result;
  }, defaultPropertyStats);

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

  return { totalAnswered, byProperty, byOption };
}
