import { useMemo } from "react";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const allQuestions = [
  // Admissions & Applications
  "What are the admission requirements for UCU-BBUC?",
  "How do I apply for Trinity intake?",
  "When is the application deadline?",
  "What documents are needed for admission?",

  // Programs & Courses
  "What programs does UCU-BBUC offer?",
  "Which undergraduate degrees are available?",
  "Does UCU-BBUC offer postgraduate programs?",
  "What is the duration of the Bachelor of Education degree?",

  // Fees & Finance
  "How much are the tuition fees?",
  "What are the accommodation fees?",
  "Are there any scholarships available?",
  "What payment methods are accepted for fees?",

  // Campus & Facilities
  "Where is the ICT lab located?",
  "Does UCU-BBUC have a library?",
  "Is there student accommodation on campus?",
  "What sports facilities are available?",

  // Academic Life
  "When does the academic year start?",
  "How are exams conducted at UCU-BBUC?",
  "What is the grading system used?",
  "How do I get my academic transcript?",

  // CGPA, Core & Credit Units
  "How is CGPA calculated at UCU-BBUC?",
  "What is the minimum CGPA to pass a semester?",
  "What CGPA is required for a First Class degree?",
  "What are core units and which ones are compulsory?",
  "How many credit units do I need to graduate?",
  "What happens if I fail a core unit?",

  // Contact & Support
  "How do I contact the admissions office?",
  "Where is UCU-BBUC located?",
  "What are the campus opening hours?",
  "How do I reach student support services?",
];

// Pick 6 random questions — stable per component mount
function pickRandom(arr: string[], n: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export const SuggestedQuestions = ({ onSelect }: SuggestedQuestionsProps) => {
  const questions = useMemo(() => pickRandom(allQuestions, 6), []);

  return (
    <div className="py-3 border-t border-border">
      <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-left"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};
