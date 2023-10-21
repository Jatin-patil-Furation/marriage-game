"use client";
import "./ani.css";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import "@/components/Marriagefron/single.css";
import "@/components/maalcard/maal.css";
import "@/components/marriageCardanimation/marriagecard.css";
import "@/components/TunelaCardAnimation/tunelacard.css";
import Marriagecardwinner from "@/components/modals/Marriagecardwinner";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";


const MarriagePage = () => {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [privateTableKey, setPrivateTableKey] = useState(null);
  const [Loggeduser, setLoggeduser] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [players, setPlayers] = useState(null);
  const [playerSlotIndex, setplayerSlotIndex] = useState(null);
  // const [cardSet, setCardSet] = useState(null);
  const [isShowButton, setIsShowButton] = useState(false);
  // const [MarraigeCard, SetMarraigeCardwinner] = useState(true);
  const [winners, setWinners] = useState(null);
  const playerId = useRef(null);
  const tableDetails = useRef(null);
  const tableCard = useRef(null);
  const stockCards = useRef(null);
  const playerData = useRef(null);
  const dispatch = useDispatch();
  const messagesRef = useRef(null);
  const socketRef = useRef(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [sentCards, setSentCards] = useState([]);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const Loggeduser = JSON.parse(localStorage.getItem("Loggeduser"));
    const privateTableKey = +JSON.parse(
      localStorage.getItem("privateTableKey")
    );
    const token = JSON.parse(localStorage.getItem("token"));
    console.log(token);
    setPrivateTableKey(() => privateTableKey);
    console.log(Loggeduser);
    setLoggeduser(() => Loggeduser);
    console.log(privateTableKey);
    console.log("connection start ");
    socketRef.current = io("https://marriage-socket.onrender.com/", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setIsSocketConnected(true);
      if (privateTableKey) {
        console.log("joining private invite key table");
        const data = {
          boot: 12000,
          key: privateTableKey,
        };
        socketRef.current.emit("private", data);
      } else {
        console.log("joining public table");
        socketRef.current.emit("public");
      }
      socketRef.current.emit("joinTable", {
        displayName: Loggeduser?.name,
        userName: Loggeduser?.name,
        chips: 2499000,
        guid: tableId,
        _id: Loggeduser?.id,
        fees: 0,
        avatar: Loggeduser?.avatar,
        isAdmin: Loggeduser?.isAdmin,
        id: socketId,
        token: token,
        gamesLost: Loggeduser?.gamesLost,
        gamesWon: Loggeduser?.gamesWon,
        totalGamesPlayed: Loggeduser?.totalGamesPlayed,
      });
      socketRef.current.on("joinTable", (data) => {
        console.log(data);
        setplayerSlotIndex(() => data?.slot?.split("slot")[1]);
        if (data?.msg)
          setMessages((prevMessages) => [...prevMessages, data?.msg]);
      });
      socketRef.current.on("thrownCard", (data) => {
        console.log(data);
        playerData.current = data?.players?.[playerId.current];
        setPlayers(() => data?.players);
        tableDetails.current = data?.table;
        tableCard.current = data?.tableCard;
        stockCards.current = data?.stockCards;
        if (data?.msg)
          setMessages((prevMessages) => [...prevMessages, data?.msg]);
      });
      socketRef.current.on("connectionSuccess", (data) => {
        console.log(data);
        playerId.current = data?.id;
        setSocketId(data.id);
        setTableId(data.tableId);
      });
      socketRef.current.on("notification", (data) => {
        console.log(data);
      });
      socketRef.current.on("gameCountDown", (data) => {
        console.log(data);
      });
      socketRef.current.on("startNew", (data) => {
        console.log(data);
        console.log(playerId.current);
        console.log(data?.players?.[playerId.current]);
        playerData.current = data?.players?.[playerId.current];
        setPlayers(() => data?.players);
        tableDetails.current = data?.table;
        tableCard.current = data?.tableCard;
        stockCards.current = data?.stockCards;
        setWinners(null);
      });

      socketRef.current.on("resetTable", (data) => {
        console.log(data);
        if (data?.msg)
          setMessages((prevMessages) => [...prevMessages, data?.msg]);
      });
      socketRef.current.on("drownCard", (data) => {
        console.log(data);
        setPlayers(data?.players);
        playerData.current = data?.players?.[playerId.current];
        console.log(data?.players?.[playerId.current]);
        if (data?.msg)
          setMessages((prevMessages) => [...prevMessages, data?.msg]);
      });
      socketRef.current.on("throwCard", (data) => {
        console.log(data);
        if (data?.msg)
          setMessages((prevMessages) => [...prevMessages, data?.msg]);
      });

      socketRef.current.on("cardShown", (data) => {
        console.log(data);
        if (!data?.isValid) {
          setSentCards(null);
        }
        setPlayers(data?.players);
        if (data?.msg)
          setMessages((prevMessages) => [...prevMessages, data?.msg]);
      });
      socketRef.current.on("wrongCard", (data) => {
        console.log(data);
        sentCards(null);
        if (data?.msg)
          setMessages((prevMessages) => [...prevMessages, data?.msg]);
      });

      socketRef.current.on("showWinner", (data) => {
        console.log(data);
        setWinners(data?.winners);
        setSentCards(null);
        setSelectedCards(null);
        setMessages([]);
        if (data?.msg)
          setMessages((prevMessages) => [...prevMessages, data?.msg]);
      });
    });

    return () => {
      socketRef.current.on("disconnect", () => {
        setIsSocketConnected(false);
        console.log("disconected");
      });
    };
  }, []);

  let slotPlayerMap = {};

  if (players) {
    for (const playerKey in players) {
      const player = players[playerKey];
      const slot = player?.slot?.replace("slot", ""); // Extract the numeric part
      slotPlayerMap[slot] = player;
    }
  }
  console.log(playerData.current, playerSlotIndex);
  console.log(slotPlayerMap);
  console.log(
    slotPlayerMap?.[playerSlotIndex]?.turn,
    !slotPlayerMap?.[playerSlotIndex]?.isDraw
  );
  const handleCardDrownFromDeck = () => {
    if (isSocketConnected) {
      console.log("get card from deck");
      socketRef.current.emit("drawStockCard", {
        id: playerId.current,
      });
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };
  const handleCardDrownFromStock = () => {
    if (isSocketConnected) {
      console.log("get card from stock");

      socketRef.current.emit("drawTableCard", {
        id: playerId.current,
      });
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };
  const handleCardThrow = (card) => {
    if (isSocketConnected) {
      console.log(card);
      console.log(playerData.current);
      console.log(slotPlayerMap?.[playerSlotIndex]?.handSet);
      const newHandSet = slotPlayerMap?.[playerSlotIndex]?.handSet?.filter(
        (cards) => deepEqual(cards, card)
      );
      socketRef.current.emit("throwCard", {
        id: playerId.current,
        card: card,
        handCard: newHandSet,
      });
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };

  const handleCardClick = (data, selectedSet) => {
    if (selectedSet === "selectedCards") {
      handleSelection(data, selectedCards, setSelectedCards);
    }
  };
  console.log("slectedcard", selectedCards);
  const handleSelection = (data, selected, setSelected) => {
    if (selected.some((selectedData) => selectedData.id === data.id)) {
      setSelected(
        selected.filter((selectedData) => selectedData.id !== data.id)
      );
    } else {
      setSelected([...selected, data]);
    }
  };

  const handleSendToBackend = (selected) => {
    setSentCards([...sentCards, ...selectedCards]);
    console.log(sentCards, selectedCards);

    console.log(slotPlayerMap?.[playerSlotIndex]);
    if (isSocketConnected) {
      console.log(slotPlayerMap?.[playerSlotIndex]);
      socketRef.current.emit("showCard", {
        id: playerId.current,
        pureRound: slotPlayerMap?.[playerSlotIndex]?.pureRound,
        cardSets: selectedCards,
        maalSeen: slotPlayerMap?.[playerSlotIndex]?.maalSeen,
      });
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }

    // Clear the selected state depending on which set of cards is being sent
    if (selected === "selectedCards") {
      setSelectedCards([]);
    }
  };

  const handleCardCancel = () => {
    setSentCards([]);
    setSelectedCards([]);
    setIsShowButton(() => false);
  };

  function deepEqual(objA, objB) {
    return JSON.stringify(objA) !== JSON.stringify(objB);
  }
  console.log("sentcard", sentCards);
  console.log("setSlected card", selectedCards);

  const ToggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const toggleDropDown = () => {
    setShowDropDown((prev) => !prev);
  };
  console.log(isShowButton);
  const cardArray = slotPlayerMap?.[playerSlotIndex]?.handSet;
  cardArray?.sort((a, b) => {
    // Check for "Joker" and "Master" cards
    if (a.type === "joker" || a.type === "master") {
      return 1; // Move "Joker" and "Master" to the end
    }
    if (b.type === "joker" || b.type === "master") {
      return -1; // Move "Joker" and "Master" to the end
    }

    // Sort by "rank" and then by "type"
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    } else {
      return a.rank - b.rank;
    }
  });
  

  console.log(slotPlayerMap?.[playerSlotIndex]);
  console.log(
    slotPlayerMap?.[playerSlotIndex]?.turn,
    !slotPlayerMap?.[playerSlotIndex]?.isDraw
  );
  console.log(messages);
  console.log(winners);
  let displayNameOfTurnedObject = null;

  for (const key in slotPlayerMap) {
    if (slotPlayerMap.hasOwnProperty(key) && slotPlayerMap[key].turn === true) {
      displayNameOfTurnedObject = slotPlayerMap[key].playerInfo.displayName;
      break; // Exit the loop once found
    }
  }
  return (
    <>
      <div
        className="min-h-screen bg-black w-[100%] m-auto 
      relative  font-roboto  bg-[url('/assets/landingPage/sikkaplaybg.svg')] 
      bg-cover bg-no-repeat   
      overflow-y-clip mx-auto"
      >
        {/** Navbar */}
        <div className="teen-patti-navbar  flex justify-between w-[80%] mx-auto ">
          <div className="left-container flex justify-between items-center gap-7 ">
            <div
              className="img-containe cursor-pointer"
              onClick={() => (window.location.href = "/dashboard")}
            >
              <img
                src={"/assets/Game-table/arrow-left.svg"}
                alt="left-arrow"
                className="w-[90%]"
                width={50}
                height={50}
              />
            </div>

            <button className="relative custom-gradient px-5 py-1">
              <img
                src={"/assets/Game-table/red-chip.svg"}
                alt="left-arrow"
                className="absolute  w-[30%] left-[-15%] top-[-2%]"
                width={50}
                height={50}
              />
              <p className="text-xs text-white">Buy Coins</p>
            </button>
          </div>
          {displayNameOfTurnedObject && (
            <div className="text-xl text-Secondary">
              {displayNameOfTurnedObject + " having turn"}{" "}
            </div>
          )}
          <div className="right-container flex justify-between gap-2">
            
            <div onClick={() => setBlockPlayerModal(true)}>
              <img
                src={"/assets/Game-table/info-tag.svg"}
                alt="Info-tag"
                width={50}
                height={50}
                className="w-full cursor-pointer "
              />
            </div>
          </div>
        </div>
        {/***  side chat and Tables */}
        <div
          className=" px-2 mt-10 w-[100%] 
        flex justify-between gap-5 "
        >
          <div
            ref={messagesRef}
            className="
            overflow-hidden
          px-2 py-2 h-[72vh] w-[18.6%] m-auto scrollbar-none overflow-y-scroll "
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className="border-2 px-2 py-1 bg-green-800 border-dashed border-yellow-400 rounded-lg"
              >
                <p className="text-white">{msg}</p>
              </div>
            ))}
          </div>

          <div
            className="  text-white  relative  w-[90%] 
            space-y-10 mx-auto py-3 max-w-7xl"
          >
            {/* table */}
            <div className="border-yellow-800 h-[76%] w-[100%]">
              <div
                className=" Img-container absolute left-1/2 top-1/2 
                transform -translate-x-1/2 -translate-y-1/2 w-[75vw] 
                sml:w-[65vw] xl:w-[62vw] 2xl:w-[70vw]    max-w-7xl "
              >
                {/**table   sit background */}
                <div
                  className="relative m-auto 
                border-red-800 w-full h-full"
                >
                  <img
                    src={"/assets/marriage/Group-201.svg"}
                    alt="table"
                    width={700}
                    height={400}
                    className="w-full h-full lg:w-[80%] m-auto z-[50] "
                  />

                  {/* left- top*/}
                  <div
                    className="absolute left-[20%] lg:left-[20%]
                   2xl:left-[18%] top-[-.5rem] 2xl:top-[-1rem] 
                   transform -translate-x-1/2 -translate-y-1/2 w-[30%] 
                   lg:w-[30%] 2xl:w-[25%]   h-[50%] md:h-[40%] 2xl:h-[30%] my-3  "
                  >
                    <div className="relative w-full h-full">
                      <div className="relative w-[40%]  border-green-800 ml-auto flex flex-col items-center gap-3 mr-2  ">
                        <p className="text-xs text-center lg:text-sm">
                          {
                            slotPlayerMap?.[(+playerSlotIndex + 3) % 5 || 5]
                              ?.playerInfo.userName
                          }
                        </p>
                        <div className="relative  border-red-700">
                          <div
                            className={`w-14 h-14 lg:w-18 lg:h-18   mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden `}
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 3) % 5 || 5]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          ></div>

                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {/**tunela card / winner card */}
                        <div className=" relative left-28 top-[-5rem] ">
                          <div className=" m-auto">
                            <div className="Tunelacontainer flex flex-col h-25">
                              {slotPlayerMap?.[(+playerSlotIndex + 3) % 5 || 5]
                                ?.setCount === 3 &&
                                slotPlayerMap?.[
                                  (+playerSlotIndex + 3) % 5 || 5
                                ]?.primarySet.map((set, setIndex) => (
                                  <div
                                    className={`border-red-800 flex mt-2 TunelacardSet-${setIndex}`}
                                    key={setIndex}
                                  >
                                    {set.map((el) => {
                                      const rightOffset = el.id * 0.2 + 1;

                                      return (
                                        <div
                                          key={el.id}
                                          className={`Tunelacard relative border-blue-700 h-[1.5rem] w-[2rem]`}
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
                        </div>
                        {/**tunela card / winner card */}
                      </div>
                    </div>
                  </div>

                  {/* left- middle*/}
                  <div
                    className="absolute left-[3rem]  top-[40%] transform -translate-x-1/2 -translate-y-1/2 
                  w-[30%] lg:w-[30%] 2xl:w-[25%]   h-[40%] 2xl:h-[30%] my-3  "
                  >
                    <div className="relative w-full h-full flex flex-col items-center gap-4 ">
                      <div className="relative w-[50%]  flex flex-col items-center gap-3   ">
                        <p className="text-sm text-center lg:text-base">
                          {
                            slotPlayerMap?.[(+playerSlotIndex + 4) % 5 || 5]
                              ?.playerInfo.userName
                          }
                        </p>

                        <div className="relative  border-red-700 ">
                          <div
                            className="w-14 h-14 lg:w-18 lg:h-18 mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 4) % 5 || 5]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          ></div>

                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {/**tunela card / winner card */}
                        <div className=" relative left-28 top-[-6rem] ">
                          <div className=" m-auto">
                            <div className="Tunelacontainer flex flex-col h-25">
                              {slotPlayerMap?.[(+playerSlotIndex + 4) % 5 || 5]
                                ?.setCount === 3 &&
                                slotPlayerMap?.[
                                  (+playerSlotIndex + 4) % 5 || 5
                                ]?.primarySet?.map((set, setIndex) => (
                                  <div
                                    className={`border-red-800 flex mt-2 TunelacardSet-${setIndex}`}
                                    key={setIndex}
                                  >
                                    {set.map((el) => {
                                      const rightOffset = el.id * 0.2 + 1;

                                      return (
                                        <div
                                          key={el.id}
                                          className={`Tunelacard relative border-blue-700 h-[1.5rem] w-[2rem]`}
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
                        </div>
                        {/**tunela card / winner card */}
                      </div>
                    </div>
                  </div>

                  {/* right- top*/}
                  <div
                    className="absolute  right-[-7rem]  top-[-.5rem] 2xl:top-[-1rem] transform -translate-x-1/2
                   -translate-y-1/2 w-[30%] lg:w-[30%] 2xl:w-[25%]   h-[50%] md:h-[40%] 2xl:h-[30%] my-3  "
                  >
                    <div className="relative w-full h-full">
                      <div className="relative w-[50%]  mr-auto flex flex-col items-center gap-3 ml-2  ">
                        <p className="text-xs text-center lg:text-sm">
                          {
                            slotPlayerMap?.[(+playerSlotIndex + 2) % 5 || 5]
                              ?.playerInfo.userName
                          }
                        </p>
                        <div className="relative  border-red-700">
                          <div
                            className="w-14 h-14 lg:w-18 lg:h-18 mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 2) % 5 || 5]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          ></div>

                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {/**tunela card / winner card */}
                        <div className=" relative right-20  top-[-5rem] ">
                          <div className=" m-auto">
                            <div className="Tunelacontainer flex flex-col h-25">
                              {slotPlayerMap?.[(+playerSlotIndex + 2) % 5 || 5]
                                ?.setCount === 3 &&
                                slotPlayerMap?.[
                                  (+playerSlotIndex + 2) % 5 || 5
                                ]?.primarySet?.map((set, setIndex) => (
                                  <div
                                    className={`border-red-800 flex mt-2 TunelacardSet-${setIndex}`}
                                    key={setIndex}
                                  >
                                    {set.map((el) => {
                                      const rightOffset = el.id * 0.2 + 1;

                                      return (
                                        <div
                                          key={el.id}
                                          className={`Tunelacard relative border-blue-700 h-[1.5rem] w-[2rem]`}
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
                        </div>
                        {/**tunela card / winner card */}
                      </div>
                    </div>
                  </div>

                  {/* right- middle*/}

                  <div className="absolute  right-[-12rem] mxl:right-[-17rem] top-[40%] transform -translate-x-1/2 -translate-y-1/2 w-[35%] lg:w-[30%] 2xl:w-[25%]   h-[40%] 2xl:h-[30%] my-3  ">
                    <div className="relative w-full h-full flex flex-col items-center gap-4 ">
                      <div className="relative w-[50%]  flex flex-col items-center gap-3   ">
                        <p className="text-sm text-center lg:text-base">
                          {
                            slotPlayerMap?.[(+playerSlotIndex + 1) % 5 || 5]
                              ?.playerInfo.userName
                          }
                        </p>
                        <div className="relative  border-red-700 ">
                          <div
                            className="w-14 h-14 lg:w-18 lg:h-18  mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 1) % 5 || 5]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          ></div>

                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {/**tunela card / winner card */}
                        <div className=" relative right-20  top-[-6rem] ">
                          <div className=" m-auto">
                            <div className="Tunelacontainer flex flex-col h-25">
                              {slotPlayerMap?.[(+playerSlotIndex + 1) % 5 || 5]
                                ?.setCount === 3 &&
                                slotPlayerMap?.[
                                  (+playerSlotIndex + 1) % 5 || 5
                                ]?.primarySet?.map((set, setIndex) => (
                                  <div
                                    className={`border-red-800 flex mt-2 TunelacardSet-${setIndex}`}
                                    key={setIndex}
                                  >
                                    {set.map((el) => {
                                      const rightOffset = el.id * 0.2 + 1;

                                      return (
                                        <div
                                          key={el.id}
                                          className={`Tunelacard relative border-blue-700 h-[1.5rem] w-[2rem]`}
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
                        </div>
                        {/**tunela card / winner card */}
                      </div>
                    </div>
                  </div>

                  {/* player */}
                  <div
                    className="absolute  border-red-900  
                    left-1/2 bottom-[-3rem] lg:bottom-[-1rem] 
                    mxl:bottom-[-2rem] transform 
                    -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="relative px-2 py-2  w-full h-full">
                      <img
                        src={Loggeduser?.avatar}
                        alt="avatar"
                        width={80}
                        height={80}
                        className={`w-28 h-28 lg:w-24 lg:h-24 mxl:w-40 mxl:h-40 2xl:w-44 2xl:h-44  rounded-full border-${"yellow-400"}  border-4 `}
                      />
                    </div>
                  </div>

                  {/**
                   *
                   *
                   */}
                  <div className=" relative left-40 top-[-5rem] ">
                    <div className=" m-auto">
                      <div className="Tunelacontainer flex flex-col h-25">
                        {slotPlayerMap?.[+playerSlotIndex % 5 || 5]
                          ?.setCount === 3 &&
                          slotPlayerMap?.[
                            +playerSlotIndex % 5 || 5
                          ]?.primarySet?.map((set, setIndex) => (
                            <div
                              className={`border-red-800 
                             flex mt-2 TunelacardSet-${setIndex}`}
                              key={setIndex}
                            >
                              {set.map((el) => {
                                const rightOffset = el.id * 0.2 + 1;

                                return (
                                  <div
                                    key={el.id}
                                    className={`Tunelacard  relative border-blue-700 h-[1.5rem] w-[2rem]`}
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
                  </div>

                  {/***  */}
                </div>
              </div>
            </div>
            {/** throw card */}
            <div
              className="absolute  w-[15rem] h-[30vh]
                    left-1/2 transform sm:bottom-[.5rem] md:bottom-[2rem]
                    -translate-x-1/2 -translate-y-1/2 z-[300]"
            >
              <div className="relative flex px-2 py-2">
                <div
                  className={` w-[6rem] h-[20vh]  `}
                  onClick={() => {
                    if (
                      slotPlayerMap?.[playerSlotIndex]?.turn &&
                      !slotPlayerMap?.[playerSlotIndex]?.isDraw
                    ) {
                      console.log("called");
                      handleCardDrownFromDeck();
                    }
                  }}
                >
                  <Image
                    src={"/assets/marriage/Backcard.svg"}
                    alt="Backcard"
                    width={60}
                    height={60}
                    className={`${
                      slotPlayerMap?.[playerSlotIndex]?.turn &&
                      !slotPlayerMap?.[playerSlotIndex]?.isDraw &&
                      " cursor-pointer "
                    }`}
                  />
                </div>
                <div
                  className={`w-[7rem] h-[20vh]`}
                  onClick={() => {
                    if (
                      slotPlayerMap?.[playerSlotIndex]?.turn &&
                      !slotPlayerMap?.[playerSlotIndex]?.isDraw
                    ) {
                      console.log("called");
                      handleCardDrownFromStock();
                    }
                  }}
                >
                  <div className="w-[100vw]  m-auto">
                    <div className="Singlecontainer w-lg sm:w-xl md:w-mxl lg:w-[1660px] flex h-25">
                      {tableCard.current?.length > 0 && (
                        <div
                          className={`marrigesingcard relative border-blue-700 
                          h-[5rem] w-[4rem] ${
                            slotPlayerMap?.[playerSlotIndex]?.turn &&
                            !slotPlayerMap?.[playerSlotIndex]?.isDraw &&
                            " cursor-pointer "
                          }
                      `}
                          data-suite={
                            tableCard.current?.[tableCard.current?.length - 1]
                              ?.type
                          }
                          data-value={
                            tableCard.current?.[tableCard.current?.length - 1]
                              ?.name
                          }
                        >
                          <div className="front">
                            <span></span>
                            <span></span>
                          </div>
                          <div className="back"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/**---------- Maaal card -------*/}
            <div
              className="absolute   w-[15rem] h-[30vh]
                     top-.1 sm:bottom-[.1rem] 
                    left-1/2 transform lg:bottom-[1rem] 
                    translate-x-1/2 -translate-y-1/2 z-[200]"
            >
              <div
                className="relative   
                    right-[20rem] flex items-center "
              >
                <div className="w-[100vw]  m-auto">
                  <div className="Maalcontainer w-lg sm:w-xl md:w-mxl lg:w-[1660px] flex h-25">
                    {slotPlayerMap?.[playerSlotIndex]?.maalSeen &&
                      slotPlayerMap?.[playerSlotIndex]?.maal && (
                        <div
                          className={`maalcard   transform rotate-[-30deg] relative border-blue-700 
                            h-[5rem] w-[4rem]`}
                          data-suite={
                            slotPlayerMap?.[playerSlotIndex]?.maal?.type
                          }
                          data-value={
                            slotPlayerMap?.[playerSlotIndex]?.maal?.name
                          }
                        >
                          <div className="front">
                            <span></span>
                            <span></span>
                          </div>
                          <div className="back"></div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            {/** playing Button */}
            <div
              className="relative top-[-3rem]  flex 
            justify-between px-2 sm:px-6 w-[100%] h-20 border-red-900"
            >
              <div className="px-2   sm:px-2  border-yellow-700 "></div>
              <div className=" px-4 sm:px-2  border-yellow-700">
                <div className=" h-20 border-yellow-700 ">
                  {isShowButton && (
                    <div
                      onClick={handleCardCancel}
                      className="py-2  px-2 flex cursor-pointer
                  text-white custom-gradient text-center item-center
                   rounded-md border border-Secondary "
                    >
                      <p
                        className="text-center  text-sm sm:text-sm 
                    text-white m-auto  item-center"
                      >
                        {"cancel cards"}
                      </p>
                    </div>
                  )}
                  <div
                    onClick={() => {
                      if (isShowButton) {
                        handleSendToBackend("selectedCards");
                      } else {
                        setIsShowButton(true);
                      }
                    }}
                    className="py-2 mt-1 px-2 flex cursor-pointer
                  text-white custom-gradient text-center item-center
                   rounded-md border border-Secondary "
                  >
                    <p
                      className="text-center text-sm text-white m-auto  
                  item-center"
                    >
                      {isShowButton ? "show cards" : "Show Seq"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/** Footer / Card showing  */}
        <div className=" mt-3 h-[20vh] ">
          <div className="w-[100vw]  m-auto">
            <div className="marriagecontainer w-lg sm:w-xl md:w-mxl lg:w-[1660px] flex h-25">
              {slotPlayerMap?.[playerSlotIndex]?.handSet?.length > 0 &&
                slotPlayerMap?.[playerSlotIndex]?.handSet?.map((el, index) => {
                  const rightOffset = index * 1.1 + 1.6; // Adjust these values as needed
                  const isSelected = selectedCards?.some(
                    (selectedData) => selectedData.id === el.id
                  );
                  const isActive = sentCards?.some(
                    (sentCard) => sentCard.id === el.id
                  );

                  const cardClassName = `marrigecard relative border-blue-700 
                  h-[5rem] w-[4rem] md:h-[6rem] md:w-[5rem] ${
                    index === 0 ? "left-[-.5rem]" : ""
                  }  ${isSelected ? "clicked selected" : ""}  ${
                    isActive ? "active" : ""
                  }`;

                  return (
                    <div
                      key={index}
                      className={cardClassName}
                      onClick={() => {
                        if (isShowButton) {
                          handleCardClick(el, "selectedCards");
                        } else {
                          handleCardThrow(el);
                        }
                      }}
                      style={{
                        right: `${rightOffset}rem`,
                        zIndex: isSelected ? 1 : 0,
                      }}
                      data-suite={el.type}
                      data-value={el.name}
                    >
                      <div
                        className={`front ${isSelected ? "overlay" : ""} 
                    ${isActive ? "overlayactive" : ""}
                  `}
                      >
                        <span></span>
                        <span></span>
                      </div>
                      <div className="back"></div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/** end box  */}

        {winners && <Marriagecardwinner winners={winners} />}
      </div>
    </>
  );
};

export default MarriagePage;
