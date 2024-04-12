import { useState } from "react";
import { setGrade } from "../setGrade";
import { TPerson } from "../../../Profile";
const handleSetGrade = (
  midleScore: number,
  finalScore: number,
  studentId: string,
  courseCode: string
) => {
  setGrade(midleScore, finalScore, studentId, courseCode);
};
interface TListCourses {
  [key: string]: TScore;
}
type TScore = {
  midterm: number;
  final: number;
  average: number;
};
interface TPersonNew extends TPerson {
  uid: string;
  listCourses: TListCourses;
}
const SetGrade: React.FC<{
  count: number;
  courseCode: string;
  midtermScoreStates: number[];
  finalScoreStates: number[];
  student: TPersonNew;
}> = ({ count, courseCode, midtermScoreStates, finalScoreStates, student }) => {
  const [midtermScore, setMidtermScore] = useState<number>(
    midtermScoreStates[count]
  );
  const [finalScore, setFinalScore] = useState<number>(finalScoreStates[count]);
  return (
    <div key={student.uid}>
      <p>{student.name}</p>
      <p>{student.email}</p>
      <img style={{ width: 150 }} src={student.image} alt="Student" /> <br />
      <br />
      <div>
        {" "}
        Current midterm score: {student.listCourses[courseCode].midterm}
      </div>
      <input
        type="number"
        value={midtermScore}
        onChange={(event) => setMidtermScore(parseFloat(event.target.value))}
        placeholder="Enter new midterm score"
      />
      <br />
      <div> Current final score: {student.listCourses[courseCode].final}</div>
      <input
        type="number"
        value={finalScore}
        onChange={(event) => setFinalScore(parseFloat(event.target.value))}
        placeholder="Enter new final score"
      />
      <br />
      <div> Average score: {student.listCourses[courseCode].average}</div>
      <button
        onClick={() => {
          handleSetGrade(midtermScore, finalScore, student.uid, courseCode);
        }}
      >
        Set Grade
      </button>
      <div>-------------------------------------------------</div>
    </div>
  );
  //   })}
};

export default SetGrade;
