# 🎯 Crowd-sourced Fitness Challenge App

This app enables users to create and participate in community-driven fitness challenges. Users can engage in challenges, chat with others, earn badges, and track progress all within a cross-platform mobile app.

## Features

### Key Objectives:
- **🔐 User Accounts**: Secure login and registration for users.
- **🏋️‍♂️ Challenge Creation**: Create fitness challenges with goals, descriptions, tags, and badges.
- **🔎 Challenge Participation**: Search challenges by tags, view favorites, and complete goals.
- **🏅 Badges and Wall of Fame**: Earn badges and be featured on the Wall of Fame for completing challenges.

## 🛠️ Technologies

- **Frontend**: React Native with Expo, TypeScript, Redux
- **Backend**: Google Cloud Functions
- **Database**: Supabase PostgreSQL for handling structured relational data storage with real-time features.
- **Authentication**: Supabase Authentication
- **Real-time Chat**: Firebase Firestore
- **Testing**: Jest
- **Project Management**: Trello, GitHub
- **Communication**: Discord

---

## 🚀 Backend Setup

### Steps to Set Up the Backend Locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/paolacernada/Crowd-sourced-Fitness-Challenge-App.git
   cd Crowd-sourced-Fitness-Challenge-App
   ```

2. Create a `.env.server` file at the root of the `test_backend` folder and add the `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

3. In a new terminal window, navigate to the `test_backend` folder:
   ```bash
   cd test_backend
   ```

4. Install dependencies and run the backend:
   ```bash
   npm install
   npm start
   ```
   * This installs the dependencies and runs the backend.
   * **Keep this terminal open** to continue running the backend.

---

## 📱 Frontend Setup

### Steps to Set Up the Frontend Locally:

1. Install Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```

2. Create a `.env.frontend` file at the root of the `react_native_frontend` folder and add the `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

3. In a new terminal window, navigate to the `react_native_frontend` folder:
   ```bash
   cd react_native_frontend
   ```

4. Install dependencies and run the frontend:
   ```bash
   npx expo install
   npx expo start
   ```

   *If your device is having network issues, try adding the `--tunnel` flag.*

5. Install Expo Go on your mobile device:
   - **Android**: [Expo Go on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US)
   - **iOS**: [Expo Go on the App Store](https://apps.apple.com/us/app/expo-go/id982107779)

6. Scan the QR code generated by Expo with your device to preview the app.

---

## 🔄 Branch Protection and Pull Requests

1. Create a new branch:
   ```bash
   git checkout -b <branch-name>
   ```

2. Fix linting issues:
   ```bash
   npm run lint:fix

3. Push the branch:
   ```bash
   git push origin <branch-name>
   ```

4. Open a pull request on GitHub. GitHub Actions will automatically check for linting errors before merging.

5. Upon review, the pull request will be approved and merged to the `main` branch, or revisions will be requested.

---

# ⚡ Supabase Edge Functions

### Installation

1. Install Supabase CLI, following instructions to add it to your PATH:
   ```bash
   brew install supabase/tap/supabase
   ```

2. Upgrade Supabase CLI (if needed):
   ```bash
   brew upgrade supabase
   ```

3. Log into Supabase. If you see an error (WSL may cause one), try adding the `--no-browser` flag:
   ```bash
   supabase login
   ```

4. Initialize the Supabase project in the root folder:
   ```bash
   supabase init
   ```

5. Start the Supabase service:
   ```bash
   supabase start
   ```

# 🧪 Testing

1. Run the function locally for testing:
   ```bash
   supabase functions serve exampleFunction
   ```

2. Deploy the function to Supabase:
   ```bash
   supabase functions deploy functionName
   ```

   - Deployment URL can be found in the terminal output after deployment.

3. Update the frontend to use the deployed Edge Function URL instead of local routes.

# 📚 Explore the Docs

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals or explore advanced topics with [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Create a project that runs on Android, iOS, and the web.
- [Supabase documentation](https://supabase.com/docs): Tutorials, APIs, and platform resources.

---
