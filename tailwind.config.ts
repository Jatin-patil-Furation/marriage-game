import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        Secondary: "#CA2446",
        Background: "#0E0D0C",
        GreyDark: "#1E1E1E",
        GreyLight: "#636363",
      },
      fontFamily: {
        roboto: ["Roboto", "sans"],
      },
      fontSize: {
        xxxs: ".45rem",
        xxs: ".5rem",
        xm: ".55rem",
      },
      screens: {
        xs: "560px",
        sm: "640px",
        md: "768px",
        mds: "780px",
        ml: "810px",
        mls: "844px",
        mlg: "896px",
        mlx: "926px",
        lg: "1024px",
        sml: "1100px",
        xl: "1280px",
        mxl: "1400px",
        mxxl: "1600px",
        // customsm: {
        //   raw: "(min-width: 320px) and (max-width: 360px) and (min-height: 568px) and (max-height:780px )",
        // },
        // customsm: {
        //   raw: "(min-width: 568px) and (max-width: 780px) and (min-height: 320px) and (max-height: 361px)",
        // },
        // customsms: {
        //   raw: "(min-width: 780px) and (max-width: 813px) and (min-height: 361px) and (max-height: 376px)",
        // },
        // customsms: {
        //   raw: "(min-height: 361px) and (min-width:781px) and (max-width:812px) and (max-height:375px) ",
        // },
        // custommd: {
        //   raw: "(min-height: 376px) and (min-width:812px) and (max-width:896px) and (max-height:414px) ",
        // },
        // custommds: {
        //   raw: "(min-height: 415px) and (min-width:896px) and (max-width:926px) and (max-height:428px) ",
        // },
        // customlg: {
        //   raw: "(min-height: 429px) and (min-width:926px) and (max-width:1024px) and (max-height:768px) ",
        // },
        // customlgs: {
        //   raw: "(min-height: 767px) and (min-width:1024px) and (max-width:1180px) and (max-height:820px) ",
        // },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
export default config;

//570
