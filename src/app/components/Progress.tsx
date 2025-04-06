import type { Stats } from "@/app/types";

function Progress({
  data,
  current,
  setCurrent,
  stats,
}: {
  data: string[];
  current: string;
  setCurrent: (_: string) => void;
  stats: Stats;
}) {
  return (
    <>
      <div className="block lg:hidden">
        <select
          className="bg-transparent w-36 rounded-xl border border-dotted border-neutral-500 text-center"
          value={current}
          onChange={e => setCurrent(e.target.value)}
        >
          {data.map(property => (
            <option key={property} value={property}>
              {property}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden lg:block">
        {data.map(property => {
          const selectedClasses =
            property == current ? "outline outline-offset-2 outline-neutral-300" : "";
          const propertyStats = stats.byProperty[property];
          let backgroundColor = "";
          if (propertyStats.locked && propertyStats.correct == 0) {
            backgroundColor = "bg-red-500/50";
          } else if (propertyStats.locked && propertyStats.correct == propertyStats.options) {
            backgroundColor = "bg-green-500/50";
          } else if (propertyStats.locked) {
            backgroundColor = "bg-yellow-500/50";
          }
          return (
            <span
              key={property}
              className={`p-2 h-10 font-bold text-center border border-dotted border-neutral-500 border-r-0 last:border-r aspect-square cursor-pointer ${selectedClasses} ${backgroundColor}`}
              onClick={() => setCurrent(property)}
            >
              {property}
            </span>
          );
        })}
      </div>
    </>
  );
}

export default Progress;
