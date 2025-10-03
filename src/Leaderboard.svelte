<script>
  import { onMount } from 'svelte';
  
  export let currentScore = null;
  
  let scores = [];
  const MAX_SCORES = 10;
  
  onMount(() => {
    loadScores();
  });
  
  function loadScores() {
    const stored = localStorage.getItem('morseLeaderboard');
    if (stored) {
      scores = JSON.parse(stored);
    }
  }
  
  export function addScore(wpm, accuracy, charactersTyped) {
    const score = {
      wpm: parseFloat(wpm.toFixed(2)),
      accuracy: parseFloat(accuracy.toFixed(2)),
      characters: charactersTyped,
      date: new Date().toISOString()
    };
    
    scores.push(score);
    scores.sort((a, b) => b.wpm - a.wpm);
    scores = scores.slice(0, MAX_SCORES);
    
    localStorage.setItem('morseLeaderboard', JSON.stringify(scores));
    loadScores();
  }
  
  export function clearLeaderboard() {
    if (confirm('Are you sure you want to clear the leaderboard?')) {
      scores = [];
      localStorage.removeItem('morseLeaderboard');
    }
  }
  
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
</script>

<div class="leaderboard">
  <h2>Leaderboard</h2>
  
  {#if scores.length === 0}
    <p class="empty">No scores yet. Complete a practice round to get started!</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>WPM</th>
          <th>Accuracy</th>
          <th>Characters</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {#each scores as score, index}
          <tr class:highlight={currentScore && score.date === currentScore.date}>
            <td class="rank">{index + 1}</td>
            <td class="wpm">{score.wpm}</td>
            <td class="accuracy">{score.accuracy}%</td>
            <td>{score.characters}</td>
            <td class="date">{formatDate(score.date)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    
    <button class="clear-btn" on:click={clearLeaderboard}>
      Clear Leaderboard
    </button>
  {/if}
</div>

<style>
  .leaderboard {
    background: #f5f5f5;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 1rem;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .empty {
    color: #777;
    font-style: italic;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 4px;
    overflow: hidden;
  }
  
  th {
    background: #4CAF50;
    color: white;
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
  }
  
  td {
    padding: 0.75rem;
    border-bottom: 1px solid #ddd;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr.highlight {
    background: #fff9c4;
    font-weight: 600;
  }
  
  .rank {
    font-weight: bold;
    color: #4CAF50;
    width: 60px;
  }
  
  .wpm {
    font-weight: 600;
    color: #2196F3;
  }
  
  .accuracy {
    color: #FF9800;
  }
  
  .date {
    font-size: 0.9rem;
    color: #777;
  }
  
  .clear-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .clear-btn:hover {
    background: #d32f2f;
  }
</style>
