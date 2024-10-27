import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Number of samples
num_samples = 1000

# Generate synthetic data
data = {
    'income_annum': np.random.randint(300000, 1200000, size=num_samples),  # Annual income between 300k and 1.2M
    'cibil_score': np.random.randint(300, 900, size=num_samples),          # Credit score between 300 and 900
    'loan_amount': np.random.randint(50000, 500000, size=num_samples),     # Loan amount between 50k and 500k
    'loan_term': np.random.choice([12, 24, 36, 60, 84, 120], size=num_samples), # Loan terms in months
}

# Create DataFrame
df = pd.DataFrame(data)

# Generate loan status based on some simple rules
df['loan_status'] = np.where(
    (df['income_annum'] > 50000) & (df['cibil_score'] > 700) & (df['loan_amount'] <= 300000), 1, 0
)

# Shuffle the DataFrame
df = df.sample(frac=1).reset_index(drop=True)

# Save to CSV
df.to_csv('synthetic_loan_data.csv', index=False)

print("Synthetic dataset generated and saved as 'synthetic_loan_data.csv'.")
