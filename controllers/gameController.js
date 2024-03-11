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
    const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    const startRow = Math.floor(Math.random() * (15 - word.length + 1));
    const startCol = Math.floor(Math.random() * (15 - word.length + 1));

    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        grid[startRow][startCol + i] = word[i].toUpperCase();
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        grid[startRow + i][startCol] = word[i].toUpperCase();
      }
    }
  });

  return grid;
};

export const renderPage = async (req, res) => {
  try {
    const word = "sky";
    const response = await fetch(`https://api.datamuse.com/words?ml=${word}`);
    let data = await response.json();

    data = data.slice(0, 10);
    console.log(data);

    const grid = generateGrid(data.map((item) => item.word));
    console.log(grid);

    res.render('index', { data, grid });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send('Error fetching data');
  }
};
