// frontend/src/components/PredictForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PredictForm = () => {
    const [form, setForm] = useState({ income: '', credit_score: '', loan_amount: '', loan_term: '' });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post('http://127.0.0.1:5000/predict', form);
        setResult(res.data);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="number" name="income" placeholder="Income" onChange={handleChange} />
                <input type="number" name="credit_score" placeholder="Credit Score" onChange={handleChange} />
                <input type="number" name="loan_amount" placeholder="Loan Amount" onChange={handleChange} />
                <input type="number" name="loan_term" placeholder="Loan Term" onChange={handleChange} />
                <button type="submit">Predict Eligibility</button>
            </form>
            {result && (
                <div>
                    <p>Approval Status: {result.approval_status}</p>
                    <p>Approval Probability: {result.approval_probability}</p>
                </div>
            )}
        </div>
    );
};

export default PredictForm;
