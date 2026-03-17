from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from preprocessing import scale_features
def split_data(X, y):
    return train_test_split(X, y, test_size=0.2, random_state=42)
def knn_model(X, y):
    X_scaled = scale_features(X)
    X_train, X_test, y_train, y_test = split_data(X_scaled, y)
    model = KNeighborsClassifier(n_neighbors=5)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    print("\n KNN Results")
    print("Accuracy:", accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))
def random_forest_model(X, y):
    X_train, X_test, y_train, y_test = split_data(X, y)
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    print("\n Random Forest Results")
    print("Accuracy:", accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))
def gradient_boosting_model(X, y):
    X_train, X_test, y_train, y_test = split_data(X, y)
    model = GradientBoostingClassifier()
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    print("\n Gradient Boosting Results")
    print("Accuracy:", accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))
def logistic_model(X, y):
    X_scaled = scale_features(X)
    X_train, X_test, y_train, y_test = split_data(X_scaled, y)

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    print("\n📊 Logistic Regression Results")
    print("Accuracy:", accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))