# Travel Journal Application

A full-stack travel journal web app for recording trips — destinations, dates, photos, highlights, ratings, budget, and notes.
## Authors & Contributors

| Name | Role | GitHub |
| :--- | :--- | :--- |
| Akinbobola Adefolu | Backend | https://github.com/bobola-one |
| Muliro Michael Khaemba | Backend | https://github.com/Muliro1 |
| Harleen Kaur | Frontend | https://github.com/Harleen-Kaur07 |

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Views:** Pug templates
- **Styling:** CSS

## Prerequisites

Install these on the new machine before cloning:

| Tool | Version | Check |
|------|---------|-------|
| [Git](https://git-scm.com/) | Latest | `git --version` |
| [Node.js](https://nodejs.org/) | 18+ recommended | `node --version` |
| [MongoDB](https://www.mongodb.com/try/download/community) | 6+ recommended | `mongod --version` |

npm is included with Node.js. Verify with `npm --version`.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Muliro1/BTDT.git
cd BTDT
```

To use the active development branch:

```bash
git checkout development
```

### 2. Install dependencies

```bash
npm install
```

This installs Express, Mongoose, Pug, and the other packages listed in `package.json`.

### 3. Configure environment variables

The `.env` file is not committed to Git (it is listed in `.gitignore`). Create it from the example:

```bash
cp .env.example .env
```

Or create `.env` manually in the project root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/travel_journal
NODE_ENV=development
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server listens on |
| `MONGO_URI` | MongoDB connection string (`travel_journal` is the database name) |
| `NODE_ENV` | `development` or `production` |

### 4. Install and start MongoDB

MongoDB must be running before seeding or starting the app.

#### Linux (Ubuntu / Debian)

```bash
# Install MongoDB (see https://www.mongodb.com/docs/manual/administration/install-on-linux/)
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB (systemd)
sudo systemctl start mongod
sudo systemctl enable mongod   # start on boot (optional)
```

#### macOS (Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows

Install [MongoDB Community Server](https://www.mongodb.com/try/download/community), then start the **MongoDB** service from Services, or run:

```powershell
net start MongoDB
```

#### WSL (Windows Subsystem for Linux)

If `systemctl start mongod` fails with *"System has not been booted with systemd"*, start MongoDB manually:

```bash
sudo mkdir -p /var/log/mongodb
sudo mongod --config /etc/mongod.conf --fork
```

To enable systemd in WSL2 (optional), add to `/etc/wsl.conf`:

```ini
[boot]
systemd=true
```

Then run `wsl --shutdown` from PowerShell and reopen your WSL terminal.

#### Verify MongoDB is running

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

You should see `{ ok: 1 }`. If you get `ECONNREFUSED`, MongoDB is not running yet.

### 5. Seed the database

Load sample trip data into the `travel_journal` database:

```bash
npm run seed
```

Expected output:

```
MongoDB connected: localhost
Seeded 5 trips into the database.
```

To confirm in the shell:

```bash
mongosh travel_journal
```

```javascript
db.trips.find()
```

Type `exit` to leave mongosh.

### 6. Start the application

**Development** (auto-restarts on file changes):

```bash
npm run dev
```

**Production-style:**

```bash
npm start
```

The server runs at **http://localhost:3000** (or whatever you set in `PORT`).

## Project Structure

```
BTDT/
├── server.js                 # Application entry point
├── .env.example              # Environment variable template
├── package.json
└── src/
    ├── app.js                # Express app setup
    ├── config/
    │   └── db.js             # MongoDB connection
    ├── controllers/
    │   └── tripController.js # Trip CRUD logic
    ├── middleware/
    │   └── errorHandler.js   # Error handling
    ├── models/
    │   └── Trip.js           # Trip Mongoose schema
    ├── routes/
    │   └── tripRoutes.js     # Trip routes
    ├── utils/
    │   ├── seedData.js       # Database seeder
    │   └── testDB.js         # DB connection test utility
    ├── public/
    │   ├── css/style.css
    │   └── js/main.js
    └── views/
        ├── layouts/layout.pug
        ├── partials/         # header, footer
        ├── error.pug
        └── trips/            # index, show, create, edit
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run seed` | Clear and repopulate the database with sample trips |
| `npm run dev` | Start the server with nodemon (development) |
| `npm start` | Start the server with Node |

## Troubleshooting

### `connect ECONNREFUSED 127.0.0.1:27017`

MongoDB is not running. Start it (see step 4), then retry `npm run seed` or `npm start`.

Your `.env` URI is correct for a local install — this error is almost always a stopped MongoDB service, not a bad connection string.

### Port 3000 already in use

Check what is using the port:

```bash
ss -tlnp | grep :3000
# or
lsof -i :3000
```

Stop that process, or change `PORT` in `.env` (e.g. `PORT=3001`).

### `.env` not loading

Ensure `.env` exists in the project root (same folder as `package.json`), not inside `src/`.

### Re-seed from scratch

```bash
npm run seed
```

This deletes existing trips and inserts the 5 sample records again.

## Database Details

- **Connection URI:** `mongodb://localhost:27017/travel_journal`
- **Database name:** `travel_journal`
- **Collection:** `trips` (created automatically by Mongoose)
- **Data files:** Stored by the MongoDB server (e.g. `/var/lib/mongodb` on Linux), not inside this project folder.
