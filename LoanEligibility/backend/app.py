from flask import Flask, request, jsonify
from loan_calculator import calculate_optimal_loan  # Import your function
import joblib
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and scaler (adjust the path if necessary)
model = joblib.load('loan_model.pkl')  # Ensure this path is correct
scaler = joblib.load('scaler.pkl')  # Ensure this path is also correct

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        income = data['income_annum']
        credit_score = data['cibil_score']
        loan_amount = data['loan_amount']
        loan_term = data['loan_term']
        
        # Preprocess input
        features = np.array([[income, credit_score, loan_amount, loan_term]])
        scaled_features = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(scaled_features)
        approval_probability = model.predict_proba(scaled_features)[0][1]
        
        return jsonify({
            'approval_status': 'Approved' if prediction[0] == 1 else 'Denied',
            'approval_probability': approval_probability
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400
@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json['message']
    # For demonstration, you can implement simple keyword-based responses
    if 'advice' in user_message.lower():
        response = "To improve your loan eligibility, consider increasing your credit score and reducing your debt-to-income ratio."
    elif 'budget' in user_message.lower():
        response = "I can help you create a budget. Please provide your monthly income and expenses."
    else:
        response = "I'm here to assist you. Please ask any questions regarding loans or finances."
    
    return jsonify({'response': response})

@app.route('/credit_score_simulator', methods=['POST'])
def credit_score_simulator():
    data = request.json
    try:
        current_credit_score = data['current_credit_score']
        actions = data['actions']  # List of actions to simulate
        
        # Base score factors (for demonstration)
        score_change = 0

        for action in actions:
            if action['type'] == 'pay_off_debt':
                score_change += 20  # Simulating a positive impact
            elif action['type'] == 'increase_income':
                score_change += 10  # Simulating a moderate positive impact
            elif action['type'] == 'miss_payment':
                score_change -= 30  # Simulating a negative impact
            elif action['type'] == 'new_credit_inquiry':
                score_change -= 15  # Simulating a negative impact

        # Calculate new credit score
        new_credit_score = max(300, min(current_credit_score + score_change, 850))

        return jsonify({
            'new_credit_score': new_credit_score,
            'message': 'Your projected credit score has been calculated.'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

def calculate_optimal_loan(income, existing_debts, interest_rate, dti_limit):
    max_debt = income * dti_limit
    total_debt = existing_debts
    optimal_loan = max_debt - total_debt
    return optimal_loan if optimal_loan >= 0 else None

def calculate_optimal_loan(income, existing_debts, interest_rate, dti_limit):
    # This function can remain unchanged; we're just hard-coding the output in the route handler.
    max_debt = income * dti_limit
    total_debt = existing_debts
    optimal_loan = max_debt - total_debt
    return optimal_loan if optimal_loan >= 0 else None

@app.route('/calculate-loan', methods=['POST'])
def calculate_loan():
    # Get data from the request
    data = request.json
    income = data.get('income')
    existing_debts = data.get('existing_debts')
    interest_rate = data.get('interest_rate', 0.05)  # Default to 5% if not provided
    dti_limit = data.get('dti_limit', 0.36)            # Default to 36% if not provided

    # Hard-code a specific optimal loan amount for testing
    optimal_loan = 10000  # Replace this with your desired hard-coded output

    # You can also choose to ignore the calculated optimal loan
    # optimal_loan = calculate_optimal_loan(income, existing_debts, interest_rate, dti_limit)

    return jsonify({"optimal_loan": optimal_loan}), 200
if __name__ == '__main__':
    app.run()