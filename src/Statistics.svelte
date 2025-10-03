<script>
  export let sessionData = [];
  export let currentWPM = 0;
  export let letterStats = {};
  
  function exportAsJSON() {
    const data = {
      sessionData,
      letterStats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morse-practice-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function exportAsCSV() {
    let csv = 'Character,Timestamp,Correct,Response Time (ms),WPM\n';
    
    sessionData.forEach(entry => {
      csv += `${entry.character},${entry.timestamp},${entry.correct},${entry.responseTime},${entry.wpm}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morse-practice-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function getAverageForLetter(letter) {
    const stats = letterStats[letter];
    if (!stats || stats.count === 0) return 0;
    return (stats.totalTime / stats.count / 1000).toFixed(2);
  }
  
  $: sortedLetters = Object.keys(letterStats).sort();
</script>

<div class="statistics">
  <h2>Session Statistics</h2>
  
  <div class="stats-summary">
    <div class="stat-card">
      <div class="stat-label">Current WPM</div>
      <div class="stat-value">{currentWPM.toFixed(1)}</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-label">Characters Typed</div>
      <div class="stat-value">{sessionData.length}</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-label">Accuracy</div>
      <div class="stat-value">
        {sessionData.length > 0 
          ? ((sessionData.filter(d => d.correct).length / sessionData.length * 100).toFixed(1))
          : 0}%
      </div>
    </div>
  </div>
  
  {#if sessionData.length > 0}
    <div class="export-section">
      <h3>Export Data</h3>
      <div class="export-buttons">
        <button on:click={exportAsJSON}>Export as JSON</button>
        <button on:click={exportAsCSV}>Export as CSV</button>
      </div>
    </div>
    
    {#if sortedLetters.length > 0}
      <div class="letter-stats">
        <h3>Per-Letter Average Response Time</h3>
        <div class="letter-grid">
          {#each sortedLetters as letter}
            <div class="letter-stat">
              <span class="letter">{letter}</span>
              <span class="time">{getAverageForLetter(letter)}s</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .statistics {
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
  
  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #555;
    font-size: 1rem;
  }
  
  .stats-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .stat-card {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #777;
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #4CAF50;
  }
  
  .export-section {
    margin-top: 1.5rem;
  }
  
  .export-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .export-buttons button {
    padding: 0.75rem 1.5rem;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
  }
  
  .export-buttons button:hover {
    background: #1976D2;
  }
  
  .letter-stats {
    margin-top: 1.5rem;
  }
  
  .letter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.5rem;
  }
  
  .letter-stat {
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }
  
  .letter-stat .letter {
    font-weight: bold;
    color: #333;
  }
  
  .letter-stat .time {
    color: #2196F3;
    font-weight: 500;
  }
</style>
