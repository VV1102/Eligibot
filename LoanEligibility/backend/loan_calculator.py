# loan_calculator.py
import pulp

def calculate_optimal_loan(income, existing_debts, interest_rate, dti_limit):
    problem = pulp.LpProblem("Optimal_Loan_Amount", pulp.LpMaximize)
    loan_amount = pulp.LpVariable("Loan_Amount", lowBound=0, cat='Continuous')

    # Constraints
    max_loan_based_on_income = 0.8 * income
    problem += loan_amount <= max_loan_based_on_income, "Max_Loan_Income"

    monthly_income = income / 12
    total_monthly_debt_payments = existing_debts / 12
    problem += (total_monthly_debt_payments + (loan_amount * interest_rate / 12)) <= (dti_limit * monthly_income), "DTI_Limit"

    # Objective Function
    problem += loan_amount

    problem.solve()

    if pulp.LpStatus[problem.status] == 'Optimal':
        return loan_amount.varValue
    else:
        return None
