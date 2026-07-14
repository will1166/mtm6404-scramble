/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const originalWords = [
  "inception",
  "gladiator",
  "titanic",
  "avatar",
  "jaws",
  "matrix",
  "psycho",
  "interstellar",
  "goodfellas",
  "whiplash",
  "ratatouille",
  "casablanca"
];

function App() {
  // Core game states with Local Storage checking
  const [wordsList, setWordsList] = React.useState(() => {
    const saved = localStorage.getItem('scramble_words');
    return saved ? JSON.parse(saved) : shuffle([...originalWords]);
  });

  const [points, setPoints] = React.useState(() => {
    const saved = localStorage.getItem('scramble_points');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [strikes, setStrikes] = React.useState(() => {
    const saved = localStorage.getItem('scramble_strikes');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [passes, setPasses] = React.useState(() => {
    const saved = localStorage.getItem('scramble_passes');
    return saved ? parseInt(saved, 10) : 3; // Game gives player 3 passes
  });

  // User input and text feedback states
  const [guess, setGuess] = React.useState("");
  const [feedback, setFeedback] = React.useState("");

  // Keep local storage updated automatically
  React.useEffect(() => {
    localStorage.setItem('scramble_words', JSON.stringify(wordsList));
    localStorage.setItem('scramble_points', points.toString());
    localStorage.setItem('scramble_strikes', strikes.toString());
    localStorage.setItem('scramble_passes', passes.toString());
  }, [wordsList, points, strikes, passes]);

  // Grab the first word from our remaining words list
  const currentWord = wordsList[0];

  // Scramble the current word safely so it doesn't reshuffle on every single keystroke
  const scrambledWord = React.useMemo(() => {
    return currentWord ? shuffle(currentWord) : "";
  }, [currentWord]);

  // Game over triggers if we run out of words OR hit 3 strikes
  const isGameOver = wordsList.length === 0 || strikes >= 3;

  // --- HANDLER FUNCTIONS ---

  // Handle when the player submits their guess
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from refreshing on submit!
    
    const cleanGuess = guess.trim().toLowerCase();
    const cleanAnswer = currentWord.toLowerCase();

    if (cleanGuess === cleanAnswer) {
      setPoints(prev => prev + 1);
      setFeedback("🎉 Correct! Great eye!");
      setGuess("");
      // Remove the successfully guessed word from the front of the list
      setWordsList(prev => prev.slice(1));
    } else {
      setStrikes(prev => prev + 1);
      setFeedback("❌ Wrong! Try again or pass.");
      // FIXED: Guess is NOT cleared here so the user can see/edit their incorrect typo
    }
  };

  // Handle when the player skips/passes the current word
  const handlePass = () => {
    if (passes > 0) {
      setPasses(prev => prev - 1);
      setFeedback("🎟️ Passed!");
      setGuess("");
      // FIXED: Removes the passed word from the list entirely so the game can reach absolute completion
      setWordsList(prev => prev.slice(1));
    }
  };

  // Reset the entire game to try again
  const handleReset = () => {
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGuess("");
    setFeedback("");
    setWordsList(shuffle([...originalWords]));
  };

return (
    <div className="scramble-game" style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🎬 Movie Scramble 🎬</h1>
      
      {/* SCOREBOARD STATUS AREA */}
      <div className="scoreboard" style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0', fontWeight: 'bold' }}>
        <div>🎥 Points: {points}</div>
        <div>❌ Strikes: {strikes} / 3</div>
        <div>🎟️ Passes Left: {passes}</div>
      </div>

      <hr />

      {/* GAME OVER SCREEN */}
      {isGameOver ? (
        <div className="game-over-screen">
          <h2>Game Over! 🎬</h2>
          {strikes >= 3 ? <p>You hit the maximum number of strikes.</p> : <p>Wow! You cleared the whole movie reel!</p>}
          <h3>Final Score: {points} Points</h3>
          {/* Added onClick to reset the game */}
          <button onClick={handleReset} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px' }}>
            Play Again
          </button>
        </div>
      ) : (
        /* ACTIVE GAMEPLAY SCREEN */
        <div className="gameplay-screen">
          <h2 style={{ fontSize: '32px', letterSpacing: '4px', margin: '30px 0', color: '#2c3e50' }}>
            {scrambledWord}
          </h2>

          {feedback && (
            <p style={{ fontWeight: 'bold', color: feedback.includes('Correct') ? 'green' : 'red', margin: '15px 0' }}>
              {feedback}
            </p>
          )}

          {/* onSubmit handler */}
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Type movie name..." 
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', width: '70%', marginBottom: '10px' }}
            />
            <br />
            <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', margin: '5px', cursor: 'pointer' }}>
              Submit Guess
            </button>
            {/*  onClick for passes */}
            <button 
              type="button" 
              onClick={handlePass}
              disabled={passes === 0}
              style={{ 
                padding: '10px 20px', 
                fontSize: '16px', 
                margin: '5px', 
                cursor: passes === 0 ? 'not-allowed' : 'pointer', 
                backgroundColor: passes === 0 ? '#bdc3c7' : '#f39c12', 
                color: 'white', 
                border: 'none' 
              }}
            >
              Pass Word
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Render the application to the body element
const root = ReactDOM.createRoot(document.body);
root.render(<App />);