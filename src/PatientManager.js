import React, { useState, useEffect } from "react";
import db from "./database";

const PatientManager = () => {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [dob, setDOB] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [fbs, setFBS] = useState("")
  const [search, setSearch] = useState("");

  // Load patients on startup
  useEffect(() => {
    const fetchPatients = async () => {
      const allPatients = await db.patients.toArray();
      setPatients(allPatients);
      console.log(allPatients)
    };
    fetchPatients();
  }, []);

  // Add a new patient
  const addPatient = async () => {
    if (!name || !dob || !age || !gender  || !citizenship || !address || !mobile || !bloodGroup) return alert("Please fill all fields!");

    await db.patients.add({ name, dob, gender, age, citizenship, address, mobile, bloodGroup, fbs });
    setPatients(await db.patients.toArray());

    // Clear form
    setName("");
    setDOB("");
    setAge("");
    setGender("");
    setCitizenship("");
    setAddress("");
    setMobile("");
    setBloodGroup("");
  };

  // Search filter
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const exportData = async () => {
    const patients = await db.patients.toArray();
    const blob = new Blob([JSON.stringify(patients, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients_backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const importData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = JSON.parse(e.target.result);
      await db.patients.clear();  // Optional: Clear old data
      await db.patients.bulkAdd(data);
      alert("Data imported successfully!");
    };
    reader.readAsText(file);
  };
  

  return (
    <div>
      <h1>Offline Patient Records</h1>

      <h3>Add Patient</h3>
      <div className="patient-inputs">
        <div>
          <label for="name">Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} name="name" placeholder="Name" />
        </div>

        <div>
          <label for="dob">Date of birth:</label>
          <input value={dob} onChange={(e) => setDOB(e.target.value)} type="date" placeholder="Date of birth" name="dob" />
        </div>

        <div>
          <label for="age">Age</label>
          <input value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="Age" name="age" />
        </div>
        
        <div>
          <label for="gender">Gender</label>
          <input value={gender} onChange={(e) => setGender(e.target.value)} type="text" placeholder="Gender" name="gender" />
        </div>

        <div>
          <label for="citizenship">Citizenship</label>
          <input value={citizenship} onChange={(e) => setCitizenship(e.target.value)} type="text" placeholder="Citizenship" name="citizenship" />
        </div>

        <div>
          <label for="address">Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="Address" name="address" />
        </div>

        <div>
          <label for="mobile">Mobile</label>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} type="tel" placeholder="Mobile" name="mobile" />
        </div>

        <div>
          <label for="bloodGroup">Blood Group</label>
          <input value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} type="text" placeholder="Blood Group" name="bloodGroup" />
        </div>
      </div>

      <div className="patient-test-results">
      <label for="fbs">Blood Group</label>
      <input value={fbs} onChange={(e) => setFBS(e.target.value)} type="text" placeholder="FBS" name="fbs" />
      </div>
     
      <button onClick={addPatient}>Add Patient</button>

      <h3>Search Patients</h3>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Name" />

      <h3>Patient List</h3>
      <table className="patient-lists">
        <tr>
          <th>Name</th>
          <th>DOB</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Citizenship</th>
          <th>Address</th>
          <th>Mobile</th>
          <th>Blood Group</th>
          <th>FBS</th>
        </tr>
        {filteredPatients.map((p) =>{
          let fbsValue = Number(p.fbs); // Convert to number
          let bgColor = "";
    
          if (fbsValue >= 1 && fbsValue <= 33) bgColor = "red";
          else if (fbsValue >= 34 && fbsValue <= 66) bgColor = "yellow";
          else if (fbsValue >= 67 && fbsValue <= 100) bgColor = "green";

          return  (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.dob}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
              <td>{p.citizenship}</td>
              <td>{p.address}</td>
              <td>{p.mobile}</td>
              <td>{p.bloodGroup}</td>
              <td style={{ backgroundColor: bgColor }}>{p.fbs}</td>
            </tr>
          )
        })}
      </table>

      <button onClick={exportData}>Export Data</button> <br/>
      <input type="file" onChange={importData} />
    </div>
  );
};

export default PatientManager;
