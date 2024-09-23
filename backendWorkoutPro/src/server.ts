import app from './app';
import connectDB from './config/database';

const PORT = process.env.PORT || 5000;

// Uncomment to connect to the database
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
