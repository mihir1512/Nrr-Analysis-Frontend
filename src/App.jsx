import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    yourTeam: '',
    oppositionTeam: '',
    over: '',
    position: '',
    runs: '',
    tossResult: ''
  });

  const [submitResult, setSubmitResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    // Make GET request to fetch team list
    axios.get('http://localhost:3000/result/teams')
      .then(response => {
        // Set the received team list data
        setTeamList(response.data);
      })
      .catch(error => {
        console.error('Error fetching team list:', error);
      });
  }, []); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '' // Clearing the error when the field is changed
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length === 0) {
      // Form is valid, proceed with submission
      axios.post('http://localhost:3000/result', formData)
        .then(response => {
          // Handle successful submission
          console.log('Form submitted successfully:', response.data);
          // Set the submission result
          setSubmitResult(response.data);
          // Clear the form
          setFormData({
            yourTeam: '',
            oppositionTeam: '',
            over: '',
            position: '',
            runs: '',
            tossResult: ''
          });
          // Clear any previous errors
          setErrors({});
        })
        .catch(error => {
          // Handle submission error
          console.error('Error submitting form:', error);
          // Set the submission error
          setSubmitResult('Submission failed');
        });
    } else {
      // Form has errors, display them
      setErrors(formErrors);
    }
  };

  const handleClear = () => {
    // Clear the submit result
    setSubmitResult(null);
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.yourTeam.trim()) {
      errors.yourTeam = 'Your Team is required';
    }
    if (!data.oppositionTeam.trim()) {
      errors.oppositionTeam = 'Opposition Team is required';
    }
    if (data.yourTeam.trim() === data.oppositionTeam.trim()) {
      errors.oppositionTeam = 'Opposition Team should be different from Your Team';
    }
    if (!data.over.trim()) {
      errors.over = 'Overs is required';
    } else if (isNaN(data.over) || +data.over <= 0) {
      errors.over = 'Overs should be a positive number';
    } else if (!/^\d+(\.[0-5])?$/.test(data.over.trim())) {
      errors.over = 'Overs should be a positive number with at most one digit after the decimal point between 0 and 5';
    }
    if (!data.position.trim()) {
      errors.position = 'Desired Position is required';
    } else if (!/^[1-9]\d*$/.test(data.position.trim())) {
      errors.position = 'Desired Position should be a positive integer greater than 0';
    } else if (+data.position > teamList.length) {
      errors.position = `Desired Position should be less than or equal to ${teamList.length}`;
    }
    if (!data.runs.trim()) {
      errors.runs = 'Runs is required';
    } else if (!/^\d+$/.test(data.runs.trim())) {
      errors.runs = 'Runs should be a positive integer';
    }
    if (!data.tossResult.trim()) {
      errors.tossResult = 'Toss Result is required';
    }
    return errors;
  };

  return (
    <div className="outer-box">
      <div className="inner-box">
        <main className="form-body">
          <form onSubmit={handleSubmit}>
            <p>
              <label htmlFor="team">Your Team</label>
              <select
                id="team"
                onChange={handleChange}
                name="yourTeam"
                value={formData.yourTeam}
              >
                <option value="">Select Your Team</option>
                {teamList.map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
              {errors.yourTeam && <span className="error">{errors.yourTeam}</span>}
            </p>
            <p>
              <label htmlFor="againstTeam">Opposition Team</label>
              <select
                id="againstTeam"
                onChange={handleChange}
                name="oppositionTeam"
                value={formData.oppositionTeam}
              >
                <option value="">Select Opposition Team</option>
                {teamList.map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
              {errors.oppositionTeam && <span className="error">{errors.oppositionTeam}</span>}
            </p>
            <p>
              <label htmlFor="over">How many overs match?</label>
              <input
                type="number"
                id="over"
                placeholder="Overs"
                onChange={handleChange}
                name="over"
                value={formData.over}
              />
              {errors.over && <span className="error">{errors.over}</span>}
            </p>
            <p>
              <label htmlFor="position">Desired Position</label>
              <input
                type="number"
                id="position"
                placeholder="Enter desired position"
                onChange={handleChange}
                name="position"
                value={formData.position}
              />
              {errors.position && <span className="error">{errors.position}</span>}
            </p>
            <p>
              <label htmlFor="toss">Toss result</label>
              <select
                id="toss"
                value={formData.tossResult}
                onChange={handleChange}
                name="tossResult"
              >
                <option value="">Select</option>
                <option value="batting">Batting</option>
                <option value="bowling">Bowling</option>
              </select>
              {errors.tossResult && <span className="error">{errors.tossResult}</span>}
            </p>
            <p>
              <label htmlFor="runs">Runs</label>
              <input
                type="number"
                id="runs"
                placeholder="Enter runs"
                onChange={handleChange}
                name="runs"
                value={formData.runs}
              />
              {errors.runs && <span className="error">{errors.runs}</span>}
            </p>
            <p>
              <input type="submit" id="submit" value="Result" />
            </p>
          </form>
          {submitResult && (
             <div>
             <h2>Result</h2>
             <p className="result-text">{submitResult.msg}</p>
             <button onClick={handleClear}>Clear</button>
           </div>
          )}
        </main>
      </div>
      {/* <div className="circle c1"></div>
      <div className="circle c2"></div> */}
    </div>
  );
}

export default App;
