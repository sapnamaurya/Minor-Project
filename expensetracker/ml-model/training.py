import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv("expense_data.csv", parse_dates=["Date"])

# Set plot style
sns.set_style("whitegrid")

# Pie chart for expense categories
plt.figure(figsize=(8, 6))
df.groupby("Category")['Amount'].sum().plot(kind='pie', autopct='%1.1f%%', cmap='viridis')
plt.title("Expense Distribution by Category")
plt.ylabel('')
plt.show()

# Line chart for expenses over time
plt.figure(figsize=(10, 5))
df.groupby("Date")['Amount'].sum().plot()
plt.title("Expenses Over Time")
plt.xlabel("Date")
plt.ylabel("Total Amount Spent")
plt.xticks(rotation=45)
plt.show()

# Bar chart for payment methods
plt.figure(figsize=(8, 5))
sns.barplot(x=df["Payment Method"], y=df["Amount"], estimator=sum, ci=None)
plt.title("Total Expenses by Payment Method")
plt.xlabel("Payment Method")
plt.ylabel("Total Amount")
plt.show()