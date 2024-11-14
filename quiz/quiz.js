function buildQuiz(){
    const output = [];
    myQuestions.forEach(
        (currentQuestion, questionNumber) => {
            const answers = [];
            for(letter in currentQuestion.answers){
                answers.push(
                    `<label>
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter} : 
                        ${currentQuestion.answers[letter]}
                    </label>`
                );
            }

            output.push(
                `<div class="slide">
                <div class="question"> ${currentQuestion.question} </div> 
                <div class="answers"> ${answers.join('')} </div>
                </div>`
            );
        }
    );
    quizContainer.innerHTML = output.join('');
};

function showResults(){
    const answerContainers = quizContainer.querySelectorAll('.answers');
    let numCorrect = 0;

    myQuestions.forEach( (currentQuestion, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        if(userAnswer === currentQuestion.correctAnswer){
            numCorrect++;
            answerContainers[questionNumber].style.color = 'lightgreen';
    }
    else{
        answerContainers[questionNumber].style.color = 'red';
      }
    });
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
};

function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;
    if(currentSlide === 0){
      previousButton.style.display = 'none';
    }
    else{
      previousButton.style.display = 'inline-block';
    }
    if(currentSlide === slides.length-1){
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
    }
    else{
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
    }
  };

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const myQuestions = [
    {
        question: "How much of the world's electricity currently comes from solar energy?",
        answers: {
            a: "10.4%",
            b: "0.7%",
            c: "3.9%",
            d: "21,6%"
        },
        correctAnswer: "c"
    },
    {
        question: "Which country is the leader in solar enegy production?",
        answers: {
            a: "United States of American",
            b: "Germany",
            c: "India",
            d: "China"
        },
        correctAnswer: "d"
    },
    {
        question: "The IEA projects that solar energy could become the largest energy source by ... ?",
        answers: {
            a: "2060",
            b: "2050",
            c: "2040",
            d: "2030"
        },
        correctAnswer: "b"
    },
    {
        question: "How many percent of the materials in a solar panel can be recycled?",
        answers: {
            a: "Up to 99%",
            b: "Up to 69%",
            c: "Up to 29%",
            d: "Up to 75%"
        },
        correctAnswer: "a"
    },
    {
        question: "Which spacecraft is entirely powered by solar energy?",
        answers: {
            a: "Space X's 'Starship'",
            b: "The International Space Station",
            c: "Virgin Galactic's 'VSS Unity'",
            d: "The Millennium Falcon"
        },
        correctAnswer: "b"
    },
    {
        question: "What is the largest solar panel farm with a capacity of 5 GW?",
        answers: {
            a: "Golmud Solar Park, China",
            b: "Bhadla Solar Park, India",
            c: "Xinjiang Solar Farm, China",
            d: "Pavagada Solar Farm, India"
        },
        correctAnswer: "c"
    },
    {
        question: "How long does it take for a solar panel to become carbon neutral?",
        answers: {
            a: "Within 1 year of operation",
            b: "Within 2 years of operation",
            c: "Within 3 years of operation",
            d: "Within 4 years of operation"
        },
        correctAnswer: "c"
    }
];

buildQuiz();

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

showSlide(currentSlide);

function showNextSlide() {
    showSlide(currentSlide + 1);
};
  
function showPreviousSlide() {
    showSlide(currentSlide - 1);
};

previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);
submitButton.addEventListener('click', showResults);

