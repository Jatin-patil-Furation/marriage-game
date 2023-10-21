"use client";


import React, { useEffect, useState } from "react";
import "./ani.css";
const MarriageCard = () => {
  const [cardSetdata, setCardSetdata] = useState([
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.896868968,
    },
    {
      type: "joker",
      rank: 15,
      name: "joker",
      priority: 2,
      id: 0.6868968968698,
    },
    {
      type: "master",
      rank: 16,
      name: "master",
      priority: 2,
      id: 0.8689587574,
    },
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.798686868968,
    },
    {
      type: "spade",
      rank: 12,
      name: "Q",
      priority: 12,
      id: 0.869868686842,
    },
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.90696868682309732,
    },
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.9069868268688986,
    },
    {
      type: "spade",
      rank: 12,
      name: "Q",
      priority: 12,
      id: 0.8689689686,
    },
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.97906983648686,
    },
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.2108136333867,
    },
    {
      type: "spade",
      rank: 12,
      name: "Q",
      priority: 12,
      id: 0.1411467108968668,
    },
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.74527675029347464,
    },
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.2108136830290467,
    },
    {
      type: "spade",
      rank: 12,
      name: "Q",
      priority: 12,
      id: 0.1411467029474668027,
    },
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.74527686686846419,
    },
    {
      type: "spade",
      rank: 12,
      name: "Q",
      priority: 12,
      id: 0.1411463868362268027,
    },
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.74527675555546419,
    },
    {
      type: "heart",
      rank: 2,
      name: "J",
      priority: 2,
      id: 0.21081363868690467,
    },
    {
      type: "spade",
      rank: 12,
      name: "Q",
      priority: 12,
      id: 0.38743949047,
    },
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.6757575757598588,
    },
    {
      type: "diamond",
      rank: 4,
      name: "4",
      priority: 4,
      id: 0.98658686858,
    },
  ]);
  const [selectedCards, setSelectedCards] = useState([]);
   const [sentCards, setSentCards] = useState([]);


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
   // Simulate sending selected card data to the backend. Replace with an actual API call.
   
   // Update the sentCards state with the selected cards
   setSentCards([...sentCards, ...selectedCards]);
   // Clear the selected state depending on which set of cards is being sent
   if (selected === "selectedCards") {
     setSelectedCards([]);
   } 
 };

  const handleCardCancel = () => {
    setSentCards([]);
    setSelectedCards([]);
    setSelected2([]);
    setSelected3([]);
  };

    console.log("sentcard", sentCards);
     console.log("setSlected card", selectedCards);

  return (
    <>
      {/* <div className="border-2 top-[-5rem] left-40 gap-5 relative">
        <button
          className="bg-white"
          onClick={() => handleSendToBackend("selectedCards")}
        >
          Show card
        </button>

        <button onClick={handleCardCancel} className="bg-white relative left-5">
          Cancel card
        </button>
      </div> */}

      <div className="w-[100vw]  m-auto">
        <div className="marriagecontainer w-lg sm:w-xl md:w-mxl lg:w-[1660px] flex h-25">
          {cardSetdata.length > 0 &&
            cardSetdata.map((el, index) => {
              const rightOffset = index * 1.1 + 1.6; // Adjust these values as needed
              const isSelected = selectedCards.some(
                (selectedData) => selectedData.id === el.id
              );
              const isActive = sentCards.some(
                (sentCard) => sentCard.id === el.id
              );

              const cardClassName = `marrigecard relative border-blue-700 h-[6rem] w-[5rem] ${
                index === 0 ? "left-[-.5rem]" : ""
              }  ${isSelected ? "clicked selected" : ""}  ${
                isActive ? "active" : ""
              }`;

              return (
                <div
                  key={el.id}
                  className={cardClassName}
                  // onClick={() => handleCardClick(el)}
                  onClick={() => handleCardClick(el, "selectedCards")}
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
    </>
  );
};

export default MarriageCard;
