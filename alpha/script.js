var fontStylesJSON = {
  "Agu Display":
    "https://fonts.googleapis.com/css2?family=Agu+Display&display=swap",

  "Bai Jamjuree":
    "https://fonts.googleapis.com/css2?family=Bai+Jamjuree:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap",

  Kanit:
    "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",

  Merriweather:
    "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap",

  Roboto:
    "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",

  Signika:
    "https://fonts.googleapis.com/css2?family=Signika:wght@300..700&display=swap",
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjo5Q7udPIXCVUFJYG4Dp1hcpLvAElg6o",
  authDomain: "money-92adb.firebaseapp.com",
  databaseURL: "https://money-92adb-default-rtdb.firebaseio.com",
  projectId: "money-92adb",
  storageBucket: "money-92adb.appspot.com",
  messagingSenderId: "1042572717494",
  appId: "1:1042572717494:web:f056df88597e53c3a0e517",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function loadNote() {
  const noteId = sessionStorage.getItem("selectedNoteId");
  if (!noteId) {
    document.getElementById("note-title").textContent = "No note selected.";
    document.getElementById("note-content").textContent = "";
    window.location.href = "../";
    return;
  }

  const noteRef = ref(database, `notes/${noteId}`);
  try {
    const snapshot = await get(noteRef);
    if (snapshot.exists()) {
      const noteData = snapshot.val();
      document.getElementById("note-title").textContent =
        noteData.title || "Untitled";
      document.getElementById("note-date").textContent =
        noteData.date || "No date available";
      document.getElementById("note-char-count").textContent = `${
        noteData.content?.length || 0
      } characters`;

      const formattedContent = formatContent(noteData.content);
      document.getElementById("note-content").innerHTML = formattedContent;
    } else {
      document.getElementById("note-title").textContent = "Note not found.";
      document.getElementById("note-content").textContent =
        "Unable to load content.";
    }
  } catch (error) {
    console.error("Error fetching note:", error);
    document.getElementById("note-title").textContent = "Error loading note.";
  }
}

window.onload = () => {
  loadNote();
};
// Function to format content with longer paragraphs
function formatContent(content) {
  // Split content into lines to handle both paragraphs and standalone uppercase lines
  const lines = content.split(/\n/).map((line) => line.trim()); // Split by lines and trim spaces

  let newContent = "";
  let paragraphBuffer = [];

  lines.forEach((line) => {
    // Check if the line is uppercase (likely a heading), including special characters like hyphens
    if (/^[A-Z\s\d\-!?,.]+$/.test(line) && line.length > 1) {
      // Process any buffered paragraph before adding the heading
      if (paragraphBuffer.length > 0) {
        newContent += `<p>${paragraphBuffer.join(" ")}</p>`; // Join buffered lines into a single paragraph
        paragraphBuffer = []; // Clear the buffer for the next paragraph
      }
      // Add the heading with special formatting
      newContent += `<p style="font-weight: bold; text-transform: uppercase; text-decoration: underline; margin-top: 20px;">${line}</p>`;
    } else if (line.length > 0) {
      // Accumulate regular lines for a paragraph
      paragraphBuffer.push(line);
    } else {
      // If the line is empty, treat it as a paragraph break
      if (paragraphBuffer.length > 0) {
        newContent += `<p>${paragraphBuffer.join(" ")}</p>`;
        paragraphBuffer = [];
      }
    }
  });

  // Add any remaining buffered paragraph if any
  if (paragraphBuffer.length > 0) {
    newContent += `<p>${paragraphBuffer.join(" ")}</p>`;
  }

  return newContent;
}


// Function to apply a random font
function applyRandomFont() {
  const fontNames = Object.keys(fontStylesJSON); // Get all font names
  const randomFont = fontNames[Math.floor(Math.random() * fontNames.length)]; // Randomly select one
  const fontURL = fontStylesJSON[randomFont]; // Get the corresponding URL

  // Create a new <link> element for the font
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = fontURL;

  // Append the <link> to the <head>
  document.head.appendChild(link);

  // Apply the font to the body
  document.body.style.fontFamily = randomFont;
}

// Apply the random font on window load
window.onload = () => {
  applyRandomFont();
  loadNote();
};

// Attach deleteStory to window object for global access
window.deleteStory = function () {
  if (
    confirm(
      "Are you sure you want to delete this story? This action cannot be undone."
    )
  ) {
    const storyId = sessionStorage.getItem("selectedNoteId");

    if (!storyId) {
      alert("No story found to delete.");
      return;
    }

    deleteStoryFromDB(storyId)
      .then(() => {
        sessionStorage.removeItem("selectedNoteId");
        alert("Story deleted successfully.");
        window.location.href = "../";
      })
      .catch((error) => {
        console.error("Error deleting story:", error);
        alert("Failed to delete the story. Please try again.");
      });
  } else {
    // Optional: Hide the menu after scrolling
    const menuItems = document.getElementById("menu-items");
    const floatingBtn = document.getElementById("floating-btn");
    menuItems.classList.add("hidden");
    floatingBtn.classList.toggle("rotated");
  }
};

// Attach Firebase deletion function to window object
window.deleteStoryFromDB = async function (storyId) {
  const storyRef = ref(database, `notes/${storyId}`);
  await set(storyRef, null);
};
