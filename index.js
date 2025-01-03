// const express = require("express");
// const { exec } = require("child_process");
// const path = require("path");
// const fs = require("fs");

// const app = express();
// const PORT = 4000;

// app.use(express.json());

// app.post("/self-destruct", (req, res) => {
//   const { token } = req.body;
//   const secureToken = "your-secure-token"; // Secure token for authorization

//   if (token !== secureToken) {
//     return res.status(403).json({ message: "Unauthorized" });
//   }

//   console.log("Self-destruct sequence initiated");

//   // Set the path to the folder to delete (one level up from 'landmine')
//   const folderToDelete = path.join(__dirname, '..', 'tobedeleted');

//   // Log the folder path to verify
//   console.log("Deleting folder at:", folderToDelete);

//   // Ensure the folder exists before trying to delete it
//   if (fs.existsSync(folderToDelete)) {
//     fs.rm(folderToDelete, { recursive: true, force: true }, (err) => {
//       if (err) {
//         console.error("Error deleting folder:", err);
//         return res.status(500).json({ message: "Failed to delete folder" });
//       }

//       console.log('Folder "tobedeleted" deleted successfully');
//       res.status(200).json({ message: '"tobedeleted" folder successfully deleted' });

//       // After folder deletion, trigger process termination (with delay if needed)
//       setTimeout(() => {
//         exec("pkill -f node", (error, stdout, stderr) => {
//           if (error) {
//             console.error("Error stopping process:", error.message);
//           } else {
//             console.log("Server process terminated.");
//           }
//         });
//       }, 1000); // 1-second delay to ensure folder deletion is handled first
//     });
//   } else {
//     console.error("Folder 'tobedeleted' not found.");
//     res.status(404).json({ message: "'tobedeleted' folder not found" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 4000;

app.use(express.json());

app.post("/self-destruct", (req, res) => {
  const { token } = req.body;
  const secureToken = "your-secure-token"; 

  if (token !== secureToken) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  console.log('Self-destruct sequence initiated');

  const pm2ProcessName = "your-pm2-app-name";  // Replace with your PM2 app's name or ID
  const directoryToRemove = "./tobedeleted";

  // Stop the PM2 process and delete it
  exec(`pm2 stop ${pm2ProcessName} && pm2 delete ${pm2ProcessName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error stopping/deleting PM2 process: ${error.message}`);
      return res.status(500).json({ message: "Failed to stop/delete PM2 process" });
    }
    
    console.log(`PM2 process stopped and deleted: ${stdout}`);

    // Now delete the folder
    exec(`rm -rf ${directoryToRemove}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deleting folder: ${error.message}`);
        return res.status(500).json({ message: "Failed to delete folder" });
      }

      console.log(`Folder Deleted: ${stdout}`);
      res.status(200).json({ message: "App directory and PM2 process successfully destroyed" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
