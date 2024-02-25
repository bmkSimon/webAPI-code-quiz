// add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;


// add variables to reference DOM elements
const questionsEl = document.getElementById('questions');
const startBtn = document.getElementById('start');
const start_screen = document.getElementById('start-screen');
const wrapper = document.getElementById('wrapper');
const submitBtn = document.getElementById('submit');
const ques_title = document.getAnimations('question-tite');
const ques_choices = document.getElementById('choices');
const timeEl = document.getElementById('time');
const end_screen = document.getElementById('end-screen');
const feedbackEl = document.getElementById('feedback');
const final_score = document.getElementById('final-score');
const initials = document.getElementById('initials');

// reference the sound effects
let sfxRight = new Audio('assets/sfx/correct.wav');
let sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
     start_screen.style.display = 'none';
        
  // un-hide questions section
     questionsEl.style.display = 'block';
      
  // start timer. timer stops and ends quizz once time reaches 0.
      timerId = window.setInterval(function () {
        timeEl.innerHTML = time--; 
        if(time <= 0) {
          time = 0;
          timeEl.innerHTML = 0;
          quizEnd();
        }
      }, 1000);
  
  // show starting time
    timeEl.innerHTML = time;

  // call a function to show the next question
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  let currentQuestion = questions[currentQuestionIndex];
  
  // update title with current question
  ques_title.textContent = currentQuestion.title;
    
  // loop over the choices for each question 
  //create a clickable list of answers.
  currentQuestion.choices.map((el, idx) => {
    const option = document.createElement('button');
    option.textContent = el;
    option.className = 'option';

  //check which option is clicked and play wright/wrong sound
  //display feedback on if answer correct or wrong
  //end quizz if all questions asked
    option.addEventListener('click', function () {
      if (el === currentQuestion.answer) {
        sfxRight.play();
        feedbackEl.textContent = 'Correct';
        feedbackEl.classList.remove('hide');

        window.setTimeout(function () {
          currentQuestionIndex++;
          ques_choices.innerHTML = '';
          feedbackEl.classList.add('hide');
        
          if (currentQuestionIndex === questions.length - 1) {
            quizEnd();
            return;
          }
          
          getQuestion();
        }, 1000);
        return

      }

      sfxWrong.play();

  //subtract 15s from timer if incorrect answer selected
      time = time - 15;
      feedbackEl.textContent = 'Wrong';
      feedbackEl.classList.remove('hide');
      
      window.setTimeout(function () {
        feedbackEl.classList.add('hide');
      }, 1000);
    });

    ques_choices.appendChild(option);
  }, '');

}

initials.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  saveHighScore();
});

// define the steps of the QuizEnd function...when the quiz ends...
function quizEnd() {
  // stop the timer
  window.clearInterval(timerId);
 
  // show end screen, hide questions and show score
  questionsEl.style.display = 'none';
  end_screen.style.display = 'block';
  final_Score.textContent = time;
  
}

// complete the steps to save the high score
function saveHighScore() {
  const userInitials = initials.value;
  let highscores = localStorage.getItem('highscores');

  if (userInitials.trim() === '') {
    feedbackEl.textContent = 'Please enter initials';
    feedbackEl.classList.remove('hide');
  }

  if (highscores === null) {
    highscores = [{ initials: userInitials, score: time }];
  } else {
    highscores = JSON.parse(highscores);
    highscores = [...highscores, { initials: userInitials, score: time }];
  }

  localStorage.setItem('highscores', JSON.stringify(highscores));
  window.location = 'highscores.html';
  
submitBtn.onclick = saveHighScore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;


// user clicks on an element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
