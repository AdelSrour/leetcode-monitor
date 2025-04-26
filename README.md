
# LeetCode Monitor

**LeetCode monitoring system designed for instructors to view all student submissions from a single dashboard.**  
Built with a PHP backend and a React frontend.

---

## 📑 Table of Contents
1. [Features](#✨-features)
2. [Project Structure](#-project-structure)
3. [Getting Started](#-getting-started)
   - [Backend Setup](#backend-setup-php-native)
   - [Frontend Setup](#frontend-setup-react--vite)
4. [Usage](#️-usage)
5. [License](#-license)
6. [Contributing](#-contributing)
7. [Future Improvements](#-future-improvements)


## ✨ Features
- View recent LeetCode submissions from multiple users on a single dashboard.
- No need to open individual user profiles manually.
- Real-time updates (configurable based on your setup).
- Designed for supervisors, instructors, and coding coaches.

---

## 📁 Project Structure

```
Backend:
├── /app 
│   ├── /controllers
│   │   └── - Implementation for each model
│   ├── /models
│   │   ├── userCreate.php   - Handles user creation
│   │   ├── userData.php     - Fetches user data
│   │   ├── userLogin.php    - Manages user logins
│   │   ├── userLogout.php   - Destroys user session
│   │   ├── userSession.php  - Validates user session
│   │   ├── viewCreate.php   - Creates a new monitor
│   │   ├── viewDelete.php   - Deletes a specific monitor
│   │   └── viewDisplay.php  - Returns requested monitor
│   ├── /services
│   │   ├── cacher.php       - Caches LeetCode responses
│   │   ├── leetcode.php     - Connects to the LeetCode API
│   │   └── profile.php      - Converts LeetCode responses into profiles
├── /core
│   ├── database.php         - Database connection (configure credentials here)
│   ├── model.php            - Models implementation
│   ├── responser.php        - Handles output
│   └── validators.php       - Handles input validation
└── /public
    └── api.php              - Routes requests to the appropriate controller

Frontend:
├── /src
│   ├── /pages
│   │   ├── Home.jsx         - Main page after login, shows form for monitor creation
│   │   ├── Dashboard.jsx    - Displays the requested monitor page
│   │   ├── Landing.jsx      - Home landing page
│   │   ├── Login.jsx        - Sign-in page
│   │   ├── Signup.jsx       - Sign-up page
│   │   └── Navbar.jsx       - Sidebar/navigation
```


---

## 🚀 Getting Started

### Backend Setup (PHP Native)

1. Navigate to the backend directory:

    - Import the provided SQL scripts from `/backend/database/` to set up the database.
    - Configure your database credentials by editing database.php located in `/backend/core/`
    ```php
    private $host = 'localhost';
    private $db = 'db_name';
    private $user = 'db_username';
    private $pass = 'db_password';
    ```

   - Copy php files into website directory
   ```bash
   cd backend
   ```

    ```bash
    cp -r ./app ./core ./public /var/www/{site-name}
   ```
   - Make sure that api.php is in the public directory while app & core in subdirectory and they are not public

2. Start a local PHP server (or deploy to any web server supporting PHP)
---

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the backend URL and site Title:
   ```
    VITE_APP_TITLE = "site title"
    VITE_APP_URL = "https://example.com"
    VITE_API_URL = "https://example.com/api.php"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
---

## ⚙️ Usage
- Register a new account and log in.
- Start by inserting a list of LeetCode users from the dashboard to begin monitoring.

---

## 📜 License
This project is licensed under the **MIT License**.  
See [LICENSE](./LICENSE) for more information.

---

## 🤝 Contributing
Pull requests are welcome!  
If you have ideas to improve the tool (better UI, faster syncing, etc.), feel free to open an issue or PR.

---

## 🧠 Future Improvements
- Admin Panel to manage registered users.
- Rate limiting for login/register.
- Support for more coding platforms.

---
