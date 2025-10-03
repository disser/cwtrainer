# CW Trainer - Morse Code Practice Application

A web-based morse code practice application built with Svelte for improving your CW (Continuous Wave) receiving skills.

## Features

- **2-Minute Practice Rounds**: Timed sessions to maximize your practice efficiency
- **Real-time WPM Tracking**: See your words per minute score based on the Paris standard
- **Customizable Settings**: 
  - Adjustable speed (WPM)
  - Configurable tone frequency
  - Select character sets: A-Z letters, numbers, punctuation, and accented characters
- **Performance Analytics**:
  - Rolling average WPM over last 10 letters
  - Per-letter response time tracking
  - Accuracy percentage
  - Data export (JSON/CSV) for analysis
- **Leaderboard**: Track your top 10 scores
- **Automatic Character Progression**: Next character plays as soon as you respond

## Live Demo

🎯 **[Try CW Trainer Now](https://disser.github.io/cwtrainer/)**

## How to Use

1. Configure your settings (speed, tone frequency, character sets)
2. Click "Start 2-Minute Practice Round"
3. Listen to each morse code character
4. Type the letter you hear immediately
5. Try to achieve the highest WPM with good accuracy!

## Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Technologies
- **Svelte** - Reactive UI framework
- **Vite** - Build tool and dev server
- **Web Audio API** - Morse code tone generation
- **LocalStorage** - Data persistence

## Paris Standard WPM

The application uses the Paris standard for WPM calculation:
- The word "PARIS" = 50 units
- 1 WPM = typing "PARIS" once per minute
- This is the standard used in amateur radio

## License

MIT License - feel free to use and modify for your morse code practice!

## Contributing

Contributions welcome! Feel free to open issues or submit pull requests.
