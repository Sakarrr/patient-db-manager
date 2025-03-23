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
    fbs: "",
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
    if (Object.values(formData).some((field) => !field))
      return alert("Please fill all fields!");

    if (editingId) {
      await db.patients.update(editingId, formData);
      setEditingId(null);
    } else {
      await db.patients.add(formData);
    }

    setPatients(await db.patients.toArray());
    setFormData({
      name: "",
      dob: "",
      age: "",
      gender: "",
      citizenship: "",
      address: "",
      mobile: "",
      bloodGroup: "",
      fbs: "",
    });
  };

  const exportData = async () => {
    const patients = await db.patients.toArray();
    const blob = new Blob([JSON.stringify(patients, null, 2)], {
      type: "application/json",
    });
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
      // await db.patients.clear(); // Optional: Clear old data
      await db.patients.bulkAdd(data);
      alert("Data imported successfully!");
    };
    reader.readAsText(file);
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

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-wrapper">
      <h1>Offline Patient Records</h1>
      <h3>{editingId ? "Edit Patient" : "Add Patient"}</h3>
      <div className="patient-inputs">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              value={formData[key]}
              onChange={handleChange}
              type={"text"}
              name={key}
              className={key}
              placeholder={`Enter ${
                key.charAt(0).toUpperCase() + key.slice(1)
              }`}
            />
          </div>
        ))}
      </div>
      <div className="input-btns">
        <button onClick={addOrUpdatePatient}>
          {editingId ? "Update" : "Add"} Patient
        </button>

        <button onClick={clearAllData} className="clear">
          Clear All Data
        </button>
      </div>
      <div className="patient-list-header">
        <h3>Patient List</h3>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient by Name"
        />
      </div>
      <table>
        <thead>
          <tr>
            {Object.keys(formData).map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p.id}>
              {Object.keys(formData).map((key) => (
                <td
                  key={key}
                  style={
                    key === "fbs"
                      ? {
                          backgroundColor:
                            p.fbs < 34
                              ? "red"
                              : p.fbs < 67
                              ? "yellow"
                              : "green",
                        }
                      : {}
                  }
                >
                  {p[key]}
                </td>
              ))}
              <td>
                <button onClick={() => editPatient(p)}>Edit</button>
                <button onClick={() => deletePatient(p.id)} className="delete">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={exportData} className="export">
        Export Data
      </button>{" "}
      <br />
      <input type="file" onChange={importData} className="import" />
    </div>
  );
};

export default PatientManager;
