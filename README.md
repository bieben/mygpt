# My GPT
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  
And it's deployed on Heroku. Just click to see!
### [My GPT](https://my-gpt-client-aa4f34b370ff.herokuapp.com/)



## Overview

This project is a chat application that allows users to sign up and sign in using email and Google authentication. Users can interact with a chatbot powered by OpenAI's API, and their conversation history is saved in Firebase Firestore.

## Features

1. **User Authentication**
   - Email sign-up and sign-in with email verification.
   - Google sign-in.

2. **Chat Interface**
   - Real-time messaging interface with a chatbot.
   - User-friendly design.

3. **Conversation Functionality**
   - Save and retrieve conversation history.
   - View past conversations on the user dashboard.

4. **OpenAI Integration**
   - Chatbot responses generated using OpenAI API.
   - The engine is gpt-3.5-turbo.

5. **Documentation**
   - Comprehensive setup and deployment instructions.

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.
- Firebase project set up with Firestore and Authentication enabled.
- OpenAI API key.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bieben/mygpt.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd your-repository
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file in the root directory and add your Firebase and OpenAI API keys:**

   ```plaintext
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   OPENAI_API_KEY=your_openai_api_key
   ```

### Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or use an existing one.
3. Enable **Email/Password** and **Google** sign-in methods in the Authentication section.
4. Set up Firestore Database with the following rules to secure data access:

   ```plaintext
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. Since it might take a while to sign up for an account, here I post my apiKey for convenience. Replace this config variable in `/src/firebase/firebase.js`.
   ```javascript
   const firebaseConfig = {
    apiKey: "AIzaSyC4AqQhFknL1_FsrXec8REP1PFei2OToxM",
    authDomain: "mygpt-9c820.firebaseapp.com",
    projectId: "mygpt-9c820",
    storageBucket: "mygpt-9c820.appspot.com",
    messagingSenderId: "304980670815",
    appId: "1:304980670815:web:c7b8d0c6269f09fad8deea",
    measurementId: "G-SM3BW86XLZ"
   };
   ```

### Running the Application

1. **Start the development server:**
   At the root directory, start the npm to run backend server.

   ```bash
   npm start
   ```
2. Run the client side:
   ```bash
   cd client
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Deployment

1. **Build the project for production:**

   ```bash
   npm run build
   ```

2. **Deploy to Heroku:**

   - **Install the Heroku CLI:**

     ```bash
     npm install -g heroku
     ```

   - **Login to Heroku:**

     ```bash
     heroku login
     ```

   - **Create a new Heroku application:**

     ```bash
     heroku create your-app-name
     ```

   - **Initialize a Git repository (if not already done):**

     ```bash
     git init
     ```

   - **Add and commit your code:**

     ```bash
     git add .
     git commit -m "Initial commit"
     ```

   - **Set the buildpack for Create React App:**

     ```bash
     heroku buildpacks:set mars/create-react-app
     ```

   - **Push your code to Heroku:**

     ```bash
     git push heroku master
     ```

   - **Open your Heroku app in the browser:**

     ```bash
     heroku open
     ```

   - **Configure environment variables in Heroku:**

     Go to the Heroku dashboard, navigate to your application, and set the environment variables under the "Settings" tab. Click "Reveal Config Vars" and add the following:

     ```plaintext
     FIREBASE_API_KEY=your_api_key
     FIREBASE_AUTH_DOMAIN=your_auth_domain
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_STORAGE_BUCKET=your_storage_bucket
     FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     FIREBASE_APP_ID=your_app_id
     OPENAI_API_KEY=your_openai_api_key
     ```

## Additional Information

### Secure Environment Variables

Ensure you do not expose your API keys and other sensitive information. Use environment variables for this purpose and do not commit your `.env` file to version control.

### Project Structure

The project follows a standard React structure with components organized under the `src` directory. Key files include:

- `src/firebase/firebase.js`: Firebase configuration and utility functions.
- `src/components/Login.js`: User authentication component.
- `src/components/Chat.js`: Chat interface component.
- `src/contexts/StateProvider.js`: Context API setup for global state management.

### Troubleshooting

- Ensure all Firebase configurations are correct.
- Check if the OpenAI API key is valid and has the necessary permissions.
- Refer to the [Firebase Documentation](https://firebase.google.com/docs) and [OpenAI Documentation](https://beta.openai.com/docs) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, please open an issue in the [GitHub repository](https://github.com/bieben/mygpt/issues).

