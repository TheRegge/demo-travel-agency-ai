/**
 * Clarification Prompt Component
 * Elegant UI for AI follow-up questions and user responses
 */

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClarificationQuestion } from "@/types/travel"
import { CheckCircle, HelpCircle, ArrowRight } from "lucide-react"

interface ClarificationPromptProps {
  questions: ClarificationQuestion[]
  onAnswer: (questionId: string, answer: string) => void
  onSubmit: () => void
  disabled?: boolean
  className?: string
}

export const ClarificationPrompt = ({
  questions,
  onAnswer,
  onSubmit,
  disabled = false,
  className = ""
}: ClarificationPromptProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswerSelect = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)
    onAnswer(questionId, answer)
  }

  const handleSubmit = () => {
    // Check if all required questions are answered
    const requiredQuestions = questions.filter(q => q.required)
    const answeredRequired = requiredQuestions.every(q => answers[q.id])
    
    if (answeredRequired) {
      onSubmit()
    }
  }

  const canSubmit = () => {
    const requiredQuestions = questions.filter(q => q.required)
    return requiredQuestions.every(q => answers[q.id]) && !disabled
  }

  const getQuestionIcon = (question: ClarificationQuestion) => {
    const iconMap = {
      trip_type: "🗺️",
      duration: "📅",
      budget: "💰",
      group_size: "👥",
      preferences: "❤️",
      dates: "📆",
      accommodation: "🏨"
    }
    return iconMap[question.type] || "❓"
  }

  return (
    <Card className={`bg-gradient-to-br from-sky-50 to-emerald-50 border-sky-200 shadow-lg ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Help me personalize your trip</h3>
            <p className="text-sm text-gray-600">Answer a few quick questions for better recommendations</p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              {/* Question Header */}
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{getQuestionIcon(question)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800">{question.question}</h4>
                    {question.required && (
                      <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                        Required
                      </Badge>
                    )}
                    {answers[question.id] && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  {question.context && (
                    <p className="text-xs text-gray-500 mb-3">{question.context}</p>
                  )}
                </div>
              </div>

              {/* Answer Options */}
              {question.options ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswerSelect(question.id, option.value)}
                      disabled={disabled}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${
                        answers[question.id] === option.value
                          ? 'border-sky-500 bg-sky-50 text-sky-900'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                // Free text input for questions without options
                <div className="ml-8">
                  <input
                    type="text"
                    placeholder="Your answer..."
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                    disabled={disabled}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Divider */}
              {index < questions.length - 1 && (
                <div className="border-t border-gray-200 pt-3"></div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {Object.keys(answers).length} of {questions.filter(q => q.required).length} required questions answered
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit()}
              className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white disabled:opacity-50"
            >
              {canSubmit() ? (
                <>
                  Get My Recommendations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'Please answer required questions'
              )}
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(Object.keys(answers).length / questions.filter(q => q.required).length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClarificationPrompt