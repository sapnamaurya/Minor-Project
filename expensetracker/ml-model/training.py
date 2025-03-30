import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from sklearn.decomposition import PCA

# Load the dataset
df = pd.read_csv("expense_data.csv", parse_dates=["Date"])

# Encode categorical data
le_category = LabelEncoder()
df["Category_encoded"] = le_category.fit_transform(df["Category"])
le_payment = LabelEncoder()
df["Payment_encoded"] = le_payment.fit_transform(df["Payment Method"])

# Clustering expenses using K-Means (including multiple features)
X = df[["Amount", "Category_encoded", "Payment_encoded"]]
kmeans = KMeans(n_clusters=3, random_state=42)
df['Cluster'] = kmeans.fit_predict(X)

# Applying PCA for dimensionality reduction
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)
df['PCA1'], df['PCA2'] = X_pca[:, 0], X_pca[:, 1]

# Bar chart for total expenses by category
plt.figure(figsize=(8, 6))
df.groupby("Category")['Amount'].sum().plot(kind='bar', colormap='viridis')
plt.title("Total Expenses by Category")
plt.xlabel("Category")
plt.ylabel("Total Amount Spent")
plt.xticks(rotation=45)
plt.show()

# Pie chart for expense distribution by category
plt.figure(figsize=(8, 6))
df.groupby("Category")['Amount'].sum().plot(kind='pie', autopct='%1.1f%%', colormap='viridis')
plt.title("Expense Distribution by Category")
plt.ylabel("")  # Remove y-axis label for clarity
plt.show()