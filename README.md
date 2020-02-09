# Start up idea Webfolioo

Where developers can post their website by choosing the most popular stacks in the market.

Inspired by ASANA and Behance.

# Configuration

Make sure to add your own MONGOURI from your mongodb database in config/keys.js.

```
module.exports = {
  mongoURI: "YOUR_MONGO_URI_HERE",
  secretOrKey: "secret"
};
```

# Quick Start

```
Install dependencies for server & client
npm install && npm run client-install

Run client & server with concurrently
npm run dev

Server runs on http://localhost:5000 and client on http://localhost:3000
```

For deploying to Heroku, please refer to this helpful video by TraversyMedia.
