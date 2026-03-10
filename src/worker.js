const { connectRabbitMQ, getChannel } = require('./config/rabbitmq');
const handleNotification = require('./handlers');

const startWorker = async () => {
  await connectRabbitMQ();
  const channel = getChannel();

  const queue = 'sso_notification_queue';
  const exchange = 'central_notifications_exchange';

  await channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(
    queue,
    exchange,
    'notification.#',
  );
  
  console.log(`✅ Worker listening on queue: ${queue}`);
  
  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      console.log(`📩 Processing ${payload.type} for ${payload.recipient}`);

      // Pass to the handler mapper
      await handleNotification(payload);

      // Acknowledge success
      channel.ack(msg);
    } catch (e) {
      console.error('❌ Worker Error:', e.message);
      // nack(message, requeue_flag, multiple_flag)
      // Requeue: false (so it doesn't loop forever if code is broken)
      channel.nack(msg, false, false);
    }
  });
};

startWorker().catch(console.error);