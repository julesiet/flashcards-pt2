import './App.css';
import { useState } from 'react';

const App = () => {

  const QandA = {
    "Hello!": "Kon'nichiwa!",
    "Nice to meet you": "Onegai shimasu",
    "Excuse me": "Sumimasen",
    "Thank you": "Arigatōgozaimasu",
    "Yes": "Hai",
    "No": "Īe",
    "Left": "Hidari",
    "Right": "Migi",
    "Bathroom": "Basurūmu",
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

  const allQuestions = Object.keys(QandA);

  const [frontText, setFrontText] = useState("Welcome! Click on this flashcards to flip them over, instructions are on the back of this card.");
  const [backText, setBackText] = useState("The front of a card will always be a COLORED card, the back will be WHITE - English on the FRONT, Japanese on BACK! Good luck and happy studying!");
  const [isFlipped, setIsFlipped] = useState(false); // better way to track card flipping
  const [colorClass, setColorClass] = useState("flashcard-color-default");
  const [image, setImage] = useState('intro.jpg');

  const handleNext = () => {
    let random = Math.floor(Math.random() * allQuestions.length);
    const question = allQuestions[random];

    setFrontText(question);
    setBackText(QandA[question]);
    setImage(`${question}.jpg`);

    // colors based on question displayed
    if (greetings.includes(question)) setColorClass("flashcard-color-red");
    else if (numbers.includes(question)) setColorClass("flashcard-color-green");
    else if (directions.includes(question)) setColorClass("flashcard-color-yellow");
    else if (places.includes(question)) setColorClass("flashcard-color-blue");
    else setColorClass("flashcard-color-default");

    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="container">
      <div className="header-container">
        <h1> Basic Japanese! 🇯🇵 </h1>
        <h2>Departing to Japan soon? Or just curious about the language of Japan? Test your knowledge here!</h2>
        <h4>Number of cards: {allQuestions.length}</h4>
      </div>

      <dl className="question-legend">
        <dt className="flashcard-color-red"></dt><dd>greetings</dd>
        <dt className="flashcard-color-green"></dt><dd>numbers</dd>
        <dt className="flashcard-color-yellow"></dt><dd>directions</dd>
        <dt className="flashcard-color-blue"></dt><dd>places</dd>
      </dl>

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

      <button onClick={handleNext} className="flashcard-button">→</button>
    </div>
  );
};

export default App;
