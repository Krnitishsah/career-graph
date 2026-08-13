// # src/lib/cognodb/config.ts

const config = {
  url: process.env.COGNODB_URL || "",
  username: process.env.COGNODB_USERNAME || "",
  password: process.env.COGNODB_PASSWORD || "",
  database: process.env.COGNODB_DATABASE || "cognodb",
};

export default config;
