# AfriApply - Automated Job Application Assistant

AfriApply is an intelligent job application automation tool that helps job seekers on Afriwork by automatically finding suitable positions, generating personalized cover letters using AI, and submitting applications on their behalf. The system includes Telegram notifications to keep users updated on their job search progress.

⚠️ **WARNING**: This tool will automatically apply to jobs that match your profile criteria. Make sure your profile and preferences are accurately configured before running the automation. Review your settings carefully as applications will be submitted without manual approval.

## 🚀 Features

- **Automated Job Scraping**: Continuously monitors Afriwork for new job postings
- **AI-Powered Matching**: Uses advanced AI to analyze job descriptions and match them with your profile
- **Smart Cover Letter Generation**: Creates personalized cover letters for each suitable position
- **Automated Application Submission**: Fills out and submits job applications automatically
- **Telegram Notifications**: Real-time updates on job applications and matches
- **Profile Management**: Web interface to set up and manage your professional profile
- **Job Filtering**: Customizable filters for job types, locations, experience levels, and more
- **Application Tracking**: Keeps track of all submitted applications

## 🛠 Tech Stack

- **Runtime**: Bun
- **Backend**: Hono (lightweight web framework)
- **Database**: SQLite with Drizzle ORM
- **AI Integration**: Multiple providers (OpenAI, Anthropic, Google, Groq)
- **Web Scraping**: Puppeteer
- **Notifications**: Telegram Bot API
- **Frontend**: JSX with server-side rendering

## 📋 Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Afriwork account credentials
- AI API key (OpenAI, Anthropic, Google, or Groq)
- Telegram Bot Token for notifications

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd afriapply
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   # Afriwork credentials
   AFRIWORK_EMAIL=your-email@example.com
   AFRIWORK_PASSWORD=your-password
   AFRIWORK_BASE_URL=https://afriworket.com/

   # AI Configuration (choose one)
   OPENAI_API_KEY=your-openai-key
   # OR
   ANTHROPIC_API_KEY=your-anthropic-key
   # OR
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-key
   # OR
   GROQ_API_KEY=your-groq-key

   # Telegram Bot
   BOT_TOKEN=your-telegram-bot-token
   WEBHOOK_URL=your-webhook-url

   # Server Configuration
   PORT=3000
   HEADLESS=true
   ```

4. **Set up the database**
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

5. **Seed initial data (optional)**
   ```bash
   bun run seed
   ```

## 🚀 Usage

### 1. Start the Server

```bash
bun run index.ts
```

The server will start on `http://localhost:3000`

### 2. Set Up Your Profile

1. Navigate to `http://localhost:3000/setup`
2. Fill out your professional information:
   - Personal details (name, email, location)
   - Professional summary
   - Skills and experience
   - Education background
   - Portfolio links
   - Job preferences and filters
   - Telegram username (recommended for employer communication on Afriwork)

### 3. Configure Telegram Notifications

1. Create a Telegram bot using [@BotFather](https://t.me/botfather)
2. Add your bot token to the `.env` file
3. Start a conversation with your bot
4. Send `/start` command to register for notifications

### 4. Run Job Search

**Manual trigger:**
```bash
curl http://localhost:3000/apply
```

**Automated scheduling:**
Set up a cron job or use a task scheduler to periodically trigger the job search.

## 🤖 AI Integration

AfriApply supports multiple AI providers for cover letter generation:

- **OpenAI**: GPT-4o-mini
- **Anthropic**: Claude-3-haiku-20240307
- **Google**: Gemini-1.5-flash
- **Groq**: OpenAI GPT-OSS-120B

The system automatically detects which API key is available and uses the corresponding provider.

## 🔍 How It Works

1. **Profile Analysis**: The system analyzes your professional profile, skills, and preferences
2. **Job Scraping**: Continuously monitors Afriwork for new job postings based on your filters
3. **AI Matching**: Uses AI to evaluate job descriptions against your profile
4. **Cover Letter Generation**: Creates personalized cover letters for suitable positions
5. **Automated Application**: Fills out application forms and submits them
6. **Notification**: Sends updates via Telegram about successful applications and matches
7. **Tracking**: Records all applications in the database for future reference

## 📱 API Endpoints

- `GET /setup` - Profile setup and management interface
- `POST /setup` - Save profile information
- `GET /apply` - Trigger job search and application process
- `POST /webhook/telegram` - Telegram webhook for bot interactions

## � Configuration Options

### Job Filters

Configure your job search preferences:

- **Sector**: Choose from 40+ industry sectors
- **Job Types**: Full-time, Part-time, Freelance, Contract, etc.
- **Work Location**: On-site, Remote, Hybrid
- **Experience Level**: Entry, Junior, Intermediate, Senior, Expert
- **Education Level**: Various education requirements
- **Gender Preference**: If specified by employers


## ⚠️ Important Warnings

- **Automatic Application Submission**: This tool will automatically submit job applications without manual review. Ensure your profile information is accurate and complete.
- **Telegram Username**: Your Telegram username is recommended as many Afriwork employers prefer to use Telegram for communication with candidates.
- **Review Your Filters**: Double-check your job filter preferences as the system will apply to ALL jobs that match your criteria.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is designed to assist with job applications on Afriwork. Users are responsible for:

- Ensuring their profile information is accurate
- Reviewing generated cover letters before submission
- Complying with Afriwork's terms of service
- Using the tool responsibly and ethically

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
