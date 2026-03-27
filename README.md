# Little Mandarin Club

Little Mandarin Club is a beginner-friendly web app for learning Mandarin vocabulary with flashcards, pronunciation audio, and mini quizzes.

## Features

- Category-based vocabulary lessons (Animals, Food, Colors, Numbers, Greetings, Family)
- Flashcards with Chinese characters, pinyin, English, and emoji cues
- Text-to-speech pronunciation using the browser Speech Synthesis API
- Interactive multiple-choice quiz mode
- Progress tracking with stars saved in `localStorage`
- Mobile-friendly, playful UI

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

## Project Structure

```text
.
|- index.html       # Main app layout and views
|- style.css        # Styling and animations
|- vocabulary.js    # Vocabulary categories and words
|- app.js           # App logic (navigation, lesson, quiz, stars)
```

## Run Locally

This is a static frontend app, so no build step is required.

1. Clone the repository:
   ```bash
   git clone https://github.com/elevelyn19-collab/little-mandarin-club.git
   ```
2. Open the project folder.
3. Open `index.html` in your browser.

## How to Use

1. Choose a category from the home screen.
2. Browse vocabulary flashcards and tap the speaker icon to hear pronunciation.
3. Start **Quiz Time!** to test your memory.
4. Complete a quiz to earn stars.

## Notes

- Stars are stored in your browser (`localStorage` key: `lmc-stars`).
- Speech playback depends on browser support for Speech Synthesis.

