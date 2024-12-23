import { useState } from "react";
import Editor from "../Components/Editor";
import { diff_match_patch } from "diff-match-patch";
import TimerPicker from "../Components/TimerPicker";

const App = () => {
  const [originalText] =
    useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Phasellus vitae ex nec lorem lacinia commodo.
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
Integer non nulla at lorem tincidunt bibendum, a ultricies purus.
Curabitur euismod, lorem ac feugiat convallis, neque erat volutpat sapien, id elementum nunc justo sit amet eros.
Donec sit amet, enim eu purus cursus fringilla.`);
  const [studentText, setStudentText] = useState("");
  const [comparisonResult, setComparisonResult] = useState("");
  const [accuracy, setAccuracy] = useState(null);

  const compareTexts = () => {
    const dmp = new diff_match_patch();
    const originalLines = originalText.split("\n");
    const studentLines = studentText.split("\n");

    let totalWords = 0;
    let matchedWords = 0;

    const highlightedLines = originalLines.map((originalLine, index) => {
      const studentLine = studentLines[index] || ""; // Default to empty if student text is shorter
      const diffs = dmp.diff_main(originalLine, studentLine);
      dmp.diff_cleanupSemantic(diffs);

      // Count total and matched words for accuracy
      const originalWords = originalLine.split(/\s+/).filter(Boolean);
      const studentWords = studentLine.split(/\s+/).filter(Boolean);
      totalWords += originalWords.length;

      originalWords.forEach((word, wordIndex) => {
        if (studentWords[wordIndex] === word) matchedWords++;
      });

      // Highlight differences in the current line
      const highlighted = diffs
        .map(([type, text]) => {
          if (type === -1) {
            return `<span class="bg-red-600 text-white">${text}</span>`; // Leftover (Dark Red)
          }
          if (type === 1) {
            return `<span class="bg-yellow-200">${text}</span>`; // Wrong (Light Red)
          }
          return `<span class="bg-green-200">${text}</span>`; // Matched (Green)
        })
        .join("");

      return `<div>${highlighted}</div>`; // Wrap each line in a block for proper structure
    });

    // Highlight extra lines in student text
    const extraLines = studentLines
      .slice(originalLines.length)
      .map((line) => `<div class="bg-red-200">${line}</div>`);

    setComparisonResult(highlightedLines.concat(extraLines).join(""));

    // Calculate accuracy percentage
    const accuracyPercentage =
      totalWords > 0 ? ((matchedWords / totalWords) * 100).toFixed(2) : 0;
    setAccuracy(accuracyPercentage);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <h1 className="text-3xl font-bold text-center mb-5">
        Text Comparison Tool
      </h1>
      <div className="flex justify-center">
        <TimerPicker compareTexts={compareTexts} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Original Text</h2>
          <Editor text={originalText} isReadOnly />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Text</h2>
          <Editor text={studentText} setText={setStudentText} />
        </div>
      </div>
      <button
        onClick={compareTexts}
        className="mt-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Compare
      </button>
      {comparisonResult && (
        <div className="mt-5 p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Comparison Result</h2>
          <div className="flex gap-5">
            <div className="my-3 flex gap-2 items-center">
              <span className="h-4 w-4 bg-red-600"></span>
              <span>Left Word</span>
            </div>
            <div className="my-3 flex gap-2 items-center">
              <span className="h-4 w-4 bg-yellow-200"></span>
              <span>Wrong Word</span>
            </div>
            <div className="my-3 flex gap-2 items-center">
              <span className="h-4 w-4 bg-green-200"></span>
              <span>Correct Word</span>
            </div>
          </div>
          <div
            className="comparison-result text-gray-800"
            dangerouslySetInnerHTML={{ __html: comparisonResult }}
          ></div>
        </div>
      )}
      {accuracy !== null && (
        <div className="mt-3 p-4 bg-green-50 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold">Accuracy</h2>
          <p className="text-green-700">
            Your accuracy is <span className="font-bold">{accuracy}%</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
