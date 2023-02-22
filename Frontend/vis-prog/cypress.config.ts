import { defineConfig } from "cypress";
import { config } from "dotenv"

export default defineConfig({
  env: {
    auth0_username: process.env.AUTH0_TEST_USERNAME,
    auth0_password: process.env.AUTH0_TEST_PASSWORD,
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    
    setupNodeEvents(on, config) {

      // implement node event listeners here
    },
  },
});
