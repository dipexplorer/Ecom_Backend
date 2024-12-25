# EasyShop

EasyShop is a simple e-commerce platform that allows users to browse and purchase products. This README provides instructions on how to set up the project locally, configure environment variables, and start the server.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features

- Browse products
- Add products to the cart
- Checkout process
- Admin panel to manage products and orders

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- npm (Node Package Manager) installed
- MongoDB database

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/easyshop.git
    cd easyshop
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/easyshop
    SECRET_KEY=your_secret_key
    ```

2. Set up admin credentials by running the following command:

    ```bash
    node admin.js
    ```

    Follow the prompts to create the admin user.

3. Initialize the folder to add dummy data for the first time by running:

    ```bash
    node init-folder.js
    ```

## Running the Application

To start the server, use one of the following commands:

- Using Node.js:

    ```bash
    node app.js
    ```

- Using Nodemon (for automatic restarts):

    ```bash
    nodemon app.js
    ```

The server should now be running on the port specified in your `.env` file (default is 3000). Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
