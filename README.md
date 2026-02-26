cat <<EOF > README.md
# Notification Service 📧

A Node.js microservice that processes system-wide notifications using **RabbitMQ** and **Nodemailer**.

## 🏗️ Architecture
- **Broker:** RabbitMQ (Topic Exchange)
- **Exchange:** \`central_notifications_exchange\`
- **Routing Key:** \`notification.sso.invite\`
- **Queue:** \`sso_notification_queue\`

## 🚀 Getting Started

### 1. Environment Configuration
Create a \`.env\` file in the root:
\`\`\`env
RABBITMQ_URL=amqp://admin:admin321@localhost:5672
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
\`\`\`

### 2. Execution
\`\`\`bash
# Using Docker
docker-compose up --build -d

# Locally
npm install
node src/worker.js
\`\`\`

---
Maintained by [Durvash](https://github.com/Durvash)
EOF