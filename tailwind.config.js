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
        'text-dark':'#212121'        
      },
      fontFamily:{
        'poppins':['Poppins','sans-serif']
      }
    },
  },
  plugins: [],
};
