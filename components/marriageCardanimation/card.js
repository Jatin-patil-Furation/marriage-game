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
      id: 0.6868968968698,
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
    {
      type: "spade",
      rank: 8,
      name: "8",
      priority: 8,
      id: 0.986865686858,
    },
  ]);
  const [selectedCards, setSelectedCards] = useState([]);
  const handleCardClick = (data) => {
    if (selectedCards.some((selectedData) => selectedData.id === data.id)) {
      // If the card data is already selected, remove it from the selection.
      setSelectedCards(
        selectedCards.filter((selectedData) => selectedData.id !== data.id)
      );
    } else {
      // If the card data is not selected, add it to the selection.
      setSelectedCards([...selectedCards, data]);
    }
  };
  console.log("slectedcard", selectedCards);

  return (
    <>
      <div className="w-[100vw]  m-auto">
        <div className="marriagecontainer w-lg sm:w-xl md:w-mxl lg:w-[1660px] flex h-25">
          {cardSet.length > 0 &&
            cardSet.map((el, index) => {
              const rightOffset = index * 1.1 + 1.6; // Adjust these values as needed
              const isSelected = selectedCards.some(
                (selectedData) => selectedData.id === el.id
              );
              const cardClassName = `marrigecard relative border-blue-700 h-[6rem] w-[5rem] ${
                index === 0 ? "left-[-.5rem]" : ""
              }  ${isSelected ? "clicked selected" : ""}`;

              return (
                <div
                  key={el.id}
                  className={cardClassName}
                  onClick={() => handleCardClick(el)}
                  style={{
                    right: `${rightOffset}rem`,
                    zIndex: isSelected ? 1 : 0,
                  }}
                  data-suite={el.type}
                  data-value={el.name}
                >
                  <div className={`front ${isSelected ? "overlay" : ""}`}>
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
