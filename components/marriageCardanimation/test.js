"use client";

import React, { useEffect, useState } from "react";
import "./ani.css";

const MarriageCard = () => {
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
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.7452767598946419,
    },
  ]);

  const [isFlipped, setIsFlipped] = useState(
    Array(cardSet?.length).fill(false)
  );

  const toggleAllCards = () => {
    setIsFlipped((prevIsFlipped) =>
      prevIsFlipped.map((_) => !prevIsFlipped[0])
    );
  };

  // console.log("seeplaying", seeplayingcard, cardsInfo);

  return (
    <>
      <div className=" w-[100vw]  m-auto ">
        <div className="marriagecontainer w-lg sm:w-xl md:w-mxl lg:w-[1660px] flex   h-25 ">
          {cardSet?.length > 0 &&
            cardSet?.map((el, index) => {
              return (
                <div
                  key={el.id}
                  className={`marrigecard
                   relative 
                   border-blue-900
                h-[6rem] w-[5rem]  ${isFlipped[index] ? "flipped" : ""} 
                ${index == 0 ? " border-black " : ""}
                  :     
                    ${
                      index == 1
                        ? " relative right-5  z-[100]  border-blue-900 "
                        : ""
                    }
                     ${
                       index == 2
                         ? " relative right-[2.7rem] z-[100]  border-blue-700 "
                         : ""
                     }
                      ${
                        index == 3
                          ? " relative right-[3.8rem] z-[100]  border-blue-700 "
                          : ""
                      }
                       ${
                         index == 4
                           ? " relative right-[5rem] z-[100]  border-blue-700 "
                           : ""
                       }
                        ${
                          index == 5
                            ? " relative right-[6.4rem] z-[100]  border-blue-700 "
                            : ""
                        }
                         ${
                           index == 6
                             ? " relative right-[7.6rem] z-[100]  border-blue-700 "
                             : ""
                         }
                          ${
                            index == 7
                              ? " relative right-[8.8rem] z-[100]  border-blue-700 "
                              : ""
                          }
                           ${
                             index == 8
                               ? " relative right-[10.2rem] z-[100]  border-blue-700 "
                               : ""
                           }
                            ${
                              index == 9
                                ? " relative  right-[11.5rem] z-[100]  border-blue-700 "
                                : ""
                            }
                             ${
                               index == 10
                                 ? " relative right-[13rem] z-[100]  border-blue-700 "
                                 : ""
                             }
                              ${
                                index == 11
                                  ? " relative right-[14.5rem] z-[100]  border-blue-700 "
                                  : ""
                              }
                     ${
                       index == 12
                         ? " relative  right-[15.6rem] z-[100]  border-blue-700 "
                         : ""
                     }
                      ${
                        index == 13
                          ? " relative  right-[16.7rem] z-[100]  border-blue-700 "
                          : ""
                      }
                       ${
                         index == 14
                           ? " relative  right-[18.2rem] z-[100]   border-blue-700 "
                           : ""
                       }
                        ${
                          index == 15
                            ? " relative right-[19.5rem] z-[100]   border-blue-700 "
                            : ""
                        }
                         ${
                           index == 16
                             ? " relative  right-[21rem] z-[100]   border-blue-700 "
                             : ""
                         }
                        
                          ${
                            index == 17
                              ? " relative right-[22.2rem] z-[100]  border-blue-700 "
                              : ""
                          }
                           ${
                             index == 18
                               ? " relative right-[23.5rem] z-[100]  border-blue-700 "
                               : ""
                           }
                            ${
                              index == 19
                                ? " relative right-[25rem]  z-[100]  border-blue-700 "
                                : ""
                            }
                             ${
                               index == 20
                                 ? " relative  right-[26rem] z-[100]  border-blue-700 "
                                 : ""
                             }
                              ${
                                index == 21
                                  ? " relative right-[26rem]  z-[100]  border-blue-700 "
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
      </div>
    </>
  );
};

export default MarriageCard;
