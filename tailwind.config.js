/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'selector',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        'bg':'#F4F6FD',
        'dark-blue':'#392755',
        'dark':'#423E78',
        'light':{
          100:'#FDFCFD',
          200:'#F4F4F8',
          400:'#BCBCBC',
          500:'#EBE9F8',
          600:'#C2C3CB'
        },
        'accent':'#B2A6FF',
        'dark:text-white':'#212121'        
      },
      fontFamily:{
        'poppins':['Poppins','sans-serif']
      },
      screens:{
        "min-3xl":"1366px",
        "max-5xl":{max:"1660px"},
        "max-4xl":{max:"1440px"},
        "max-3xl":{max:"1366px"},
        "max-2xl":{max:"1280px"},
        "max-xl":{max:"1166px"},
        "max-lg":{max:"1024px"},
        "max-tab":{max:"990px"},
        "max-sm-tab":{max:"768px"},
        "max-xs-tab":{max:"749px"},
        "max-md-mb":{max:"600px"},
        "max-sm-mb":{max:"414px"}
      }
    },
  },
  plugins: [],
};
