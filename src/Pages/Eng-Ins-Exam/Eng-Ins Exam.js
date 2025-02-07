import React, { useState, useEffect } from "react";
import "./Eng-Ins-Exam.css";

const questions = [
  {
    question: "What does DAO stand for?",
    options: [
      "Division Administrative Order",
      "Declaration Administrative Order",
      "Director Administrative Order",
      "Department of Environment and Natural Resources (DENR) Administrative Order",
    ],
  },
  {
    question: "DAO 2000-98 is otherwise known as __________?",
    options: [
      "Occupational Safety and Health Standards",
      "Mine Safety and Health Standards",
      "Safe and Workplace Standards",
      "Safety and Health Standards",
    ],
  },
  {
    question: "In case of a fatal accident, when to give notice to the Director, Regional Director, or their duly authorized representative/s?",
    options: ["Within 4 Hours", "Within 8 Hours", "Within 24 Hours", "Within 48 Hours"],
  },
  {
    question: "In case of a fatal accident, when to submit a detailed report to the Director, Regional Director, or their duly authorized representative/s?",
    options: ["Within 4 Days", "Within 8 Days", "Within 15 Days", "Within 30 Days"],
  },
  {
    question: "What does MGAR stand for?",
    options: [
      "Mostly General Accident Report",
      "Monthly Group Accident Report",
      "Monthly General Authorized Report",
      "Monthly General Accident Report",
    ],
  },
  {

  question: "What is the form to be used in submitting MGAR?",
  options: [
        "A. MGB Form No. 15-4",
       "B. MGB Form No. 15-5" ,
        "C. MGB Form No. 15-7",
       "D. MGB Form No. 15-8",
  ],
},
{
    question: "When to submit the Safety and Health Program?",
    options: [
          "A. 15 Working Days before the start of the Calendar Year",
         "B. 15 Days before the start of the Calendar Year" ,
          "C. 15 Working Days after the start of the Calendar Year",
         "D. 15 Days after the start of the Calendar Year",
    ],
  },
  {
    question: "Duties and responsibilities of the Safety Inspector/Engineer shall:",
    options: [
          "A. Provide and make available personal protective equipment (PPE) in accordance with the type of work performed at no cost to the employee",
         "B. Provide hospitalization, medical facilities, including transportation to the hospital, and provide full treatment to employees injured" ,
          "C. Submit to the Director a Safety and Health Program covering its area of operation",
         "D. None of the above",
    ],
  },
  {
    question: "Duties and responsibilities of the Safety Inspector/Engineer shall:",
    options: [
          "A. Make routine inspection of the mine/plant",
         "B. Institute and formulate a safety and health program for the company" ,
          "C. Formulate an emergency response preparedness program for the company",
         "D. All of the above",
    ],
  },
  {
    question: "What is the highest element in a series of control measures?",
    options: [
          "A. Personal Protective Equipment",
         "B. Engineering" ,
          "C. Elimination",
         "D. Administrative",
    ],
  },
  {
    question: "What is the lowest element in a series of control measures?",
    options: [
          "A. Personal Protective Equipment",
         "B. Engineering" ,
          "C. Elimination",
         "D. Administrative",
    ],
  },
  {
    question: "What does MSDS stand for?",
    options: [
          "A. Manual Safety Data Sheet",
         "B. Material Safety Data Sheet" ,
          "C. Miners Safety Data Sheet",
         "D. Maintenance Safety Data Sheet",
    ],
  },
  {
    question: "How should an acetylene and oxygen cylinder be positioned during cutting/welding?",
    options: [
          "A. Must be positioned at an angle of at least 30° with the floor",
         "B. Must always be in an upright position" ,
          "C. May be laid down on the floor",
         "D. None of the above",
    ],
  },
  {
    question: "What are the two main causes of incidents in the workplace?",
    options: [
          "A. Unsafe acts and unsafe people",
         "B. Unsafe people and unsafe machines" ,
          "C. Unsafe conditions and unsafe machines",
         "D. Unsafe acts and unsafe conditions",
    ],
  },
  {
    question: "Who can apply for Safety Inspector?",
    options: [
          "A. A graduate in any engineering, geology, metallurgy, or chemistry course",
         "B. A college undergraduate in any engineering, geology, metallurgy, or chemistry course" ,
          "C. A high school graduate",
         "D. All of the above",
    ],
  },
  {
    question: "What is the formula for accident Frequency Rate (FR)?",
    options: [
          "A. (NF + Fatal) X (1,000,000) / Total Manhours Worked",
         "B. (Days Lost) X (1,000,000) / Total Manhours Worked" ,
          "C. (NLTA + NF + Fatal) X (200,000) / Total Manhours Worked",
         "D. (FR) X (SR) / 2",
    ],
  },
  {
    question: "What does CSHC stand for?",
    options: [
          "A. Central Safe and Health Committee",
         "B. Center Safety and Health Committee" ,
          "C. Central Safety and Health Committee",
         "D. Cancer Safety and Health Committee",
    ],
  },
  {
    question: "The CSHC shall maintain a continuous regular __________ meetings and shall submit the minutes of the meeting to the Director, copy furnished to the Regional Director.",
    options: [
          "A. Quarterly CSHC Meetings",
         "B. Monthly CSHC Meetings" ,
          "C. Weekly CSHC Meetings",
         "D. Daily CSHC Meetings",
    ],
  },
  {
    question: "What does ERT stand for?",
    options: [
          "A. Emergency Responsorial Team",
         "B. Emergency Response Text" ,
          "C.Energy Response Team",
         "D. Emergency Response Team",
    ],
  },
  {
    question: "When to submit the Emergency Drill Report to the MGB Regional Office?",
    options: [
          "A. Monthly, within 15 days after every month",
         "B. Quarterly, within 15 days after every quarter" ,
          "C. Semi-annually, within 15 days after every semester",
         "D. Annually, within 15 days after every year",
    ],
  },
  {
    question: "What is the formula for accident Severity Rate (SR)?",
    options: [
          "A. (NF + Fatal) X (1,000,000) / Total Manhours Worked",
         "A. (NF + Fatal) X (1,000,000) / Total Manhours Worked" ,
          "C. (NLTA + NF + Fatal) X (200,000) / Total Manhours Worked",
         "D. (FR) X (SR) / 2",
    ],
  },
];



const ExamForm = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const handleChange = (index, answer) => {
    setAnswers({ ...answers, [index]: answer });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Safety Engineer/Inspector Examination</h1>
      <form>
        {shuffledQuestions.map((q, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg">
            <p className="font-semibold">{index + 1}. {q.question}</p>
            {q.options.map((option, optionIndex) => (
              <label key={optionIndex} className="block">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleChange(index, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Proceed to Exam
        </button>
      </form>
    </div>
  );
};

export default ExamForm;
