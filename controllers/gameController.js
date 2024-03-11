//gameController.js

const generateGrid = (words) => {
  const grid = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Letters to fill the grid with
  
  // Initialize the grid with random letters
  for (let i = 0; i < 15; i++) {
    const row = [];
    for (let j = 0; j < 15; j++) {
      row.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    grid.push(row);
  }

  // Place words in the grid
  words.forEach((word) => {
    // Randomly choose direction: 0 for horizontal, 1 for vertical, 2 for diagonal
    const direction = Math.floor(Math.random() * 3);
    const startRow = Math.floor(Math.random() * (15 - word.length + 1));
    const startCol = Math.floor(Math.random() * (15 - word.length + 1));

    if (direction === 0) { // Horizontal
      for (let i = 0; i < word.length; i++) {
        grid[startRow][startCol + i] = word[i].toUpperCase();
      }
    } else if (direction === 1) { // Vertical
      for (let i = 0; i < word.length; i++) {
        grid[startRow + i][startCol] = word[i].toUpperCase();
      }
    } else { // Diagonal
      // Ensure there's enough space diagonally; adjust startRow/startCol if necessary
      for (let i = 0; i < word.length; i++) {
        grid[startRow + i][startCol + i] = word[i].toUpperCase();
      }
    }
  });

  return grid;
};

export const renderPage = async (req, res) => {
  try {
    const word = req.query.word || 'defaultWord'; // Use a default word if none is provided
    const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}`);
    if (!response.ok) throw new Error('Failed to fetch words.'); // Check response status

    let data = await response.json();
    data = data.slice(0, 10);
    console.log(data);

    if (data.length === 0) throw new Error('Word is invalid or no related words found.'); // Validate data

    const grid = generateGrid(data.map((item) => item.word));
    console.log(grid);

    res.render('index', { data, grid, error: null }); // Pass null for error when successful
  } catch (error) {
    console.error("Error:", error);
    // Render the same page but with an error message
    res.render('index', { data: [], grid: [], error: error.message });
  }
};

