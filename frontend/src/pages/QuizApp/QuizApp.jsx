// src/pages/QuizPage.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {Button} from '@/components/ui/button'

// Configuration
const API_BASE_URL = 'http://localhost:3000' // Backend server URL

const QuizPage = () => {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState(null)

  // Fetch quiz from backend
  const API_BASE_URL = 'http://localhost:3000' // Backend server URL
  const fetchQuiz = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch quiz')
      }

      const data = await response.json()
      setQuestions(data.questions)
      setIsLoading(false)
    } catch (err) {
      console.error('Quiz generation error:', err)
      setError('Failed to generate quiz. Please try again.')
      setIsLoading(false)
    }
  }

  // Verify answer with backend
  const verifyAnswer = async (question, selectedAnswer, correctAnswer) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          selectedAnswer,
          correctAnswer
        })
      })

      if (!response.ok) {
        throw new Error('Failed to verify answer')
      }
      
      const data = await response.json()
      return data.isCorrect
    } catch (err) {
      console.error('Answer verification error:', err)
      return false
    }
  }

  // Timer and quiz progression effects
  useEffect(() => {
    fetchQuiz()
  }, [])

  useEffect(() => {
    if (!quizFinished && timeLeft > 0 && !isLoading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleNext()
    }
  }, [timeLeft, quizFinished, isLoading])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setFeedback(null)
  }

  const handleNext = async () => {
    // Verify the answer if an option was selected
    if (selectedOption) {
      const isCorrect = await verifyAnswer(
        questions[currentQuestion].question,
        selectedOption,
        questions[currentQuestion].correctAnswer
      )

      if (isCorrect) {
        setScore(prevScore => prevScore + 1)
        setFeedback({
          type: 'correct',
          message: 'Correct answer!'
        })
      } else {
        setFeedback({
          type: 'incorrect',
          message: `Incorrect. The correct answer was: ${questions[currentQuestion].correctAnswer}`
        })
      }

      // Move to next question or finish quiz
      if (currentQuestion + 1 < questions.length) {
        // Wait a moment to show feedback
        setTimeout(() => {
          setCurrentQuestion(prevQuestion => prevQuestion + 1)
          setSelectedOption(null)
          setTimeLeft(10)
          setFeedback(null)
        }, 2000)
      } else {
        // Wait a moment to show final feedback
        setTimeout(() => {
          setQuizFinished(true)
        }, 2000)
      }
    } else {
      // If no option selected, just move to next question
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prevQuestion => prevQuestion + 1)
        setSelectedOption(null)
        setTimeLeft(10)
      } else {
        setQuizFinished(true)
      }
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setQuizFinished(false)
    setTimeLeft(10)
    setFeedback(null)
    fetchQuiz()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <p className="text-xl">Generating quiz...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-red-500">
        <div className="text-center">
          <p className="mb-4">{error}</p>
          <Button onClick={fetchQuiz}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {!quizFinished ? (
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {questions[currentQuestion].question}
            </h2>
            <p className="text-red-500 mb-4 text-lg">
              Time Left: {timeLeft}s
            </p>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedOption === option ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!feedback}
                >
                  {option}
                </Button>
              ))}
            </div>
            {feedback && (
              <p 
                className={`mt-4 text-center ${
                  feedback.type === 'correct' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}
              >
                {feedback.message}
              </p>
            )}
            <Button
              className="mt-4 w-full"
              onClick={handleNext}
              disabled={!selectedOption || !!feedback}
            >
              Next Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl mb-4">
              Your Score: {score} / {questions.length}
            </p>
            <Button 
              className="w-full mt-4"
              onClick={handleRestart}
            >
              Restart Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default QuizPage