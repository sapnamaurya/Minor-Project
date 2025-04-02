import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder

# Define paths
BAR_CHART_PATH = "../frontend/public/bar_chart.png"
PIE_CHART_PATH = "../frontend/public/pie_chart.png"

# Load dataset
df = pd.read_csv("expense_data.csv", parse_dates=["Date"])

# Encode categorical data
df["Category_encoded"] = LabelEncoder().fit_transform(df["Category"])
df["Payment_encoded"] = LabelEncoder().fit_transform(df["Payment Method"])

# Clustering with K-Means
X = df[["Amount", "Category_encoded", "Payment_encoded"]]
kmeans = KMeans(n_clusters=3, random_state=42)
df["Cluster"] = kmeans.fit_predict(X)

# Save clustering results
df.to_csv("../frontend/public/clustered_expenses.csv", index=False)

# Group data by category
expense_summary = df.groupby("Category")["Amount"].sum()

# Save bar chart
plt.figure(figsize=(6, 5))
expense_summary.plot(kind='bar', colormap='viridis')
plt.title("Total Expenses by Category")
plt.xlabel("Category")
plt.ylabel("Total Amount Spent")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(BAR_CHART_PATH, transparent=True)

# Save pie chart
plt.figure(figsize=(6, 5))
expense_summary.plot(kind='pie', autopct='%1.1f%%', colormap='viridis')
plt.title("Expense Distribution by Category")
plt.ylabel("")
plt.tight_layout()
plt.savefig(PIE_CHART_PATH, transparent=True)

print("Clustering applied and results saved!")
print(f"Bar chart saved at: {BAR_CHART_PATH}")
print(f"Pie chart saved at: {PIE_CHART_PATH}")
