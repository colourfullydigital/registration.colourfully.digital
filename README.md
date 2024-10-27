# STEM Education Portal

A modern platform for managing STEM educational events including workshops, camps, and classes. Built with Next.js 15, Supabase, and Clerk.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- pnpm 8.x
- PostgreSQL 14 or later (via Supabase)
- Supabase account
- Clerk account
- Twilio account

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/stem-education-platform.git
cd stem-education-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory:
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Initialize the database:
```bash
pnpm db:migrate
```

5. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 🏗 Project Structure

```
stem-education-platform/
├── app/                     # Next.js 15 app directory
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Protected dashboard routes
│   └── api/                # API routes
├── components/             # React components
│   ├── ui/                # ShadCN components
│   └── shared/            # Shared components
├── lib/                    # Utility functions and configurations
├── types/                  # TypeScript type definitions
├── styles/                # Global styles and Tailwind config
└── public/                # Static assets
```

## 🔧 Core Technologies

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Communications**: Twilio
- **State Management**: React Query & Zustand
- **Forms**: React Hook Form & Zod

## 🛠 Development

### Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run tests
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with sample data
```

### Code Style

- We use ESLint and Prettier for code formatting
- Run `pnpm lint` before committing
- Use conventional commits for commit messages

### Database Migrations

Migrations are managed through Supabase migrations:

```bash
pnpm supabase migration new migration_name
pnpm supabase migration up
pnpm supabase migration down
```

## 📚 Core Features

1. **User Management**
   - Multi-tenant authentication
   - Role-based access control
   - Organization management

2. **Registration System**
   - Program registration
   - Waitlist management
   - Document management

3. **Payment Processing**
   - Secure payments
   - Payment plans
   - Refund management

4. **Program Management**
   - Class/workshop management
   - Attendance tracking
   - Resource allocation

## 🧪 Testing

We use Jest and React Testing Library for testing:

```bash
pnpm test              # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
```

## 📦 Deployment

### Production Deployment

1. Build the application:
```bash
pnpm build
```

2. Start the production server:
```bash
pnpm start
```

### Environment Variables

Ensure all required environment variables are set in your deployment environment. See `.env.example` for required variables.

## 🔒 Security

- All API routes are protected with Clerk authentication
- Database access is controlled through RLS policies
- Sensitive data is encrypted at rest
- Regular security audits are performed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔍 Documentation

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Component Library](docs/components.md)
- [Testing Guide](docs/testing.md)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
