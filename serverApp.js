// Run app by running node serverApp.js

const app = require('./server');

// use process.env to make it work with online hosting
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});