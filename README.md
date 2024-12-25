# EasyShop

**EasyShop** is a user-friendly e-commerce platform designed for simplicity and convenience. It allows users to browse and purchase products while offering an admin panel for managing products and orders. This README provides comprehensive instructions to set up, configure, and run the project locally.

---

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features

- **User-Friendly Interface**: Seamless browsing and purchasing experience.
- **Cart Management**: Add and manage products in the shopping cart.
- **Secure Checkout**: Complete orders securely.
- **Admin Panel**: Manage products, orders, and user information efficiently.
- **Dummy Data Initialization**: Pre-load test data for quick setup and testing.

---

## Prerequisites

Before proceeding, ensure you have the following installed on your machine:

1. **Node.js** (v16 or higher)
2. **npm** (Node Package Manager)
3. **MongoDB** (local instance or cloud URI)

---

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/easyshop.git
    cd easyshop
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

---

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/easyshop
    SECRET_KEY=your_secret_key
    ```

    Replace `your_secret_key` with a secure key for JWT authentication.

2. Set up admin credentials by running:

    ```bash
    node admin.js
    ```

    Follow the prompts to create an admin user.

3. Initialize the database with dummy data for testing by running:

    ```bash
    node init-folder.js
    ```

---

## Running the Application

Start the server using one of the following commands:

- With Node.js:

    ```bash
    node app.js
    ```

- With Nodemon (for development):

    ```bash
    nodemon app.js
    ```

The server will run on the port specified in the `.env` file (default: `3000`). Open your browser and navigate to:

- **Frontend**: `http://localhost:3000`

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch:

    ```bash
    git checkout -b feature/your-feature-name
    ```

3. Make your changes.
4. Commit your changes:

    ```bash
    git commit -m "Add your message here"
    ```

5. Push to the branch:

    ```bash
    git push origin feature/your-feature-name
    ```

6. Open a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

### Notes

- If you encounter any issues, ensure MongoDB is running, and the `.env` file is properly configured.
- Use `nodemon` for easier development by automatically restarting the server on code changes.
