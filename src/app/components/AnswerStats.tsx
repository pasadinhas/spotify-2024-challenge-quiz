import Image from "next/image";
import type { Stats } from "@/app/types";
import { getDisplayName, getAvatar } from "@/lib/data";

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
              src={getAvatar(option)}
              alt=""
              width={40}
              height={40}
            />
            <div className="grid text-sm">
              <span className="leading-5 ps-5">{getDisplayName(option)}</span>
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

export default AnswersStats;
