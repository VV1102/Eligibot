import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib

def train_model():
    try:
        # Load your data
        data = pd.read_csv('synthetic_loan_data.csv')
        
        # Print the columns to verify
        print("Columns in the dataset:", data.columns)

        # Strip any whitespace from column names
        data.columns = data.columns.str.strip()

        # Now define features and target variable correctly
        X = data[['income_annum', 'cibil_score', 'loan_amount', 'loan_term']]
        y = data['loan_status']

        # Split data into train and test sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Scale features
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)

        # Train model
        model = LogisticRegression()
        model.fit(X_train, y_train)

        # Save the model and scaler
        joblib.dump(model, 'loan_model.pkl')
        joblib.dump(scaler, 'scaler.pkl')
        print("Model and scaler saved successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    train_model()
