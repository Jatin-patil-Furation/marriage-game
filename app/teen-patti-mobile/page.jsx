"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SideShow from "@/components/modals/Sideshow";
import "./ani.css";
import { io } from "socket.io-client";
import Cardlefttop from "../../components/mobileanimation/Cardlefttop";
import Cardleftmiddle from "../../components/mobileanimation/Cardleftmiddle";
import Cardleftbottom from "../../components/mobileanimation/Cardleftbottom";
import Rightbottom from "../../components/mobileanimation/Rightbottom";
import Rightmiddle from "../../components/mobileanimation/Rightmiddle";
import Righttop from "../../components/mobileanimation/Righttop";
import Cardanimate from "../../components/mobileanimation/Cardanimate";
import Shareinvite from "@/components/modals/Shareinvite";
import PrivateRoute from "@/components/Private/PrivateRoute";
import BlockPlayerModal from "@/components/modals/BlockPlayerModal";
import Exitpage from "@/components/modals/Exitpage";
import { useDispatch, useSelector } from "react-redux";
import { GetloggedData } from "@/redux/AppReducer/Action";
import CreateModel from "@/components/modals/CreateModel";
import Deposit from "@/components/modals/Deposit";

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
const GamePage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [gameStartCounter, setGameStartCounter] = useState(null);
  const [shareinvitecode, SetshareinviteCode] = useState(true);

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
  const [chips, setChip] = useState(2499000);
  const [sideShowModal, setSideShowModal] = useState(false);
  const [winReason, setWinReason] = useState(null);
  const [cardsInfo, setCardsInfo] = useState(null);
  const [Loggeduser, setLoggeduser] = useState(null);
  const [privateTableKey, setPrivateTableKey] = useState(null);
  const [showBlockPlayerModal, setBlockPlayerModal] = useState(false);
  const [selectedBlockPlayer, setSelectedBlockPlayer] = useState(null);
  const [ExituserModal, SetExituserModal] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const dispatch = useDispatch();
  const [buyCoins, setBuyCoins] = useState(false);
  const messagesRef = useRef(null);
  const getuserinfo = useSelector((store) => store.AppReducer.Userloggeddata);

  const temprref = useRef(null);
  console.log(getuserinfo);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const checkOrientation = () => {
    if (window.innerWidth <= window.innerHeight) {
      setIsLandscape(false);
      temprref.current = false;
    } else {
      setIsLandscape(true);
      temprref.current = true;
    }
  };
  console.log("private", privateTableKey);
  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [pathColor, setPathColor] = useState(COLOR_CODES.info.color);

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

  const containerRef = useRef(null);

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

  const socketRef = useRef(null);

  useEffect(() => {
    const Loggeduser = JSON.parse(localStorage.getItem("Loggeduser"));
    const privateTableKey = +JSON.parse(
      localStorage.getItem("privateTableKey")
    );
    const token = JSON.parse(localStorage.getItem("token"));
    setPrivateTableKey(() => privateTableKey);
    console.log(Loggeduser);
    setLoggeduser(() => Loggeduser);
    console.log(privateTableKey);
    console.log("connection start ");
    socketRef.current = io("https://dev-socket.sikkaplay.com/", {
      transports: ["websocket"],
    });
    console.log(temprref.current);
    if (temprref.current) {
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
    }

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
  console.log(Loggeduser?.avatar);
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
  console.log(isLandscape);
  console.log(temprref.current);

  return (
    <PrivateRoute>
      <div className=" relative  font-roboto bg-[url('https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/landingPage/sikkaplaybg.svg')] bg-cover bg-no-repeat w-[100%] h-screen overflow-y-hidden">
        {isLandscape && (
          <div className=" text-white game-container w-[100%] h-screen overflow-clip">
            <div className="max-w-7xl mx-auto">
              {/* navbar */}
              <div className="navbar w-full  h-[12vh]  flex px-2 justify-between m-0">
                <div className="nav-left-items basis-[25%] flex  items-center gap-5">
                  <div className="Image-container">
                    <Image
                      src={
                        "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/arrow-left.svg"
                      }
                      alt="left-arrow"
                      className="w-[100%]"
                      width={50}
                      height={50}
                      onClick={handleExitTable}
                    />
                  </div>
                  <button
                    className="relative custom-gradient px-3 py-1 ml-2"
                    onClick={() => {
                      setBuyCoins(true);
                    }}
                  >
                    <Image
                      src={
                        "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                      }
                      alt="left-arrow"
                      className="absolute  h-full left-[-35%] top-0"
                      width={50}
                      height={50}
                    />
                    <p className="text-xs lg:text-base">Buy Coins</p>
                  </button>
                </div>
                {players?.[playerId]?.turn && (
                  <div className="text-xs">
                    {players?.[playerId]?.playerInfo.userName} countdown:{" "}
                    {timeLeft}{" "}
                  </div>
                )}
                <div className="nav-right-items basis-[20%] flex items-center  justify-end gap-2">
                  {Object.keys(slotPlayerMap).length >= 2 && (
                    <div onClick={() => setIsChatOpen(true)}>
                      <Image
                        src={
                          "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/message.svg"
                        }
                        alt="message icon"
                        width={50}
                        height={50}
                        className="w-[100%] cursor-pointer"
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
                          className="w-[100%] cursor-pointer "
                        />
                      </div>
                    )}
                </div>
              </div>
              {/* game table */}
              <div className="game w-full h-[70vh]  ">
                <div className=" relative w-full h-full flex items-center justify-center">
                  <Image
                    src={
                      "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/table-background.svg"
                    }
                    alt="table"
                    width={800}
                    height={500}
                    className="w-[80%] h-[80%] z-[50] "
                  />
                  {tableDetails?.amount && (
                    <div className="absolute left-1/2 top-[30%]  -translate-x-1/2 -translate-y-1/2 z-[150] ">
                      <div className="relative ">
                        <Image
                          src={
                            "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                          }
                          alt="red-chip"
                          width={50}
                          height={50}
                          className="h-full  absolute left-[-1.5rem] top-[0rem] z-[30] "
                        />
                        <div className="relative bg-[#005427]  px-12 py-1 z-[20] text-xxs ">
                          {tableDetails?.amount}
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    className="absolute left-1/2 top-[22%]  -translate-x-1/2 -translate-y-1/2 bg-black rounded-md text-white px-2 py-1 cursor-pointer z-[100] text-xxs   "
                    onClick={() => {
                      if (chips >= 20) {
                        setChip((prev) => prev - 20);
                      }
                    }}
                  >
                    Tip
                  </button>
                  <Image
                    className="absolute left-[49%] top-3  w-[13%] ml:left-[49.5%] lg:w-[20%] lg:top-4 z-[51]  transform -translate-x-1/2 -translate-y-1/2 "
                    src={
                      "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/Game-host.svg"
                    }
                    alt="game-host"
                    width={80}
                    height={80}
                    unoptimized={false}
                    loading="eager"
                  />
                  {/* left-top */}
                  <div className="absolute h-[30%] w-[20%] ml:w-[17%] xs:left-[15%] xs:top-[-2%] ml:left-[18%]  lg:top-[-3%] lg:left-[13%]    z-[51]">
                    {/* image */}
                    <div className="relative inset-0 h-full  ">
                      <div className="w-[40%]  ml-auto flex flex-col justify-center items-center">
                        <p className="text-xxs mls:text-xs text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div
                          style={{
                            backgroundImage: `url(${
                              slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                ?.playerInfo?.avatar ||
                              "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                            })`,
                          }}
                          className="w-10 h-10 xs:w-10 xs:h-10 sm:w-12 sm:h-12 ml:w-14 ml:h-14 lg:w-24 lg:h-24 customsms:w-12 customsms:h-12    rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden    ring-1 ring-white "
                        >
                          {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                            ?.active && (
                            <div className="absolute w-full h-[30%] bg-GreyLight opacity-80   left-1/2 bottom-0 transform -translate-x-1/2  text-center text-xxs ml:text-xs   ">
                              {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                ?.packed
                                ? "packed"
                                : slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                    ?.seen
                                ? "Seen"
                                : "Blind"}
                            </div>
                          )}
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
                      </div>

                      {slotPlayerMap?.[(+playerSlotIndex + 4) % 7 || 7]
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
                      {slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                        ?.active && (
                        <div className="absolute left-0 bottom-0 w-[30%] ">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] ">
                            <Image
                              src="https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="absolute -left-5 lg:-left-8 h-full top-0"
                            />
                            <p className="text-xxs text-center py-[.05rem] lg:text-xl">
                              {
                                slotPlayerMap[(+playerSlotIndex + 4) % 7 || 7]
                                  ?.lastBet
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* right-top */}
                  <div className="absolute h-[30%] w-[20%]  ml:w-[17%] xs:right-[15%] xs:top-[-2%] ml:right-[18%]  lg:top-[-3%] lg:right-[13%]    z-[51]">
                    {/* image */}
                    <div className="relative inset-0 h-full  ">
                      <div className="w-[40%]  mr-auto flex flex-col justify-center items-center">
                        <p className="text-xxs mls:text-xs text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div
                          style={{
                            backgroundImage: `url(${
                              slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                ?.playerInfo?.avatar ||
                              "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                            })`,
                          }}
                          className="w-10 h-10 xs:w-10 xs:h-10 sm:w-12 sm:h-12 ml:w-14 ml:h-14 lg:w-24 lg:h-24 customsms:w-12 customsms:h-12    rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden   ring-1 ring-white "
                        >
                          {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                            ?.active && (
                            <div className="absolute w-full h-[30%] bg-GreyLight opacity-80   left-1/2 bottom-0 transform -translate-x-1/2  text-center text-xxs ml:text-xs   ">
                              {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                ?.packed
                                ? "packed"
                                : slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                                    ?.seen
                                ? "Seen"
                                : "Blind"}
                            </div>
                          )}
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
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 3) % 7 || 7]
                        ?.active && (
                        <div className="absolute right-0 bottom-0 w-[30%] ">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] ">
                            <Image
                              src="https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="absolute -left-5 lg:-left-8 h-full top-0"
                            />
                            <p className="text-xxs text-center py-[.05rem] lg:text-xl">
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
                  {/* left-middle */}
                  <div className="absolute h-[34%]  lg:h-[30%] w-[20%]  ml:w-[17%]  xs:left-[8%] xs:top-[30%] md:left-[12%]  ml:left-[12%] lg:left-[2%] lg:top-[30%]    z-[51]">
                    {/* image */}
                    <div className="relative inset-0 h-full space-y-3">
                      <div className="w-[40%]  mx-auto flex flex-col justify-center items-center ">
                        <p className="text-xxs mls:text-xs text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div
                          style={{
                            backgroundImage: `url(${
                              slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                ?.playerInfo?.avatar ||
                              "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                            })`,
                          }}
                          className="w-10 h-10 xs:w-10 xs:h-10 sm:w-12 sm:h-12 ml:w-14 ml:h-14 lg:w-24 lg:h-24 customsms:w-12 customsms:h-12    rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden   ring-1 ring-white "
                        >
                          {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                            ?.active && (
                            <div className="absolute w-full h-[30%] bg-GreyLight opacity-80   left-1/2 bottom-0 transform -translate-x-1/2  text-center text-xxs ml:text-xs   ">
                              {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                ?.packed
                                ? "packed"
                                : slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                                    ?.seen
                                ? "Seen"
                                : "Blind"}{" "}
                            </div>
                          )}
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
                      </div>

                      {slotPlayerMap[(+playerSlotIndex + 5) % 7 || 7]
                        ?.active && (
                        <div className=" left-1/2 bottom-0  w-[40%] mx-auto">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] ">
                            <Image
                              src="https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="absolute -left-5 lg:-left-8 h-full top-0"
                            />
                            <p className="text-xxs text-center py-[.05rem] xs:px-2 lg:text-xl">
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
                  {/* right-middle */}
                  <div className="absolute h-[34%] lg:h-[30%] w-[20%]  ml:w-[17%] xs:right-[8%] xs:top-[30%]  md:right-[12%] ml:right-[12%] lg:right-[2%] lg:top-[30%]     z-[51]">
                    {/* image */}
                    <div className="relative inset-0 h-full  space-y-3">
                      <div className="w-[40%]  mx-auto flex flex-col justify-center items-center ">
                        <p className="text-xxs mls:text-xs text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div
                          style={{
                            backgroundImage: `url(${
                              slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                ?.playerInfo?.avatar ||
                              "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                            })`,
                          }}
                          className="w-10 h-10 xs:w-10 xs:h-10 sm:w-12 sm:h-12 ml:w-14 ml:h-14 lg:w-24 lg:h-24 customsms:w-12 customsms:h-12    rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden   ring-1 ring-white "
                        >
                          {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                            ?.active && (
                            <div className="absolute w-full h-[30%] bg-GreyLight opacity-80   left-1/2 bottom-0 transform -translate-x-1/2  text-center text-xxs ml:text-xs   ">
                              {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                ?.packed
                                ? "packed"
                                : slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                                    ?.seen
                                ? "Seen"
                                : "Blind"}
                            </div>
                          )}
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
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 2) % 7 || 7]
                        ?.active && (
                        <div className=" right-1/2 bottom-0 w-[40%] mx-auto ">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] ">
                            <Image
                              src="https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="absolute -left-5 lg:-left-8 h-full top-0"
                            />
                            <p className="text-xxs text-center py-[.05rem] xs:px-2 lg:text-xl">
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
                  {/* left-bottom */}
                  <div className="absolute h-[30%] w-[20%] xs:left-[13%]  ml:w-[17%] xs:bottom-[-2%] ml:left-[16%]  lg:bottom-[1%] lg:left-[12%]    z-[51]">
                    {/* image */}
                    <div className="relative inset-0 h-full  ">
                      <div className="w-[40%]  ml-auto flex flex-col justify-center items-center">
                        <p className="text-xxs mls:text-xs text-center lg:text-base">
                          {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                            ? slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div
                          style={{
                            backgroundImage: `url(${
                              slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                ?.playerInfo?.avatar ||
                              "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                            })`,
                          }}
                          className="w-10 h-10 xs:w-10 xs:h-10 sm:w-12 sm:h-12 ml:w-14 ml:h-14 lg:w-24 lg:h-24 customsms:w-12 customsms:h-12    rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden   ring-1 ring-white "
                        >
                          {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                            ?.active && (
                            <div className="absolute w-full h-[30%] bg-GreyLight opacity-80   left-1/2 bottom-0 transform -translate-x-1/2  text-center text-xxs ml:text-xs   ">
                              {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                ?.packed
                                ? "packed"
                                : slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                                    ?.seen
                                ? "Seen"
                                : "Blind"}
                            </div>
                          )}
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
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 6) % 7 || 7]
                        ?.active && (
                        <div className="absolute left-0 bottom-0 w-[30%] ">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] ">
                            <Image
                              src="https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="absolute -left-5 lg:-left-8 h-full top-0"
                            />
                            <p className="text-xxs text-center py-[.05rem] lg:text-xl">
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
                  {/* right-bottom */}
                  <div className="absolute h-[30%] w-[20%] xs:right-[15%]  ml:w-[17%] xs:bottom-[-2%] ml:right-[18%]  lg:bottom-[1%] lg:right-[13%]    z-[51]">
                    {/* image */}
                    <div className="relative inset-0 h-full  ">
                      <div className="w-[40%]  mr-auto flex flex-col justify-center items-center">
                        <p className="text-xxs mls:text-xs text-center lg:text-base">
                          {slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                            ? slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                                .playerInfo.userName
                            : "Sit Down"}
                        </p>
                        <div
                          style={{
                            backgroundImage: `url(${
                              slotPlayerMap[(+playerSlotIndex + 1) % 7 || 7]
                                ?.playerInfo?.avatar ||
                              "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                            })`,
                          }}
                          className="w-10 h-10 xs:w-10 xs:h-10 sm:w-12 sm:h-12 ml:w-14 ml:h-14 lg:w-24 lg:h-24 customsms:w-12 customsms:h-12    rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden   ring-1 ring-white "
                        >
                          {slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                            ?.active && (
                            <div className="absolute w-full h-[30%] bg-GreyLight opacity-80   left-1/2 bottom-0 transform -translate-x-1/2  text-center text-xxs ml:text-xs   ">
                              {slotPlayerMap?.[(+playerSlotIndex + 1) % 7 || 7]
                                ?.packed
                                ? "packed"
                                : slotPlayerMap?.[
                                    (+playerSlotIndex + 1) % 7 || 7
                                  ]?.seen
                                ? "Seen"
                                : "Blind"}
                            </div>
                          )}
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
                      </div>
                      {slotPlayerMap[(+playerSlotIndex + 1) % 7 || 7]
                        ?.active && (
                        <div className="absolute right-0 bottom-0 w-[30%] ">
                          <div className="relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] ">
                            <Image
                              src="https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Game-table/red-chip.svg"
                              alt="red-chip"
                              width={50}
                              height={50}
                              className="absolute -left-5 lg:-left-8 h-full top-0"
                            />
                            <p className="text-xxs text-center py-[.05rem] lg:text-xl">
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
                  <div className="absolute h-[35%] w-[20%]  ml:w-[17%] z-[51] left-[40%] bottom-0  flex justify-center items-center">
                    <div
                      style={{
                        backgroundImage: `url(${
                          Loggeduser?.avatar ||
                          "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                        })`,
                      }}
                      className={`w-14 h-14 xs:w-14 xs:h-14 sm:w-16 sm:h-16 ml:w-20 ml:h-20 lg:w-32 lg:h-32  customsms:w-12 customsms:h-12    rounded-full  bg-center bg-no-repeat bg-cover relative overflow-hidden   ring-1 ring-white border-${
                        slotPlayerMap?.[playerSlotIndex]?.winner
                          ? "yellow-200 shadow-2xl shadow-yellow-300 "
                          : "yellow-400"
                      }  border-4 `}
                    >
                      {slotPlayerMap[+playerSlotIndex]?.packed && (
                        <div className="absolute w-full h-[100%] bg-GreyLight opacity-80   left-1/2 bottom-0 transform -translate-x-1/2  text-center text-xxs flex justify-center items-center   ">
                          <p className="text-xs xs:text-sm sm:text-base">
                            Packed
                          </p>
                        </div>
                      )}

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
                  </div>
                </div>
                <Cardanimate
                  cardsInfo={cardsInfo || players?.[playerId]?.cardSet?.cards}
                  seeplayingcard={players?.[playerId]?.seen}
                />
              </div>
              {/* footer */}
              <div className="footer h-[8vh] lg:h-[8vh] my-3  flex w-[80%] mx-auto justify-around ">
                {players?.[playerId]?.turn && !players?.[playerId]?.packed && (
                  <button
                    onClick={handlePack}
                    className="custom-gradient px-1  text-xxxs  xs:px-3  lg:px-4"
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
                      className="custom-gradient px-1  text-xxxs xs:text-xxs xs:px-3 lg:text-xl lg:px-4"
                    >
                      {tableDetails?.isShowAvailable ? "show" : "Side Show"}
                    </button>
                  )}

                <div
                  className={`relative bg-GreyDark opacity-80 border-GreyDark border-y-white border-y-[1px] transform flex justify-center items-center transition-transform duration-[3000] ease-in-out z-[200] `}
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
                  <p className=" text-center text-xs px-8  xs:text-sm lg:text-base">
                    {chips}
                  </p>
                </div>
                {players?.[playerId]?.turn && !players?.[playerId]?.packed && (
                  <div className="flex justify-between items-center gap-2 ">
                    <button
                      className="rounded-full border border-white flex justify-center items-center  text-center w-5 h-5 lg:w-8 lg:h-8"
                      onClick={handleDeduct}
                    >
                      &minus;
                    </button>
                    <button
                      onClick={handleBliend}
                      className="custom-gradient text-base  btn-parent group flex flex-row gap-1 "
                    >
                      <span className="btn-child group-hover:w-24 group-hover:h-24"></span>
                      <p className="basis-full text-xxxs xs:text-xxs ">
                        {isBliend ? "Blind" : "Chaal"}
                      </p>
                      <p className="text-xxxs xs:text-xxs ">{value}</p>
                    </button>

                    <button
                      className="bg-Secondary rounded-full border border-white  flex justify-center items-center w-5 h-5 lg:w-8 lg:h-8"
                      onClick={handleDouble}
                    >
                      +
                    </button>
                  </div>
                )}
                {!players?.[playerId]?.packed &&
                  players?.[playerId]?.active &&
                  !cardSee && (
                    <button
                      className=" custom-gradient btn-parent text-white group"
                      onClick={handleSeeCards}
                    >
                      <span className="btn-child"></span>
                      <span className="relative text-xxxs">See</span>
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}
        {isChatOpen && (
          <div className="fixed text-white   right-0 top-0 bottom-0 bg-black  opacity-90  z-[500] w-[40%] h-full ">
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
                      src={
                        "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/Avtar/fakehuman.svg"
                      }
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
                    className={`basis-[88%] text-black text-xs  font-extrabold bg-gray-300 z-[203] pl-3 py-1 rounded-md ${
                      msg.player.id === playerId && " bg-green-200 opacity-100 "
                    }`}
                  >
                    {msg.msg}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-[10%] basis-[70%]  flex justify-between gap-2 items-center px-4 ">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
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
                className="rounded-md text-black text-xs px-2 py-1 basis-[50%] md:basis-[70%] placeholder:text-black "
              />
              <button
                type="submit"
                onClick={handleSendMessage}
                className="custom-gradient rounded-md basis-[20%] py-1 text-xs text-white"
              >
                Send
              </button>
            </div>
          </div>
        )}
        {!temprref.current && (
          <div className="rotate-message bg-red-500 text-white p-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Please rotate your device for a better gaming experience.
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
        {temprref.current &&
          !(playerId && players?.[playerId]?.sideShowTurn && sideShowModal) &&
          notification && (
            <div className=" text-center  absolute px-10 py-6 bg-GreyDark opacity-80 text-white text-2xl left-1/2 top-[30%] transform -translate-x-1/2 -translate-y-1/2 font-semibold w-[80%] z-[200]">
              {notification}
            </div>
          )}
        {temprref.current && winReason && (
          <div className=" text-center  absolute px-10 py-6 bg-GreyDark opacity-80 text-white text-2xl left-1/2 top-[30%] transform -translate-x-1/2 -translate-y-1/2 font-semibold w-[80%] z-[200]">
            {winReason}
          </div>
        )}
        {temprref.current &&
          players?.[playerId]?.active &&
          gameStartCounter !== 0 &&
          gameStartCounter !== null &&
          !notification && (
            <div className="text-center  absolute px-10 py-6 bg-GreyDark opacity-80 text-white text-2xl left-1/2 top-[30%] transform -translate-x-1/2 -translate-y-1/2 font-semibold w-[80%] z-[200]">
              Game Starts in {gameStartCounter} Seconds
            </div>
          )}
        {temprref.current &&
          !players?.[playerId]?.active &&
          gameStartCounter !== 0 &&
          !notification && (
            <div className="text-center  absolute px-10 py-3 bg-GreyDark opacity-80 text-white text-2xl left-1/2 top-[10%] transform -translate-x-1/2 -translate-y-1/2 font-semibold w-[80%] z-[200]">
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
  );
};

export default GamePage;
