import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

async function run() {
  try {
    await mongoose.connect(DB_URI);

    console.info();
  } finally {
    await mongoose.disconnect();
  }
}

run().catch(console.dir);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
