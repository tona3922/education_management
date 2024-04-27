import { DocumentData } from "firebase/firestore";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourse } from "./hooks/getCourse";

import styles from "./index.module.css";
import {
  ECourseDocumentType,
  removeCourseDocument,
  updateDocument,
} from "../Management/Student/updateCourse";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { uuidv4 } from "../../utils/common";

const CourseDetail = () => {
  // Truy xuất role của user từ local storage
  const role = localStorage.getItem("role");
  const isTeacher = role === "teacher";

  // Lấy course code từ URL parameters
  const params = useParams();
  const courseCode = params?.courseCode;

  // State variables để quản lý course data và document upload
  const [course, setCourse] = useState<DocumentData>([]);
  const [documentSelected, setDocumentSelected] = useState<DocumentData>();
  const [isUploading, setIsUploading] = useState(false);

  // Tham chiếu đến input file cho document upload
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    handleGetCourse();
  }, [courseCode]);

  // Hàm để fetch course data
  const handleGetCourse = async () => {
    if (!courseCode) return;

    const course = await getCourse(courseCode);
    course && setCourse(course);
  };

  // Hàm mở course document trong trang mới
  const onOpenCourseDoc = (url: string) => {
    window.open(url, "_blank");
  };

  // Hàm xóa course document
  const onRemoveCourseDocument = async (documentId: string) => {
    const isConfirm = confirm("Are you sure you want to remove this document?");

    if (!courseCode || !isConfirm) return;
    await removeCourseDocument(courseCode, documentId);
    handleGetCourse();
  };

  // Xử lí button click cho updating course document
  const onBtnUpdateClick = async (document: DocumentData) => {
    setDocumentSelected(document);
    if (!courseCode) return;

    // Nếu document là 1 notification, prompt nội dung mới
    if (document.type === ECourseDocumentType.NOTIFICATION) {
      const newNotification = prompt(
        "Enter new notification content:",
        document.content
      );
      if (!newNotification) return;

      // Cập nhật notification content
      await updateDocument(courseCode, {
        ...document,
        content: newNotification,
      });
      handleGetCourse();
    } else {
      // Nếu document là 1 file, kích hoạt thao tác nhập file để cập nhật
      if (isUploading || !inputFileRef.current) return;
      inputFileRef.current.accept =
        document.type === ECourseDocumentType.FILE ? ".pdf" : ".mp4";
      inputFileRef.current.click();
    }
  };

  // Xử lí file upload
  const onUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);
      const splitFileName = file.name.split(".");

      const fileName =
        splitFileName[0] + "_" + uuidv4() + "." + splitFileName[1];
      const storage = getStorage();
      const storageRef = ref(storage, fileName);
      const res = await uploadBytes(storageRef, file);

      // Lấy Url của tệp sau khi tải lên thành công
      const url = await getDownloadURL(res.ref);

      // Cập nhật document data với file URL mới
      const documentData = {
        ...documentSelected,
        name: file.name,
        content: url,
      };

      // Cập nhật document trong database
      await updateDocument(course.courseCode, documentData);
      alert("Update document successfully");
      handleGetCourse();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
      inputFileRef.current && (inputFileRef.current.value = "");
    }
  };

  return (
    <>
      {/* Course information */}
      <div>
        <div className={styles.title}>
          <p>Course information:</p>
          <strong>{course?.courseCode}</strong>
        </div>

        <div className={styles.row}>
          <strong>Course Name:</strong>
          <span>{course?.courseName}</span>
        </div>

        <div className={styles.row}>
          <strong>Credit:</strong>
          <span>{course?.credit}</span>
        </div>

        <div className={styles.row}>
          <strong>Schedule:</strong>
          <span>{course?.schedule}</span>
        </div>

        {!isTeacher && (
          <div className={styles.row}>
            <strong>Teacher:</strong>
            <span>{course?.teacher}</span>
          </div>
        )}

        {/* Display registered students */}
        <div>
          <strong>Registered Students:</strong>

          {course?.studentRegister?.map((it: any) => (
            <div
              key={`student-item-${it.uid}`}
              className={`${styles.row} ${styles.studentItem}`}
            >
              <img src={it.image} alt="" />

              <div>
                <p style={{ margin: 0 }}>{it?.name}</p>
                <p style={{ margin: 0 }}>{it?.email}</p>

                {/* Display GPA and major if teacher role */}
                {isTeacher && (
                  <>
                    <p style={{ margin: 0 }}>GPA: {it?.GPA?.toFixed(2)}</p>
                    <p style={{ margin: 0 }}>Major: {it?.major}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Display course documents */}
        {course?.courseDocuments && (
          <div>
            <strong>Course Documents:</strong>

            {course.courseDocuments.map((it: DocumentData) =>
              it.type === ECourseDocumentType.NOTIFICATION ? (
                <div
                  className={styles.row}
                  key={`course-document-item-${it.id}`}
                >
                  <strong>{it.content}</strong>

                  {/* Display remove and update buttons for teacher */}
                  {isTeacher && (
                    <>
                      <button onClick={() => onRemoveCourseDocument(it.id)}>
                        Remove
                      </button>
                      <button onClick={() => onBtnUpdateClick(it)}>
                        Update
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className={styles.row}
                  key={`course-document-item-${it.id}`}
                >
                  <strong>{it.name}</strong>

                  <button onClick={() => onOpenCourseDoc(it.content)}>
                    Download
                  </button>

                  {/* Display remove and edit buttons for teacher */}
                  {isTeacher && (
                    <>
                      <button onClick={() => onRemoveCourseDocument(it.id)}>
                        Remove
                      </button>
                      <button onClick={() => onBtnUpdateClick(it)}>
                        {isUploading && documentSelected?.id === it.id
                          ? "Updating..."
                          : "Edit"}
                      </button>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        name=""
        id=""
        hidden
        ref={inputFileRef}
        onChange={onUploadFile}
      />
    </>
  );
};

export default CourseDetail;
