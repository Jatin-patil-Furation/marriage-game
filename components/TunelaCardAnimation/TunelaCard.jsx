"use client";
import React, {useState } from "react";
import "./ani.css";
import { TunelaCarddata } from "./Cardtun";

console.log("TunelaCard", TunelaCarddata[0].card);
console.log("2", TunelaCarddata[0].card2);


const TunelaCard = () => {

  const [cardSet, setCardSet] = useState([
    {
      type: "spade",
      rank: 2,
      name: "2",
      priority: 2,
      id: 0.9868688996868,
    },
    {
      type: "spade",
      rank: 3,
      name: "3",
      priority: 3,
      id: 0.896861118585,
    },
    {
      type: "spade",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.6811196868,
    },
  ]);

  
    console.log("cradset", cardSet);
    


  return (
    <>
      <div className=" m-auto">
        <div
          className="Tunelacontainer flex
               flex-col h-25"
        >
          {TunelaCarddata.map((set, setIndex) => {
            return Object.values(set).map((cardSet, cardSetIndex) => (
              <div
                className={` border-red-800 
                 flex mt-2
              TunelacardSet-${setIndex}`}
                key={cardSetIndex}
              >
                {cardSet.map((el, index) => {
                  const rightOffset = index * 0.2 + 1;

                  return (
                    <div
                      key={el.id}
                      className={`Tunelacard relative
                       border-blue-700 h-[1.5rem] w-[2rem]`}
                      style={{
                        right: `${rightOffset}rem`,
                      }}
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
            ));
          })}
        </div>
      </div>
    </>
  );
};

export default TunelaCard;

{
  /**<div className="m-auto">
        <div className="Tunelacontainer flex h-25">

          {TunelaCarddata.map((set, setIndex) => {
            return Object.values(set).map((cardSet, cardSetIndex) => (
              <div className={`border-2  TunelacardSet-${setIndex}`} key={cardSetIndex}>
                {cardSet.map((el, index) => {
                  const rightOffset = index * 0.51 + 1;

                  return (
                    <div
                      key={el.id}
                      className={`Tunelacard relative border-blue-700 h-[2rem] w-[3rem]`}
                      // style={{
                      //   right: `${rightOffset}rem`,
                      // }}
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
            ));
          })}
        </div>
      </div> */
}

//  const uniqueCardTypes = Array.from(new Set(cardSet.map((card) => card.type)))

// const [uniqueCardSet, setUniqueCardSet] = useState(uniqueCardTypes);

// // Now uniqueCardSet contains an array of unique card types
// console.log("Unique Card Types:", uniqueCardSet);

// const uniqueCards = cardSet.reduce((unique, card) => {
//   const isUnique = !unique.some(
//     (c) => c.type === card.type && c.name === card.name
//   );
//   return isUnique ? [...unique, card] : unique;
// }, []);
// console.log("Unique Cards:", uniqueCards);
// const uniqueCard = cardSet.reduce((unique, card) => {
//   if (!unique[card.type]) {
//     unique[card.type] = {};
//   }
//   unique[card.type][card.name] = card;
//   return unique;
// }, {});

// console.log("Unique Cards:", uniqueCard);
//  <div className="  m-auto">
//    <div className="Tunelacontainer flex h-25">
//      {cardSet.length > 0 &&
//        cardSet.map((el, index) => {
//          const rightOffset = index * 0.51 + 1;
//          return (
//            <div
//              key={el.id}
//              className={`Tunelacard relative border-blue-700 
//                   h-[2rem] w-[3rem] `}
//              style={{
//                right: `${rightOffset}rem`,
//              }}
//              data-suite={el.type}
//              data-value={el.name}
//            >
//              <div className="front">
//                <span></span>
//                <span></span>
//              </div>
//              <div className="back"></div>
//            </div>
//          );
//        })}
//    </div>
//  </div>;
