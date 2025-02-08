export default function OptionLayout({
  children,
  main = null,
}: {
  children: React.ReactNode;
  main?: React.ReactNode;
}) {
  return (
    <div className="lg:grid lg:gap-10 select-none">
      {main}
      <div className="grid gap-5">{children}</div>
    </div>
  );
}
