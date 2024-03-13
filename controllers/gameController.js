const generateGrid = (words) => {
  const grid = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Initialize the grid with placeholder characters
  for (let i = 0; i < 15; i++) {
    const row = [];
    for (let j = 0; j < 15; j++) {
      row.push('-'); // Placeholder for empty cells
    }
    grid.push(row);
  }

  // Helper function to check if the word can be placed
  const canPlaceWord = (startRow, startCol, word, direction) => {
    if (direction === 0 && startCol + word.length > 15) return false; // Horizontal check
    if (direction === 1 && startRow + word.length > 15) return false; // Vertical check
    if (direction === 2 && (startRow + word.length > 15 || startCol + word.length > 15)) return false; // Descending diagonal check
    if (direction === 3 && (startRow - word.length < -1 || startCol + word.length > 15)) return false; // Ascending diagonal check

    for (let i = 0; i < word.length; i++) {
      const row = startRow + (direction === 1 ? i : direction === 2 ? i : direction === 3 ? -i : 0);
      const col = startCol + (direction === 0 ? i : direction === 2 || direction === 3 ? i : 0);

      if (grid[row][col] !== '-') return false; // Cell is not empty
    }
    return true;
  };

  // Helper function to place the word
  const placeWord = (startRow, startCol, word, direction) => {
    for (let i = 0; i < word.length; i++) {
      const row = startRow + (direction === 1 ? i : direction === 2 ? i : direction === 3 ? -i : 0);
      const col = startCol + (direction === 0 ? i : direction === 2 || direction === 3 ? i : 0);
      grid[row][col] = word[i].toUpperCase();
    }
  };

  // Place each word
  words.forEach(word => {
    let placed = false;
    const direction = Math.floor(Math.random() * 4); // Including ascending diagonal as a direction
    while (!placed) {
      const startRow = direction === 3 ? Math.floor(Math.random() * (14 - word.length)) + word.length : Math.floor(Math.random() * (15 - word.length));
      const startCol = Math.floor(Math.random() * (15 - word.length));

      if (canPlaceWord(startRow, startCol, word, direction)) {
        placeWord(startRow, startCol, word, direction);
        placed = true;
      }
    }

    if (!placed) console.log(`Failed to place word: ${word}`);
  });

  // Fill empty cells with random letters
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (grid[i][j] === '-') {
        grid[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
};




export const renderPage = async (req, res) => {
  try {
    const word = req.query.word || 'water'; // Use a default word if none is provided
    const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}`);
    if (!response.ok) throw new Error('Failed to fetch words.');

    let data = await response.json();
    data = data.slice(0, 10);

    if (data.length === 0) throw new Error('Word is invalid or no related words found.');

    const grid = generateGrid(data.map((item) => item.word));

    res.render('index', { data, grid, error: null });
  } catch (error) {
    console.error("Error:", error);
    res.render('index', { data: [], grid: [], error: error.message });
  }
};
