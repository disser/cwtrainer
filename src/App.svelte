<script>
  import { onMount, onDestroy } from 'svelte';
  import { MorseGenerator } from './MorseGenerator.js';
  import { getRandomCharacter } from './MorseData.js';
  import Settings from './Settings.svelte';
  import Statistics from './Statistics.svelte';
  import Leaderboard from './Leaderboard.svelte';
  
  // Settings
  let wpm = 20;
  let frequency = 700;
  let enabledSets = {
    letters: true,
    numbers: false,
    punctuation: false,
    accented: false
  };
  
  // Session state
  let morseGenerator;
  let isActive = false;
  let isPaused = false;
  let currentCharacter = '';
  let userInput = '';
  let feedback = '';
  let feedbackClass = '';
  
  // Timer
  let timeRemaining = 120; // 2 minutes in seconds
  let timerInterval = null;
  
  // Statistics
  let sessionData = [];
  let letterStats = {};
  let recentAttempts = []; // Last 10 attempts for rolling WPM
  let currentWPM = 0;
  let characterStartTime = 0;
  let totalCorrect = 0;
  let totalAttempts = 0;
  
  // Components
  let leaderboardComponent;
  let lastScore = null;
  
  onMount(() => {
    morseGenerator = new MorseGenerator(wpm, frequency);
    window.addEventListener('keypress', handleKeyPress);
  });
  
  onDestroy(() => {
    if (morseGenerator) {
      morseGenerator.close();
    }
    stopTimer();
    window.removeEventListener('keypress', handleKeyPress);
  });
  
  function handleSettingsChange(settings) {
    wpm = settings.wpm;
    frequency = settings.frequency;
    enabledSets = settings.enabledSets;
    
    if (morseGenerator) {
      morseGenerator.setWPM(wpm);
      morseGenerator.setFrequency(frequency);
    }
  }
  
  function startSession() {
    // Reset all data
    sessionData = [];
    letterStats = {};
    recentAttempts = [];
    currentWPM = 0;
    totalCorrect = 0;
    totalAttempts = 0;
    timeRemaining = 120;
    feedback = '';
    userInput = '';
    lastScore = null;
    
    // Initialize audio
    morseGenerator.initAudio();
    
    isActive = true;
    isPaused = false;
    
    // Start timer
    startTimer();
    
    // Play first character
    playNextCharacter();
  }
  
  function startTimer() {
    timerInterval = setInterval(() => {
      if (!isPaused) {
        timeRemaining--;
        
        if (timeRemaining <= 0) {
          endSession();
        }
      }
    }, 1000);
  }
  
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  
  function pauseSession() {
    isPaused = !isPaused;
  }
  
  function endSession() {
    isActive = false;
    isPaused = false;
    stopTimer();
    
    // Calculate final statistics
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
    const finalWPM = currentWPM;
    
    // Add to leaderboard
    if (leaderboardComponent && totalAttempts > 0) {
      leaderboardComponent.addScore(finalWPM, accuracy, totalAttempts);
      lastScore = {
        wpm: finalWPM,
        accuracy: accuracy,
        characters: totalAttempts,
        date: new Date().toISOString()
      };
    }
    
    feedback = `Session ended! Final WPM: ${finalWPM.toFixed(1)}, Accuracy: ${accuracy.toFixed(1)}%`;
    feedbackClass = 'final';
  }
  
  async function playNextCharacter() {
    if (!isActive || isPaused) return;
    
    currentCharacter = getRandomCharacter(enabledSets);
    userInput = '';
    feedback = `Playing: [Hidden]`;
    feedbackClass = '';
    
    characterStartTime = Date.now();
    
    try {
      await morseGenerator.playCharacter(currentCharacter);
    } catch (error) {
      console.error('Error playing character:', error);
    }
  }
  
  function handleKeyPress(event) {
    if (!isActive || isPaused || !currentCharacter) return;
    
    const key = event.key.toUpperCase();
    
    // Only accept valid characters
    if (key.length !== 1) return;
    
    userInput = key;
    
    const responseTime = Date.now() - characterStartTime;
    const correct = key === currentCharacter;
    
    // Update statistics
    totalAttempts++;
    if (correct) {
      totalCorrect++;
    }
    
    // Track per-letter statistics
    if (!letterStats[currentCharacter]) {
      letterStats[currentCharacter] = { totalTime: 0, count: 0 };
    }
    letterStats[currentCharacter].totalTime += responseTime;
    letterStats[currentCharacter].count++;
    
    // Calculate WPM for this attempt
    // Paris standard: 1 word = 5 characters, time in minutes
    const timeInMinutes = responseTime / 60000;
    const attemptWPM = correct ? (1 / 5) / timeInMinutes : 0;
    
    // Add to recent attempts (rolling window of 10)
    recentAttempts.push(attemptWPM);
    if (recentAttempts.length > 10) {
      recentAttempts.shift();
    }
    
    // Calculate current WPM as average of recent attempts
    currentWPM = recentAttempts.reduce((a, b) => a + b, 0) / recentAttempts.length;
    
    // Record session data
    sessionData.push({
      character: currentCharacter,
      input: key,
      correct: correct,
      responseTime: responseTime,
      wpm: attemptWPM,
      timestamp: new Date().toISOString()
    });
    
    // Show feedback
    if (correct) {
      feedback = `✓ Correct! (${currentCharacter})`;
      feedbackClass = 'correct';
    } else {
      feedback = `✗ Wrong! Expected: ${currentCharacter}, Got: ${key}`;
      feedbackClass = 'wrong';
    }
    
    // Trigger update
    sessionData = sessionData;
    letterStats = letterStats;
    
    // Play next character after brief delay
    setTimeout(() => {
      if (isActive && !isPaused) {
        playNextCharacter();
      }
    }, 500);
  }
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<main>
  <header>
    <h1>CW Trainer - Morse Code Practice</h1>
  </header>
  
  <div class="container">
    {#if !isActive}
      <Settings 
        bind:wpm
        bind:frequency
        bind:enabledSets
        onSettingsChange={handleSettingsChange}
      />
      
      <div class="start-section">
        <button class="start-btn" on:click={startSession}>
          Start 2-Minute Practice Round
        </button>
        <p class="info">
          You will have 2 minutes to copy as many characters as possible.
          Type the letter you hear immediately after each tone.
        </p>
      </div>
    {:else}
      <div class="practice-session">
        <div class="timer-section">
          <div class="timer" class:warning={timeRemaining <= 30}>
            {formatTime(timeRemaining)}
          </div>
          <div class="controls">
            <button on:click={pauseSession}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button on:click={endSession} class="stop-btn">
              End Session
            </button>
          </div>
        </div>
        
        <div class="current-stats">
          <div class="stat">
            <span class="label">Current WPM:</span>
            <span class="value">{currentWPM.toFixed(1)}</span>
          </div>
          <div class="stat">
            <span class="label">Characters:</span>
            <span class="value">{totalAttempts}</span>
          </div>
          <div class="stat">
            <span class="label">Accuracy:</span>
            <span class="value">
              {totalAttempts > 0 ? ((totalCorrect / totalAttempts * 100).toFixed(1)) : 0}%
            </span>
          </div>
        </div>
        
        <div class="feedback-area">
          {#if isPaused}
            <div class="pause-message">PAUSED</div>
          {:else}
            <div class="feedback {feedbackClass}">
              {feedback || 'Listening...'}
            </div>
          {/if}
        </div>
        
        <div class="input-display">
          {#if userInput}
            <div class="user-input">You typed: <strong>{userInput}</strong></div>
          {/if}
        </div>
      </div>
    {/if}
    
    <Statistics 
      bind:sessionData
      bind:currentWPM
      bind:letterStats
    />
    
    <Leaderboard 
      bind:this={leaderboardComponent}
      currentScore={lastScore}
    />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
  
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  h1 {
    color: white;
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }
  
  .container {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
  
  .start-section {
    text-align: center;
    padding: 2rem 0;
  }
  
  .start-btn {
    padding: 1.25rem 2.5rem;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
  }
  
  .start-btn:active {
    transform: translateY(0);
  }
  
  .info {
    margin-top: 1rem;
    color: #666;
    font-size: 1rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .practice-session {
    background: #f9f9f9;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }
  
  .timer-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #ddd;
  }
  
  .timer {
    font-size: 3rem;
    font-weight: bold;
    color: #4CAF50;
    font-family: 'Courier New', monospace;
  }
  
  .timer.warning {
    color: #f44336;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  .controls {
    display: flex;
    gap: 0.5rem;
  }
  
  .controls button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  }
  
  .controls button:first-child {
    background: #FF9800;
    color: white;
  }
  
  .controls button:first-child:hover {
    background: #F57C00;
  }
  
  .stop-btn {
    background: #f44336 !important;
    color: white;
  }
  
  .stop-btn:hover {
    background: #d32f2f !important;
  }
  
  .current-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stat {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
  }
  
  .stat .label {
    display: block;
    font-size: 0.9rem;
    color: #777;
    margin-bottom: 0.5rem;
  }
  
  .stat .value {
    display: block;
    font-size: 1.8rem;
    font-weight: bold;
    color: #2196F3;
  }
  
  .feedback-area {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .feedback {
    font-size: 1.5rem;
    font-weight: 600;
    padding: 1rem 2rem;
    border-radius: 8px;
    text-align: center;
  }
  
  .feedback.correct {
    background: #c8e6c9;
    color: #2e7d32;
  }
  
  .feedback.wrong {
    background: #ffcdd2;
    color: #c62828;
  }
  
  .feedback.final {
    background: #e1f5fe;
    color: #01579b;
    font-size: 1.3rem;
  }
  
  .pause-message {
    font-size: 2rem;
    font-weight: bold;
    color: #FF9800;
  }
  
  .input-display {
    text-align: center;
    min-height: 40px;
  }
  
  .user-input {
    font-size: 1.2rem;
    color: #555;
  }
  
  .user-input strong {
    color: #2196F3;
    font-size: 1.5rem;
  }
</style>
