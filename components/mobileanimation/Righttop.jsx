"use client";

import React, { useEffect, useState } from "react";
import "./righttop.css";
import Image from "next/image";

const Righttop = ({ cardsInfo }) => {
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

  return (
    <>
      {!cardsInfo ? (
        <div className="">
          <div className="relative  mt-[-20%] right-[60%]  w-[75%] m-auto items-center">
            <Image
              src={"/assets/Game-table/righttopcard.svg"}
              alt="Backcard"
              width={200}
              height={200}
            />
          </div>
        </div>
      ) : (
        <div className="containerrighttop right-32 top-[-.5rem]">
          {cardsInfo?.length > 0 &&
            cardsInfo?.map((el, index) => {
              return (
                <div
                  key={el.id}
                  className={`cardrighttop xs:h-[2.2rem] xs:w-[1.6rem] ${
                    isFlipped[index] ? "flipped" : ""
                  } 
                 ${
                   index == 0
                     ? " border-black transform rotate-[-30deg] relative left-[14%] top-1"
                     : ""
                 }
                  ${
                    index == 1
                      ? " border-blue-700 transform rotate-[-5deg] relative left-[11%]"
                      : ""
                  }
                   ${
                     index == 2
                       ? " border-yellow-500 transform rotate-[18deg] relative left-[9%]"
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

export default Righttop;
