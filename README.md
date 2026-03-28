# Whose Bean

A privacy-focused, self-hosted web analytics platform that gives you insights into your website traffic without compromising user privacy.

## Mission

We didn't like the analytics options out there. So we decided to make our own using the very latest technology. The whole code was largely written using opencode and the bulk of it was created in less than one week.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Creating Your Account](#creating-your-account)
- [Adding \& Managing Domains](#adding--managing-domains)
- [The Tracking Script](#the-tracking-script)
- [Understanding the Analytics Dashboard](#understanding-the-analytics-dashboard)
- [Period Filtering](#period-filtering)
- [Real-time Analytics](#real-time-analytics)
- [Admin Panel](#admin-panel)
- [Debug Analytics](#debug-analytics)
- [Settings](#settings)
- [Password Reset](#password-reset)
- [Docker Setup](#docker-setup)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Nginx Configuration](#nginx-configuration)
- [Database Configuration](#database-configuration)
- [Environment Variables Reference](#environment-variables-reference)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Technology Stack](#technology-stack)
- [License](#license)

---

## Project Overview

Whose Bean is a lightweight, self-hosted web analytics solution similar to Plausible or Fathom. It provides essential traffic insights while keeping your data under your control.

**Key Philosophy:**

- No cookies required (but uses session-based tracking)
- No annoying consent banners
- Simple, clean interface
- Your data stays on your server
- Real-time analytics with live updates

---

## Features

### Analytics

- **Page Views Tracking**: Monitor all page views across your websites
- **Unique Visitors**: Track distinct visitors using session-based identification
- **Views Over Time**: Line chart showing traffic trends with dual-axis (views + visitors)
- **Top Pages**: Bar chart showing your most visited pages
- **Top Countries**: Geographic distribution of your visitors
- **Referrers**: See where your visitors come from (direct, search, social)
- **Operating Systems**: Pie chart showing visitor OS distribution
- **Browser Analytics**: See which browsers your visitors use
- **Device Analytics**: Desktop, mobile, and tablet breakdown
- **Real-time Updates**: Live streaming analytics via Server-Sent Events
- **Period Filtering**: View data for today, yesterday, last hour, last 6/12/24 hours, last 7/14/28/90/180/365 days, or year to date
- **Bot Detection**: Automatically detect and filter search engine bots, crawlers, and headless browsers from analytics data

### User Management

- **User Registration**: Create accounts to access the dashboard
- **Role-based Access**: Admin and regular user roles
- **Admin Panel**: Manage users, invite new users, promote to admin
- **Secure Authentication**: JWT-based authentication
- **Password Reset**: Secure password reset via email for forgot password scenarios

### Domain Management

- **Domain Creator Attribution**: See which admin created each domain
- **Public/Private Visibility**: Share analytics via direct link with unauthenticated guests
- **Domain-Level Access Control**: Grant/revoke domain access to non-admin users

### Developer Experience

- **Simple Tracking Script**: Single JavaScript snippet to add to your site
- **IP Spoofing (Dev)**: Test geolocation with fake IPs during development
- **Custom Endpoints**: Configure custom analytics endpoints
- **Multiple Domains**: Track unlimited domains from one dashboard

---

## Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd whose-bean
npm install

# 2. Set up environment
cp .env.example .env.local
npm run db:generate
npm run db:push

# 3. Start development server
npm run dev
```

Then open http://localhost:9500/register to create your account.

> **Tip:** Use the tracking script on your website to start collecting data. See [The Tracking Script](#the-tracking-script) for details.

---

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Git**: For cloning the repository (optional)
- **Database**: SQLite (default) or PostgreSQL

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd whose-bean
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings. The defaults work for local development:

```env
DATABASE_URL="file:./dev.db"
USE_POSTGRES=false
JWT_SECRET="your-secret-key-change-in-production"
APP_URL="https://your-domain.com"
```

> **Security Note:** Change `JWT_SECRET` to a secure random string in production.

For email functionality, configure SMTP (see [Environment Variables Reference](#environment-variables-reference)).

### 4. Set Up the Database

```bash
npm run db:generate
npm run db:push
```

This creates the SQLite database at `prisma/dev.db`.

### 5. Start the Development Server

```bash
npm run dev
```

The application runs at **http://localhost:9500**

---

## Creating Your Account

1. Open http://localhost:9500/register in your browser
2. Enter your email address and a secure password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

> **Note:** There is no default admin account. You must register first. The first registered user becomes an admin automatically.
>
> **Important:** After the first user registers, public registration is automatically disabled to secure the analytics platform. Additional users can only be added by:
>
> - An admin via the [Admin Panel](#admin-panel) using the "Invite User" feature
> - An admin creating a user directly

For returning users, navigate to http://localhost:9500/login to sign in.

---

## Adding & Managing Domains

### Adding a New Domain

1. After logging in, go to the dashboard at http://localhost:9500/dashboard
2. Enter your domain name (e.g., `example.com` or `mysite.blog`)
3. Click "Add Domain"

Your domain will appear in the list with:

- **Domain name**: The website URL
- **Events**: Number of page views recorded
- **Domain ID**: A unique identifier needed for the tracking script
- **Added date**: When you created the domain

### Viewing Analytics

Click "View Dashboard" on any domain card to see its analytics dashboard.

### Deleting a Domain

> **Warning:** This permanently deletes the domain and all its analytics data.

1. Click the delete icon on the domain card
2. Confirm the deletion in the dialog

Only admin users can delete domains.

### Clearing Analytics Data

Alternatively, admins can clear analytics data while keeping the domain:

1. Go to the domain's analytics dashboard
2. Scroll to the Danger Zone section
3. Click "Clear All Analytics"
4. Confirm the action

This removes all page view data but retains the domain configuration. The domain ID remains the same for tracking.

### Domain Creator

Each domain card shows who created it with a "By: email" label. This helps track domain ownership within your organization.

### Public/Private Domains

Admins can mark domains as public or private:

| Visibility  | Who Can View                                   |
| ----------- | ---------------------------------------------- |
| **Public**  | Anyone with the direct link (including guests) |
| **Private** | Admins + users with explicit access            |

Toggle visibility from the domain analytics page header. Only admins can change visibility.

---

## The Tracking Script

Add the following JavaScript snippet to your website's HTML, replacing `YOUR_DOMAIN_ID` with your actual domain ID from the dashboard.

### Basic Implementation

```html
<script
  data-domain-id="YOUR_DOMAIN_ID"
  src="https://your-analytics-server.com/track.js"
  async
></script>
```

Replace `https://your-analytics-server.com` with your actual Whose Bean deployment URL.

### Finding Your Domain ID

1. Go to your dashboard at `/dashboard`
2. Find the domain in the list
3. The domain ID is shown below the domain name (a string like `cmmowhlt60001arayxmzh1jes`)

### Configuration Options

The tracking script supports several configuration methods:

| Attribute        | Window Variable              | Description                         | Required |
| ---------------- | ---------------------------- | ----------------------------------- | -------- |
| `data-domain-id` | `window.ANALYTICS_DOMAIN_ID` | Your domain ID from the dashboard   | Yes      |
| `data-ip`        | `window.ANALYTICS_IP`        | Spoof IP for geolocation (dev only) | No       |
| -                | `window.ANALYTICS_URL`       | Custom analytics endpoint URL       | No       |

### IP Spoofing (Development Only)

During development, you can test geolocation by spoofing IP addresses:

```html
<!-- Using data attribute -->
<script
  data-domain-id="YOUR_DOMAIN_ID"
  data-ip="8.8.8.8"
  src="https://your-domain.com/track.js"
  async
></script>

<!-- Or using window variable -->
<script>
  window.ANALYTICS_IP = '8.8.8.8';
</script>
<script data-domain-id="YOUR_DOMAIN_ID" src="https://your-domain.com/track.js" async></script>
```

> **Important:** IP spoofing only works in development mode. In production, only real client IPs are used.

### Custom Analytics Endpoint

If your tracking script runs on a different domain than your analytics server:

```html
<script>
  window.ANALYTICS_URL = 'https://analytics.example.com/api/analytics';
  window.ANALYTICS_DOMAIN_ID = 'YOUR_DOMAIN_ID';
</script>
<script src="https://cdn.yoursite.com/track.js" async></script>
```

### Script Placement

Place the script in the `<head>` section of your HTML for best results:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
    <!-- Place tracking script here -->
    <script
      data-domain-id="YOUR_DOMAIN_ID"
      src="https://your-analytics-server.com/track.js"
      async
    ></script>
  </head>
  <body>
    <!-- Your content -->
  </body>
</html>
```

### Examples

**Basic usage:**

```html
<script
  data-domain-id="cmmowhlt60001arayxmzh1jes"
  src="https://analytics.example.com/track.js"
  async
></script>
```

**With IP spoofing for testing:**

```html
<script
  data-domain-id="cmmowhlt60001arayxmzh1jes"
  data-ip="1.2.3.4"
  src="https://your-domain.com/track.js"
  async
></script>
```

---

## Understanding the Analytics Dashboard

When you click "View Dashboard" on a domain, you'll see a comprehensive analytics view.

### Stat Cards

The top of the dashboard shows three key metrics:

| Stat                 | Description                                       |
| -------------------- | ------------------------------------------------- |
| **Total Page Views** | The total number of times pages were viewed       |
| **Unique Visitors**  | Distinct visitors (identified by session)         |
| **Pages Tracked**    | Number of unique pages in the top 10 most visited |

### Charts

#### Views Over Time

A line chart showing traffic trends over the selected period. It has two Y-axes:

- **Left axis (blue)**: Total page views
- **Right axis (green)**: Unique visitors

This lets you correlate total views with visitor counts.

#### Top Pages

A vertical bar chart showing your most visited pages. The X-axis shows view counts (integers), and the Y-axis shows the page paths.

Use this to identify:

- Your most popular content
- Which pages drive the most engagement
- Potential pages to improve or promote

#### Top Countries

A vertical bar chart showing where your visitors are located geographically. Shows country names on the Y-axis with view counts on the X-axis.

This helps you understand:

- Your geographic audience
- Potential markets to target
- If your content resonates in specific regions

#### Browsers

A pie/donut chart showing the distribution of browsers used by your visitors. Common values include Chrome, Firefox, Safari, Edge, and others.

#### Devices

A pie/donut chart showing the types of devices:

- **Desktop**: Laptops and computers
- **Mobile**: Smartphones
- **Tablet**: Tablets

### Data Tables

The analytics dashboard includes two detailed data tables for deeper analysis:

#### Page Views Table

A complete log of all page view events. Useful for investigating specific visits.

| Column       | Description                                       |
| ------------ | ------------------------------------------------- |
| **Location** | City and country of the visitor                   |
| **Time**     | Date and time of the page view                    |
| **Page**     | URL path of the viewed page                       |
| **Browser**  | Visitor's browser (Chrome, Firefox, Safari, etc.) |
| **Device**   | Device type (Desktop, Mobile, Tablet)             |

#### Visitors Table

A list of visitor sessions with aggregated activity data.

| Column         | Description                             |
| -------------- | --------------------------------------- |
| **Location**   | City and country of the visitor         |
| **First Seen** | When the visitor was first detected     |
| **Last Seen**  | Most recent visit timestamp             |
| **Pages**      | Number of pages visited in this session |
| **Device**     | Device type used by the visitor         |
| **Browser**    | Browser used by the visitor             |

**Features:**

- Both tables are **sortable** - click any column header to sort ascending or descending
- Both tables are **paginated** - navigate through large datasets with page controls
- Data is filtered by the selected time period

### Visibility Badge

A badge in the header shows whether the domain is Public or Private. Only admins see the toggle button to change visibility.

### User Access Section

Admins can manage domain access directly from the analytics page:

- See users who have access
- Grant access to additional users
- Revoke access from users

### Guest View

When guests view public domains:

- They see the analytics but no navigation
- "Back" button is hidden
- "Track Your Domain" section is hidden
- They cannot modify any data

---

## Period Filtering

Use the period dropdown in the top-right of the dashboard to change the time range for all analytics data:

| Period            | Description                               |
| ----------------- | ----------------------------------------- |
| **Today**         | From midnight to the current moment today |
| **Yesterday**     | The entire previous day (00:00 to 23:59)  |
| **Last hour**     | The past 60 minutes                       |
| **Last 6 hours**  | The previous 6 hours                      |
| **Last 12 hours** | The previous 12 hours                     |
| **Last 24 hours** | The previous 24 hours                     |
| **Last 7 days**   | The previous 7 days                       |
| **Last 14 days**  | The previous 14 days                      |
| **Last 28 days**  | The previous 4 weeks                      |
| **Last 90 days**  | The previous 3 months                     |
| **Last 180 days** | The previous 6 months                     |
| **Last year**     | The previous 365 days                     |
| **Year to date**  | January 1st of the current year to now    |

Selecting a period updates all charts and stat cards instantly.

### Additional Filters

Beyond period filtering, the analytics dashboard provides three additional filter dropdowns to refine your data:

| Filter                | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| **Operating Systems** | Filter data by specific OS (Windows, macOS, Linux, iOS, Android, etc.) |
| **Browsers**          | Filter data by browser (Chrome, Firefox, Safari, Edge, etc.)           |
| **Devices**           | Filter data by device type (Desktop, Mobile, Tablet)                   |

These filters work in combination with the selected time period. Use them to analyze specific segments of your traffic, such as mobile users over the last 7 days or Chrome visitors over the past month.

---

## Real-time Analytics

Whose Bean provides live analytics updates using Server-Sent Events (SSE).

### The Live Indicator

Next to your domain name, you'll see a status badge:

- **Green "Live"**: Connected and receiving real-time updates. New page views appear instantly.
- **Gray "Connecting..."**: Attempting to establish a real-time connection.

### How It Works

- When you open the analytics dashboard, a connection is established to receive live updates
- New page views are pushed to your dashboard as they happen
- The connection automatically reconnects if interrupted
- Close the browser tab to disconnect

### Benefits

- See traffic spikes as they happen
- Monitor the effectiveness of marketing campaigns in real-time
- Detect unusual traffic patterns immediately

---

## Admin Panel

The admin panel is accessible at `/admin` and provides user management and system administration features.

> **Access:** Only users with the `admin` role can access the admin panel.

### Features

#### Adding Users

Admins can add users in two ways:

##### Create User (Direct)

Create a user account immediately with email and password.

| Field            | Description                      |
| ---------------- | -------------------------------- |
| Email            | User's email address             |
| Password         | Minimum 8 characters             |
| Confirm Password | Re-enter password                |
| Make Admin       | Optional toggle for admin access |

Steps:

1. Go to `/admin`
2. Select "Create User" tab
3. Fill in email and password
4. Optionally enable "Make this user an admin"
5. Click "Create User"

##### Invite User (Email)

Send an invitation email for the user to register.

1. Go to the admin panel at `/admin`
2. Select "Invite User" tab
3. Enter an email address in the "Invite New User" form
4. Optionally check "Make this user an admin" to grant admin privileges
5. Click "Send Invitation"

An invitation email is sent to the user with a link to register.

> **Note:** Sending a new invitation invalidates any previous invitation links for the same email.

#### User Management

The user management table shows:

- **Email**: The user's email address
- **Role**: Admin or user
- **Created**: Account creation date
- **Actions**:
  - "Make Admin" button (for non-admin users)
  - "Delete" button (disabled when only one admin remains)

#### Preventing Account Lockout

Whose Bean requires at least one admin user to exist at all times. This prevents accidental lockout where no one can access the admin panel.

- The "Delete" button is disabled when attempting to delete the last admin user
- A tooltip explains: "Cannot delete the last admin"
- To remove the final admin, first promote another user to admin, then delete
- Alternatively, use "Reset Database" in the Danger Zone to wipe everything

#### Danger Zone

Three destructive actions are available:

1. **Delete All Domains** (Admin Panel only)
   - Permanently removes all domains and their analytics data
   - Requires confirmation in a dialog
   - Does NOT delete user accounts
   - Note: To clear analytics for a single domain while keeping the domain, use "Clear All Analytics" in the domain's analytics page

2. **Clear All Analytics** (Per-domain)
   - Available in each domain's analytics page Danger Zone
   - Removes all page view data but keeps the domain
   - Useful for starting fresh with the same domain ID

3. **Reset Database**
   - Wipes ALL data including:
     - All user accounts
     - All domains and analytics
     - All pending invitations
   - Requires typing a confirmation phrase
   - Logs you out after completion
   - **This action cannot be undone**

#### Domain Access Overview

View all domains and their access counts:

- See how many users have access to each domain
- Click a domain to manage its users
- Grant or revoke access per domain

#### Debug Analytics

The debug analytics page at `/admin/debug-analytics` provides a raw view into the database for troubleshooting and verification purposes.

> **Access:** Only users with the `admin` role can access the debug analytics page.

##### Overall Database Stats

At the top of the page, you'll see an overview of your entire database:

| Stat                  | Description                                  |
| --------------------- | -------------------------------------------- |
| **Users**             | Total user accounts (with admin count shown) |
| **Invitations**       | Pending user invitations                     |
| **Password Tokens**   | Active password reset tokens                 |
| **Domains**           | Total tracked domains (public/private split) |
| **Analytics Entries** | Total page view records in database          |
| **Bot Entries**       | Analytics entries marked as bots             |

##### Domain Filter

Use the dropdown to filter analytics entries by a specific domain. Selecting "All Domains" shows entries across all tracked sites.

##### Domain Stats

When a specific domain is selected, additional statistics appear:

| Stat                | Description                            |
| ------------------- | -------------------------------------- |
| **Entries**         | Total analytics entries for the domain |
| **Unique Sessions** | Distinct visitor sessions              |
| **Bot Entries**     | Entries flagged as bots                |
| **Last 24h**        | Entries in the past 24 hours           |
| **Last 7 days**     | Entries in the past 7 days             |

##### Raw Analytics Table

The main table shows the most recent 500 analytics entries with full details:

| Column      | Description                                  |
| ----------- | -------------------------------------------- |
| **Domain**  | The tracked domain for this entry            |
| **Time**    | Timestamp of the page view                   |
| **Session** | Unique session identifier (truncated)        |
| **Page**    | URL path of the viewed page                  |
| **Country** | Visitor's country (if detected)              |
| **City**    | Visitor's city (if detected)                 |
| **Device**  | Device type (Desktop, Mobile, Tablet)        |
| **Browser** | Browser used (Chrome, Firefox, Safari, etc.) |
| **OS**      | Operating system                             |
| **Bot**     | Whether the entry was flagged as a bot       |

##### Session Color Coding

Rows are color-coded by session ID to visually group entries from the same visitor. Each unique session gets assigned a consistent color, making it easy to identify repeat visits within the data.

##### Use Cases

- Verify tracking is working correctly
- Debug bot detection issues
- Investigate unusual traffic patterns
- View raw data before aggregation
- Identify session behavior for specific visitors

---

## Domain Access Control

Whose Bean supports domain-level access control for non-admin users.

### How It Works

- **Admins**: Automatically have access to all domains
- **Non-admin users**: Only see domains they've been granted access to
- **Public domains**: Accessible to everyone (including guests)

### Granting Access

Admins can grant access from two locations:

1. **Admin Panel** → Domain Access Overview → Click domain → Add users
2. **Domain Page** → User Access section → Add users

Only non-admin users who don't already have access appear in the dropdown.

### Revoking Access

When an admin revokes a non-admin user's access:

1. The user immediately loses access to that domain
2. If viewing that domain's analytics, they're redirected to `/dashboard`
3. The domain disappears from their domain list

### Public vs Private Domains

| Visibility | Who Can View                            |
| ---------- | --------------------------------------- |
| Public     | Anyone with the link (including guests) |
| Private    | Admins + granted users only             |

Admins can toggle visibility from the domain analytics page.

### Guest Access

Unauthenticated users can view public domains:

- Access via direct link: `/dashboard/[domain-id]`
- Cannot access `/dashboard` (requires login)
- Cannot see "Back" button or "Track Your Domain" section
- Cannot modify any data

---

## Settings

Whose Bean provides a settings page at `/settings` where users can view their account information and change their password.

### Account Information

The account information card displays:

| Field            | Description                        |
| ---------------- | ---------------------------------- |
| **Email**        | Your registered email address      |
| **Role**         | Your role (admin or user)          |
| **Member Since** | Date when your account was created |

This section is read-only and updates automatically as your account details change.

### Change Password

The change password form allows you to update your password:

1. Navigate to `/settings`
2. Enter your current password
3. Enter your new password (minimum 8 characters)
4. Confirm your new password
5. Click "Update Password"

> **Note:** You must know your current password to change it. If you've forgotten your password, use the [password reset](#password-reset) feature.

---

## Password Reset

Whose Bean includes a secure password reset feature that allows users to reset their password via email.

### How It Works

1. **Request Reset**: Click "Forgot your password?" on the [login page](https://your-domain.com/login)
2. **Enter Email**: Enter your email address on the [forgot password page](https://your-domain.com/forgot-password)
3. **Check Email**: Receive a password reset link via email
4. **Set New Password**: Click the link and set a new password on the [reset password page](https://your-domain.com/reset-password/[token])

### Security Features

- **Email Enumeration Protection**: The system shows the same success message whether the email exists or not
- **Token Expiration**: Reset links expire after 1 hour
- **One-time Use**: Each reset token can only be used once
- **Password Requirements**: Minimum 8 characters required

### Email Configuration

Password reset requires SMTP configuration. Ensure you have set up:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `APP_URL` (must be your public application URL)

> **Note:** Without proper email configuration, password reset emails will not be sent.

---

## Docker Setup

### Using Docker Compose (Recommended)

1. Build and start the containers:

```bash
docker-compose up -d
```

2. The application is available at http://localhost:9500

3. To stop the containers:

```bash
docker-compose down
```

### Using Docker Directly

1. Build the image:

```bash
docker build -t whose-bean .
```

2. Run the container:

```bash
docker run -p 9500:9500 -v $(pwd)/prisma:/app/prisma whose-bean
```

> **Note:** The volume mount (`-v`) preserves your database data outside the container.

---

## Production Build

### Building the Application

```bash
npm run build
```

This creates an optimized production build.

### Starting the Production Server

```bash
npm start
```

The server runs on port 9500.

---

## Deployment

### Why a Long-Running Server Is Required

Whose Bean uses an in-memory EventBus (`src/lib/event-bus.ts`) to power real-time analytics streaming via Server-Sent Events (SSE). The EventBus maintains active subscriptions in memory and emits updates when new analytics data is received.

This architecture requires a **persistent server process** and will not work on serverless platforms, which create new isolated environments for each request.

### Supported Deployment Targets

Whose Bean works on any platform that runs a persistent Node.js process:

- **Traditional VPS**: DigitalOcean, Linode, Hetzner, etc.
- **Docker Platforms**: Railway, Render, Fly.io, Coolify
- **Self-hosted**: Run on your own server
- **Any platform** that supports long-running Node.js processes

### Not Compatible With

The following platforms do NOT support Whose Bean:

- Vercel
- Netlify
- AWS Lambda / AWS Amplify
- Cloudflare Pages / Cloudflare Workers
- Google Cloud Functions
- Azure Functions
- Any serverless or edge computing platform

### Recommended Setup

1. **Docker** is the easiest deployment method
2. Use a VPS with Docker installed (DigitalOcean, Linode, Hetzner)
3. Clone your repository, run `docker-compose up -d`
4. Set up reverse proxy (nginx, Traefik) for SSL

---

## Nginx Configuration

When deploying Whose Bean behind nginx, you need to configure nginx to handle SSL termination and properly support Server-Sent Events (SSE) used for real-time analytics updates.

### HTTP to HTTPS Redirect

```nginx
server {
    server_name your-domain.com;
    server_tokens off;

    listen 80;           # IPv4
    listen [::]:80;      # IPv6

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://your-domain.com$request_uri;
    }
}
```

### HTTPS Reverse Proxy

```nginx
server {
    server_name your-domain.com;

    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate /etc/nginx/ssl/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass              https://your-domain.com;

        # Required for Whose Bean
        proxy_http_version      1.1;
        proxy_set_header        Upgrade $http_upgrade;
        proxy_set_header        Connection 'upgrade';
        proxy_cache_bypass      $http_upgrade;

        # SSE-specific settings
        proxy_buffering         off;
        proxy_cache             off;
        proxy_read_timeout      86400;
        proxy_send_timeout      86400;

        # Necessary for processing incoming request headers
        proxy_set_header        Host $host;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $remote_addr;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_set_header        X-Forwarded-Host $server_name;
    }
}
```

### Key Settings Explained

| Setting              | Value | Purpose                                     |
| -------------------- | ----- | ------------------------------------------- |
| `proxy_http_version` | 1.1   | Required for SSE connection upgrade         |
| `proxy_buffering`    | off   | Prevents nginx from buffering SSE responses |
| `proxy_cache`        | off   | Disables caching for real-time data         |
| `proxy_read_timeout` | 86400 | Allows 24-hour connections for live updates |
| `proxy_send_timeout` | 86400 | Prevents timeout when sending data          |

> **Note:** Replace `https://your-domain.com` with your actual upstream address (e.g., `http://whose-bean:9500` if using Docker with a service name, or your container's service name).

---

## Database Configuration

### SQLite (Default)

SQLite is the default database. The database file is stored at `prisma/dev.db`.

**Setup:**

```bash
npm run db:generate
npm run db:push
```

These commands generate the Prisma client and create the database schema.

**Benefits:**

- Zero setup
- File-based (easy to backup)
- Perfect for single-server deployments

### PostgreSQL

To use PostgreSQL instead:

1. Set `USE_POSTGRES=true` in your environment
2. Update `DATABASE_URL` to your PostgreSQL connection string:

```env
USE_POSTGRES=true
DATABASE_URL="postgresql://username:password@host:5432/database"
```

3. Generate the client and create the schema:

```bash
npm run db:generate
npm run db:push
```

### Switching Databases

> **Warning:** Switching from SQLite to PostgreSQL (or vice versa) will delete all existing data. Make sure to export any important data before switching.

To switch:

1. Set `USE_POSTGRES=true` (or `false`)
2. Update `DATABASE_URL` to your new database connection string
3. Run `npm run db:generate` to regenerate the Prisma client
4. Run `npm run db:push` to create the new database schema

---

## Environment Variables Reference

| Variable                             | Description                                                               | Required                         |
| ------------------------------------ | ------------------------------------------------------------------------- | -------------------------------- |
| `DATABASE_URL`                       | Database connection string (SQLite or PostgreSQL)                         | Yes                              |
| `USE_POSTGRES`                       | Set to `true` for PostgreSQL, `false` for SQLite                          | Yes                              |
| `JWT_SECRET`                         | Secret key for JWT authentication                                         | Yes                              |
| `SMTP_HOST`                          | SMTP server hostname                                                      | For password reset & invitations |
| `SMTP_PORT`                          | SMTP server port (usually 587 or 465)                                     | For password reset & invitations |
| `SMTP_USER`                          | SMTP username                                                             | For password reset & invitations |
| `SMTP_PASS`                          | SMTP password                                                             | For password reset & invitations |
| `SMTP_FROM`                          | Sender email address                                                      | For password reset & invitations |
| `APP_URL`                            | Your application's public URL                                             | Yes                              |
| `ALLOWED_ORIGINS`                    | Comma-separated list of allowed origins for server actions (default: `*`) | No                               |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Encryption key for server actions (avoids deployment errors)              | No (recommended for production)  |
| `ANALYTICS_BOT_HANDLING`             | Analytics bot handling mode: `filter` (default), `mark`, or `log`         | No                               |

### Server Actions Encryption Key

The `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` variable prevents errors when deploying to non-Vercel platforms. Without it, you may see errors like:

```
Error: Failed to find Server Action "x". This request might be from an older or newer deployment.
```

**Generate a key:**

```bash
openssl rand -base64 32
```

For more details, see [Next.js Server Actions documentation](https://nextjs.org/docs/messages/failed-to-find-server-action).

### Bot Handling Modes

The `ANALYTICS_BOT_HANDLING` variable controls how bots are handled in your analytics data:

| Mode     | Behavior                                                            |
| -------- | ------------------------------------------------------------------- |
| `filter` | (Default) Bots are completely excluded from all analytics data      |
| `mark`   | Bots are included in analytics but flagged so you can identify them |
| `log`    | Bot requests are logged but not counted in any analytics metrics    |

Filtering bots provides cleaner analytics by excluding known search engine crawlers, headless browsers, and other automated traffic.

### Example Production Configuration

```env
DATABASE_URL="postgresql://analytics:secure_password@db:5432/whosebean"
USE_POSTGRES=true
JWT_SECRET="extremely-long-random-secret-string-min-32-chars"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Whose Bean <noreply@yourdomain.com>"
APP_URL="https://analytics.yourdomain.com"
# ALLOWED_ORIGINS="*.example.com,localhost"
ANALYTICS_BOT_HANDLING=filter
```

> **Security:** Never commit `.env.local` to version control. Add it to your `.gitignore` file.

---

## Available Scripts

| Script                     | Description                           |
| -------------------------- | ------------------------------------- |
| `npm run dev`              | Start development server on port 9500 |
| `npm run build`            | Build the application for production  |
| `npm run start`            | Start production server on port 9500  |
| `npm run lint`             | Run ESLint code analysis              |
| `npm run lint:fix`         | Fix ESLint issues automatically       |
| `npm run format`           | Format code with Prettier             |
| `npm run test`             | Run tests in watch mode               |
| `npm run test:run`         | Run tests once                        |
| `npm run db:generate`      | Generate Prisma client                |
| `npm run db:push`          | Push schema to database               |
| `npm run db:migrate`       | Run database migrations               |
| `npm run db:clear-invites` | Clear expired invitations             |

---

## Troubleshooting

### Port 9500 Already in Use

If you get an error about port 9500 being in use:

```bash
# Find the process using the port
lsof -i :9500

# Kill the process (replace PID with the actual process ID)
kill -9 <PID>
```

Or start on a different port:

```bash
PORT=3000 npm run dev
```

### Database Connection Errors

- **SQLite**: Ensure the `prisma` directory exists and is writable
- **PostgreSQL**: Verify connection string, ensure database exists, check credentials

### Tracking Script Not Working

1. **Check the domain ID**: Ensure it matches your dashboard exactly
2. **Check the script URL**: Must point to your Whose Bean server
3. **Check browser console**: Look for JavaScript errors
4. **Verify data is sent**: Network tab should show requests to `/api/analytics`

### Real-time Updates Not Working

- Refresh the page to reconnect
- Check your browser supports Server-Sent Events
- Ensure no browser extensions blocking the connection
- Check server logs for connection errors

### Login/Registration Issues

- Clear browser cookies and try again
- Check that `JWT_SECRET` is set in your environment
- Verify the database is accessible

### Password Reset Issues

**Email not received:**

- Check spam/junk folder
- Verify SMTP configuration is correct
- Ensure `APP_URL` matches your public URL
- Check server logs for email sending errors

**Reset link expired:**

- Request a new password reset link
- Links expire after 1 hour for security

**Reset link invalid:**

- Request a new password reset link
- Each link can only be used once
- Ensure you're using the complete link from the email

---

## Technology Stack

- **Framework**: Next.js (App Router with React Server Components)
- **Language**: TypeScript
- **Database**: SQLite (default) or PostgreSQL
- **ORM**: Prisma
- **Data Fetching**: @tanstack/react-query
- **Charts**: Recharts
- **Maps**: react-simple-maps
- **UI Components**: shadcn (Radix UI + Tailwind CSS)
- **Data Tables**: @tanstack/react-table
- **State Management**: Zustand
- **Animations**: Framer Motion + tw-animate-css
- **Icons**: Lucide React
- **Validation**: Zod
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer
- **Real-time**: Server-Sent Events (SSE)
- **Theme Management**: next-themes
- **Testing**: Vitest
- **Code Quality**: ESLint + Prettier

---

## License

MIT
