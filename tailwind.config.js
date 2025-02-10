/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-dashboard': "#0B57B9",
        'login': "#fafbfc",
        'login-text':"#828d9f",
        'login-border':"#ccc",
        'login-button': "#1b6ec2",
      },
      width: {
        '16/18': '88.88%',  
        '2/18' : '11.11%'
      },
      screens: {
        'phone': {'max': '751px'}, 
        'phoneLarge': {'min': '550px', 'max': '751px'}, 
        'tabletSmall': {'min': '751px','max': '769px'},
        'tabletLarge': {'min': '769px', 'max': '1200px'}, 
        'tablet': {'min': '751px', 'max': '1024px'}, 
        'desktop': {'min': '1025px'},
        'desktopLarge': {'min': '2600px'},
    }    
    },
  },
  plugins: [],
}

