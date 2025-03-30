import Dexie from "dexie";

// Initialize the database
const db = new Dexie("PatientDatabase");
db.version(1).stores({
  patients:
    "++id, name, dob, gender, age, citizenship, address, mobile, bloodGroup, fbs,sgpt,sgot,cholesterol,tg, creatinine,uricAcid,breathometer, ecg",
});

export default db;
