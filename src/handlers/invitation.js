const nodemailer = require('../config/nodemailer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

module.exports = async (payload) => {
  try {
    const { recipient, content } = payload;

    // 🔍 DEBUG 1: Verify the incoming payload from RabbitMQ
    console.log('📦 [Worker] Received Payload:', JSON.stringify(payload, null, 2));

    // Ensure we map the URL correctly. 
    // Earlier you sent it as 'url', but here you use 'actionUrl'. Let's fix that:
    const inviteUrl = content.actionUrl || content.url;
    const logoPath = path.join(process.cwd(), 'src/templates/email', 'nimje_orbit_logo.png')
    const imageAsBase64 = fs.readFileSync(logoPath, 'base64');
    const mimeType = 'image/png'; 
    const logoDataUri = `data:${mimeType};base64,${imageAsBase64}`;

    const emailContent = await ejs.renderFile(path.join(process.cwd(), 'src/templates/email', 'inviteMember.ejs'), {
      name: recipient.split('@')[0],
      companyLogo: logoDataUri,
      invitationUrl: inviteUrl,
      teamName: 'Nimje Orbit'
    });
    
    const mailOptions = {
      from: '"Nimje Orbit" <noreply@nimjeorbit.com>',
      to: recipient,
      subject: 'You have been invited!',
      html: emailContent
    };

    console.log('📬 Mail Options:', mailOptions);
    
    // 🔍 DEBUG 2: Check if the transporter is actually ready
    // This helps catch "Invalid Login" or "Connection Timeout" issues
    await nodemailer.verify();
    console.log('✅ SMTP Transporter is ready');

    const info = await nodemailer.sendMail(mailOptions);
    console.log('✨ Message Sent ID:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ [Worker] Email Error:', error.message);
    console.error('Stack Trace:', error.stack);
    throw error; // Throw so RabbitMQ knows to potentially DLQ or retry
  }
};