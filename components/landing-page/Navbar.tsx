"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar: React.FC = () => {
   const router = useRouter()

   const navigateToLoginPage = () => {
     router.push("/login");
   };
     const navigateTosignupPage = () => {
       router.push("/createuser");
     };

       const Loggeduser = () => {
         const datauser = localStorage.getItem("Loggeduser");
         const logedinfo = datauser ? JSON.parse(datauser) : null;
         if (!logedinfo) {
           router.push("/login");
         } else {
           router.push("/dashboard");
         }
       };

  return (
    <nav className="mx-auto  px-[1.2rem] z-20  items-center flex justify-between shape">
      <div
        onClick={() => router.push("/")}
        className="px-6 pb-1 flex justify-center items-center sm:w-[38%] md:w-[35%] lg:w-[22%]  border-red-600"
      >
        <img
          src={
            "https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/hero/hero-heading.svg"
          }
          alt={"logo"}
          className="mb-2"
        />
      </div>

      <div className="flex justify-center  px-8 items-center space-x-4 ">
        <button
          onClick={Loggeduser}
          className="text-white py-2 px-8 text-base rounded 
        hover:bg-gradient-to-t from-[#AD0B40] to-[#FF1917] 
         bg-opacity-15 border border-white 
          hover:border-none duration-200 ease-in	"
        >
          Login
        </button>

        <button
          onClick={navigateTosignupPage}
          className=" text-base py-2  px-8   rounded bg-white text-[#ad0b40]  border-white  hover:bg-gradient-to-t from-[#AD0B40] to-[#FF1917]  bg-opacity-15 hover:text-white hover:border-none"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
