# API Documentation

This document provides detailed information about the APIs available in the Real-Time Chat Application.

## API Gateway

The API Gateway service routes requests to the appropriate microservices and handles authentication.

Base URL: `http://localhost:3000/api`

## Authentication Service

### Register a new user
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Data constraints**:
  ```json
  {
    "name": "[string]",
    "email": "[valid email address]",
    "password": "[password with minimum 6 characters]"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "token": "[jwt token]",
      "user": {
        "_id": "[user id]",
        "name": "[user name]",
        "email": "[user email]"
      }
    }
    ```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Data constraints**:
  ```json
  {
    "email": "[valid email address]",
    "password": "[password]"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "token": "[jwt token]",
      "user": {
        "_id": "[user id]",
        "name": "[user name]",
        "email": "[user email]"
      }
    }
    ```

### Get user profile
- **URL**: `/auth/profile`
- **Method**: `GET`
- **Auth required**: Yes (Bearer token in Authorization header)
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "user": {
        "_id": "[user id]",
        "name": "[user name]",
        "email": "[user email]",
        "createdAt": "[timestamp]"
      }
    }
    ```

## Chat Service

### Create a conversation
- **URL**: `/chat/conversations`
- **Method**: `POST`
- **Auth required**: Yes (Bearer token in Authorization header)
- **Data constraints**:
  ```json
  {
    "participants": ["[user id 1]", "[user id 2]", ...],
    "name": "[optional conversation name]"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "conversation": {
        "_id": "[conversation id]",
        "participants": ["[user objects]"],
        "name": "[conversation name or null]"
      }
    }
    ```

### Get user conversations
- **URL**: `/chat/conversations`
- **Method**: `GET`
- **Auth required**: Yes (Bearer token in Authorization header)
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "conversations": ["[conversation objects]"]
    }
    ```

### Send a message
- **URL**: `/chat/messages`
- **Method**: `POST`
- **Auth required**: Yes (Bearer token in Authorization header)
- **Data constraints**:
  ```json
  {
    "conversationId": "[conversation id]",
    "content": "[message content]"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "message": {
        "_id": "[message id]",
        "conversationId": "[conversation id]",
        "sender": "[user object]",
        "content": "[message content]",
        "timestamp": "[timestamp]"
      }
    }
    ```

### Get conversation messages
- **URL**: `/chat/messages/:conversationId`
- **Method**: `GET`
- **Auth required**: Yes (Bearer token in Authorization header)
- **URL Parameters**:
  - `conversationId` - The ID of the conversation
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "messages": ["[message objects]"]
    }
    ```

## Media Service

### Upload media
- **URL**: `/media/upload`
- **Method**: `POST`
- **Auth required**: Yes (Bearer token in Authorization header)
- **Data constraints**:
  - Form data with `media` file field and `conversationId` field
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "media": {
        "_id": "[media id]",
        "filename": "[original filename]",
        "url": "[media url]",
        "type": "[file type]",
        "conversationId": "[conversation id]",
        "uploader": "[user object]",
        "timestamp": "[timestamp]"
      }
    }
    ```

### Get conversation media
- **URL**: `/media/:conversationId`
- **Method**: `GET`
- **Auth required**: Yes (Bearer token in Authorization header)
- **URL Parameters**:
  - `conversationId` - The ID of the conversation
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "media": ["[media objects]"]
    }
    ```

### Delete media
- **URL**: `/media/:mediaId`
- **Method**: `DELETE`
- **Auth required**: Yes (Bearer token in Authorization header)
- **URL Parameters**:
  - `mediaId` - The ID of the media file
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Media deleted successfully"
    }
    ```

## Notification Service

### Get user notifications
- **URL**: `/notifications`
- **Method**: `GET`
- **Auth required**: Yes (Bearer token in Authorization header)
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "notifications": ["[notification objects]"]
    }
    ```

### Mark notification as read
- **URL**: `/notifications/:notificationId/read`
- **Method**: `PUT`
- **Auth required**: Yes (Bearer token in Authorization header)
- **URL Parameters**:
  - `notificationId` - The ID of the notification
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "notification": "[notification object]"
    }
    ```

## WebSocket Events

The chat service uses Socket.io for real-time communication.

### Connection
- **Event**: `connection`
- **Description**: Establishes a WebSocket connection

### Message
- **Event**: `message`
- **Description**: Sends or receives a chat message
- **Data**:
  ```json
  {
    "_id": "[message id]",
    "conversationId": "[conversation id]",
    "sender": "[user object]",
    "content": "[message content]",
    "timestamp": "[timestamp]"
  }
  ```

### Disconnect
- **Event**: `disconnect`
- **Description**: Handles client disconnection
