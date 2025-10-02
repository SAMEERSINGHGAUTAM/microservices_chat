# Deployment Guide

This document provides instructions for deploying the Real-Time Chat Application in different environments.

## Prerequisites

Before deploying the application, ensure you have the following:

1. Docker installed on the target system
2. Kubernetes cluster (for Kubernetes deployment)
3. AWS account with S3 bucket configured (for media storage)
4. MongoDB instances for each service
5. Redis instance
6. RabbitMQ instance
7. SSL certificates (for production deployment)

## Environment Variables

Each service requires specific environment variables to be set. Copy the `.env.example` file in each service directory to `.env` and configure the values appropriately.

### API Gateway
- `PORT`: Port to run the service on
- `JWT_SECRET`: Secret for JWT token signing
- `REDIS_URL`: URL to Redis instance

### Auth Service
- `PORT`: Port to run the service on
- `MONGODB_URI`: URI to MongoDB instance
- `JWT_SECRET`: Secret for JWT token signing
- `JWT_EXPIRES_IN`: JWT token expiration time
- `REDIS_URL`: URL to Redis instance

### Chat Service
- `PORT`: Port to run the service on
- `MONGODB_URI`: URI to MongoDB instance
- `REDIS_URL`: URL to Redis instance
- `RABBITMQ_URL`: URL to RabbitMQ instance
- `ENCRYPTION_KEY`: Key for message encryption

### Media Service
- `PORT`: Port to run the service on
- `MONGODB_URI`: URI to MongoDB instance
- `AWS_ACCESS_KEY_ID`: AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AWS_REGION`: AWS region
- `AWS_S3_BUCKET`: S3 bucket name

### Notification Service
- `PORT`: Port to run the service on
- `MONGODB_URI`: URI to MongoDB instance
- `RABBITMQ_URL`: URL to RabbitMQ instance
- `EMAIL_SERVICE`: Email service provider (e.g., Gmail)
- `EMAIL_USER`: Email service username
- `EMAIL_PASS`: Email service password
- `FCM_SERVICE_ACCOUNT_KEY`: Firebase Cloud Messaging service account key

## Docker Deployment

### Development Environment

1. Start the infrastructure services:
   ```bash
   docker-compose -f infrastructure/docker-compose.dev.yml up -d
   ```

2. Start each service:
   ```bash
   cd services/api-gateway
   docker build -t chat-app-api-gateway .
   docker run -p 3000:3000 chat-app-api-gateway
   
   cd services/auth-service
   docker build -t chat-app-auth-service .
   docker run -p 3001:3001 chat-app-auth-service
   
   cd services/chat-service
   docker build -t chat-app-chat-service .
   docker run -p 3002:3002 chat-app-chat-service
   
   cd services/media-service
   docker build -t chat-app-media-service .
   docker run -p 3003:3003 chat-app-media-service
   
   cd services/notification-service
   docker build -t chat-app-notification-service .
   docker run -p 3004:3004 chat-app-notification-service
   ```

3. Start the client application:
   ```bash
   cd client
   docker build -t chat-app-client .
   docker run -p 3005:3000 chat-app-client
   ```

### Production Environment

1. Build all services:
   ```bash
   docker-compose build
   ```

2. Start all services:
   ```bash
   docker-compose up -d
   ```

## Kubernetes Deployment

### Prerequisites

1. Kubernetes cluster configured
2. kubectl installed and configured
3. Helm installed (optional but recommended)

### Deployment Steps

1. Create Kubernetes secrets for environment variables:
   ```bash
   kubectl create secret generic api-gateway-secret --from-env-file=services/api-gateway/.env
   kubectl create secret generic auth-service-secret --from-env-file=services/auth-service/.env
   kubectl create secret generic chat-service-secret --from-env-file=services/chat-service/.env
   kubectl create secret generic media-service-secret --from-env-file=services/media-service/.env
   kubectl create secret generic notification-service-secret --from-env-file=services/notification-service/.env
   ```

2. Deploy infrastructure services:
   ```bash
   kubectl apply -f infrastructure/k8s/mongo
   kubectl apply -f infrastructure/k8s/redis
   kubectl apply -f infrastructure/k8s/rabbitmq
   ```

3. Deploy application services:
   ```bash
   kubectl apply -f infrastructure/k8s/services/api-gateway
   kubectl apply -f infrastructure/k8s/services/auth-service
   kubectl apply -f infrastructure/k8s/services/chat-service
   kubectl apply -f infrastructure/k8s/services/media-service
   kubectl apply -f infrastructure/k8s/services/notification-service
   ```

4. Deploy client application:
   ```bash
   kubectl apply -f infrastructure/k8s/client
   ```

5. Deploy Nginx reverse proxy:
   ```bash
   kubectl apply -f infrastructure/k8s/nginx
   ```

### Scaling Services

To scale any service, use the following command:
```bash
kubectl scale deployment <service-name> --replicas=<number>
```

For example, to scale the chat service to 3 replicas:
```bash
kubectl scale deployment chat-service --replicas=3
```

### Updating Services

To update a service with new code:

1. Build and push new Docker images to a registry
2. Update the deployment with:
   ```bash
   kubectl set image deployment/<service-name> <container-name>=<new-image>
   ```

## Nginx Configuration

The Nginx reverse proxy is configured to route requests to the appropriate services:

- `/api/auth/*` → Auth Service
- `/api/chat/*` → Chat Service
- `/api/media/*` → Media Service
- `/api/notifications/*` → Notification Service
- `/` → Client Application

SSL termination is handled at the Nginx level, and all internal communication between services happens over HTTP.

## Monitoring and Health Checks

Each service exposes a `/health` endpoint that returns a 200 status code if the service is running properly.

For Kubernetes deployments, health checks are configured in the deployment YAML files:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
```

## Backup and Recovery

### MongoDB Backup

For each service's MongoDB instance, create regular backups:
```bash
mongodump --uri=<mongodb-uri> --out=/backup/location
```

### Recovery

To restore from a backup:
```bash
mongorestore --uri=<mongodb-uri> /backup/location
```

## Troubleshooting

### Common Issues

1. **Services not communicating**: Check that all environment variables are set correctly and that services can reach each other.

2. **WebSocket connections failing**: Verify that the Nginx configuration properly handles WebSocket upgrades.

3. **Media uploads failing**: Ensure AWS credentials are correct and the S3 bucket exists with proper permissions.

4. **Notifications not being sent**: Check RabbitMQ connection and verify email/Firebase credentials.

### Logs

To view logs for a specific service in Kubernetes:
```bash
kubectl logs <pod-name>
```

To view logs for a Docker container:
```bash
docker logs <container-name>
```

### Rolling Restarts

To perform a rolling restart of a service in Kubernetes:
```bash
kubectl rollout restart deployment/<service-name>
