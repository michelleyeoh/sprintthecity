'use client'
import { Typewriter } from 'react-simple-typewriter'

export default function Home() {
  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <main className="flex flex-col items-center justify-center h-screen">
        <div className="text-left max-w-[550px]">
          <h1 className="font-serif text-black text-6xl pb-2">Sprint the City ✈︎</h1>
          <h1 className="font-serif text-black text-4xl">
            How much of{" "}
            <span style={{ color: '#5b0f00', fontWeight: 'bold' }}>
            <Typewriter
              words={['Los Angeles', 'San Diego', 'Seattle', 'San Francisco', 'New York City']}
              loop={5}
              cursor
              cursorStyle='|'
              typeSpeed={100}
              deleteSpeed={80}
              delaySpeed={2000}
            />
          </span>
          <br/>
            have you explored?
          </h1>
          {/* <p className="font-serif text-black">Login today to find out!</p> */}
        </div>
      </main>
    </div>
  );
}
