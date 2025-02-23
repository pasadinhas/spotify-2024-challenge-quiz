export default function ThreeColumns({
  children,
}: {
  children: string | JSX.Element | JSX.Element[];
}) {
  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-rows-1 lg:grid-cols-3 lg:gap-x-20">
      {children}
    </div>
  );
}
