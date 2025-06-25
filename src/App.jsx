import './App.css';
import { useState, useEffect } from 'react';

const App = () => {

  const QandA = {
    "Hello!": "Konnichiwa",
    "Nice to meet you": "Onegai shimasu",
    "Excuse me": "Sumimasen",
    "Thank you": "Arigatogozaimasu",
    "Yes": "Hai",
    "No": "Ie",
    "Left": "Hidari",
    "Right": "Migi",
    "Bathroom": "Basurumu",
    "Entrance": "Iriguchi",
    "One (number)": "Ichi",
    "Two (number)": "Ni",
    "Three (number)": "San",
    "Four (number)": "Shi",
    "Five (number)": "Go",
    "Six (number)": "Roku",
    "Seven (number)": "Shichi",
    "Eight (number)": "Hachi",
    "Nine (number)": "Kyu",
    "Ten (number)": "Ju",
  };

  const greetings = ["Hello!", "Nice to meet you", "Excuse me", "Thank you", "Yes", "No"];
  const numbers = ["One (number)", "Two (number)", "Three (number)", "Four (number)", "Five (number)", "Six (number)", "Seven (number)", "Eight (number)", "Nine (number)", "Ten (number)"];
  const directions = ["Left", "Right"];
  const places = ["Bathroom", "Entrance"];

  let allQuestions = Object.keys(QandA);

  const [frontText, setFrontText] = useState("Welcome! Click on this flashcards to flip them over, instructions are on the back of this card.");
  const [backText, setBackText] = useState("The front of a card will always be a COLORED card, the back will be WHITE - English on the FRONT, Japanese on BACK! Good luck and happy studying!");
  
  const [isFlipped, setIsFlipped] = useState(false); // better way to track card flipping
  const [firstRun, setFirstRun] = useState(true); // will ONLY shuffle cards the first time, otherwise, shuffling is done on the user's request
  const [userAnswer, setUserAnswer] = useState(''); // process user input
  const [questionSet, setQuestionSet] = useState([]); // holds question set
  const [masterSet, setMasterSet] = useState([]); // holds question set that have been mastered
  const [index, setIndex] = useState(-1); 
  const [streak, setStreak] = useState(0);
  const [pb, setPb] = useState(0);

  // state variables JUST for styling
  const [disabledL, setDisabledL] = useState('flashcard-button-disabled'); // changing styling of buttons based on beginning or end of card set
  const [disabledR, setDisabledR] = useState(''); // changing styling of buttons based on beginning or end of card set
  const [colorClass, setColorClass] = useState("flashcard-color-default");
  const [answerBorder, setAnswerBorder] = useState("input-box-border-def");
  const [hidden, setHidden] = useState("hidden");
  const [image, setImage] = useState('intro.jpg');
  
  const handleNext = () => {
    if (index == -1 && firstRun) {
      randomizeQs();
      setFirstRun(false);
    }

    if (index == questionSet.length) {
      setIndex(questionSet.length);
      setHidden("hidden");
      setDisabledR('flashcard-button-disabled');
      setColorClass("flashcard-color-default");
      setFrontText('You have reached the end of the question set!');
      setBackText('Press back arrow to view cards in reverse.');
      setImage("intro.jpg");
    } else {
      setIndex(prev => prev + 1);
    }
    setUserAnswer('');
    setAnswerBorder("input-box-border-def");
    /*
    console.log("index: ", index);
    console.log("question: ", questionSet[index]);
    console.log(questionSet);
    */
  };

  const handleBack = () => {
    if (index == -1) {
      setIndex(-1);
      setHidden("hidden");
      setDisabledL('flashcard-button-disabled');
      setFrontText("Welcome! Click on this flashcards to flip them over, instructions are on the back of this card.");
      setBackText("The front of a card will always be a COLORED card, the back will be WHITE - English on the FRONT, Japanese on BACK! Good luck and happy studying!");
      setImage("intro.jpg");
      setColorClass("flashcard-color-default");
    } else {
      setIndex(prev => prev - 1);
    }
    setUserAnswer('');
    setAnswerBorder("input-box-border-def");
  }

  useEffect(() => {
    if (index == -1) return; // Don't show a card if index is -1

    if (index != questionSet.length) {
      setDisabledL('');
      setDisabledR('');
      setHidden('');
      setFrontText(questionSet[index]);
      setBackText(QandA[questionSet[index]]);
      setImage(`${questionSet[index]}.jpg`);
      colorChecker(questionSet[index]);
    }
    console.log("Question set: ", questionSet);
    console.log("New set of questions: ", allQuestions);
  }, [index, questionSet]);

  const colorChecker = (question) => {
    // colors based on question displayed
    if (greetings.includes(question)) setColorClass("flashcard-color-red");
    else if (numbers.includes(question)) setColorClass("flashcard-color-green");
    else if (directions.includes(question)) setColorClass("flashcard-color-yellow");
    else if (places.includes(question)) setColorClass("flashcard-color-blue");
    else setColorClass("flashcard-color-default");

    setIsFlipped(false);
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setAnswerBorder("input-box-border-def");
  };

  const randomizeQs = () => { // creates a randomized list/array of questions that are non-repeating + randomized
    let copy = [...allQuestions];

    for(let i = 0; i < allQuestions.length; i++) {
      let x = Math.floor(Math.random() * allQuestions.length);
      let y = Math.floor(Math.random() * allQuestions.length);

      let temp = copy[x];
      copy[x] = copy[y];
      copy[y] = temp;  
    }
    setQuestionSet([...copy]);
  }

  const handleAnswer = () => { // checks if user input is equal to the right answer (MUST be on the question side to count as correct)
    if (userAnswer.toLowerCase().includes(backText.toLowerCase()) && !isFlipped) {
      setAnswerBorder("input-box-border-cor");
      setStreak(prev => prev + 1);
    } else {
      setAnswerBorder("input-box-border-inc");
      if (pb < streak) setPb(streak);
      setStreak(0);
    } 
  }

  const handleUserInput = (e) => {
    e.preventDefault();
    setUserAnswer(e.target.value);
  }

  const masteringCards = () => {
    const currentCard = questionSet[index];

    // add current card to mastered list
    setMasterSet(prev => [...prev, currentCard]);

    // remove it from the question set
    const newSet = questionSet.filter((_, i) => i !== index);
    setQuestionSet(newSet);

    // adjust index:
    if (index >= newSet.length) {
      // if we were at the end, go back one
      setIndex(newSet.length - 1);
    } else {
      // otherwise, stay at the same position (which now shows the next card)
      setIndex(index);
    }
};


  return (
    <div className="container">
      <div className="header-container">
        <h1> Basic Japanese! 🇯🇵 </h1>
        <h2>Departing to Japan soon? Or just curious about the language of Japan? Test your knowledge here!</h2>
        <h4>Number of cards: {allQuestions.length}  //  Current streak: {streak} | Longest streak: {pb} </h4>
      </div>

      <dl className="question-legend">
        <dt className="flashcard-color-red"></dt><dd>greetings</dd>
        <dt className="flashcard-color-green"></dt><dd>numbers</dd>
        <dt className="flashcard-color-yellow"></dt><dd>directions</dd>
        <dt className="flashcard-color-blue"></dt><dd>places</dd>
      </dl>

      <button className={`master-button ${hidden}`} onClick={masteringCards}> mastered? ★ </button>

      <div className='flashcard-container'>
        <div className='mastered-container'>
          <h3 className='mastered-header'> mastered questions: </h3>
          <ul>
            {masterSet.map((question) => (
              <li key={question}> {question} </li>
            ))}
          </ul>
        </div>
      <div className="flashcard" onClick={flipCard}>
        <div className={`flashcard-inner ${isFlipped ? "flip-state" : ""}`}>
          <div className={`flashcard-front ${colorClass}`}>
            <h3>{frontText}</h3>
            <img src={image} width="300" height="200"></img>
          </div>
          <div className="flashcard-back">
            <h3>{backText}</h3>
          </div>
        </div>
      </div>
      </div>

      <form className='answer-container'>
        <label className='guess-the-answer'> Guess the answer: </label>
        <input type='text' name='answerbox' value={userAnswer} onChange={handleUserInput} className={answerBorder}/>
        <button type='button' onClick={handleAnswer}> Submit Guess </button>
      </form>

      <div className="flashcard-btn-container">
        <button className={`flashcard-button ${disabledL}`} onClick={handleBack}>←</button>
        <button className={`flashcard-button ${disabledR}`} onClick={handleNext}>→</button>
        <button className="flashcard-button" onClick={randomizeQs}> Shuffle Cards </button>
      </div>

    </div>
  );
};

export default App;
