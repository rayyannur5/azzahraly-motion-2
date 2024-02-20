/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("daisyui"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": { display: "none" },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".transparent-scrollbar::-webkit-scrollbar": {
          "background-color": "transparent",
          width: "10px",
        },
        // ".transparent-scrollbar::-webkit-scrollbar-track": {
        //   padding: "3px",
        // },
        ".transparent-scrollbar::-webkit-scrollbar-thumb": {
          "background-color": "lightblue",
          "border-radius": "10px",
        },
        "input::-webkit-outer-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
        "input::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
