// admin.js
import admin from "firebase-admin";
import serviceAccount from "../mygpt-9c820-firebase-adminsdk-otf3z-f8efcf71da.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const setAdmin = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin privileges granted to user ${uid}`);
  } catch (error) {
    console.error("Error setting admin claim: ", error);
  }
};
