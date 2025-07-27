# 🏆 Hospitality Recognition Platform

A modern employee recognition and rewards platform designed specifically for the hospitality industry. This application enables employees to recognize their colleagues' achievements, earn points, and redeem rewards while providing administrators with comprehensive analytics and management tools.

## ✨ Features

### 🎯 Employee Recognition
- **Peer-to-Peer Recognition**: Employees can recognize colleagues for their contributions
- **Recognition Categories**: Teamwork, Innovation, Excellence, and Customer Service
- **Points System**: Earn points for recognitions and achievements
- **Kudos System**: Add emoji reactions to recognitions
- **Real-time Feed**: View all recognitions in a dynamic timeline

### 🎁 Rewards & Redemptions
- **Reward Catalog**: Browse available rewards across different categories
- **Point Redemption**: Use earned points to redeem rewards
- **Reward Suggestions**: Employees can suggest new rewards
- **Voting System**: Vote on reward suggestions from colleagues

### 📊 Analytics Dashboard
- **Engagement Metrics**: Track recognition activity and participation
- **Performance Insights**: Analyze top performers and departments
- **Time-based Analytics**: View data for different time periods
- **Department Comparisons**: Compare performance across teams

### 👥 User Management
- **Profile Management**: Update personal information and avatars
- **Points Tracking**: Monitor personal point balance and history
- **Notification System**: Stay updated on new recognitions and rewards

### 🔧 Administrative Tools
- **User Management**: Administer user accounts and permissions
- **Recognition Types**: Configure recognition categories and point values
- **Reward Management**: Create and manage reward offerings
- **Analytics**: Comprehensive reporting and insights

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with React 18
- **UI Framework**: Material-UI (MUI) with custom theming
- **Styling**: Tailwind CSS
- **Authentication**: Keycloak SSO
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Emoji Support**: Emoji Mart & Emoji Picker React
- **Notifications**: Notistack

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Keycloak server running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hospitality-recognition.git
   cd hospitality-recognition
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Keycloak**
   - Create a new realm called `employee-recognition`
   - Create a client called `employee-recognitions`
   - Configure the client settings for your domain

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
hospitality-recognition/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── (rewards)/         # Rewards routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── recognition/      # Recognition components
│   └── rewards/          # Rewards components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── auth/            # Authentication utilities
│   ├── types/           # TypeScript type definitions
│   └── utils/           # General utilities
└── styles/              # Global styles
```

## 🔐 Authentication

This application uses Keycloak for Single Sign-On (SSO) authentication. Users are required to log in through the Keycloak portal before accessing the application.

### Keycloak Configuration

- **Realm**: `employee-recognition`
- **Client ID**: `employee-recognitions`
- **URL**: `http://localhost:8080`

## 🎨 Features in Detail

### Recognition System
- Create recognitions with custom messages and emoji reactions
- Categorize recognitions by type (Teamwork, Innovation, Excellence, Customer Service)
- Award points based on recognition type
- Pin important recognitions for extended visibility

### Rewards System
- Browse available rewards with point costs
- Suggest new rewards for consideration
- Vote on reward suggestions from colleagues
- Redeem points for rewards

### Analytics & Reporting
- View engagement metrics and performance insights
- Filter data by time periods (Week, Month, Year)
- Compare department performance
- Track top performers and recognition trends

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=employee-recognition
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=employee-recognitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/yourusername/hospitality-recognition/issues) page
2. Create a new issue with detailed information about your problem
3. Include steps to reproduce the issue

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Material-UI](https://mui.com/)
- Authentication powered by [Keycloak](https://www.keycloak.org/)
- Emoji support from [Emoji Mart](https://github.com/missive/emoji-mart)

---

**Made with ❤️ for the hospitality industry**
