const amqp = require('amqplib');

let connection;
let channel;

const connectRabbitMQ = async () => {
  try {
    // Create connection
    connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
    
    // Create channel
    channel = await connection.createChannel();
    
    // Assert queue
    await channel.assertQueue('message_notifications');
    
    console.log('RabbitMQ connected');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    process.exit(1);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
