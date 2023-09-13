/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      gridTemplateColumns: { // tailwind'de gridler sabittir biz farklı ekleyebiliyoruz!
        "card": "repeat(auto-fill,minmax(300px,1fr))",
        "adminlinks": "repeat(auto-fill,minmax(120px,1fr))",
      },
    },
  },
  plugins: [],
}

