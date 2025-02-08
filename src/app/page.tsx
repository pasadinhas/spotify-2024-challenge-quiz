"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import OptionLayout from "./components/OptionLayout";

function Option({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <div
      className={`lg:p-5 p-2 flex cursor-pointer rounded-xl border border-dashed border-neutral-500 bg-neutral-500/50 outline-offset-4 outline-neutral-300 hover:outline`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function HomeNoSSR() {
  const router = useRouter();

  return (
    <>
      <header className="grid justify-center p-5 pt-10 lg:p-10">
        <h1 className="text-4xl font-bold text-center text-neutral-800 dark:text-neutral-200 lg:text-6xl">
          Bem-vindo! Welcome! Benvingut! Bienvenido!
        </h1>
      </header>
      <main className="flex flex-col p-5 pb-10 lg:p-10 gap-10">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center text-neutral-700 dark:text-neutral-300">
          Select the mode you want to play:
        </h2>
        <div className="gap-5 flex flex-col lg:grid lg:grid-rows-1 lg:grid-cols-2 lg:gap-x-20">
          <OptionLayout
            main={<p className="leading-10 ps-5 text-center font-semibold">Match 🔥</p>}
          >
            <Option
              onClick={() => {
                router.push("/match");
              }}
            >
              Year
            </Option>
            <Option
              onClick={() => {
                router.push("/match");
              }}
            >
              Artists
            </Option>
            <Option
              onClick={() => {
                router.push("/match");
              }}
            >
              Albums
            </Option>
            <Option
              onClick={() => {
                router.push("/match");
              }}
            >
              Songs
            </Option>
          </OptionLayout>
          <OptionLayout
            main={<p className="leading-10 ps-5 text-center font-semibold">Guess Who 🕵</p>}
          >
            <Option
              onClick={() => {
                router.push("/guess/years");
              }}
            >
              Years
            </Option>
            <Option
              onClick={() => {
                router.push("/guess");
              }}
            >
              Artists
            </Option>
            <Option
              onClick={() => {
                router.push("/guess");
              }}
            >
              Albums
            </Option>
            <Option
              onClick={() => {
                router.push("/guess");
              }}
            >
              Songs
            </Option>
          </OptionLayout>
        </div>
      </main>
      <footer></footer>
    </>
  );
}

// export it with SSR disabled
const Home = dynamic(() => Promise.resolve(HomeNoSSR), {
  ssr: false,
});

export default Home;
