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
        }
    )
}