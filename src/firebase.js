// =====================================================
//  🔥 Firebase 설정
//  아래 값들을 Firebase 콘솔에서 복사해서 채워주세요.
//  설정 방법은 README.md 를 참고하세요.
// =====================================================

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey:            "AIzaSyCS6IIKdCeTZ5GZRN2tDIGPzxMguX0pah0",
  authDomain:        "welfare-survey.firebaseapp.com",
  databaseURL:       "https://welfare-survey-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "welfare-survey",
  storageBucket:     "welfare-survey.firebasestorage.app",
  messagingSenderId: "349429190802",
  appId:             "1:349429190802:web:148a97ddd568c59c71164b",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
