let words = [];
let currentMode = 'deToEn';
let currentIndex = -1;

const wordElem = document.getElementById('word');
const showAnswerBtn = document.getElementById('show-answer');
const nextBtn = document.getElementById('next');
const toggleModeBtn = document.getElementById('toggle-mode');
const manageWordsBtn = document.getElementById('manage-words');
const wordManagerSection = document.getElementById('word-manager');
const wordTableBody = document.getElementById('word-table-body');
const addWordForm = document.getElementById('add-word-form');
const newGermanInput = document.getElementById('new-german');
const newEnglishInput = document.getElementById('new-english');

async function fetchWords() {
  const res = await fetch('/api/words');
  words = await res.json();
  renderWordList();
}

function renderWordList() {
  wordTableBody.innerHTML = '';
  words.forEach(({ de, en }) => {
    const row = document.createElement('tr');
    const deCell = document.createElement('td');
    const enCell = document.createElement('td');
    deCell.textContent = de;
    enCell.textContent = en;
    row.appendChild(deCell);
    row.appendChild(enCell);
    wordTableBody.appendChild(row);
  });
}

function showNextWord() {
  if (words.length === 0) {
    wordElem.textContent = 'No words available';
    return;
  }
  currentIndex = Math.floor(Math.random() * words.length);
  const word = words[currentIndex];
  wordElem.textContent = currentMode === 'deToEn' ? word.de : word.en;
}

function showAnswer() {
  if (currentIndex === -1) return;
  const word = words[currentIndex];
  const question = currentMode === 'deToEn' ? word.de : word.en;
  const answer = currentMode === 'deToEn' ? word.en : word.de;
  wordElem.textContent = `${question} = ${answer}`;
}

showAnswerBtn.addEventListener('click', showAnswer);
nextBtn.addEventListener('click', showNextWord);
toggleModeBtn.addEventListener('click', () => {
  currentMode = currentMode === 'deToEn' ? 'enToDe' : 'deToEn';
  showNextWord();
});
manageWordsBtn.addEventListener('click', () => {
  wordManagerSection.classList.toggle('hidden');
  if (!wordManagerSection.classList.contains('hidden')) {
    fetchWords();
  }
});

addWordForm.addEventListener('submit', async e => {
  e.preventDefault();
  const de = newGermanInput.value.trim();
  const en = newEnglishInput.value.trim();
  if (de && en) {
    await fetch('/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ de, en })
    });
    newGermanInput.value = '';
    newEnglishInput.value = '';
    await fetchWords();
    showNextWord();
  }
});

fetchWords().then(showNextWord);
