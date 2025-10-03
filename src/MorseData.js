// Morse code mappings for all supported characters
export const morseCode = {
  // Letters A-Z
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',
  
  // Numbers 0-9
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  
  // Punctuation
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '/': '-..-.',
  '-': '-....-',
  '=': '-...-',
  '+': '.-.-.',
  '@': '.--.-.',
  '(': '-.--.',
  ')': '-.--.-',
  ':': '---...',
  ';': '-.-.-.',
  '"': '.-..-.',
  "'": '.----.',
  
  // Accented characters
  'À': '.--.-',
  'Ä': '.-.-',
  'Å': '.--.-',
  'Ą': '.-.-',
  'Ć': '-.-..',
  'Ĉ': '-.-..',
  'Ç': '-.-..',
  'É': '..-..',
  'È': '.-..-',
  'Ę': '..-..',
  'Ð': '..--.',
  'Ĝ': '--.-.',
  'Ĥ': '----',
  'Ĵ': '.---.',
  'Ł': '.-..-',
  'Ń': '--.--',
  'Ñ': '--.--',
  'Ó': '---.',
  'Ö': '---.',
  'Ø': '---.',
  'Ś': '...-...',
  'Ŝ': '...-.',
  'Š': '----',
  'Þ': '.--..',
  'Ü': '..--',
  'Ŭ': '..--',
  'Ź': '--..-.',
  'Ż': '--..-'
};

// Character categories for selection
export const characterSets = {
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  punctuation: '.,?/-=+@():;"\'',
  accented: 'ÀÄÅĄĆĈÇÉÈĘÐĜĤĴŁŃÑÓÖØŚŜŠÞÜŬŹŻ'
};

// Get random character from selected sets
export function getRandomCharacter(enabledSets) {
  let availableChars = '';
  
  if (enabledSets.letters) availableChars += characterSets.letters;
  if (enabledSets.numbers) availableChars += characterSets.numbers;
  if (enabledSets.punctuation) availableChars += characterSets.punctuation;
  if (enabledSets.accented) availableChars += characterSets.accented;
  
  if (availableChars.length === 0) {
    availableChars = characterSets.letters; // Default to letters if nothing selected
  }
  
  return availableChars[Math.floor(Math.random() * availableChars.length)];
}
