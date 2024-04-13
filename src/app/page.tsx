'use client'

import { useState } from "react";
import Data from "./Data"

const {Alphabet,ArtistChallengeData} = Data

type Tracks = typeof ArtistChallengeData['A']
type Track = Tracks['values']

type Answers = {[letter: string]: Answer}

type Answer = {
  locked: Boolean,
  answers: string[]
}

export default function Home() {

  const defaultAnswers: Answers = {}
  const [currentLetter, setCurrentLetter] = useState('A')
  const [answers, setAnswers]: [Answers, (arg0: Answers) => void] = useState(() => 
    Alphabet.reduce((result, letter) => {
      result[letter] = {
        locked: false,
        answers: [],
      }
      return result
    }, defaultAnswers)
  )

  const setAnswerForCurrentLetterWithIndex = (answer: string, index: number) => {
    if (answers[currentLetter].locked) {
      console.debug("Cannot change answers because they have already been submited for: " + currentLetter)
      return
    }
    for (let i = 0; i < answers[currentLetter].answers.length; i += 1) {
      if (answers[currentLetter].answers[i] == answer) {
        delete answers[currentLetter].answers[i]
      }
    }
    answers[currentLetter].answers[index] = answer
    setAnswers({...answers})
  }

  function guess() {
    const numberOfAnswers = answers[currentLetter].answers.filter(Boolean).length
    if (numberOfAnswers < 3) {
      alert("Oops, you didn't select answers for all tracks.")
      return
    }
    answers[currentLetter].locked = true
    setAnswers({...answers})
  }

  return (<>
    <header className="flex justify-center p-10">
      <Progress currentLetter={currentLetter} setCurrentLetter={setCurrentLetter}/>
    </header>
    <main className="flex flex-col min-w-screen p-10 gap-10">
      <ThreeColumns>
        <IndividualTrackQuiz tracks={ArtistChallengeData[currentLetter]} index={0} answers={answers[currentLetter]} setAnswerForCurrentLetterWithIndex={setAnswerForCurrentLetterWithIndex} />
        <IndividualTrackQuiz tracks={ArtistChallengeData[currentLetter]} index={1} answers={answers[currentLetter]} setAnswerForCurrentLetterWithIndex={setAnswerForCurrentLetterWithIndex} />
        <IndividualTrackQuiz tracks={ArtistChallengeData[currentLetter]} index={2} answers={answers[currentLetter]} setAnswerForCurrentLetterWithIndex={setAnswerForCurrentLetterWithIndex} />
      </ThreeColumns>
      <Controls currentLetter={currentLetter} setCurrentLetter={setCurrentLetter} guess={guess}></Controls>
    </main>
    </>
  );
}

function Controls({currentLetter, setCurrentLetter, guess}) {
  const previousLetter = currentLetter == "A" ? "Z" : String.fromCharCode(currentLetter.charCodeAt(0) - 1);
  const nextLetter = currentLetter == "Z" ? "A" : String.fromCharCode(currentLetter.charCodeAt(0) + 1);
  const btnClasses = "w-36 border border-neutral-500 px-5 py-3 hover:outline outline-offset-2 outline-neutral-300"
  return <div className="flex justify-center gap-10 my-5">
    <button className={btnClasses} onClick={() => setCurrentLetter(previousLetter)}>Previous</button>
    <button className={btnClasses} onClick={guess}>Guess</button>
    <button className={btnClasses} onClick={() => setCurrentLetter(nextLetter)}>Next</button>
  </div>
}

function ThreeColumns({ children }: { children: string | JSX.Element | JSX.Element[] }) {
  return <div className="grid grid-rows-1 grid-cols-3 gap-x-20">
    {children}
  </div>
}

function Progress({currentLetter, setCurrentLetter}: {currentLetter: string, setCurrentLetter: (_: string) => void}) {
  const selectedClasses = "outline outline-offset-2 outline-neutral-300"
  return <div className="flex items-center">
    {Alphabet.map(letter => <>
      <span className={`p-2 h-10 font-bold text-center border border-dotted border-neutral-500 border-r-0 last:border-r aspect-square cursor-pointer ${letter == currentLetter ? selectedClasses : ""}`} onClick={() => setCurrentLetter(letter)}>{letter}</span>
    </>)}
  </div>
}

type IndividualTrackQuizProps = { tracks: Tracks, index: number, answers: Answer, setAnswerForCurrentLetterWithIndex: (answer: string, index: number) => void }
function IndividualTrackQuiz({tracks, index, answers, setAnswerForCurrentLetterWithIndex}: IndividualTrackQuizProps) {
  if (tracks.length < index + 1) {
    return <></>
  }

  const options = tracks.map(track => track.addedBy.data).sort((a, b) => a.name.localeCompare(b.name))

  return <div className="grid gap-10 select-none">
    <SpotifyWidget songId={tracks[index].itemV2.data.uri} />
    <TrackAddedByOptions options={options} selectedAnswer={answers.answers[index]} locked={answers.locked} setAnswerForTrack={(answer: string) => setAnswerForCurrentLetterWithIndex(answer, index)} />
  </div>
}

function SpotifyWidget({ songId }: { songId: string }) {
  return <div className="relative">
    <iframe // this iframe is used just for the background color using blur
      className="absolute translate-y-full overflow-hidden blur-3xl -z-10 scale-y-[3] saturate-50 opacity-30"
      src={`https://open.spotify.com/embed/track/${songId.replace("spotify:track:", "")}?utm_source=generator`}
      width={'100%'}
      height="160" 
      frameBorder="0" 
      allowFullScreen={false} 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy">
    </iframe>
    <iframe // this is the actual iframe that will show up
      className="rounded-xl"
      src={`https://open.spotify.com/embed/track/${songId.replace("spotify:track:", "")}?utm_source=generator`}
      width={'100%'}
      height="160" 
      frameBorder="0" 
      allowFullScreen={false} 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy">
    </iframe>
  </div>
}



type TrackAddedByOptionsProps = { options: Track.addedBy.data }
function TrackAddedByOptions({ options, selectedAnswer, setAnswerForTrack, locked }) {
  return <div className="grid gap-5">
    <Option option={options[0]} selectedAnswer={selectedAnswer} selectAnswer={() => setAnswerForTrack(options[0]?.name)} />
    <Option option={options[1]} selectedAnswer={selectedAnswer} selectAnswer={() => setAnswerForTrack(options[1]?.name)} />
    <Option option={options[2]} selectedAnswer={selectedAnswer} selectAnswer={() => setAnswerForTrack(options[2]?.name)} />
  </div>
}


function Option({ option, selectedAnswer, selectAnswer, locked }) {
  if (!option) return <></>
  // const backgroundColor = (!locked && selectedAnswer == option.name)
  const selectedClassName = selectedAnswer == option.name ? "bg-neutral-500/50" : ""
  return <div className={`flex p-5 cursor-pointer rounded-xl border border-dashed border-neutral-500 ${selectedClassName} outline-offset-4 outline-neutral-300 hover:outline`} onClick={selectAnswer}>
    <img className="w-10 h-10 rounded-xl align-middle	" src={option.avatar.sources[0].url} />
    <span className="leading-10 ps-5 text-center">{option.name}</span>
  </div>
  
}