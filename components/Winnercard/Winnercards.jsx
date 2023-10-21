"use client";
import React, { useState } from "react";
import "./winner.css";
import { TunelaCarddata } from "./Cardtun";

const Winnercards = ({ winner }) => {
  return (
    <>
      <div className="px-2  w-[90%] sm:w-[80%] flex items-center ">
        <div
          className="Winnercontainer w-[90%] sm:w-[70%]  m-auto flex
                h-25"
        >
          {winner.map((set, setIndex) => (
            <div
              className={`border-red-800 flex mt-2 TunelacardSet-${setIndex}`}
              key={setIndex}
            >
              {set.map((el) => {
                const rightOffset = el.id * 0;
                1.2 + 1;

                return (
                  <div
                    key={el.id}
                    className={`winnercard relative
                       border-blue-700 h-[2.5rem] sm:h-[3rem] w-[2.2rem]`}
                    style={{ right: `${rightOffset}rem` }}
                    data-suite={el.type}
                    data-value={el.name}
                  >
                    <div className="front">
                      <span></span>
                      <span></span>
                    </div>
                    <div className="back"></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Winnercards;
