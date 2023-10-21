"use client";
import { GetloggedData } from "@/redux/AppReducer/Action";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Exitpage = ({ SetExituserModal }) => {
   const dispatch = useDispatch();
   const getuserinfo = useSelector((store) => store.AppReducer.Userloggeddata);
  
  const QuitGame = () => {
       GetloggedData(dispatch);
    window.location.href = "/dashboard";
  };

  return (
    <div className="fixed inset-0 z-[201] flex items-center justify-center">
      <div className="fixed inset-0 bg-[#111111] opacity-50"></div>
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-Background py-3 px-10 sm:py-5  md:py-7 lg:py-9 flex flex-col gap-5 items-center   z-[100]">
        <p className="text-center text-white text-base sm:text-lg md:text-xl lg:text-2xl">
          Are you sure you want to Quit the game?
        </p>
        <div className="flex justify-between basis-full gap-3">
          <button
            onClick={() => {
              SetExituserModal(false);
            }}
            className="border border-opacity-100 px-5 py-2 text-sm text-white rounded-sm  sm:text-base md:text-lg lg:text-xl  "
            style={{
              borderImage:
                "linear-gradient(111deg, rgba(173, 11, 64, 0.88) 9.86%, #ff1917 63.95%) 1",
            }}
          >
            Cancel
          </button>
          <button
            className="custom-gradient text-white px-5 py-2 text-sm rounded-sm sm:text-base md:text-lg lg:text-xl "
            onClick={QuitGame}
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exitpage;
