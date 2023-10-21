import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Winnercards from "@/components/Winnercard/Winnercards";
import MaalCard from "@/components/Winnercard/MaalCard";

const Marriagecardwinner = ({ winners }) => {
  let maxPointsPlayer = null;
  let maxPoints = -Infinity;

  for (const playerId in winners) {
    if (winners.hasOwnProperty(playerId)) {
      const player = winners[playerId];
      if (player.point > maxPoints) {
        maxPoints = player.point;
        maxPointsPlayer = player;
      }
    }
  }

  console.log("Player with max points:", maxPointsPlayer);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-[#111111] opacity-50"></div>
      <div>
        <div>
          <div
            className={`w-[80%] border-8 border-yellow-500
            rounded-t-lg 
             
            sm:w-[80%] md:w-[60%] lg:w-[50%] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-Background z-[100]`}
          >
            <div className="winner rounded-t-lg h-[55vh] modal bg-[url('/assets/marriage/imagebackground.svg')]  bg-center bg-no-repeat">
              {/* Content */}
              <div className="w-[90%] m-auto">
                <Image
                  src={
                    "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/game/winning.gif"
                  }
                  alt="win GIF"
                  width={200}
                  height={200}
                  className=" absolute w-[100%] m-auto  h-full bottom-0 z-1"
                />
              </div>

              <div className=" w-[50%] m-auto relative top-[-2rem] sm:top-[-2.2rem] flex items-center border-red-600">
                <Image
                  src={"/assets/marriage/youwin.svg"}
                  width={400}
                  height={200}
                  className="item-center "
                />
              </div>

              {/*** user winner image */}

              <div
                className="border-4 rounded-full  w-[12%] sm:w-[18%] 
              m-auto relative top-[-2.2rem]  flex items-center border-yellow-600"
              >
                <Image
                  // src={"/assets/marriage/player-1.svg"}
                  src={maxPointsPlayer?.playerInfo?.avatar}
                  width={100}
                  height={100}
                  className="item-center "
                />
              </div>

              {/**  */}

              <div
                className=" w-[30%] sm:w-[50%] m-auto relative
                top-[-5.2rem] sm:top-[-5rem] md:top-[-6rem]  lg:top-[-7rem]
                 flex items-center border-red-600"
              >
                <Image
                  src={"/assets/marriage/congrulations.svg"}
                  width={400}
                  height={100}
                  className="item-center z-[100]"
                />
              </div>

              {/** Card show winner */}
              <div
                className=" w-[90%] sm:w-[80%] h-[20vh]  sm:h-[15vh] m-auto
                relative top-[-5rem]
                 sm:top-[-7rem] md:top-[-8.9rem] 
              border-red-800 flex "
              >
                <div
                  className=" h-[20vh] border border-yellow-400  sm:h-[12vh] bg-winnercolor 
                rounded-lg w-[80%] m-auto"
                >
                  <Winnercards winner={maxPointsPlayer?.dirtCard} />
                </div>

                <div
                  className=" border border-yellow-400  h-[20vh] sm:h-[12vh] 
                w-[12%] flex items-center align-center bg-winnercolor rounded-lg m-auto"
                >
                  <MaalCard />
                </div>
              </div>

              {/** Quit and  start new game   */}
              <div
                className=" w-[60%] py-2 px-2 m-auto mt-3 sm:mt-0 
              relative top-[-5rem] sm:top-[-6rem] md:top-[-9.3rem]  flex justify-between border-red-700"
              >
                <div
                  className="py-2  px-8  text-center 
                item-center rounded-md border border-Secondary "
                >
                  <p
                    className="text-center text-sm text-Secondary m-auto  
                  item-center"
                  >
                    Quit
                  </p>
                </div>
                <div
                  className="py-2  px-8 
                  text-white custom-gradient text-center item-center
                   rounded-md border border-Secondary "
                >
                  <p
                    className="text-center  text-sm sm:text-sm 
                    text-white m-auto  item-center"
                  >
                    New Game
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marriagecardwinner;
