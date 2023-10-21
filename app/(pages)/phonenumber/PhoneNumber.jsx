/* eslint-disable react/no-unescaped-entities */
"use client";
import { toast } from "react-toastify";
import React, { useState, FC, useRef, useEffect } from "react";
import orline from "../../../public/assets/users/orline.svg";
import Image from "next/image";
import googlelogo from "../../../public/assets/users/gogle.svg";
import { useRouter } from "next/navigation";
import { googleSignIn, setUpCaptcha } from "../../Google/Google";
import Toast from "../notification/Toast";
import { useDispatch } from "react-redux";
import {
  Loginpost,
  Phoneloginpost,
  Signuppost
} from "@/redux/AuthReducer/Action";
import Link from "next/link";
// import { Phoneloginpost } from "@/redux/redux/AuthReducer/Action";

const countryCodes = [
  {
    code: "+91",
    country: "IN",
    image:
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IN.svg",
  },
  {
    code: "+1",
    country: "Us",
    image:
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/US.svg",
  },
  {
    code: "+44",
    country: "Uk",
    image:
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GB.svg",
  },
  {
    code: "+49",
    country: "Ger",
    image:
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DE.svg",
  },
  {
    code: "+91",
    country: "IN",
    image:
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IN.svg",
  },
  {
    code: "+93",
    country: "Af",
    image:
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AF.svg",
  },
];

const confirmationResult = null;

const PhoneNumber = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[0].code
  );
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeotpindex, setActiveOtpindex] = useState(0);
  const inputRef = useRef(null);
  const [adotp, SetadOTP] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [temp, setTemp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null); // Use ConfirmationResult type or null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  const calculateButtonColor = (input) => {
    if (input.length < 10) {
      return "bg-[#636363]";
    } else {
      return "bg-gradient-to-t from-[#AD0B40] to-[#FF1917]";
    }
  };

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
  };
  const buttonColor = calculateButtonColor(phoneNumber);
  const handleOnchange = (e, index) => {
    const { value } = e.target;
    const newOTP = [...otp];
    newOTP[index] = value.substring(value.length - 1);

    if (!value) {
      setActiveOtpindex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else {
      setActiveOtpindex((prevIndex) => Math.min(prevIndex + 1, 5));
    }

    setOtp(newOTP);
    const Aotp = newOTP;
    const otpArry = Aotp.join("");
    SetadOTP(otpArry);
  };

  const handleKeydown = ({ key }, index) => {
    if (key === "Backspace") {
      if (!otp[index]) {
        setActiveOtpindex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    }
  };

  const handleGoogleLogin = async () => {
    if (!isChecked) {
      toast.error("You must be at least 18 years old.");
    } else {
      try {
        const user = await googleSignIn();
        console.log(user);

        const loginuser = {
          email: user?.user?.email,
        };

        if (user?.user?.accessToken) {
          const payload = {
            name: user.user.displayName,
            email: user.user.email,
            avatar: user.user.photoURL,
          };

          // Make the signup API call
          Signuppost(payload)(dispatch)
            .then((res) => {
              console.log("user backend send response", res);
              //  console.log("err",res.error)
              if (
                res?.type === "SIGNUPUSERSUCESS" &&
                res?.payload?.msg === "User created successfully"
              ) {
                Loginpost(loginuser)(dispatch)
                  .then((res) => {
                    console.log("res", res);
                    if (
                      res?.type === "LOGINUSERSUCESS" &&
                      res?.payload.msg ===
                        "login successful, please take the token and keep it safe"
                    ) {
                      localStorage.setItem(
                        "Loggeduser",
                        JSON.stringify(res?.payload?.resData)
                      );
                      localStorage.setItem(
                        "token",
                        JSON.stringify(res?.payload?.token)
                      );
                      toast.success("Signup Sucesssful");
                      router.push("/dashboard");
                    } else {
                      toast.error("something went wrong");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    toast.error(err);
                  });
              }

              if (
                typeof res === "undefined" ||
                typeof res.status === "undefined"
              ) {
                Loginpost(loginuser)(dispatch)
                  .then((res) => {
                    console.log("login", res);
                    if (
                      res?.type === "LOGINUSERSUCESS" &&
                      res?.payload.msg ===
                        "login successful, please take the token and keep it safe"
                    ) {
                      localStorage.setItem(
                        "Loggeduser",
                        JSON.stringify(res?.payload?.resData)
                      );
                      localStorage.setItem(
                        "token",
                        JSON.stringify(res?.payload?.token)
                      );
                      toast.success("Signup Sucesssful");
                      router.push("/dashboard");
                    } else {
                      toast.error("something went wrong");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    toast.error(err);
                  });
              }
            })
            .catch((err) => {
              console.error("Error during signup API call:", err.status);
              toast.error("Error during signup. Please try again later.");
            });
        }
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorCode);
        console.error("Error during Google sign-in:", error);
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeotpindex]);

  const PhNumber = selectedCountryCode + phoneNumber;
  console.log("phone", PhNumber);
  console.log(phoneNumber);

  const Loggeduser = () => {
    const datauser = localStorage.getItem("Loggeduser");
    const logedinfo = datauser ? JSON.parse(datauser) : null;
    if (!logedinfo) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGetOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isChecked) {
      toast.error("Please confirm that you are 18 or older.");
      setLoading(false);
      return; // Exit the function if the age check fails
    }
    setError("");

    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return setError("Please enter a valid phone number!");
    }

    try {
      const res = await setUpCaptcha(PhNumber); // Fixed variable name
      toast.success("OTP Sent Successfully");
      setConfirmationResult(res);

      setTemp(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleverifyOTP = async (confirmationResult, adotp) => {
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(adotp);

      console.log("usercre", userCredential);
      // router.push("/createuser");
      const payload = {
        phone: phoneNumber,
      };
      localStorage.setItem("userphone", JSON.stringify(payload));
      dispatch(Phoneloginpost(payload))
        .then((res) => {
          console.log("res", res);
          if (res?.type === "PHONELOGINUSERSUCESS") {
            localStorage.setItem(
              "Loggeduser",
              JSON.stringify(res?.payload?.resData)
            );
            localStorage.setItem("token", JSON.stringify(res?.payload?.token));
            setLoading(false);
            toast.success("Verified successfully");
            Loggeduser();
          } else {
            router.push("/createuser");
            toast.success("Verified successfully");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log("err", err);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      console.log(err.message);
      toast.error("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {confirmationResult ? (
        <div className=" mx-auto border-yellow-500 ">
          <label htmlFor="OTP" className="text-white  text-sm">
            Enter OTP
          </label>

          <div className="w-[100%] pt-2 border-red-500 flex justify-center items-center gap-1 space-x-2">
            {otp.map((_, index) => {
              return (
                <React.Fragment key={index}>
                  <input
                    ref={index === activeotpindex ? inputRef : null}
                    type="number"
                    maxLength={1}
                    placeholder="  -"
                    className="w-[100%]  h-[62px]  rounded bg-[#1E1E1E]
                outline-none text-center  font-semibold text-xl spin-button-none border-gray-400
                 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                    onKeyDown={(e) => handleKeydown(e, index)}
                    onChange={(e) => handleOnchange(e, index)}
                    value={otp[index]}
                  />
                </React.Fragment>
              );
            })}
          </div>
          <div
            onClick={() => handleverifyOTP(confirmationResult, adotp)}
            className={` ${
              otp.length < 6
                ? "bg-[#636363]"
                : "bg-gradient-to-t cursor-pointer from-[#AD0B40] to-[#FF1917]"
            } py-2 px-2 mt-5  bg-[#636363] flex 
             cursor-pointer
            items-center justify-center border-yellow-600 rounded-md`}
          >
            <button
              type="submit"
              className="text-white py-1 px-2 font-semibold text-sm text-center "
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
                "Verify"
              )}
            </button>
          </div>

          <div className="py-5 px-2 flex items-center justify-center border-yellow-600 rounded-md">
            <div className="flex justify-between gap-2 border-red-600">
              <h2 className="text-[#1E1E1E] text-sm sm:text-base font-semibold">
                Didn't Revice any Code?
              </h2>
              <h2
                onClick={() => handleverifyOTP(confirmationResult, adotp)}
                className="text-white cursor-pointer text-sm sm:text-base"
              >
                Resend Code
              </h2>
            </div>
          </div>

          <div className="py-5 px-2 flex items-center justify-center border-yellow-600 rounded-md">
            <div className="flex justify-between gap-2 border-red-600">
              <h2 className="text-[#1E1E1E] text-sm sm:text-base  font-semibold">
                Don't have an account?{" "}
              </h2>
              <h2 className="text-red-500 text-sm sm:text-base  underline block">
                {" "}
                SignUp{" "}
              </h2>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleGetOTP}>
          <div className="w-[100%]">
            <div id="recaptcha-container"></div>
            <label htmlFor="phone" className="text-white m-1 text-sm">
              Phone Number
            </label>
            <div className="flex  justify-between py-1  border-red-700 items-center">
              <select
                className="w-[60%] sm:w-1/2 md:w-1/3 mr-2 text-white bg-[#1E1E1E] border-red-800 p-2 rounded"
                value={selectedCountryCode}
                onChange={handleCountryCodeChange}
              >
                {countryCodes.map((countryCode, i) => (
                  <option
                    className="flex justify-between"
                    key={i}
                    value={countryCode.code}
                  >
                    {countryCode.country} {countryCode.code}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                className="w-full text-white text-sm px-4 bg-[#1E1E1E] border-red-600 sm:w-2/3 p-2 rounded "
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
            <div className="px-2 py-2 pt-5 border-yellow-500">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-500"
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2 text-white">are you 18 +</span>
              </label>
            </div>
            <div
              onClick={handleGetOTP}
              className={`py-2 px-2 mt-5 ${buttonColor} flex items-center 
                justify-center cursor-pointer border-yellow-600 rounded-md`}
            >
              <button
                type="submit"
                className="text-white py-1 px-2 cursor-pointer font-normal text-sm text-center"
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
                  "Get OTP"
                )}
              </button>
            </div>

            <div className="px-2 py-4 flex items-center justify-center border-yellow-600 rounded-md">
              <Image src={orline} alt="orline" />
            </div>

            <div className=" py-2">
              <div
                onClick={handleGoogleLogin}
                className="py-2 hover:cursor-pointer bg-[#1E1E1E] flex items-center justify-center border-yellow-600 rounded-md"
              >
                <div className="py-1 px-2 flex justify-between gap-2 border-red-600">
                  <Image src={googlelogo} alt="googlelogo" />
                  <h2 className="text-white text-center m-auto text-sm">
                    {" "}
                    Continue with Google{" "}
                  </h2>
                </div>
              </div>
            </div>

            <div className="py-5 px-2 flex items-center justify-center border-yellow-600 rounded-md">
              <div className="flex justify-between gap-2 border-red-600">
                <h2 className="text-[#636363] text-sm sm:text-base font-normal">
                  Don't have an account?{" "}
                </h2>
                <h2 className="text-[#CA2446] text-sm hover:cursor-pointer font-normal sm:text-base underline block">
                  {" "}
                  <Link href={"/createuser"}>SignUp</Link>
                </h2>
              </div>
            </div>
            <Toast />
          </div>
        </form>
      )}
    </>
  );
};

export default PhoneNumber;

/**
 *  const handleGoogleLogin = async () => {
    if (!isChecked) {
      toast.success("min age 18 Check if you are 18");
    } else {
      try {
        const user = await googleSignIn();
        console.log(user);
            if(user?.user?.accessToken) {

            }
        const payload = {
          name: user?.user?.displayName,
          email: user?.user?.email,
          avatar: user?.user?.photoURL,
        };
       
        const loginuser = {
          email: user?.user?.email,
        };
        console.log("loginuser", loginuser);
        
        Signuppost(payload)(dispatch)
          .then((res) => {
            console.log("userbackendsendresponse", res);
            
            //  Loginpost(loginuser)(dispatch)
            //    .then((res) => {
            //      console.log("res", res);
            //      if (
            //        res?.type === "LOGINUSERSUCESS" &&
            //        res?.payload.msg ===
            //          "login successful, please take the token and keep it safe"
            //      ) {
            //        localStorage.setItem(
            //          "Loggeduser",
            //          JSON.stringify(res?.payload?.resData)
            //        );
            //        localStorage.setItem(
            //          "token",
            //          JSON.stringify(res?.payload?.token)
            //        );
            //        toast.success("Signup Sucesssful");
            //        router.push("/dashboard");
            //      } else {
            //        toast.error("something went wrong");
            //      }
            //    })
            //    .catch((err) => {
            //      console.log(err);
            //      toast.error(err);
            //    });
         
          })
          .catch((err) => {
            console.log(err.error);
            toast.error(err);
          });
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    }
  };
 */
