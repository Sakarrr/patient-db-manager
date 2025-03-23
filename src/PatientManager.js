import React, { useState, useEffect } from "react";
import db from "./database";

const PatientManager = () => {
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
    citizenship: "",
    address: "",
    mobile: "",
    bloodGroup: "",
    fbs: ""
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      setPatients(await db.patients.toArray());
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addOrUpdatePatient = async () => {
    if (Object.values(formData).some(field => !field)) return alert("Please fill all fields!");
    
    if (editingId) {
      await db.patients.update(editingId, formData);
      setEditingId(null);
    } else {
      await db.patients.add(formData);
    }

    setPatients(await db.patients.toArray());
    setFormData({ name: "", dob: "", age: "", gender: "", citizenship: "", address: "", mobile: "", bloodGroup: "", fbs: "" });
  };

  const editPatient = (patient) => {
    setFormData(patient);
    setEditingId(patient.id);
  };

  const deletePatient = async (id) => {
    await db.patients.delete(id);
    setPatients(await db.patients.toArray());
  };

  const clearAllData = async () => {
    if (window.confirm("Are you sure you want to delete all records?")) {
      await db.patients.clear();
      setPatients([]);
    }
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1>Offline Patient Records</h1>
      <h3>{editingId ? "Edit Patient" : "Add Patient"}</h3>
      <div className="patient-inputs">
        {Object.keys(formData).map(key => (
          <div key={key}>
            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              value={formData[key]}
              onChange={handleChange}
              type={key === "dob" ? "date" : "text"}
              name={key}
            />
          </div>
        ))}
      </div>
      <button onClick={addOrUpdatePatient}>{editingId ? "Update" : "Add"} Patient</button>
      <button onClick={clearAllData} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>Clear All Data</button>

      <h3>Search Patients</h3>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Name" />
      <h3>Patient List</h3>
      <table>
        <thead>
          <tr>
            {Object.keys(formData).map(key => <th key={key}>{key}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map(p => (
            <tr key={p.id}>
              {Object.keys(formData).map(key => (
                <td key={key} style={key === "fbs" ? { backgroundColor: p.fbs < 34 ? "red" : p.fbs < 67 ? "yellow" : "green" } : {}}>
                  {p[key]}
                </td>
              ))}
              <td>
                <button onClick={() => editPatient(p)}>Edit</button>
                <button onClick={() => deletePatient(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientManager;
