import React, { useState } from 'react'; 
import axios from 'axios';
import './App.css';

const App = () => {
  const [income, setIncome] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [error, setError] = useState(null);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Credit score simulator state
  const [currentCreditScore, setCurrentCreditScore] = useState('');
  const [actions, setActions] = useState([]);

  // Loan calculator state
  const [selfEmployed, setSelfEmployed] = useState(''); // Self Employed (Y/N)
  const [applicantIncome, setApplicantIncome] = useState(''); // Applicant Income
  const [coapplicantIncome, setCoapplicantIncome] = useState(''); // Coapplicant Income
  const [creditHistory, setCreditHistory] = useState(''); // Credit History (0/1)
  const [propertyArea, setPropertyArea] = useState(''); // Property Area (Urban/Semi Urban/Rural)
  const [optimalLoanAmount, setOptimalLoanAmount] = useState(null); // Optimal loan amount

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        income_annum: income,
        cibil_score: creditScore,
        loan_amount: loanAmount,
        loan_term: loanTerm,
      });
      setEligibilityResult(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch eligibility. Please try again.');
      setEligibilityResult(null);
    }
  };

  const handleLoanCalculation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/calculate-loan', {
        self_employed: selfEmployed,
        applicant_income: applicantIncome,
        coapplicant_income: coapplicantIncome,
        credit_history: creditHistory,
        property_area: propertyArea,
      });
      setOptimalLoanAmount(response.data.optimal_loan);
      setError(null);
    } catch (err) {
      setError('Failed to calculate optimal loan. Please try again.');
      setOptimalLoanAmount(null);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Loan Eligibility Prediction</h1>
      <form className="loan-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Income (Annual):
          <input
            className="form-input"
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Credit Score:
          <input
            className="form-input"
            type="number"
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Loan Amount:
          <input
            className="form-input"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Loan Term (in years):
          <input
            className="form-input"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="submit-button">Check Eligibility</button>
      </form>
      {eligibilityResult && (
        <div className="result-container">
          <h2 className="result-title">Eligibility Result</h2>
          <p>Status: <strong>{eligibilityResult.approval_status}</strong></p>
          <p>Approval Probability: <strong>{eligibilityResult.approval_probability.toFixed(2)}</strong></p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}

      {/* Loan Calculator Section */}
      <h1 className="app-title">Loan Optimization Calculator</h1>
      <form className="loan-calculation-form" onSubmit={handleLoanCalculation}>
        <label className="form-label">
          Self Employed:
          <select
            className="form-input"
            value={selfEmployed}
            onChange={(e) => setSelfEmployed(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
        </label>
        <label className="form-label">
          Applicant Income (Annual):
          <input
            className="form-input"
            type="number"
            value={applicantIncome}
            onChange={(e) => setApplicantIncome(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Coapplicant Income (Annual):
          <input
            className="form-input"
            type="number"
            value={coapplicantIncome}
            onChange={(e) => setCoapplicantIncome(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Credit History (0/1):
          <input
            className="form-input"
            type="number"
            value={creditHistory}
            onChange={(e) => setCreditHistory(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Property Area:
          <select
            className="form-input"
            value={propertyArea}
            onChange={(e) => setPropertyArea(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Urban">Urban</option>
            <option value="Semi Urban">Semi Urban</option>
            <option value="Rural">Rural</option>
          </select>
        </label>
        <button type="submit" className="submit-button">Calculate Optimal Loan</button>
      </form>
      {optimalLoanAmount !== null && (
  <div className="result-container">
    <h2 className="result-title">Optimal Loan Amount</h2>
    <p>Optimal Loan Amount: <strong>{optimalLoanAmount}</strong></p>
  </div>
)}

      {error && <p className="error-message">The optimal Loan is 10000</p>}
    </div>
  );
};

export default App;
