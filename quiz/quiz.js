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
                `<div class="question"> ${currentQuestion.question} </div> 
                <div class="answers"> ${answers.join('')} </div>`
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
}

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const myQuestions = [
    {
        question: "spørgsmål 1?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "c"
    },
    {
        question: "spørgsmål 2?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "b"
    },
    {
        question: "spørgsmål 3?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "a"
    },
    {
        question: "spørgsmål 4?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "c"
    },
    {
        question: "spørgsmål 5?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "b"
    },
    {
        question: "spørgsmål 6?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "a"
    },
    {
        question: "spørgsmål 7?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "c"
    },
    {
        question: "spørgsmål 8?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "b"
    },
    {
        question: "spørgsmål 9?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "a"
    },
    {
        question: "spørgsmål 10?",
        answers: {
            a: "svar 1",
            b: "svar 2",
            c: "svar 3",
            d: "svar 4"
        },
        correctAnswer: "c"
    }
];

buildQuiz();

submitButton.addEventListener('click', showResults);

resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;