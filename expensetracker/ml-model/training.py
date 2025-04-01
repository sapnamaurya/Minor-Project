import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from sklearn.decomposition import PCA
import os

# Define paths
OUTPUT_PATH = "../frontend/public/output.txt"
BAR_CHART_PATH = "../frontend/public/bar_chart.png"
PIE_CHART_PATH = "../frontend/public/pie_chart.png"

# Load dataset
df = pd.read_csv("expense_data.csv", parse_dates=["Date"])

# Encode categorical data
df["Category_encoded"] = df["Category"].astype("category").cat.codes
df["Payment_encoded"] = df["Payment Method"].astype("category").cat.codes

# Clustering with KMeans
X = df[["Amount", "Category_encoded", "Payment_encoded"]]
kmeans = KMeans(n_clusters=3, random_state=42)
df["Cluster"] = kmeans.fit_predict(X)

# Save analysis results to output.txt
with open(OUTPUT_PATH, "w") as f:
    f.write("Expense Clustering Analysis\n")
    f.write("==========================\n\n")
    f.write(df[["Category", "Amount", "Cluster"]].to_string(index=False))
    f.write("\n\nAnalysis Complete! Data saved to output.txt")

# Save bar chart with a lighter or transparent background
plt.figure(figsize=(6, 5))
df.groupby("Category")['Amount'].sum().plot(kind='bar', colormap='viridis')
plt.title("Total Expenses by Category")
plt.xlabel("Category")
plt.ylabel("Total Amount Spent")
plt.xticks(rotation=45)
plt.gcf().patch.set_facecolor('none')  # Set background to be transparent (or adjust opacity here)
plt.tight_layout()
plt.savefig(BAR_CHART_PATH, transparent=True)  # Save with transparent background

# Save pie chart with a lighter or transparent background
plt.figure(figsize=(6, 5))
df.groupby("Category")['Amount'].sum().plot(kind='pie', autopct='%1.1f%%', colormap='viridis')
plt.title("Expense Distribution by Category")
plt.ylabel("")  # Hide y-label
plt.gcf().patch.set_facecolor('none')  # Set background to be transparent (or adjust opacity here)
plt.tight_layout()
plt.savefig(PIE_CHART_PATH, transparent=True)  # Save with transparent background

print(f"Output saved at: {OUTPUT_PATH}")
print(f"Bar chart saved at: {BAR_CHART_PATH}")
print(f"Pie chart saved at: {PIE_CHART_PATH}")
