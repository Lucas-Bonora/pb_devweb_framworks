/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bronzeBg: "#FDF7F5",
        bronzeComponent: "#E7D9D3",
        bronzeBorder: "#ABBDF9",
        bronzeButtons: "#8EC8F6",
        bronzeSecondaryText: "#7D5E54",
        bronzePrimaryText: "#1F2D5C",
      }
    },
  },
  plugins: [],
};
