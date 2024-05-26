const crypto = require('crypto');
const fs = require('fs');

const hashes = [
];

for(let i = 0; i < 100; i++) {
  hashes.push(crypto.randomBytes(20).toString('hex')); 
}

// Shuffle array 
shuffleArray(hashes);

// Write shuffled array to file
fs.writeFileSync('./ownerHashes.json', JSON.stringify(hashes));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}