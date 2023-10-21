"use client";

import React, { useEffect, useState } from "react";
import "./ani.css";



const MaalCard = () => {
  const [seconds, setSeconds] = useState(10);
  const [cardSet, setCardSet] = useState([
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.21081363868686,
    }
  
  ]);

  const [isFlipped, setIsFlipped] = useState(
    Array(cardSet?.length).fill(false)
  );

  const toggleAllCards = () => {
    setIsFlipped((prevIsFlipped) =>
      prevIsFlipped.map((_) => !prevIsFlipped[0])
    );
  };



  return (
    <>
      <div className="w-[100vw]  m-auto">
        <div className="Maalcontainer w-lg sm:w-xl md:w-mxl lg:w-[1660px] flex h-25">
          {cardSet.length > 0 &&
            cardSet.map((el, index) => {
              const rightOffset = index * 1.1 + 1.6; // Adjust these values as needed

              return (
                <div
                  key={el.id}
                  className={`maalcard   transform rotate-[-30deg] relative border-blue-700 
                 h-[6rem] w-[4.2rem] ${isFlipped[index] ? "flipped" : ""}
                  
                  `}
                  // style={{ right: `${rightOffset}rem` }}
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
      </div>
    </>
  );
};

export default MaalCard;
