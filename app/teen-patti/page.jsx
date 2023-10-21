"use client";
import Image from "next/image";
import Cardanimate from "@/components/Animation/Cardanimate";
import SideShow from "@/components/modals/Sideshow";
import "./ani.css";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Cardlefttop from "@/components/Animation/Cardlefttop";
import Cardleftmiddle from "@/components/Animation/Cardleftmiddle";
import Cardleftbottom from "@/components/Animation/Cardleftbottom";
import Righttop from "@/components/Animation/Righttop";
import Rightmiddle from "@/components/Animation/Rightmiddle";
import Rightbottom from "@/components/Animation/Rightbottom";
import Shareinvite from "@/components/modals/Shareinvite";
import BlockPlayerModal from "@/components/modals/BlockPlayerModal";
import Exitpage from "@/components/modals/Exitpage";
import PrivateRoute from "@/components/Private/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { GetloggedData } from "@/redux/AppReducer/Action";
import Deposit from "@/components/modals/Deposit";
import BuyCoinmodal from "@/components/modals/BuyCoinmodal";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 15;
const ALERT_THRESHOLD = 10;
const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

const TIME_LIMIT = 13;

const LandscapePage = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [pathColor, setPathColor] = useState(COLOR_CODES.info.color);
  const getuserinfo = useSelector((store) => store.AppReducer.Userloggeddata);

  // console.log("timeleft", timeLeft);

  const setRemainingPathColor = (timeLeft) => {
    const { alert, warning, info } = COLOR_CODES;
    const pathRemaining = document.getElementById("base-timer-path-remaining");
    if (pathRemaining) {
      if (timeLeft <= alert.threshold) {
        pathRemaining.classList.remove(alert.color, warning.color);
        pathRemaining.classList.add(info.color);
      } else if (timeLeft > warning.threshold) {
        pathRemaining.classList.remove(info.color, info.color);
        pathRemaining.classList.add(alert.color);
      } else {
        pathRemaining.classList.remove(alert.color, warning.color);
        pathRemaining.classList.add(warning.color);
      }
    }
  };

  const calculateTimeFraction = () => {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  };

  const setCircleDasharray = () => {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;

    const pathRemaining = document.getElementById("base-timer-path-remaining");

    if (pathRemaining) {
      pathRemaining.setAttribute("stroke-dasharray", circleDasharray);
    }
  };
  const [gifKey, setGifKey] = useState(0);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [gameStartCounter, setGameStartCounter] = useState(null);
  const [shareinvitecode, SetshareinviteCode] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [gameData, setPlayerGamingStatus] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [players, setPlayers] = useState(null);
  const [tableDetails, setTableDetails] = useState(null);
  const [playerSlotIndex, setplayerSlotIndex] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [value, setValue] = useState(5000);
  const [cardSee, setCardSee] = useState(false);
  const [isBliend, setIsBliend] = useState(true);
  const [previousValue, setPreviousValue] = useState(null);
  const [hasDoubled, setHasDoubled] = useState(false);
  const [chips, setChip] = useState(80000);
  const [sideShowModal, setSideShowModal] = useState(false);
  const [winReason, setWinReason] = useState(null);
  const [cardsInfo, setCardsInfo] = useState(null);
  const [Loggeduser, setLoggeduser] = useState(null);
  const [privateTableKey, setPrivateTableKey] = useState(null);
  const [showBlockPlayerModal, setBlockPlayerModal] = useState(false);
  const [selectedBlockPlayer, setSelectedBlockPlayer] = useState(null);
  const [ExituserModal, SetExituserModal] = useState(false);
  const [buyCoins, setBuyCoins] = useState(false);
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleDouble = () => {
    if (!hasDoubled) {
      setPreviousValue(value);
      setValue(() => value * 2);
      setHasDoubled(true);
    }
  };
  const handleExitTable = () => {
    SetExituserModal(true);
    // window.location.href = "/dashboard";
  };

  const handleDeduct = () => {
    if (hasDoubled) {
      setValue(previousValue);
      setPreviousValue(null);
      setHasDoubled(false);
    }
  };

  useEffect(() => {
    GetloggedData(dispatch);
  }, []);

  useEffect(() => {
    // Check the screen orientation when the component mounts
    const checkOrientation = () => {
      setIsPortrait(window.innerWidth < window.innerHeight);
    };

    // Add an event listener to check orientation changes
    window.addEventListener("resize", checkOrientation);

    // Initial check
    checkOrientation();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  });

  useEffect(() => {
    console.log(isPortrait, window.innerWidth, window.innerHeight);
    // Redirect to another page if it's in portrait mode on a mobile device
    if (window.innerWidth <= 768 && window.innerHeight <= 932) {
      window.location.href = "/teen-patti-mobile"; // Replace with your desired URL
    }
  }, [isPortrait]);

  const socketRef = useRef(null);

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
    // socketRef.current = io("https://newsocket.onrender.com/", {
    socketRef.current = io("https://dev-socket.sikkaplay.com/", {
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

      socketRef.current.on("recieve", (data) => {
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }

      socketRef.current.on("notification", (data) => {
        console.log(data);
        setNotification(data?.message);
      });
      socketRef.current.on("newPlayerJoined", (newplayer) => {
        console.log("new player joined", newplayer);
      });
      socketRef.current.on("joinTable", (newplayer) => {
        setPlayerGamingStatus(() => newplayer);

        setplayerSlotIndex(() => newplayer?.slot?.split("slot")[1]);
        console.log(newplayer?.slot?.split("slot")[1]);
        setPlayerId(newplayer.id);
        console.log(newplayer.id);

        console.log("new player", newplayer);
      });
      socketRef.current.on("connectionSuccess", (data) => {
        console.log("connection is done", data);
      });
      socketRef.current.on("connectionSuccess", (data) => {
        setSocketId(data.id);
        setTableId(data.tableId);
      });
      socketRef.current.on("cardsSeen", (data) => {
        console.log("cardsInfo", data.cardsInfo);
        setCardsInfo(data.cardsInfo);
        console.log("players", data.players);
        setCardSee(true);
      });
      socketRef.current.on("betPlaced", (data) => {
        console.log("bet", data.bet);
        console.log("placedBy", data.placedBy);
        console.log("players", data.players);
        setPlayers(() => data.players);
        setTableDetails(data.table);

        let seenValue = null;

        for (const playerId in data?.players) {
          if (data?.players[playerId].turn === true) {
            seenValue = data?.players[playerId]?.seen;
            setSideShowModal(data?.players[playerId].isSideShowAvailable);
            break;
          }
        }

        setHasDoubled(false);
        if (data.table.lastBlind && !seenValue) {
          setValue(data.table.lastBet);
        }
        if (data.table.lastBlind && seenValue) {
          setValue(data.table.lastBet * 2);
        }
        if (!data.table.lastBlind && seenValue) {
          setValue(data.table.lastBet);
        }
        if (!data.table.lastBlind && !seenValue) {
          setValue(data.table.lastBet / 2);
        }
      });
      socketRef.current.on("sideShowResponded", (data) => {
        console.log("message", data.message);
        //todo: sideshow bet undefinded console.log("bet", data.bet);
        console.log("placedBy", data.placedBy);
        console.log("players", data.players);
        console.log("table", data.table);
        setPlayers(() => data.players);
        setTableDetails(data.table);
        setNotification(null);
      });
      socketRef.current.on("sideShowPlaced", (data) => {
        setNotification("Wait for opponent side show response");
        console.log("message", data.message);
        console.log("bet", data.bet);
        console.log("placedBy", data.placedBy);
        console.log("players", data.players);
        setPlayers(data.players);
        setTableDetails(data.table);
        console.log("table", data.table);
      });
      socketRef.current.on("showWinner", (data) => {
        console.log("winner data", data);
        setWinReason(data.message);
        setPlayers(data.players);
        setTableDetails(data.table);
        GetloggedData(dispatch);
      });
      socketRef.current.on("playerPacked", (data) => {
        console.log("bet", data.bet);
        console.log("placedBy", data.placedBy);
        console.log("players", data.players);
        console.log("table", data.table);
        setPlayers(() => data.players);
        setTableDetails(data.table);
      });
      socketRef.current.on("startNew", (data) => {
        setPlayers(data.players);
        setMessages([]);
        setTableDetails(data.table);
        setCardSee(false);
        setValue(5000);
        setIsBliend(true);
        console.log(data);
        setWinReason(null);
        setCardsInfo(null);
        setNotification(null);
        setSelectedBlockPlayer(null);
        const countdown = 5; // Replace with the timer value from your data
        setGameStartCounter(countdown);

        const timerInterval = setInterval(() => {
          setGameStartCounter((prevTimer) => {
            if (prevTimer <= 0) {
              clearInterval(timerInterval); // Stop the timer when it reaches 0
              return 0;
            } else {
              return prevTimer - 1;
            }
          });
        }, 1000);
      });
      socketRef.current.on("notification", (data) => {
        console.log(data);
      });
      socketRef.current.on("gameCountDown", (data) => {
        const countdown = data.count; // Replace with the timer value from your data
        if (data.count) {
          setGameStartCounter(countdown);

          const timerInterval = setInterval(() => {
            setGameStartCounter((prevTimer) => {
              if (prevTimer <= 0) {
                clearInterval(timerInterval); // Stop the timer when it reaches 0
                return 0;
              } else {
                return prevTimer - 1;
              }
            });
          }, 1000);
        }
      });
      socketRef.current.on("resetTable", (data) => {
        console.log(data.sentObj);
      });
    });

    return () => {
      socketRef.current.on("disconnect", () => {
        setIsSocketConnected(false);
        console.log("disconected");
      });
      if (gameStartCounter) {
        clearInterval(gameStartCounter);
      }
    };
  }, []);

  const handleBliend = () => {
    const socket = socketRef.current;
    if (isSocketConnected && socket) {
      // Emit the socket event here
      console.log("bliend called ", value);
      if (chips - value >= 0) {
        setChip((prev) => prev - value);
        socketRef.current.emit("placeBet", {
          player: {
            id: gameData?.id,
            playerInfo: gameData?.playerInfo,
          },
          bet: {
            amount: value,
            blind: isBliend,
            show: false,
          },
        });
      }
      setTimeLeft(13);
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };

  const handlePack = () => {
    if (isSocketConnected) {
      // Emit the socket event here
      console.log("pack called ", value);

      socketRef.current.emit("placePack", {
        player: {
          id: gameData?.id,
          playerInfo: gameData?.playerInfo,
        },
        bet: {
          amount: value,
          blind: isBliend,
        },
      });
      setTimeLeft(13);
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };
  // todo : count of un packed plyaers
  const handleshow = () => {
    if (isSocketConnected) {
      // Emit the socket event here
      console.log("bliend called ", value);

      socketRef.current.emit("placeBet", {
        player: {
          id: gameData?.id,
          playerInfo: gameData?.playerInfo,
        },
        bet: {
          amount: value,
          blind: isBliend,
          show: true,
        },
      });
      setTimeLeft(13);
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };
  const handlePlaceSideShow = () => {
    if (isSocketConnected) {
      // Emit the socket event here
      console.log("side showe called ");
      socketRef.current.emit("placeSideShow", {
        player: {
          id: gameData?.id,
          playerInfo: gameData?.playerInfo,
        },
        bet: {
          amount: value,
          blind: isBliend,
        },
      });
      setTimeLeft(13);
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };

  const handleSeeCards = () => {
    setCardSee(() => true);
    setValue(() => value * 2);
    setIsBliend(false);
    if (isSocketConnected) {
      // Emit the socket event here
      console.log("seen card ");

      socketRef.current.emit("seeMyCards", {
        id: gameData?.id,
      });
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };

  const handleResponseSideShowCancel = () => {
    if (isSocketConnected) {
      setSideShowModal(false);
      // Emit the socket event here
      console.log("side show");

      socketRef.current.emit("respondSideShow", {
        player: {
          id: gameData?.id,
          playerInfo: {
            userName: gameData?.playerInfo.userName,
          },
        },
        lastAction: "Denied",
      });
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };
  const handleResponseSideShowAccept = () => {
    if (isSocketConnected) {
      setSideShowModal(false);
      // Emit the socket event here
      console.log("side show");
      socketRef.current.emit("respondSideShow", {
        player: {
          id: gameData?.id,
          playerInfo: {
            userName: gameData?.playerInfo.userName,
          },
        },
        lastAction: "Accepted",
      });
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };
  const handleSendMessage = () => {
    // Send the message to the server
    if (isSocketConnected) {
      if (message.trim() !== "") {
        socketRef.current.emit("chat", {
          id: playerId,
          msg: message,
        });
      }

      // Clear the input field
      setMessage("");
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };
  const handleBlockPlayer = () => {
    setBlockPlayerModal(false);
    if (isSocketConnected && selectedBlockPlayer.id) {
      console.log(selectedBlockPlayer);
      socketRef.current.emit("kickOut", {
        id: selectedBlockPlayer.id,
      });
      setSelectedBlockPlayer(null);
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  };
  let slotPlayerMap = {};

  if (players) {
    for (const playerKey in players) {
      const player = players[playerKey];
      const slot = player?.slot?.replace("slot", ""); // Extract the numeric part
      slotPlayerMap[slot] = player;
    }
  }

  console.log(players, tableDetails, playerId);
  console.log(slotPlayerMap, playerSlotIndex, slotPlayerMap?.[playerSlotIndex]);
  console.log(cardsInfo);
  console.log(Loggeduser);
  console.log(messages);
  console.log(selectedBlockPlayer, playerId);

  if (slotPlayerMap?.[playerSlotIndex]?.kickout) {
    if (isSocketConnected) {
      // Emit the socket event here
      console.log("pack called ", value);

      socketRef.current.emit("placePack", {
        player: {
          id: gameData?.id,
          playerInfo: gameData?.playerInfo,
        },
        bet: {
          amount: value,
          blind: isBliend,
        },
      });
      window.location.href = "/dashboard";
    } else {
      console.log("Socket is not connected. Cannot emit event.");
    }
  }
  //  https:s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/drawer/edit.svg

  useEffect(() => {
    let timerInterval;

    if (players?.[playerId]?.turn) {
      // Start the timer
      setTimeLeft(13); // Set an initial timer value, change this as needed
      timerInterval = setInterval(() => {
        setTimeLeft((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(timerInterval); // Stop the timer when it reaches 0
            socketRef.current.emit("placePack", {
              player: {
                id: gameData?.id,
                playerInfo: gameData?.playerInfo,
              },
              bet: {
                amount: value,
                blind: isBliend,
              },
            });
            return 0;
          } else {
            return prevTimer - 1;
          }
        });
      }, 1000);
    } else {
      // Stop the timer when it's not the player's turn
      clearInterval(timerInterval);
    }

    return () => {
      // Clear the interval when the component unmounts or when isPlayerTurn changes
      clearInterval(timerInterval);
    };
  }, [players?.[playerId]?.turn]);

  console.log("timeLeft", timeLeft);
  return (
    <>
      <PrivateRoute>
        <div className="min-h-screen relative  font-roboto bg-[url('https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/landingPage/sikkaplaybg.svg')] bg-cover bg-no-repeat   overflow-y-clip mx-auto">
          <div className=" text-white relative h-[100vh] w-[100vw] space-y-10 mx-auto py-3 max-w-7xl">
            {/* navbar */}
            <div className="teen-patti-navbar  flex justify-between w-[80%] mx-auto ">
              <div className="left-container flex justify-between items-center gap-7 ">
                <div className="Image-containe cursor-pointer">
                  <Image
                    src={
                      "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/arrow-left.svg"
                    }
                    alt="left-arrow"
                    className="w-[90%]"
                    width={50}
                    height={50}
                    onClick={handleExitTable}
                  />
                </div>
                <button
                  className="relative custom-gradient px-5 py-1"
                  onClick={() => {
                    setBuyCoins(true);
                  }}
                >
                  <Image
                    src={
                      "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                    }
                    alt="left-arrow"
                    className="absolute  w-[30%] left-[-15%] top-[-2%]"
                    width={50}
                    height={50}
                  />
                  <p className="text-xs">Buy Coins</p>
                </button>
              </div>
              {players?.[playerId]?.turn && (
                <div>
                  {players?.[playerId]?.playerInfo.userName} countdown:{" "}
                  {timeLeft}{" "}
                </div>
              )}
              <div className="right-container flex justify-between gap-2">
                {Object.keys(slotPlayerMap).length >= 2 && (
                  <div onClick={() => setIsChatOpen(true)}>
                    <Image
                      src={
                        "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/message.svg"
                      }
                      alt="message icon"
                      width={50}
                      height={50}
                      className="w-full cursor-pointer"
                    />
                  </div>
                )}
                {players?.[playerId]?.turn &&
                  players?.[playerId]?.playerInfo?.isAdmin && (
                    <div onClick={() => setBlockPlayerModal(true)}>
                      <Image
                        src={
                          "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/info-tag.svg"
                        }
                        alt="Info-tag"
                        width={50}
                        height={50}
                        className="w-full cursor-pointer "
                      />
                    </div>
                  )}
              </div>
            </div>
            {/* table */}
            <div className="h-[76%] w-[100%]">
              <div className="Image-container absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[75vw] sml:w-[65vw] xl:w-[62vw] 2xl:w-[70vw]    max-w-7xl ">
                <div className="relative w-full h-full">
                  <Image
                    src={
                      "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/table-background.svg"
                    }
                    alt="table"
                    width={800}
                    height={500}
                    className="w-full h-full z-[50] "
                  />
                  {tableDetails?.amount && (
                    <div className="absolute left-1/2 top-[30%]  -translate-x-1/2 -translate-y-1/2 ">
                      <div className="relative ">
                        <Image
                          src={
                            "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                          }
                          alt="red-chip"
                          width={50}
                          height={50}
                          className="w-8  absolute left-[-1rem] top-[0rem] z-[30] "
                        />
                        <div className="relative bg-[#005427]  px-12 py-1 z-[20] ">
                          {tableDetails?.amount}
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    className="absolute left-1/2 top-[20%]  -translate-x-1/2 -translate-y-1/2 bg-black rounded-md text-white px-2 py-1 cursor-pointer z-[300] text-sm   "
                    onClick={() => {
                      console.log("tip called");
                      if (chips >= 20) {
                        console.log("kami kele");
                        setChip((prev) => prev - 20);
                      }
                    }}
                  >
                    Tip
                  </button>
                  <Image
                    className="absolute left-[49%] top-[-1rem] mxl:top-[-1rem] transform -translate-x-1/2 -translate-y-1/2 w-[19%] mxl:w-[20%]  2xl:w-[22%]"
                    src={
                      "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/Game-host.svg"
                    }
                    alt="game-host"
                    width={50}
                    height={50}
                  />

                  {/* left- top*/}
                  <div className="absolute left-[14%] lg:left-[17%] 2xl:left-[18%] top-[-1rem] 2xl:top-[-1rem] transform -translate-x-1/2 -translate-y-1/2 w-[35%] lg:w-[30%] 2xl:w-[25%]   h-[50%] md:h-[40%] 2xl:h-[30%] my-3  ">
                    <div className="relative w-full h-full">
                      <div className="relative w-[50%]  ml-auto flex flex-col items-center gap-3 mr-2  ">
                        <p className="text-sm text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div className="relative">
                          <div
                            className={`w-16 h-16 lg:w-24 lg:h-24   mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden `}
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                  ?.playerInfo?.avatar ||
                                " https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          >
                            {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                              ?.active && (
                              <div className="absolute w-full h-[50%] bg-GreyLight opacity-80 font-bold py-1  xl:py-0 bottom-[-1rem] lg:bottom-[-1.3rem] 2xl:bottom-[-1.6rem]  left-0 text-center text-xs lg:text-base">
                                {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                  ?.packed
                                  ? "packed"
                                  : slotPlayerMap[
                                      (+playerSlotIndex + 4) % 7 || 7
                                    ]?.seen
                                  ? "Seen"
                                  : "Blind"}
                              </div>
                            )}
                          </div>
                          {slotPlayerMap?.[(+playerSlotIndex + 4) % 7 || 7]
                            ?.winner && (
                            <Image
                              src={"/assets/game/winning.gif"}
                              alt="win GIF"
                              width={200}
                              height={200}
                              className=" absolute w-80  h-full bottom-0 z-40"
                            />
                          )}
                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                          ?.active && (
                          <Cardlefttop
                            cardsInfo={
                              slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                ?.cardSet?.cards
                            }
                          />
                        )}
                        {/* {players?.[playerId]?.turn && timeLeft >= 0 && (
                        <Image
                          src={"/assets/game/timer.gif"}
                          alt="timmer GIF"
                          width={200}
                          height={200}
                          className="z-[201] absolute"
                          key={gifKey}
                        />
                      )} */}
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                        ?.active && (
                        <div className="absolute left-2 bottom-0 transform  transition-transform duration-[3000] ease-in-out">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 py-[.10rem]">
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              }
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="w-7 lg:w-8 2xl:w-9 absolute left-[-1rem] top-[-.1rem] "
                            />
                            <p className="text-sm lg:text-base 2xl:text-xl">
                              {
                                slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                  ?.lastBet
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* <div
                    className="absolute  left-1/2 bottom-[-6rem]  lg:bottom-[-4.3rem] 
              mxl:bottom-[-5rem] transform -translate-x-1/2 -translate-y-1/2   "
                  >
                    {timeLeft == 13 ? (
                      <div>
                        <div className="relative w-full h-full">
                          <Image
                            src={Loggeduser?.avatar}
                            alt="avatar"
                            width={50}
                            height={50}
                            className={`w-28 h-28 lg:w-36 lg:h-36 mxl:w-40 mxl:h-40 2xl:w-44 2xl:h-44  rounded-full border-${
                              slotPlayerMap?.[playerSlotIndex]?.winner
                                ? "yellow-200 shadow-2xl shadow-yellow-300 "
                                : "yellow-400"
                            }  border-4 `}
                          />
                          {slotPlayerMap?.[playerSlotIndex]?.winner && (
                            <Image
                              src={"/assets/game/winning.gif"}
                              alt="win GIF"
                              width={200}
                              height={200}
                              className=" absolute w-80  h-full bottom-0 z-40"
                            />
                          )}
                        </div>

                        {slotPlayerMap[+playerSlotIndex]?.packed && (
                          <div className="absolute w-full h-[100%] rounded-full bg-GreyLight opacity-80 font-bold py-1 xl:py-0 bottom-0   left-0 text-center text-xs lg:text-base  flex justify-center items-center ">
                            <p>packed</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative  right-1 sm:right-24 md:right-14 mb-[-1rem] border-red-900 w-10 m-auto">
                        <div
                          className="base-timer   w-32 h-32  
                   sm:w-30 sm:h-30
                  md:w-36 md:h-36 lg:w-40 lg:h-40 mxl:w-40 mxl:h-40 2xl:w-44 2xl:h-44   m-auto"
                        >
                          <svg
                            className="base-timer__svg"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g className="base-timer__circle">
                              <circle
                                className="base-timer__path-elapsed"
                                cx="50"
                                cy="50"
                                r="45"
                              ></circle>
                              <path
                                id="base-timer-path-remaining"
                                strokeDasharray="283"
                                className={`base-timer__path-remaining ${pathColor}`}
                                d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
                              ></path>
                            </g>
                          </svg>
                          <div
                            id="base-timer-label"
                            className="relative  border-yellow-500 "
                          >
                            <div
                              className="relative top-[-103px]   border-green-900 
                        
                       w-full h-full  m-auto"
                            >
                              <Image
                                src={"/assets/drawer/user-avatar.svg"}
                                alt="avatar"
                                className={` absolute m-auto
                          w-24 h-24  sm:w-26 sm:h-26
                          md:w-28 md:h-28
                          lg:w-32 lg:h-32 
                          left-[.9rem] 
                          top-[-.6rem] 
                           p-1
                          sm:left-[1rem] 
                          md:left-[1rem]
                           lg:left-[1rem]
                          sm:top-[-.6rem] 
                          md:top-[-1.6rem] lg:top-[-2.55rem] items-center
                           rounded-full yellow-200 shadow-2xl shadow-yellow-300 
                            md:border-6
                            sm:border-2
                           border-4`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div> */}
                  </div>

                  {/* left- middle*/}
                  <div className="absolute left-[-1rem]  top-[40%] transform -translate-x-1/2 -translate-y-1/2 w-[35%] lg:w-[30%] 2xl:w-[25%]   h-[40%] 2xl:h-[30%] my-3  ">
                    <div className="relative w-full h-full flex flex-col items-center gap-4 ">
                      <div className="relative w-[50%]  flex flex-col items-center gap-3   ">
                        <p className="text-sm text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>

                        <div className="relative">
                          <div
                            className="w-16 h-16 lg:w-24 lg:h-24 mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          >
                            {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                              ?.active && (
                              <div className="absolute w-full h-[50%] bg-GreyLight opacity-80 font-bold py-1 xl:py-0 bottom-[-1rem] lg:bottom-[-1.3rem] 2xl:bottom-[-1.6rem]  left-0 text-center text-xs lg:text-base   text-xs">
                                {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                  ?.packed
                                  ? "packed"
                                  : slotPlayerMap[
                                      (+playerSlotIndex + 5) % 7 || 7
                                    ]?.seen
                                  ? "Seen"
                                  : "Blind"}
                              </div>
                            )}
                          </div>
                          {slotPlayerMap?.[(+playerSlotIndex + 5) % 7 || 7]
                            ?.winner && (
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/game/winning.gif"
                              }
                              alt="win GIF"
                              width={200}
                              height={200}
                              className=" absolute w-80  h-full bottom-0 z-40"
                            />
                          )}
                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                          ?.active && (
                          <Cardleftmiddle
                            cardsInfo={
                              slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                ?.cardSet?.cards
                            }
                          />
                        )}
                      </div>

                      {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                        ?.active && (
                        <div className="">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 py-[.10rem]">
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              }
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="w-7 lg:w-8 2xl:w-9 absolute left-[-1rem] top-[-.1rem] "
                            />
                            <p className="text-sm lg:text-base 2xl:text-xl">
                              {
                                slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                  .lastBet
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* left- bottom*/}
                  <div className="absolute left-[8%] lg:left-[12%] 2xl:left-[13%] bottom-[-7rem] lg:bottom-[-7rem] 2xl:bottom-[-6rem] transform -translate-x-1/2 -translate-y-1/2 w-[35%] lg:w-[30%] 2xl:w-[25%]   h-[50%] md:h-[40%] 2xl:h-[30%] my-3  ">
                    <div className="relative w-full h-full">
                      <div className="relative w-[50%]  ml-auto flex flex-col items-center gap-3 mr-2  ">
                        <p className="text-sm text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div className="relative">
                          <div
                            className="w-16 h-16 lg:w-24 lg:h-24 mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          >
                            {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                              ?.active && (
                              <div className="absolute w-full h-[50%] bg-GreyLight opacity-80 font-bold py-1 xl:py-0 bottom-[-1rem] lg:bottom-[-1.3rem] 2xl:bottom-[-1.6rem]  left-0 text-center text-xs lg:text-base   text-xs">
                                {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                  ?.packed
                                  ? "packed"
                                  : slotPlayerMap[
                                      (+playerSlotIndex + 6) % 7 || 7
                                    ]?.seen
                                  ? "Seen"
                                  : "Blind"}
                              </div>
                            )}
                          </div>
                          {slotPlayerMap?.[(+playerSlotIndex + 6) % 7 || 7]
                            ?.winner && (
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/game/winning.gif"
                              }
                              alt="win GIF"
                              width={200}
                              height={200}
                              className=" absolute w-80  h-full bottom-0 z-40"
                            />
                          )}
                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                          ?.active && (
                          <Cardleftbottom
                            cardsInfo={
                              slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                ?.cardSet?.cards
                            }
                          />
                        )}
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                        ?.active && (
                        <div className="absolute left-1 bottom-0">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 py-[.10rem]">
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              }
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="w-7 lg:w-8 2xl:w-9 absolute left-[-1rem] top-[-.1rem] "
                            />
                            <p className="text-sm lg:text-base 2xl:text-xl">
                              {
                                slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                  .lastBet
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* right- top*/}
                  <div className="absolute right-[-8rem]  top-[-1rem] 2xl:top-[-1rem] transform -translate-x-1/2 -translate-y-1/2 w-[35%] lg:w-[30%] 2xl:w-[25%]   h-[50%] md:h-[40%] 2xl:h-[30%] my-3  ">
                    <div className="relative w-full h-full">
                      <div className="relative w-[50%]  mr-auto flex flex-col items-center gap-3 ml-2  ">
                        <p className="text-sm text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div className="relative">
                          <div
                            className="w-16 h-16 lg:w-24 lg:h-24 mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          >
                            {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                              ?.active && (
                              <div className="absolute w-full h-[50%] bg-GreyLight opacity-80 font-bold py-1 xl:py-0 bottom-[-1rem] lg:bottom-[-1.3rem] 2xl:bottom-[-1.6rem]  left-0 text-center text-xs lg:text-base   text-xs">
                                {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                  ?.packed
                                  ? "packed"
                                  : slotPlayerMap[
                                      (+playerSlotIndex + 3) % 7 || 7
                                    ]?.seen
                                  ? "Seen"
                                  : "Blind"}
                              </div>
                            )}
                          </div>
                          {slotPlayerMap?.[(+playerSlotIndex + 3) % 7 || 7]
                            ?.winner && (
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/game/winning.gif"
                              }
                              alt="win GIF"
                              width={200}
                              height={200}
                              className=" absolute w-80  h-full bottom-0 z-40"
                            />
                          )}
                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                          ?.active && (
                          <Righttop
                            cardsInfo={
                              slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                ?.cardSet?.cards
                            }
                          />
                        )}
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                        ?.active && (
                        <div className="absolute right-1 bottom-0">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 py-[.10rem]">
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              }
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="w-7 lg:w-8 2xl:w-9 absolute left-[-1rem] top-[-.1rem] "
                            />
                            <p className="text-sm lg:text-base 2xl:text-xl">
                              {
                                slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                  .lastBet
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* right- middle*/}
                  {/* <div className="absolute right-[-15rem] mxl:right-[-17rem] top-[40%] transform -translate-x-1/2 -translate-y-1/2 w-[35%] lg:w-[30%] 2xl:w-[25%]   h-[40%] 2xl:h-[30%] my-3  ">
                    <div className="relative w-full h-full flex flex-col items-center gap-4 ">
                      <div className="relative w-[50%]  flex flex-col items-center gap-3   ">
                        <p className="text-sm text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div className="relative">
                          <div
                            className="w-16 h-16 lg:w-24 lg:h-24 mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          >
                            {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                              ?.active && (
                              <div className="absolute w-full h-[50%] bg-GreyLight opacity-80 font-bold py-1 xl:py-0 bottom-[-1rem] lg:bottom-[-1.3rem] 2xl:bottom-[-1.6rem]  left-0 text-center text-xs lg:text-base   ">
                                {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                  ?.packed
                                  ? "packed"
                                  : slotPlayerMap[
                                      (+playerSlotIndex + 2) % 7 || 7
                                    ]?.seen
                                  ? "Seen"
                                  : "Blind"}
                              </div>
                            )}
                          </div>
                          {slotPlayerMap?.[(+playerSlotIndex + 2) % 7 || 7]
                            ?.winner && (
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/game/winning.gif"
                              }
                              alt="win GIF"
                              width={200}
                              height={200}
                              className=" absolute w-80  h-full bottom-0 z-40"
                            />
                          )}
                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                          ?.active && (
                          <Rightmiddle
                            cardsInfo={
                              slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                ?.cardSet?.cards
                            }
                          />
                        )}
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                        ?.active && (
                        <div className=" border-red-700 ">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 py-[.10rem]">
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              }
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="w-7 lg:w-8 2xl:w-9 absolute left-[-1rem] top-[-.1rem] "
                            />
                            <p className="text-sm lg:text-base 2xl:text-xl">
                              {
                                slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                  .lastBet
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]?.active && (
                      <div className="relative  border-2 border-red-700 ">
                        <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 py-[.10rem]">
                          <Image
                            src={
                              "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                            }
                            alt="red-chip"
                            width={50}
                            height={50}
                            className="w-7 lg:w-8 2xl:w-9 absolute left-[-1rem] top-[-.1rem] "
                          />
                          <p className="text-sm lg:text-base 2xl:text-xl">
                            {
                              slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                .lastBet
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div> */}
                  <div className="absolute right-[-15rem] mxl:right-[-17rem] top-[40%] transform -translate-x-1/2 -translate-y-1/2 w-[35%] lg:w-[30%] 2xl:w-[25%]   h-[40%] 2xl:h-[30%] my-3  ">
                    <div className="relative w-full h-full flex flex-col items-center gap-4 ">
                      <div className="relative w-[50%]  flex flex-col items-center gap-3   ">
                        <p className="text-sm text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div className="relative">
                          <div
                            className="w-16 h-16 lg:w-24 lg:h-24 mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          >
                            {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                              ?.active && (
                              <div className="absolute w-full h-[50%] bg-GreyLight opacity-80 font-bold py-1 xl:py-0 bottom-[-1rem] lg:bottom-[-1.3rem] 2xl:bottom-[-1.6rem]  left-0 text-center text-xs lg:text-base   ">
                                {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                  ?.packed
                                  ? "packed"
                                  : slotPlayerMap[
                                      (+playerSlotIndex + 2) % 7 || 7
                                    ]?.seen
                                  ? "Seen"
                                  : "Blind"}
                              </div>
                            )}
                          </div>
                          {slotPlayerMap?.[(+playerSlotIndex + 2) % 7 || 7]
                            ?.winner && (
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/game/winning.gif"
                              }
                              alt="win GIF"
                              width={200}
                              height={200}
                              className=" absolute w-80  h-full bottom-0 z-40"
                            />
                          )}
                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                          ?.active && (
                          <Rightmiddle
                            cardsInfo={
                              slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                ?.cardSet?.cards
                            }
                          />
                        )}
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                        ?.active && (
                        <div className="relative top-[-3.5rem]  border-red-700 ">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 py-[.10rem]">
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              }
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="w-7 lg:w-8 2xl:w-9 absolute left-[-1rem] top-[-.1rem] "
                            />
                            <p className="text-sm lg:text-base 2xl:text-xl">
                              {
                                slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                  .lastBet
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* right- bottom*/}
                  <div className="absolute right-[-8rem]  lg:right-[-9rem] 2xl:right-[-10rem]  bottom-[-7rem] lg:bottom-[-7rem] 2xl:bottom-[-6rem]  transform -translate-x-1/2 -translate-y-1/2 w-[35%] lg:w-[30%] 2xl:w-[25%]   h-[50%] md:h-[40%] 2xl:h-[30%] my-3  ">
                    <div className="relative w-full h-full">
                      <div className="relative w-[50%]  mr-auto flex flex-col items-center gap-3 ml-2  ">
                        <p className="text-sm text-center lg:text-base">
                          {slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                            ? slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div className="relative">
                          <div
                            className="w-16 h-16 lg:w-24 lg:h-24 mxl:w-28 mxl:h-28 2xl:w-36 2xl:h-36 rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden "
                            style={{
                              backgroundImage: `url(${
                                slotPlayerMap[(+playerSlotIndex + 1) % 7 || 7]
                                  ?.playerInfo?.avatar ||
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                              })`,
                            }}
                          >
                            {slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                              ?.active && (
                              <div className="absolute w-full h-[50%] bg-GreyLight opacity-80  font-bold py-1 xl:py-0 bottom-[-1rem] lg:bottom-[-1.3rem] 2xl:bottom-[-1.6rem]  left-0 text-center text-xs lg:text-base xl:text-base ">
                                {slotPlayerMap?.[
                                  (+playerSlotIndex + 1) % 7 || 7
                                ]?.packed
                                  ? "packed"
                                  : slotPlayerMap?.[
                                      (+playerSlotIndex + 1) % 7 || 7
                                    ]?.seen
                                  ? "Seen"
                                  : "Blind"}
                              </div>
                            )}
                          </div>
                          {slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                            ?.winner && (
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/game/winning.gif"
                              }
                              alt="win GIF"
                              width={200}
                              height={200}
                              className=" absolute w-80  h-full bottom-0 z-40"
                            />
                          )}
                          <div className="absolute inset-[-.5rem] flex items-center justify-center ring-2 ring-white rounded-full"></div>
                        </div>
                        {slotPlayerMap[(+playerSlotIndex + 1) % 7 || 7]
                          ?.active && (
                          <Rightbottom
                            cardsInfo={
                              slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                                ?.cardSet?.cards
                            }
                          />
                        )}
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 1) % 7 || 7]
                        ?.active && (
                        <div className="absolute right-1 bottom-0">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 py-[.10rem]">
                            <Image
                              src={
                                "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              }
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="w-7 lg:w-8 2xl:w-9 absolute left-[-1rem] top-[-.1rem] "
                            />
                            <p className="text-sm lg:text-base 2xl:text-xl">
                              {
                                slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                                  .lastBet
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* player */}

                  <div className="absolute left-1/2 bottom-[-6rem]  lg:bottom-[-4.3rem] mxl:bottom-[-5rem] transform -translate-x-1/2 -translate-y-1/2   ">
                    <div className="relative w-full h-full">
                      <Image
                        src={Loggeduser?.avatar}
                        alt="avatar"
                        width={50}
                        height={50}
                        className={`w-28 h-28 lg:w-36 lg:h-36 mxl:w-40 mxl:h-40 2xl:w-44 2xl:h-44  rounded-full border-${
                          slotPlayerMap?.[playerSlotIndex]?.winner
                            ? "yellow-200 shadow-2xl shadow-yellow-300 "
                            : "yellow-400"
                        }  border-4 `}
                      />
                      {slotPlayerMap?.[playerSlotIndex]?.winner && (
                        <Image
                          src={
                            "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/game/winning.gif"
                          }
                          alt="win GIF"
                          width={200}
                          height={200}
                          className=" absolute w-80  h-full bottom-0 z-40"
                        />
                      )}
                    </div>
                    {slotPlayerMap[+playerSlotIndex]?.packed && (
                      <div className="absolute w-full h-[100%] rounded-full bg-GreyLight opacity-80 font-bold py-1 xl:py-0 bottom-0   left-0 text-center text-xs lg:text-base  flex justify-center items-center ">
                        <p>packed</p>
                      </div>
                    )}
                  </div>
                </div>
                <Cardanimate
                  cardsInfo={cardsInfo || players?.[playerId]?.cardSet?.cards}
                  seeplayingcard={players?.[playerId]?.seen}
                />
              </div>
            </div>
            {/* footer */}
            <div className="teen-patti-navbar  mx-auto  bottom-5 left-0  right-0 flex justify-evenly items-center w-[100%]   ">
              <div className="left-container flex justify-between items-center gap-7 ">
                {players?.[playerId]?.turn && !players?.[playerId]?.packed && (
                  <button
                    onClick={handlePack}
                    className="custom-gradient px-3 py-1 text-base"
                  >
                    Pack
                  </button>
                )}

                {players?.[playerId]?.turn &&
                  !players?.[playerId]?.packed &&
                  players?.[playerId]?.isSideShowAvailable &&
                  cardSee && (
                    <button
                      onClick={
                        tableDetails?.isShowAvailable
                          ? handleshow
                          : handlePlaceSideShow
                      }
                      className="custom-gradient px-3 py-1 text-base"
                    >
                      {tableDetails?.isShowAvailable ? "show" : "Side Show"}
                    </button>
                  )}
              </div>
              <div
                className={`relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] px-6 transform  transition-transform duration-[3000] ease-in-out z-[1000] `}
              >
                <Image
                  src={
                    "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                  }
                  alt="red-chip"
                  width={50}
                  height={50}
                  className="absolute left-[-1.5rem] top-[0rem] h-full "
                />
                <p className=" text-center text-lg">{chips}</p>
              </div>
              <div className="right-container flex justify-between items-center gap-2">
                {players?.[playerId]?.turn && !players?.[playerId]?.packed && (
                  <div className="flex justify-between items-center gap-4 ">
                    <button
                      onClick={handleDeduct}
                      className="rounded-full border border-white flex justify-center items-center w-5 h-5 text-center"
                    >
                      -
                    </button>

                    <button
                      onClick={handleBliend}
                      className="custom-gradient px-3 py-1 text-base  btn-parent group flex flex-col"
                    >
                      <span className="btn-child group-hover:w-24 group-hover:h-24"></span>
                      <p className="basis-full">
                        {isBliend ? "Blind" : "Chaal"}
                      </p>
                      <p>{value}</p>
                    </button>
                    <button
                      onClick={handleDouble}
                      className="bg-Secondary rounded-full border border-white  flex justify-center items-center w-5 h-5"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              {!players?.[playerId]?.packed &&
                players?.[playerId]?.active &&
                !cardSee && (
                  <button
                    className=" custom-gradient btn-parent text-white group"
                    onClick={handleSeeCards}
                  >
                    <span className="btn-child"></span>
                    <span className="relative">See</span>
                  </button>
                )}
            </div>
          </div>

          {isChatOpen && (
            <div className="fixed  right-0 top-0 bottom-0 bg-black  opacity-90  z-[200] w-[40%] h-full ">
              <div className="h-[10%] relative w-full">
                <div
                  className="rounded-full p-3 z-[201]  text-white custom-gradient "
                  onClick={() => setIsChatOpen(false)}
                >
                  x
                </div>
              </div>
              <div
                ref={messagesRef}
                className="h-[80%] py-2 overflow-y-scroll scrollbar-none z-[201] "
              >
                {messages.map((msg, index) => (
                  <div
                    className="flex justify-between mt-3 items-center mx-2"
                    key={index}
                  >
                    <div
                      className={`basis-[10%] flex flex-col gap-1 items-center relative ${
                        msg.player.id === playerId && " order-last"
                      }`}
                    >
                      <Image
                        src={msg.player.playerInfo.avatar}
                        alt="user-avatar"
                        className="w-12 rounded-full  "
                        width={50}
                        height={50}
                      />
                      <p className=" text-xxs text-white rounded-lg  text-center">
                        {msg.player.playerInfo.displayName ||
                          msg.player.playerInfo.userName}
                      </p>
                    </div>
                    <div
                      className={`basis-[88%] text-black  font-extrabold bg-gray-300 z-[203] px-1 py-1 rounded-md ${
                        msg.player.id === playerId &&
                        " bg-green-200 opacity-100 "
                      }`}
                    >
                      {msg.msg}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-[10%] flex justify-between gap-2 items-center px-2 ">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  className="rounded-md text-black px-3 py-2 basis-[70%] placeholder:text-black "
                  onChange={(e) => {
                    const inputText = e.target.value;
                    setMessage(inputText);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent the default behavior (e.g., form submission)
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="custom-gradient rounded-md px-3 basis-[20%] py-1 text-white"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          )}
          {showBlockPlayerModal && (
            <BlockPlayerModal
              setBlockPlayerModal={setBlockPlayerModal}
              slotPlayerMap={slotPlayerMap}
              handleBlockPlayer={handleBlockPlayer}
              setSelectedBlockPlayer={setSelectedBlockPlayer}
            />
          )}
          {playerId && players?.[playerId]?.sideShowTurn && sideShowModal && (
            <SideShow
              handleResponseSideShowCancel={handleResponseSideShowCancel}
              handleResponseSideShowAccept={handleResponseSideShowAccept}
            />
          )}
          {!(playerId && players?.[playerId]?.sideShowTurn && sideShowModal) &&
            notification && (
              <div className=" text-center  absolute px-10 py-6 bg-GreyDark opacity-80 text-white text-2xl left-1/2 top-[30%] transform -translate-x-1/2 -translate-y-1/2 font-semibold w-[80%]">
                {notification}
              </div>
            )}
          {winReason && (
            <div className=" text-center  absolute px-10 py-6 bg-GreyDark opacity-80 text-white text-2xl left-1/2 top-[30%] transform -translate-x-1/2 -translate-y-1/2 font-semibold w-[80%]">
              {winReason}
            </div>
          )}
          {players?.[playerId]?.active &&
            gameStartCounter !== 0 &&
            gameStartCounter !== null &&
            !notification && (
              <div className="text-center  absolute px-10 py-6 bg-GreyDark opacity-80 text-white text-2xl left-1/2 top-[30%] transform -translate-x-1/2 -translate-y-1/2 font-semibold w-[80%]">
                Game Starts in {gameStartCounter} Seconds
              </div>
            )}
          {!players?.[playerId]?.active &&
            gameStartCounter !== 0 &&
            !notification && (
              <div className="text-center  absolute px-10 py-3 bg-GreyDark opacity-80 text-white text-2xl left-1/2 top-[10%] transform -translate-x-1/2 -translate-y-1/2 font-semibold w-[80%]">
                Please Wait For End Of Current Game
              </div>
            )}
          {buyCoins && (
            <div>
              <Deposit setDeposit={setBuyCoins} />
            </div>
          )}
          {shareinvitecode && privateTableKey && (
            <Shareinvite
              SetshareinviteCode={SetshareinviteCode}
              joincode={privateTableKey}
            />
          )}

          {ExituserModal && <Exitpage SetExituserModal={SetExituserModal} />}
        </div>
      </PrivateRoute>
    </>
  );
};

export default LandscapePage;
