import { useRouter } from "next/navigation";

function Controls({
  data,
  current,
  setCurrent,
  guess,
  resetAnswers,
}: {
  data: string[];
  current: string;
  setCurrent: (letter: string) => void;
  guess: () => void;
  resetAnswers: () => void;
}) {
  const currentIndex = data.indexOf(current);
  const previous = data[(currentIndex - 1) % data.length];
  const next = data[(currentIndex + 1) % data.length];
  const btnClasses = "rounded-xl border px-5 py-3 hover:outline outline-offset-2 ";
  const btnNeutralClasses = "border-neutral-500 outline-neutral-300";
  const btnDangerClasses = "border-red-500 outline-red-300";
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center gap-10">
        <button className={btnClasses + btnNeutralClasses} onClick={() => setCurrent(previous)}>
          «
        </button>
        <button className={btnClasses + btnNeutralClasses + " w-36"} onClick={guess}>
          Guess
        </button>
        <button className={btnClasses + btnNeutralClasses} onClick={() => setCurrent(next)}>
          »
        </button>
      </div>
      <div className="flex justify-center gap-5">
        <button className={btnClasses + btnNeutralClasses} onClick={() => router.back()}>
          Back to Game Selector
        </button>
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

export default Controls;
