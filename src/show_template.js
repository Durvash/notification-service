const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

// Change (req, res) to (data) to match how you are calling it
module.exports = async (data) => {
  try {
    console.log('Email templates displaying...');

    // 1. Destructure recipient from the incoming data object
    const { recipient } = data; 
    
    // Safety check: if recipient is missing, don't crash the script
    const displayName = recipient ? recipient.split('@')[0] : 'User';

    const inviteUrl = 'http://localhost:3000/';
    const logoPath = path.join(process.cwd(), 'src/templates/email', 'nimje_orbit_logo.png');
    
    const imageAsBase64 = fs.readFileSync(logoPath, 'base64');
    const mimeType = 'image/png'; 
    const logoDataUri = `data:${mimeType};base64,${imageAsBase64}`;

    const emailContent = await ejs.renderFile(path.join(process.cwd(), 'src/templates/email', 'inviteMember.ejs'), {
      name: displayName, // Use our safe display name
      companyLogo: logoDataUri,
      invitationUrl: inviteUrl,
      teamName: 'Nimje Orbit'
    });
    
    return emailContent;
  } catch (error) {
    console.error('❌ [Worker] Email Error:', error.message);
    throw error; 
  }
}

// --- TEST BLOCK ---
if (require.main === module) {
  const mockData = {
    recipient: 'mahadev@example.com', // This is what becomes 'data' above
    teamName: 'Nimje Orbit Test'
  };

  module.exports(mockData)
    .then(html => {
      console.log('--- HTML GENERATED ---');
      fs.writeFileSync('test_email_preview.html', html);
      console.log('✅ Success! Preview saved to test_email_preview.html');
    })
    .catch(err => {
      console.error('Test Failed:', err);
    });
}