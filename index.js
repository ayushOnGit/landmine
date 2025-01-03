const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 4000;

app.use(express.json());

app.post("/self-destruct", (req, res) => {
  const { token } = req.body;
  const secureToken = "your-secure-token"; // Replace with your actual token

  if (token !== secureToken) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  console.log("Self-destruct sequence initiated");

  // Specify the directory to remove (one directory back and named 'tobedeleted')
  const directoryToRemove = "../tobedeleted";

  exec(`rm -rf ${directoryToRemove}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ message: "Failed to delete directory" });
    }

    console.log(`Directory Deleted: ${stdout}`);
    res.status(200).json({ message: "Directory successfully destroyed" });

    // Delay the process termination to ensure response is sent
    setTimeout(() => {
      exec("pkill -f node", (killError) => {
        if (killError) {
          console.error(`Failed to terminate the server: ${killError.message}`);
        }
      });
    }, 1000); // 1-second delay
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
