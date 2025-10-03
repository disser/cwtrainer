<script>
  export let wpm = 20;
  export let frequency = 700;
  export let enabledSets = {
    letters: true,
    numbers: false,
    punctuation: false,
    accented: false
  };
  export let onSettingsChange;
  
  function handleChange() {
    if (onSettingsChange) {
      onSettingsChange({ wpm, frequency, enabledSets });
    }
  }
</script>

<div class="settings">
  <h2>Settings</h2>
  
  <div class="setting-group">
    <label>
      Speed (WPM):
      <input 
        type="number" 
        bind:value={wpm} 
        min="5" 
        max="60" 
        on:change={handleChange}
      />
    </label>
  </div>
  
  <div class="setting-group">
    <label>
      Tone Frequency (Hz):
      <input 
        type="number" 
        bind:value={frequency} 
        min="400" 
        max="1200" 
        step="50"
        on:change={handleChange}
      />
    </label>
  </div>
  
  <div class="setting-group">
    <h3>Character Sets</h3>
    <label class="checkbox-label">
      <input 
        type="checkbox" 
        bind:checked={enabledSets.letters}
        on:change={handleChange}
      />
      A-Z Letters
    </label>
    
    <label class="checkbox-label">
      <input 
        type="checkbox" 
        bind:checked={enabledSets.numbers}
        on:change={handleChange}
      />
      0-9 Numbers
    </label>
    
    <label class="checkbox-label">
      <input 
        type="checkbox" 
        bind:checked={enabledSets.punctuation}
        on:change={handleChange}
      />
      Punctuation
    </label>
    
    <label class="checkbox-label">
      <input 
        type="checkbox" 
        bind:checked={enabledSets.accented}
        on:change={handleChange}
      />
      Accented Characters
    </label>
  </div>
</div>

<style>
  .settings {
    background: #f5f5f5;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #555;
    font-size: 1rem;
  }
  
  .setting-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    font-weight: normal;
    margin-bottom: 0.5rem;
  }
  
  .checkbox-label input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  
  input[type="number"] {
    width: 100px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    margin-left: 0.5rem;
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
</style>
