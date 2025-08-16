# Registration Portal for Colourfully Digital Foundation

This is a web application for managing educational programs, including user registration, dependent management, and program listings. It is built with Node.js, Express, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or later recommended)
- PostgreSQL

### Environment Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Colourfully-Digital/registration.colourfully.digital.git
    cd registration.colourfully.digital
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the Database:**
    - Make sure you have PostgreSQL installed and running.
    - Create a new database.
    - Connect to your new database and run the schema script to create the necessary tables and functions:
      ```bash
      psql -U your_username -d your_database_name -f schema.sql
      ```

4.  **Create a `.env` file:**
    Create a `.env` file in the root of the project and add your database connection details and a session secret:
    ```env
    DB_USER=your_postgres_user
    DB_HOST=localhost
    DB_DATABASE=your_database_name
    DB_PASSWORD=your_postgres_password
    DB_PORT=5432
    SESSION_SECRET=a_strong_secret_string_for_sessions
    ```

5.  **Start the application:**
    You can start the server directly using Node:
    ```bash
    node app.js
    ```
    Alternatively, you can use the provided restart script, which runs the application in the background using `nohup`:
    ```bash
    ./my_restart_script.sh
    ```
    The application will be running on `http://localhost:3000` (or the port configured in your environment).

## 🏗 Project Structure

```
.
├── app.js                  # Main application file
├── db.js                   # Database connection setup
├── package.json            # Project dependencies and scripts
├── schema.sql              # PostgreSQL database schema
├── my_restart_script.sh    # Script to run/restart the server
├── controllers/            # Contains business logic for routes
├── routes/                 # Defines the application's routes
├── utils/                  # Utility functions and middleware
├── views/                  # EJS templates for the UI
│   ├── layouts/
│   ├── pages/
│   └── partials/
└── public/                 # Static assets (CSS, images, client-side JS)
```

## 🔧 Core Technologies

-   **Backend**: Node.js with Express.js
-   **Database**: PostgreSQL
-   **Frontend**: EJS (Embedded JavaScript) for server-side rendering
-   **Authentication**: Session-based authentication with `express-session` and password hashing with `bcrypt`.
-   **Styling**: Plain CSS

## 🛠 Development

### Running the App

To run the application for development, you can use:
```bash
node app.js
```
Or, for a more robust startup that logs to a file, use the provided shell script:
```bash
./my_restart_script.sh
```
The script will handle stopping any existing process and starting a new one in the background. Logs will be written to `logs.log`.

### Scripts

-   `npm test`: This command is currently configured to run the `my_restart_script.sh`.

## 📚 Core Features

-   **User Authentication**: Users can sign up, sign in, and sign out. Passwords are securely hashed.
-   **Program Management**: Admins can create, update, delete, and view programs. Users can view program listings.
-   **Dependent Management**: Authenticated users can manage their dependents (create, update, delete, view).
-   **Role-Based Access**: The database schema includes roles for `admin`, `instructor`, and `parent_guardian`, allowing for different levels of access.

## 📄 License

This project is licensed under the ISC License.

