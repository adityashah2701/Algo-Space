import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, CardContent } from "@/components/ui/card";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNext();
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.post(
        "https://api.gemini.com/generate-quiz",
        {
          prompt: "Generate a multiple-choice quiz with four options per question.",
        },
        {
          headers: { Authorization: `Bearer ${API_KEY}` },
        }
      );
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setTimeLeft(10);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {!quizFinished ? (
        <Card className="w-96 p-4">
          <CardContent>
            {questions.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
                <p className="text-red-500 mb-2">Time Left: {timeLeft}s</p>
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      className={`w-full ${selectedOption === option ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <Button
                  className="mt-4 w-full bg-green-500 text-white"
                  onClick={handleNext}
                  disabled={!selectedOption}
                >
                  Next
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-96 p-4">
          <CardContent>
            <h2 className="text-xl font-bold">Quiz Completed!</h2>
            <p className="text-lg">Your Score: {score} / {questions.length}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizPage;
