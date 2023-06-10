const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3500;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
