// Import necessary Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app);

// Precomputed hash for the secret word (SHA-256)
const storedHash =
  "816eb5b979c291748e3febaaf762408d11b6d9f1cd8c6561b80cb47721ca378f";

// Utility function to hash input strings securely
async function generateHash(secret) {
  const normalizedInput = secret.trim().toLowerCase(); // Normalize the input (remove extra spaces and lowercase)
  const encoder = new TextEncoder();
  const data = encoder.encode(normalizedInput);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // Return the hash in hex format
}

// Function to verify the secret word by comparing hashes
async function verifySecret(secret) {
  const inputHash = await generateHash(secret);
  return inputHash === storedHash;
}

// Event listener for the login form submission
document
  .getElementById("stripe-login")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const driverName = document.getElementById("driverName").value;

    try {
      console.log("Driver Name (Raw):", driverName);

      // Verify the secret word entered by the user
      const isValidSecret = await verifySecret(driverName);

      if (!isValidSecret) {
        alert("Incorrect secret word!");
        return; // Stop the login process if the secret is invalid
      }

      // Authenticate with Firebase if the secret is valid
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save login success and login time to localStorage
      localStorage.setItem("userEmail", user.email); // Save user email
      localStorage.setItem("loginTime", new Date().toISOString()); // Save login time

      alert("Login successful!");

      // Redirect after successful login
      window.location.href = "./home/"; // Change this to your desired redirect path
    } catch (error) {
      alert("Login failed: " + error.message); // Display error if login fails
    }
  });
