# Project overview
We are building an MVP designed to streamline the management of workshops, camps, and classes.

## Tech Stack

- **Frontend**: Remix with App Router
- **UI Framework**: Tailwind CSS with ShadCN components
- **Database and Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Communications**: Twilio
- **Styling**: Tailwind CSS with ShadCN/UI components

## Target Users

- **Administrators**: Educational organization staff managing programs
- **Instructors**: STEM educators teaching classes and workshops
- **Parents/Guardians**: Registering children for programs
- **Staff**: Supporting program operations

# Core functionalities
### 1. Authentication & User Management
  - Multi-tenant user authentication system
  - Role-based access control (RBAC)
  - Social login options
  - Profile management
  - Organization management

### 2. Registration System
  - Multi-step registration flow
  - Shopping cart for multiple registrations
  - Waitlist management
  - Document upload and tracking
  - Family account management

### 3. Payment Processing
  - Secure credit card processing
  - Payment plans and recurring billing
  - Refund and credit management
  - PCI compliance
  - Receipt generation

### 4. Communication System
  - Email notifications with templates
  - SMS notifications
  - In-app messaging
  - Automated communication workflows
  - Announcement system

### 5. Program Management
  - Class/workshop creation and management
  - Attendance tracking
  - Resource allocation
  - Instructor schedule management
  - Curriculum tracking

### 6. Reporting and Analytics
  - Real-time dashboard
  - Custom report builder
  - Data export functionality
  - Performance metrics
  - Financial reporting

## Non-functional Requirements

### Security and Compliance

- GDPR compliance
- Data encryption
- Regular security audits
- Backup and recovery
- Access logging

### Performance

- Page load time < 3 seconds
- API response time < 500ms
- Concurrent users: 1000+
- Uptime: 99.9%

### Accessibility

- WCAG 2.1 AA compliance
- Mobile responsiveness
- Cross-browser compatibility
- Keyboard navigation support

## Phase 1 MVP Features

1. Basic user authentication and roles
2. Program registration with payment processing
3. Simple attendance tracking
4. Email notifications
5. Basic reporting

# Technical Implementation Documentation

## Database Schema

### User Management
```sql
-- Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role VARCHAR NOT NULL,
  organization_id UUID,
  contact_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations Table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Registration System
```sql
-- Programs Table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name VARCHAR NOT NULL,
  description TEXT,
  capacity INTEGER,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  location_id UUID REFERENCES locations(id),
  instructor_id UUID REFERENCES profiles(id),
  status VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registrations Table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  program_id UUID REFERENCES programs(id),
  status VARCHAR NOT NULL,
  payment_status VARCHAR,
  waitlist_position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES registrations(id),
  document_type VARCHAR NOT NULL,
  status VARCHAR,
  file_path VARCHAR,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Service Interfaces

### Payment Service
```typescript
interface PaymentProcessor {
  processPayment(amount: number, paymentMethod: PaymentMethod): Promise<PaymentResult>;
  createPaymentPlan(schedule: PaymentSchedule): Promise<PaymentPlan>;
  processRefund(transactionId: string, amount: number): Promise<RefundResult>;
}

type PaymentMethod = {
  type: 'credit_card' | 'bank_transfer';
  details: CreditCardDetails | BankDetails;
};

type PaymentResult = {
  success: boolean;
  transactionId?: string;
  error?: string;
};
```

### Communication Service
```typescript
interface CommunicationService {
  sendEmail(template: EmailTemplate, recipient: User): Promise<void>;
  sendSMS(message: string, phoneNumber: string): Promise<TwilioResponse>;
  scheduleNotification(notification: Notification): Promise<void>;
}

type EmailTemplate = {
  type: 'registration' | 'reminder' | 'confirmation';
  subject: string;
  body: string;
  variables: Record<string, string>;
};

type Notification = {
  type: 'email' | 'sms';
  recipient: User;
  scheduledFor: Date;
  content: EmailTemplate | SMSContent;
};
```

### Analytics Service
```typescript
interface AnalyticsService {
  generateReport(parameters: ReportParams): Promise<Report>;
  exportData(format: ExportFormat, data: ReportData): Promise<ExportFile>;
  getMetrics(timeframe: DateRange): Promise<DashboardMetrics>;
}

type ReportParams = {
  type: 'attendance' | 'financial' | 'registration';
  dateRange: DateRange;
  filters: Record<string, any>;
};

type DashboardMetrics = {
  activePrograms: number;
  totalRegistrations: number;
  revenue: number;
  attendanceRate: number;
};
```

## API Routes Structure
```typescript
// pages/api structure
export default {
  auth: {

    'webhook': WebhookHandler
  },
  programs: {
    'index': ProgramHandler,
    '[id]': ProgramDetailHandler,
    'create': ProgramCreateHandler
  },
  registrations: {
    'create': RegistrationCreateHandler,
    '[id]': RegistrationDetailHandler,
    'webhook': PaymentWebhookHandler
  },
  communications: {
    'email': EmailHandler,
    'sms': SMSHandler
  }
};
```

## Integration Configurations

### Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Twilio Configuration
```typescript
// lib/twilio.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

export const twilioClient = twilio(accountSid, authToken);
```
