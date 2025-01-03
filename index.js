const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 4000;

app.use(express.json());

app.post("/self-destruct", (req, res) => {
  const { token } = req.body;
  const secureToken = "your-secure-token"; // Secure token for authorization

  if (token !== secureToken) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  console.log("Self-destruct sequence initiated");

  // Set the path to the folder to delete (one level up from 'landmine')
  const folderToDelete = path.join(__dirname, '..', 'tobedeleted');

  // Log the folder path to verify
  console.log("Deleting folder at:", folderToDelete);

  // Ensure the folder exists before trying to delete it
  if (fs.existsSync(folderToDelete)) {
    fs.rm(folderToDelete, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("Error deleting folder:", err);
        return res.status(500).json({ message: "Failed to delete folder" });
      }

      console.log('Folder "tobedeleted" deleted successfully');
      res.status(200).json({ message: '"tobedeleted" folder successfully deleted' });

      // After folder deletion, trigger process termination (with delay if needed)
      setTimeout(() => {
        exec("pkill -f node", (error, stdout, stderr) => {
          if (error) {
            console.error("Error stopping process:", error.message);
          } else {
            console.log("Server process terminated.");
          }
        });
      }, 1000); // 1-second delay to ensure folder deletion is handled first
    });
  } else {
    console.error("Folder 'tobedeleted' not found.");
    res.status(404).json({ message: "'tobedeleted' folder not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
