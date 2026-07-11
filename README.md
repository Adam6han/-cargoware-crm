# CargoWare CRM — Event Tracking System

A modern, open-source CRM event tracking module designed for international logistics and freight forwarding operations. Built as a prototype for the [CargoWare](https://www.cargoware.com) SaaS platform, this project demonstrates how sales teams can manage customer relationships, track interactions, and evaluate performance through structured event logging.

![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![Ant Design](https://img.shields.io/badge/Ant%20Design-6-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Live Demo

**[→ Open Live Demo](https://cargoware-crm.pages.dev)**

## ✨ Features

### Customer Management
- Customer directory with search, filtering by tier (A/B/C/D), status, and account manager
- Detailed customer profiles with contact info, industry tags, cooperation history, and notes
- Real-time statistics dashboard showing customer distribution and engagement metrics

### Event Tracking (Core Module)
- **7 event types**: Phone calls, online meetings, on-site visits, emails, product demos, business negotiations, and others
- **4 outcome labels**: Positive progress, needs follow-up, requires attention, at risk
- Timeline view with full CRUD operations — add, edit, filter events per customer
- Next-action planning with deadline tracking for each interaction

### KPI Dashboard
- Automated sales performance scoring based on event tracking data
- Multi-dimensional scoring: frequency (40pts) + positive rate (30pts) + customer coverage (15pts) + time investment (15pts)
- Team ranking with visual breakdowns by event type
- Configurable time period filters (weekly, monthly, quarterly, all-time)

### UX & Architecture
- Enterprise SaaS design language — dark sidebar navigation with light content area
- Responsive layout built with Ant Design 6 component library
- Client-side data persistence via LocalStorage (zero backend dependency)
- Pre-loaded with realistic freight forwarding industry mock data

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| UI Library | Ant Design 6 + @ant-design/icons |
| Routing | React Router 7 |
| Date Handling | dayjs |
| Data Layer | LocalStorage (client-side) |
| Deployment | Cloudflare Pages + Vercel |
| Linting | Oxlint |

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Adam6han/cargoware-crm.git
cd cargoware-crm

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   └── Layout.jsx          # App shell — sidebar, header, navigation
├── pages/
│   ├── Dashboard.jsx       # Overview with stats & recent activity
│   ├── CustomerList.jsx    # Customer directory with filters & CRUD
│   ├── CustomerDetail.jsx  # Customer profile + event timeline
│   ├── EventsPage.jsx      # Global event feed with filtering
│   └── KPIDashboard.jsx    # Sales performance scoring & rankings
├── data/
│   └── mockData.js         # Seed data (customers, events, sales team)
├── utils/
│   └── storage.js          # LocalStorage abstraction layer
├── App.jsx                 # Router configuration & theme
├── main.jsx                # Entry point
└── index.css               # Global styles & scrollbar customization
```

## 🎯 Design Philosophy

This prototype was built with a **product-first approach** rather than a feature-checklist mindset:

1. **Event tracking as the core interaction** — In freight forwarding, customer relationships drive revenue. The ability to log, recall, and act on every interaction (calls, meetings, visits) is what separates effective CRM adoption from shelf-ware.

2. **KPI derived from behavior, not just outcomes** — The scoring system evaluates effort quality (positive rate), breadth (customer coverage), depth (time invested), and consistency (frequency), rather than simply counting activities.

3. **Industry-contextual mock data** — All sample data reflects real logistics scenarios: ocean freight rate negotiations, China-Europe railway capacity inquiries, FBA first-mile services, and quarterly contract renewals. This demonstrates domain understanding beyond generic CRUD.

4. **Code as prototype** — Using React + Ant Design instead of static wireframes means interaction logic is testable, and the codebase itself serves as a reference implementation for engineering handoff.

## 🌐 Deployment

This project is deployed on two platforms for global accessibility:

- **Cloudflare Pages** (primary): [cargoware-crm.pages.dev](https://cargoware-crm.pages.dev)
- **Vercel** (mirror): [cargoware-crm.vercel.app](https://cargoware-crm.vercel.app)

Both deployments are automatically updated on push to `main`.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [CargoWare](https://www.cargoware.com) platform by WallTech Co., Ltd.
- UI components by [Ant Design](https://ant.design)
- Built with [Vite](https://vite.dev) and [React](https://react.dev)
