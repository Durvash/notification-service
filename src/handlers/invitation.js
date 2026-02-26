const nodemailer = require('../config/nodemailer'); 

module.exports = async (payload) => {
  try {
    const { recipient, content } = payload;

    // 🔍 DEBUG 1: Verify the incoming payload from RabbitMQ
    console.log('📦 [Worker] Received Payload:', JSON.stringify(payload, null, 2));

    // Ensure we map the URL correctly. 
    // Earlier you sent it as 'url', but here you use 'actionUrl'. Let's fix that:
    const inviteUrl = content.actionUrl || content.url; 

    const mailOptions = {
      from: '"Corporate Hub" <noreply@company.com>',
      to: recipient,
      subject: 'You have been invited!',
      html: `<h1>Welcome!</h1><p>Join here: <a href="${inviteUrl}">${inviteUrl}</a></p>`,
    };

    console.log('============== DEBUG START 🚀 ==============');
    console.log('📬 Mail Options:', mailOptions);
    
    // 🔍 DEBUG 2: Check if the transporter is actually ready
    // This helps catch "Invalid Login" or "Connection Timeout" issues
    await nodemailer.verify(); 
    console.log('✅ SMTP Transporter is ready');

    const info = await nodemailer.sendMail(mailOptions);
    
    console.log('✨ Message Sent ID:', info.messageId);
    console.log('============== DEBUG END ==============');
    
    return info;
  } catch (error) {
    console.error('❌ [Worker] Email Error:', error.message);
    console.error('Stack Trace:', error.stack);
    throw error; // Throw so RabbitMQ knows to potentially DLQ or retry
  }
};