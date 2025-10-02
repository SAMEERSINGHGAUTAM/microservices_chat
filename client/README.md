# Real-Time Chat Application - Client

This is the frontend client for the Real-Time Chat Application, built with React.

## Features

- User authentication (login/register)
- Real-time messaging with Socket.io
- Media file sharing (images, videos, audio, documents)
- Conversation management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   ├── Chat/
│   └── Common/
├── pages/
│   ├── Login.js
│   ├── Register.js
│   └── Chat.js
├── services/
│   ├── auth.service.js
│   ├── chat.service.js
│   └── media.service.js
├── App.js
└── App.css
```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects the app (irreversible)

## Environment Variables

Create a `.env` file in the client directory with the following variables:

```
REACT_APP_API_URL=http://localhost:3000
```

## Dependencies

- react
- react-dom
- react-router-dom
- socket.io-client
- axios

## Learn More

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
