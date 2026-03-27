// Little Mandarin Club — App Logic

// --- State ---
let stars = parseInt(localStorage.getItem('lmc-stars') || '0');
let currentCategory = null;
let currentWordIndex = 0;
let quizQueue = [];
let quizIndex = 0;

// --- DOM References ---
const starCountEl = document.getElementById('star-count');
const homeView = document.getElementById('home-view');
const lessonView = document.getElementById('lesson-view');
const quizView = document.getElementById('quiz-view');
const congratsView = document.getElementById('congrats-view');
const categoryGrid = document.getElementById('category-grid');
const cardContainer = document.getElementById('card-container');
const quizOptions = document.getElementById('quiz-options');
const quizQuestionText = document.getElementById('quiz-question-text');
const quizProgress = document.getElementById('quiz-progress');

// --- Helpers ---
function showView(view) {
  [homeView, lessonView, quizView, congratsView].forEach(v => v.classList.add('hidden'));
  view.classList.remove('hidden');
}

function updateStars() {
  starCountEl.textContent = stars;
  localStorage.setItem('lmc-stars', stars);
}

function speak(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// --- Home Screen ---
function renderHome() {
  categoryGrid.innerHTML = '';
  VOCABULARY.categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.id = `cat-${cat.id}`;
    card.style.borderColor = cat.color;
    card.innerHTML = `
      <div class="category-icon">${cat.icon}</div>
      <div class="category-name">${cat.name}</div>
    `;
    card.addEventListener('click', () => startLesson(cat));
    categoryGrid.appendChild(card);
  });
  showView(homeView);
}

// --- Lesson ---
function startLesson(category) {
  currentCategory = category;
  currentWordIndex = 0;
  showView(lessonView);
  renderCard();
}

function renderCard() {
  const word = currentCategory.words[currentWordIndex];
  cardContainer.innerHTML = `
    <div class="flashcard">
      <div class="flashcard-img-container">
        <span style="font-size:5rem">${word.emoji}</span>
      </div>
      <div class="flashcard-chinese">${word.chinese}</div>
      <div class="flashcard-pinyin">${word.pinyin}</div>
      <div style="color:#aaa;font-size:1rem;margin-bottom:1.5rem">${word.english}</div>
      <button class="speaker-btn" id="speak-btn" title="Hear pronunciation">🔊</button>
    </div>
  `;
  document.getElementById('speak-btn').addEventListener('click', () => speak(word.chinese));
  // Auto-speak on load
  setTimeout(() => speak(word.chinese), 300);
}

document.getElementById('prev-word').addEventListener('click', () => {
  if (currentWordIndex > 0) {
    currentWordIndex--;
    renderCard();
  }
});

document.getElementById('next-word').addEventListener('click', () => {
  if (currentWordIndex < currentCategory.words.length - 1) {
    currentWordIndex++;
    renderCard();
  }
});

document.getElementById('start-quiz').addEventListener('click', startQuiz);
document.getElementById('back-to-home').addEventListener('click', renderHome);

// --- Quiz ---
function startQuiz() {
  quizQueue = shuffle(currentCategory.words);
  quizIndex = 0;
  showView(quizView);
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const correct = quizQueue[quizIndex];
  const total = quizQueue.length;

  // Progress bar
  quizProgress.style.width = `${(quizIndex / total) * 100}%`;
  quizQuestionText.innerHTML = `Which one is <strong>${correct.english}</strong>?`;

  // Build 4 options (correct + 3 random wrong from same category)
  const others = shuffle(currentCategory.words.filter(w => w.chinese !== correct.chinese)).slice(0, 3);
  const options = shuffle([correct, ...others]);

  quizOptions.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span style="font-size:2.8rem">${opt.emoji}</span><br><span style="font-size:1rem;color:#888">${opt.chinese}</span>`;
    btn.addEventListener('click', () => handleAnswer(btn, opt, correct));
    quizOptions.appendChild(btn);
  });
}

function handleAnswer(btn, selected, correct) {
  const allBtns = quizOptions.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  if (selected.chinese === correct.chinese) {
    btn.classList.add('option-correct');
    speak(correct.chinese);
    setTimeout(nextQuizStep, 1000);
  } else {
    btn.classList.add('option-incorrect');
    // Highlight correct
    allBtns.forEach(b => {
      if (b.innerHTML.includes(correct.emoji)) b.classList.add('option-correct');
    });
    setTimeout(nextQuizStep, 1200);
  }
}

function nextQuizStep() {
  quizIndex++;
  if (quizIndex >= quizQueue.length) {
    showCongrats();
  } else {
    renderQuizQuestion();
  }
}

// --- Congrats ---
function showCongrats() {
  stars++;
  updateStars();
  showView(congratsView);
  quizProgress.style.width = '100%';
}

document.getElementById('finish-congrats').addEventListener('click', renderHome);
document.getElementById('quiz-home-btn').addEventListener('click', renderHome);

// --- Init ---
updateStars();
renderHome();
