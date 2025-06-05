module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
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
