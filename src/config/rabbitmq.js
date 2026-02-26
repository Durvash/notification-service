const amqp = require('amqplib');

let channel = null;
let connection = null;

/**
 * Initializes the RabbitMQ connection and creates a channel.
 * This should be called once when the service starts.
 */
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    console.log('✅ Connected to RabbitMQ Broker');

    // Handle connection closure or errors
    connection.on('error', (err) => console.error('RabbitMQ Connection Error', err));
    connection.on('close', () => console.log('RabbitMQ Connection Closed'));
  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ:', error.message);
    // In production, you might want to retry here
    process.exit(1);
  }
};

/**
 * Returns the active channel.
 * This is used by the worker to listen for messages.
 */
const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ first.');
  }
  return channel;
};

module.exports = { connectRabbitMQ, getChannel };
