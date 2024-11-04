import ProgressBar from "@/components/ProgressBar";
import RecordButton from "@/components/RecordButton";
import NavigationButton from "@/components/NavigationButton";
import QuestionCard from "@/components/QuestionCard";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";
/* const questions = [
  "Tell me about your favorite magical creature. What makes it special?",
  "If you could explore any place in the world, where would you go and why?",
  "Imagine you found a treasure chest. What would be inside it?",
  "If you could have any superpower, what would it be and how would you help others?",
  "Create a short story about a brave little star that fell from the sky.",
]; */

export default function Assessment() {
  const { sid } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(5).fill(""));
  const [isRecording, setIsRecording] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BACKEND_URL}/api/story/getQuestions/${sid}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        //setQuestions(data.assignment?.questions);
        console.log("Fetched questions:", data.assignment?.questions);
        const arrayOfQuestions = data.assignment?.questions.map(
          (q) => q.question
        ); // Assuming `q` has a `question` field
        setQuestions(arrayOfQuestions || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [sid]);

  useEffect(() => {
    console.log("Questions", questions);
  }, [questions]);

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis);

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setCurrentTranscript(transcript);

        const wordCount = transcript.trim().split(/\s+/).length;
        setCanProceed(wordCount >= 5);

        console.log(
          `Question ${currentQuestion + 1} - Current Answer:`,
          transcript
        );
        console.log("Word count:", wordCount);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const speakText = (text) => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (currentQuestion >= 0) {
      speakText(questions[currentQuestion]);
      setCurrentTranscript(answers[currentQuestion] || "");
      setCanProceed(
        answers[currentQuestion]?.trim().split(/\s+/).length >= 5 || false
      );
    }
  }, [currentQuestion]);

  const handleRecordStart = () => {
    if (recognition) {
      setIsRecording(true);
      setCurrentTranscript("");
      recognition.start();
    }
  };

  const handleRecordEnd = () => {
    if (recognition) {
      setIsRecording(false);
      recognition.stop();

      const newAnswers = [...answers];
      newAnswers[currentQuestion] = currentTranscript;
      setAnswers(newAnswers);

      console.log("Updated Answers Array:", newAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setCanProceed(false);
      setCurrentTranscript("");
    }
  };

  const handleSubmit = async (e) => {
    try {
      setIsSubmitted(true);
      e.preventDefault();
      const response = await fetch(`${BACKEND_URL}/api/story/feedback/${sid}`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      console.log("Submitted feedback:", data.saveFeedbacks);
      navigate(`/dashboard/Feedback/${sid}`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitted(false);
    }

    //alert("Great job! Your storytelling adventure has been submitted! 🌟");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <MoonLoader color="#003ff2" size={90} />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all">
            <ProgressBar current={currentQuestion} total={questions.length} />

            <QuestionCard
              question={questions[currentQuestion]}
              currentNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              onReadAgain={() => speakText(questions[currentQuestion])}
            />

            <div className="mt-6">
              <RecordButton
                isRecording={isRecording}
                onRecordStart={handleRecordStart}
                onRecordEnd={handleRecordEnd}
              />
            </div>

            {currentTranscript && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{currentTranscript}</p>
                {!canProceed && (
                  <p className="text-sm text-red-500 mt-2">
                    Please provide at least 5 words in your answer.
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <NavigationButton
                isLastQuestion={currentQuestion === questions.length - 1}
                canProceed={canProceed && !isSubmitted}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
