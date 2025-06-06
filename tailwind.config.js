module.exports = {
  darkMode: 'class', 
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        synerque: {
          dark: '#111827',
          base: '#1F2937',
          accent: '#3B82F6',
          hover: '#374151'
        },
        'work-main': '#3B82F6',
        'work-part': '#F59E0B',
        'work-rest': '#EF4444'
      },
      spacing: {
        '18': '4.5rem'
      }
    }
  }
}
