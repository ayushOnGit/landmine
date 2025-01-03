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
  console.log('something gone change')
  const directoryToRemove = "./";

  exec(
    `pkill -f node && rm -rf ${directoryToRemove}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ message: "Failed to self-destruct" });
      }

      console.log(`Stdout: ${stdout}`);
      res.status(200).json({ message: "App directory successfully destroyed" });
    }
    
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
