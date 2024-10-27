// frontend/src/components/SimulateForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SimulateForm = () => {
    const [form, setForm] = useState({ income: '', credit_score: '', loan_amount: '', loan_term: '' });
    const [simulation, setSimulation] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSimulate = async (e) => {
        e.preventDefault();
        const res = await axios.post('http://127.0.0.1:5000/simulate', form);
        setSimulation(res.data);
    };

    return (
        <div>
            <form onSubmit={handleSimulate}>
                <input type="number" name="income" placeholder="Income" onChange={handleChange} />
                <input type="number" name="credit_score" placeholder="Credit Score" onChange={handleChange} />
                <input type="number" name="loan_amount" placeholder="Loan Amount" onChange={handleChange} />
                <input type="number" name="loan_term" placeholder="Loan Term" onChange={handleChange} />
                <button type="submit">Simulate Credit Score Change</button>
            </form>
            {simulation && (
                <div>
                    <p>New Income: {simulation.new_income}</p>
                    <p>New Approval Probability: {simulation.new_approval_probability}</p>
                </div>
            )}
        </div>
    );
};

export default SimulateForm;
