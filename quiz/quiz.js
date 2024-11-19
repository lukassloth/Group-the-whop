function buildQuiz(){ //Funktion, der bruges til at lave quizzen
    const output = []; //Tomt array, der bliver brugt til at gemme HTML-koden til hvert quizspørgsmål

    output.push( // Tilføjer følgende HTML-elementer til output array
        `<div class="slide start-slide active-slide"> 
            <h2 id="miniHeadline">Test your knowledge!</h2>
            <p id="startText">Try answering these questions about solar panels and solar energy</p>
            <button id="start">Start Quiz</button>
        </div>
    `)
    myQuestions.forEach( // ForEach loop, der kører alle spørgsmålene igennem
        (currentQuestion, questionNumber) => { //Referer til det aktuelle spørgsmål og index
            const answers = []; //Tomt array til at holde svarmuligheder i
            for(letter in currentQuestion.answers){ //For loop, der går igennem alle svarmuligheder til det aktuelle spørgsmål
                answers.push( //Tilføjer HTML-elemter til answers array for hver svarmulighed
                    `<label> 
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter} : 
                        ${currentQuestion.answers[letter]}
                    </label>` // Container og "radio" knapper til hvert spørgsmål, der stilles op med a, b, c.. værdi og spørgsmål
                );
            }

                output.push( //Tilføjer HTML-elementer til output array
                    `<div class="slide"> 
                    <div class="question"> ${currentQuestion.question} </div> 
                    <div class="answers"> ${answers.join('')} </div>
                    </div>`// Slide indeholder både spørgsmål og svar, så det er muligt at lave en slide funktion
                    //Question viser spørgsmålets tekst
                    //Answers viser alle svarmulighederne ved brug af answers.join
            ); 
        }
    );
    quizContainer.innerHTML = output.join(''); //Konstanten, hvor HTML elementerne skal sættes ind ved brug af output.join
};

function showSlide(n) { //Funktion for hvilket slide, der vises med parameteren n
    slides[currentSlide].classList.remove('active-slide'); //Fjerner class 'active-slide' fra den slide, der er aktiv
    slides[n].classList.add('active-slide'); //Tilføjer class 'active-slide' til den næste slide
    
    currentSlide = n; //Opdaterer currentSlide så den viser det slide, den nu er på
    
    if(currentSlide === 0){ // If statement, der referer til 'previous' knappen
      previousButton.style.display = 'none'; //Hvis den er på første slide, så vises 'previous' knappen ikke
      nextButton.style.display = 'none'; //Hvis det er første slide, så vises 'next' knappen ikke
      submitButton.style.display = 'none'; //Hvis det er første slide, så vises 'submit' knappen ikke
    }
    else{
      previousButton.style.display = currentSlide === 1 ? 'none' : 'inline-block';//Else statement, der viser 'previous' knappen, hvis den er på alle andre sider end den første
      nextButton.style.display = currentSlide === slides.length - 1 ? 'none' : 'inline-block'; //Viser 'next' knappen så længe den ikke er på sidste slide
      submitButton.style.display = currentSlide === slides.length - 1 ? 'inline-block' : 'none'; //Viser 'submit' knappen når den er på sidste slide
    }
};

function showResults(){ //Funktion, der viser om svarerne er rigtige og markerer dem med grøn eller rød herefter
    const answerContainers = quizContainer.querySelectorAll('.answers'); //Henter alle svarmulighederne med det tilhørende svar
    let numCorrect = 0; //Variabel, der holder styr på antal rigtige svar
    let output = ""; //En streng, der bruges til at samle HTML-elementer for detajleret visning af svarerne 

    myQuestions.forEach( (currentQuestion, questionNumber) => { //forEach loop, der går igennem alle spørgsmålene
        const answerContainer = answerContainers[questionNumber]; //Referer til svarmulighederne for det aktuelle spørgsmål
        const selector = `input[name=question${questionNumber}]:checked`; //Bygger en CSS-selektor, der finder den valgte svar knap for det aktuelle spørgsmål
        const userAnswer = (answerContainer.querySelector(selector) || {}).value; //Henter værdien af den valgte svar knap eller returnerer undifined, hvis intet er valgt


        const isCorrect = userAnswer === currentQuestion.correctAnswer; //Konstant, der sammenligner brugerens svar med det rigtige svar
        if (isCorrect) { // If statement, der tjekker om svaret er korrekt
            numCorrect++; //Hvis svaret er korrrekt, så tæller den én op på numCorrect variablen, der holder styr på antal rigtige
            answerContainers[questionNumber].style.color = 'green'; //Hvis svaret er korrekt farves det grønt
        } else { // Else statement, hvis svaret er forkert
            answerContainers[questionNumber].style.color = 'red'; //Hvis svaret er forkert farves det rød
        };
    
    output += `<p>
      <strong>Question ${questionNumber + 1}: ${currentQuestion.question}</strong><br>
      Your answer: ${userAnswer || "No answer"}<br>
      Correct answer: ${currentQuestion.correctAnswer}<br>
      ${isCorrect ? '<span style="color: green;">Correct!</span>' : '<span style="color: red;">Incorrect</span>'}
    </p>`;
    //Tilføjer HTML struktur for hvert spørgsmål til output strengen
    //Viser spørgsmåls nummer og tekst i fed skrift
    //Your answer: Viser brugerens svar eller No answer, hvis der ikke er svaret noget
    //Correct answer: Viser det rigtige svar til spørgsmålet
    //Til sidst skrives der Correct! i grøn, hvis svaret er rigtigt, eller Incorrect i rød, hvis det er forkert eller ikke svaret på

    resultsContainer.innerHTML = `
    <p id="numberResult">${numCorrect} out of ${myQuestions.length} correct</p>
    ${output}`;
    resultsContainer.style.display = 'block';
    //Indsætter den samlede HTML struktur i resultsContainer
    //Skriver hvor mange rigtige man har ud af det samlede antal spørgsmål
    //Tilføjer den detaljerede gennemgang af alle svarene gennem output
    //Gør så den vises når man trykker på submit-knappen, da den ellers er skjult
}
)};

const quizContainer = document.getElementById('quiz'); //Konstant for quizContaineren, der refererer til div i HTML med id="quiz"
const resultsContainer = document.getElementById('results'); //Konstant for resulstContainer, der refererer til div i HTML med id="results"
const submitButton = document.getElementById('submit'); // Knappen, der bruges til at evaluerer svarerne
const myQuestions = [ // Konstant, der indeholder spørgsmålene og svarerne i et samlet array, med dictonaries i sig
    { //Dictonary med question, answers som en dictionary og correctAnswer
        question: "How much of the world's electricity currently comes from solar energy?", //Selve spørgsmålet
        answers: { //Svarmulighederne indekseret i a,b,c,d
            a: "10.4%",
            b: "0.7%",
            c: "3.9%",
            d: "21,6%"
        },
        correctAnswer: "c" //Det korrekt svar
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
            d: "Huanghe Hydropower Hainan Solar Park, China"
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

buildQuiz(); //Her kaldes på funktionen buildQuiz

const previousButton = document.getElementById("previous"); //Henter 'previous' knappen fra HTML-dokumentet
const nextButton = document.getElementById("next"); //Henter 'next' knappen fra HTML-dokumentet
const resulstContainer = document.getElementById("results-container"); //Henter results-container fra HTML-dokumentet
const slides = document.querySelectorAll(".slide"); //Henter alle HTML-elementer med slide class
let currentSlide = 0; //Sørge for den starter på det første slide, og der holdes styr på hvilket slide den er på

showSlide(currentSlide); //Sørger for quizzen starter på første slide

function showNextSlide() { //Funktion, der gør at den næste slide bliver synlig, da currentslide øges med 1
    showSlide(currentSlide + 1);
};
  
function showPreviousSlide() { //Funktion, der gør at den forrige slide bliver synlig igen, da currentslide reduceres med 1
    showSlide(currentSlide - 1);
};

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start");
    if (startButton) {
        startButton.addEventListener("click", () => { //Gør så den skifter til første slide med spørgsmål når man trykker på 'start' knappen
            showSlide(1);
        });
    }
});
previousButton.addEventListener("click", showPreviousSlide); //Når der klikkes på 'previous' knappen, så kaldes showPreviousSlide
nextButton.addEventListener("click", showNextSlide); //Når der klikkes på 'next' knappen, så kaldes showNextSlide
submitButton.addEventListener("click", function() {
    resulstContainer.style.display = 'block';
});
submitButton.addEventListener('click', showResults); //Når der klikkes på 'submit' knappen, så kaldes showResults
submitButton.addEventListener('click', () => { //EventListener, der gør at siden scroller ned til resultatet når man trykker submit
    document.getElementById('results-container').scrollIntoView({
        behavior: "smooth"
    });
});