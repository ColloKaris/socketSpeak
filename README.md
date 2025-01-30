# SocketSpeak

This is a chat application built with Node.js, React, MongoDB, and Socket.io. The goal of this project was to use WebSockets to build a chat application that allows bidirectional, real-time communication between users.

The WebSocket protocol is a communication protocol that provides full-duplex, real-time communication between a client and a server. In the case of this application, when one user sends a message to another user, the message is first routed through the server, before being sent to the recipient.

The decision to use Socket.io as opposed to the ws, a pure implementation of the WebSocket protocol, is because Socket.io comes with additional features such as connection monitoring, rooms, automatic reconnections, automatic long polling, and message guarantees.

In this project, the backend was built by [Collins Kariuki](https://github.com/ColloKaris), myself. The frontend was built by [Nelson Kamau](https://github.com/NellitG).

## How to run the application:

1. Clone the repository
2. cd into the project folder `cd socketSpeak`
3. cd into the backend folder `cd backend`
4. Install dependencies: `npm install`
5. Start the server: `npm start`
6. cd into the frontend folder `cd ../frontend`
7. Install dependencies: `npm install`
8. Start the frontend: `npm run dev`
9. Open your browser and go to: `http://localhost:3001/`

## Features:

- Websockets implementation using Socket.io
- Real-time communication between users using Socket.io
- User authentication (login/register) using Json Web Tokens.
- Efficient error handling on the backend using custom Express error class
- Interaction with database done using the native MongoDB Node.js driver rather than an ORM.
- Model-view-controller architecture for clear separation of concerns and improved maintainability.
- Zod and MongoDB Json Schema validation to validate all data before processing or storage in the database.
- Implementation of RESTful APIs.

## Tech Stack:

- **Backend**: Node.js, TypeScript, Express, Socket.io
- **Frontend**: React, Tailwind CSS, Daisy UI, Socket.io
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens
- **Password Encryption**: Bcrypt
- **Data validation**: Zod, MongoDB Schema Validation
- **Logging**: Pino

## Screenshots 📸
