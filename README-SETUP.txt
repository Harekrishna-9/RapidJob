RAPID JOB USER LOGIN / SIGNUP SYSTEM

FILES TO UPLOAD
- index.html (updated only with auth SDK, auth.css/auth.js and header login widget)
- style.css (your original file, unchanged)
- script.js (your original file, unchanged)
- auth.css
- auth.js
- login.html
- signup.html
- forgot-password.html
- user-dashboard.html
- profile.html

FIREBASE SETUP
1. Firebase Console > Authentication > Sign-in method.
2. Enable Email/Password.
3. Authentication > Settings > Authorized domains:
   add harekrishna-9.github.io if it is not already present.
4. Realtime Database > Rules:
   review and publish firebase-database-rules.json.
5. Storage > Rules:
   review and publish firebase-storage-rules.txt.
6. For your own admin profile, manually change:
   users/YOUR_UID/role = "Super Admin"

IMPORTANT
- GitHub Pages supports Firebase Authentication.
- User profiles are saved at users/{uid}.
- Admin User Manager can later read this users node.
- Deleting a Firebase Authentication account from admin requires a secure backend/Admin SDK.
  This package creates an accountDeleteRequests entry for admin review instead.
- The existing homepage layout, post rendering, Firebase posts and tools code were not rewritten.
