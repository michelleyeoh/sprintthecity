"use client";
import { Typewriter } from "react-simple-typewriter";
import { LiaRunningSolid } from "react-icons/lia";


export default function Home() {
  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <main className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col md:flex-row justify-center gap-8">
        
          <div className="text-left min-w-[500px]">
            <h1 className="font-serif text-black text-xl md:text-6xl pb-2">
              Sprint the City ✈︎
            </h1>
            <h1 className="font-serif text-black text-base md:text-4xl">
              How much of{" "}
              <span style={{ color: "#5b0f00", fontWeight: "bold" }}>
                <Typewriter
                  words={[
                    "Los Angeles",
                    "San Diego",
                    "Seattle",
                    "San Francisco",
                    "New York City",
                  ]}
                  loop={5}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={80}
                  delaySpeed={2000}
                />
              </span>
              <br />
              have you explored?
            </h1>
            <br />
            
          </div>
          <button className="bg-[#5b0f00] flex flex-col items-center justify-center font-serif text-white px-4 py-2 rounded-xl hover:bg-[#310000] transition-colors duration-300">
            <a href="/sprint">Sprint</a>
            <LiaRunningSolid />
          </button>
        </div>
      </main>
    </div>
  );
}
