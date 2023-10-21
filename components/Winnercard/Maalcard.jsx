"use client";

import React, { useState } from "react";
import "./maal.css";

const MaalCard = () => {

  const [cardSet, setCardSet] = useState([
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.21081363868686,
    },
  ]);

  return (
    <>
      <div className=" flex items-center m-auto">
        <div className="Maalcontainer w-[100%] m-auto  h-25">
          {cardSet.length > 0 &&
            cardSet.map((el, index) => {
              return (
                <div
                  key={el.id}
                  className={`maalcard  relative m-auto border-blue-700 
                h-[3rem] w-[2.2rem]
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
      </div>
    </>
  );
};

export default MaalCard;
