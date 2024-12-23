// Import necessary Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjo5Q7udPIXCVUFJYG4Dp1hcpLvAElg6o",
  authDomain: "money-92adb.firebaseapp.com",
  databaseURL: "https://money-92adb-default-rtdb.firebaseio.com",
  projectId: "money-92adb",
  storageBucket: "money-92adb.appspot.com",
  messagingSenderId: "1042572717494",
  appId: "1:1042572717494:web:f056df88597e53c3a0e517",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

// Handle login form submission
document
  .getElementById("stripe-login")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const driverName = document.getElementById("driverName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (driverName && email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in as: " + userCredential.user.email);

        // Store the driver's name in sessionStorage (or localStorage if you prefer)
        sessionStorage.setItem("driverName", driverName);

        // Redirect to dashboard
        window.location.href = "../dashboard/";
      } catch (error) {
        console.error("Login Error: ", error.message);
        alert("Login failed. Please check your credentials.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  });

