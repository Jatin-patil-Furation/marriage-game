/* eslint-disable react/no-unescaped-entities */
"use client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import orline from "../../../public/assets/users/orline.svg";
import Image from "next/image";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { auth } from "../../Firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "../notification/Toast";

import { useDispatch } from "react-redux";
import { Loginpost } from "@/redux/AuthReducer/Action";

const EmailLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigateTosignupPage = () => {
    router.push("/createuser");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isFormValid = () => {
    const { email, password } = formData;
    return email.trim() !== "" && password.trim() !== "";
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

 
  console.log("formdata",formData)
 const handleSubmit = (e) => {
   e.preventDefault();
   const { email, password } = formData;

   if (email.trim() === "" || password.trim() === "") {
     toast.error("Please fill in both email and password fields.");
     return;
   }
    
   if (email.trim() !=="" && password.trim()!=="" ){
 setLoading(true);

 signInWithEmailAndPassword(auth, formData.email, formData.password)
   .then((userCredential) => {
     Loginpost(formData)(dispatch)
       .then((res) => {
         if (res?.type === "LOGINUSERSUCESS") {
           localStorage.setItem(
             "Loggeduser",
             JSON.stringify(res?.payload?.resData)
           );
           localStorage.setItem("token", JSON.stringify(res?.payload?.token));
           toast.success("Login Success");
           Loggeduser();
           setFormData({
             email: "",
             password: "",
           });
         } else if (res.type === "LOGINUSERFAILURE") {
           toast.error("Wrong password");
           setFormData({
             ...formData,
             password: "", // Clear only the password field
           });
         }
       })
       .catch((err) => {
         console.log(err);
         setLoading(false);
         toast.error("An error occurred during login.");
       })
       .finally(() => {
         setLoading(false);
       });
   })
   .catch((error) => {
     const errorCode = error.code;
     const errorMessage = error.message;
      // setFormData({
      //   email: "",
      //   password: "",
      // });
     setLoading(false);
     toast.error(errorMessage); // Display the specific error message to the user
   });
   }
  
 };



  return (
    <div className="w-[100%] px-2">
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone" className="text-white m-1   text-sm">
          Email address
        </label>
        <div className="flex justify-between py-1  border-red-700 items-center">
          <input
            type="email"
            name="email"
            className="w-full text-white px-4 bg-[#1E1E1E]
           border-red-600  p-2 rounded "
            placeholder=" Email Address"
            onChange={handleInputChange}
          />
        </div>
        <label htmlFor="password" className="text-white m-1   text-sm">
          Password
        </label>

        <div className="relative py-1  border-red-500">
          <input
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            autoComplete="current-password"
            required
            className="appearance-none  relative block
           w-full px-4 py-2 bg-[#1E1E1E] 
              border-none
              text-white  p-2 rounded
               z-10 "
            placeholder="Password"
            onChange={handleInputChange}
          />
          <div
            className="absolute  px-4 border-green-500 
          inset-y-0 right-0 
         flex items-center z-10 text-sm leading-5"
          >
            <button
              type="button"
              className="text-white"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <AiFillEyeInvisible className="h-5 w-5" />
              ) : (
                <AiFillEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div
          onClick={handleSubmit}
          className={`py-2 px-2 mt-5 
         ${
           isFormValid()
             ? "bg-gradient-to-t from-[#AD0B40] to-[#FF1917]"
             : "bg-[#636363]"
         }
       flex items-center justify-center
        cursor-pointer
       border-yellow-600 rounded-md`}
        >
          <button
            type="submit"
            disabled={loading}
            className={`text-white hover:cursor-pointer py-1 px-2 font-semibold text-sm text-center `}
          >
            {loading ? (
              <div className="w-[50%] flex items-center h-[15px] m-auto  ">
                <Image
                  src={`https://s3.us-east-2.amazonaws.com/sikkaplay.com-assets/assets/users/loading.gif`}
                  alt="loader"
                  width={200}
                  height={100}
                />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
      <div className="px-2 py-4 flex items-center justify-center border-yellow-600 rounded-md">
        <Image src={orline} alt="orline" />
      </div>

      <div className="py-5 px-2 flex items-center justify-center border-yellow-600 rounded-md">
        <div className="flex justify-between gap-2 border-red-600">
          <h2 className="text-[#636363] text-sm sm:text-base font-normal">
            Don't have an account?{" "}
          </h2>
          <h2
            onClick={navigateTosignupPage}
            className="text-[#CA2446] hover:cursor-pointer text-sm font-normal sm:text-base underline block"
          >
            {" "}
            SignUp{" "}
          </h2>
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default EmailLogin;
 // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const { email, password } = formData;
  //   if (email.trim() === "" || password.trim() === "") {
  //      setLoading(false);
  //     toast.error("Please fill in both password fields.");
  //     return ;
  //   }
  //   setLoading(true);
  //   signInWithEmailAndPassword(auth, formData.email, formData.password)
  //     .then((userCredential) => {
  //       console.log("usercredentail", userCredential);

  //       Loginpost(formData)(dispatch)
  //         .then((res) => {
  //           console.log("resapi", res);
  //           if (res?.type === "LOGINUSERSUCESS") {
  //             localStorage.setItem(
  //               "Loggeduser",
  //               JSON.stringify(res?.payload?.resData)
  //             );
  //             localStorage.setItem(
  //               "token",
  //               JSON.stringify(res?.payload?.token)
  //             );
  //             setLoading(false);
  //             toast.success("Login Sucesss");
  //             Loggeduser();
  //           }
  //           else  if (res.type === "LOGINUSERFAILURE") {
  //              setLoading(false);
  //              toast.error("Wrong password");
  //               setFormData({
  //                 email: "",
  //                 password: "",
  //               });
  //            }
  //            setFormData({
  //              email: "",
  //              password: "",
  //            });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //            setFormData({
  //              email: "",
  //              password: "",
  //            });
  //           toast.error(err);
  //           setLoading(false);
           
  //         });
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
       
  //       console.log(errorCode);
  //        setFormData({
  //          email: "",
  //          password: "",
  //        });
  //       toast.error(errorCode);
        
  //       setLoading(false);
  //     });
  //   // console.log(formData);
  // };
  