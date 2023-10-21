"use client";

import React, { useEffect, useState } from "react";
import "./ani.css";
import $ from "jquery";
import Image from "next/image";

const Cardanimate = ({ cardsInfo, seeplayingcard }) => {
  const [seconds, setSeconds] = useState(10);
  const [cardSet, setCardSet] = useState([
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.21081363343490467,
    },
    {
      type: "spade",
      rank: 12,
      name: "Q",
      priority: 12,
      id: 0.14114671092268027,
    },
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.7452767598946419,
    },
  ]);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (seconds > 0) {
  //       setSeconds(seconds - 1);
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [seconds]);
  const [isFlipped, setIsFlipped] = useState(
    Array(cardsInfo?.length).fill(false)
  );

  const toggleAllCards = () => {
    setIsFlipped((prevIsFlipped) =>
      prevIsFlipped.map((_) => !prevIsFlipped[0])
    );
  };

  console.log("seeplaying", seeplayingcard, cardsInfo);
  return (
    <>
     {!cardsInfo ? ( 
        <div className="container  item-center z-[100]">
          <div className="relative  left-14 w-[8%] m-auto items-center">
            <Image
              src={"/assets/Game-table/Backcard.svg"}
              alt="Backcard"
              width={100}
              height={100}
            />
          </div>
        </div>
      ) : (
        <div className="container z-[201]">
          {cardsInfo?.length > 0 &&
            cardsInfo?.map((el, index) => {
              
              return (
                <div
                  key={el.id}
                  className={`card  xs:h-[2.2rem] xs:w-[1.6rem] ${
                    isFlipped[index] ? "flipped" : ""
                  } 
                 ${
                   index == 0
                     ? " border-black transform rotate-[-30deg] relative left-[16%] top-1"
                     : ""
                 }
                  ${
                    index == 1
                      ? " border-blue-700 transform rotate-[-5deg] relative left-[12%]"
                      : ""
                  }
                   ${
                     index == 2
                       ? " border-yellow-500 transform rotate-[16deg] relative left-[8%]"
                       : ""
                   }

                `}
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
      )}
    </>
  );
};

export default Cardanimate;
