<script>
  import { morseCode, characterSets } from './MorseData.js';
  
  // Props with default values to ensure they're always defined
  export let enabledSets = {
    letters: true,
    numbers: false,
    punctuation: false,
    accented: false
  };
  
  // Initialize visibleCharacters with an empty object to avoid null/undefined
  let visibleCharacters = {};
  
  // Update filtered characters whenever enabledSets changes
  $: {
    // Make sure enabledSets is properly initialized
    const sets = enabledSets || {
      letters: true,
      numbers: false,
      punctuation: false,
      accented: false
    };
    
    visibleCharacters = getFilteredCharacters(sets);
  }
  
  function getFilteredCharacters(sets) {
    // Always return an object even if sets is undefined
    if (!sets) return {};
    
    let result = {};
    
    // Add letters if enabled
    if (sets.letters) {
      for (let char of characterSets.letters) {
        result[char] = morseCode[char];
      }
    }
    
    // Add numbers if enabled
    if (sets.numbers) {
      for (let char of characterSets.numbers) {
        result[char] = morseCode[char];
      }
    }
    
    // Add punctuation if enabled
    if (sets.punctuation) {
      for (let char of characterSets.punctuation) {
        result[char] = morseCode[char];
      }
    }
    
    // Add accented chars if enabled
    if (sets.accented) {
      for (let char of characterSets.accented) {
        result[char] = morseCode[char];
      }
    }
    
    return result;
  }
  
  // Group characters for display with safe checks
  function getCharacterGroups() {
    const groups = [];
    const vc = visibleCharacters || {}; // Ensure we have an object
    const es = enabledSets || { letters: true, numbers: false, punctuation: false, accented: false };
    
    // Safely handle each character set
    if (es.letters && characterSets.letters) {
      try {
        const letters = Array.from(characterSets.letters).filter(char => char in vc);
        if (letters.length) groups.push({ title: "Letters", chars: letters });
      } catch (e) {
        console.error("Error processing letters:", e);
      }
    }
    
    if (es.numbers && characterSets.numbers) {
      try {
        const numbers = Array.from(characterSets.numbers).filter(char => char in vc);
        if (numbers.length) groups.push({ title: "Numbers", chars: numbers });
      } catch (e) {
        console.error("Error processing numbers:", e);
      }
    }
    
    if (es.punctuation && characterSets.punctuation) {
      try {
        const punctuation = Array.from(characterSets.punctuation).filter(char => char in vc);
        if (punctuation.length) groups.push({ title: "Punctuation", chars: punctuation });
      } catch (e) {
        console.error("Error processing punctuation:", e);
      }
    }
    
    if (es.accented && characterSets.accented) {
      try {
        const accented = Array.from(characterSets.accented).filter(char => char in vc);
        if (accented.length) groups.push({ title: "Accented Characters", chars: accented });
      } catch (e) {
        console.error("Error processing accented chars:", e);
      }
    }
    
    return groups;
  }
  
  // Reactive update of character groups
  $: characterGroups = visibleCharacters ? getCharacterGroups() : [];
</script>

<div class="reference-container">
  <h3>Morse Code Reference</h3>
  
  {#if Object.keys(visibleCharacters).length === 0}
    <div class="empty-message">
      No character sets enabled. Enable some character sets in settings.
    </div>
  {:else}
    {#each characterGroups as group}
      <div class="character-group">
        <h4>{group.title}</h4>
        <div class="character-grid">
          {#each group.chars as char}
            <div class="character-item">
              <span class="character">{char}</span>
              <span class="morse-code">{visibleCharacters[char] || ''}</span>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .reference-container {
    background-color: #f0f4f8;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
    max-height: 800px; /* Increased height */
    overflow-y: auto;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
  }
  
  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #555;
    font-size: 1rem;
  }
  
  .character-group {
    margin-bottom: 1.5rem;
  }
  
  .character-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
  
  .character-item {
    background: white;
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #e0e0e0;
  }
  
  .character {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2196F3;
    margin-bottom: 0.25rem;
  }
  
  .morse-code {
    font-family: monospace;
    color: #555;
    letter-spacing: 1px;
  }
  
  .empty-message {
    text-align: center;
    color: #777;
    font-style: italic;
    padding: 1rem;
  }

  @media (max-width: 600px) {
    .character-grid {
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }
  }
</style>
