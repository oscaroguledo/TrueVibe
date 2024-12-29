// utils/letterColors.js

const letterColors = [
  { letter: 'A', color: '#f56a00', backgroundColor: '#fde3cf' },
  { letter: 'B', color: '#87d068', backgroundColor: '#e6f7f3' },
  { letter: 'C', color: '#1890ff', backgroundColor: '#e6f7ff' },
  { letter: 'D', color: '#52c41a', backgroundColor: '#f6ffed' },
  { letter: 'E', color: '#eb2f96', backgroundColor: '#fff0f6' },
  { letter: 'F', color: '#ff4d4f', backgroundColor: '#fff1f0' },
  { letter: 'G', color: '#fa8c16', backgroundColor: '#fff7e6' },
  { letter: 'H', color: '#13c2c2', backgroundColor: '#e6fffb' },
  { letter: 'I', color: '#2f54eb', backgroundColor: '#e6f7ff' },
  { letter: 'J', color: '#d48806', backgroundColor: '#fffbe6' },
  { letter: 'K', color: '#b37feb', backgroundColor: '#f9f0ff' },
  { letter: 'L', color: '#8c8c8c', backgroundColor: '#f5f5f5' },
  { letter: 'M', color: '#ff4d4f', backgroundColor: '#fff1f0' },
  { letter: 'N', color: '#f1c40f', backgroundColor: '#fef3c7' },
  { letter: 'O', color: '#4e9f3d', backgroundColor: '#f2f9e6' },
  { letter: 'P', color: '#e64a19', backgroundColor: '#fce4b1' },
  { letter: 'Q', color: '#1d8e1f', backgroundColor: '#e0f7e0' },
  { letter: 'R', color: '#ff5722', backgroundColor: '#ffebee' },
  { letter: 'S', color: '#e91e63', backgroundColor: '#f8bbd0' },
  { letter: 'T', color: '#ff9800', backgroundColor: '#fff3e0' },
  { letter: 'U', color: '#f56a00', backgroundColor: '#fde3cf' },
  { letter: 'V', color: '#4caf50', backgroundColor: '#e8f5e9' },
  { letter: 'W', color: '#ff9800', backgroundColor: '#fff8e1' },
  { letter: 'X', color: '#673ab7', backgroundColor: '#f3e5f5' },
  { letter: 'Y', color: '#03a9f4', backgroundColor: '#e1f5fe' },
  { letter: 'Z', color: '#8bc34a', backgroundColor: '#e8f5e9' }
];

// Function to get color and background for a given letter or a random letter if not found
const getLetterColor = (letter) => {
  const letterData = letterColors.find(item => item.letter === letter.toUpperCase());

  // If the letter is found, return the corresponding colors
  if (letterData) {
    return { color: letterData.color, backgroundColor: letterData.backgroundColor };
  }

  // If the letter is not found, pick a random letter from the alphabet
  const randomLetter = letterColors[Math.floor(Math.random() * letterColors.length)];
  return { color: randomLetter.color, backgroundColor: randomLetter.backgroundColor };
};

export default getLetterColor;
