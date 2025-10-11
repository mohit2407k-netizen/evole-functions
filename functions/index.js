const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.checkLogin = functions.https.onRequest(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    res.send("User not logged in");
    return;
  }

  try {
    await admin.auth().verifyIdToken(token.replace("Bearer ", ""));
    res.send("User is logged in");
  } catch (e) {
    res.send("Invalid");
  }
});
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// admin.initializeApp();
// const db = admin.firestore();

// exports.onboardUser = functions.https.onRequest(async (req, res) => {
//   try {
//     // ✅ Allow only POST requests
//     if (req.method !== "POST") {
//       return res.status(405).send("Only POST requests are allowed");
//     }

//     const {
//       email,
//       name,
//       phone,
//       dob,
//       gender,
//       currentStatus,
//       highestQualification,
//       field,
//       yearOfCompletion,
//     } = req.body;

//     if (!email) {
//       return res.status(400).json({message: "Email is required!"});
//     }

//     // 🔍 Check if user already exists
//     const userRef = db.collection("users").doc(email);
//     const doc = await userRef.get();

//     // ⚙ Convert date fields to proper Firestore types
//     let dobTimestamp = null;
//     if (dob) {
//       dobTimestamp = admin.firestore.Timestamp.fromDate(new Date(dob));
//     }

//     // 🧾 Prepare user data
//     const userData = {
//       basicInfo: {
//         name: name || "",
//         phone: phone || "",
//         dob: dobTimestamp || null,
//         gender: gender || "",
//       },
//       educationInfo: {
//         currentStatus: currentStatus || "",
//         highestQualification: highestQualification || "",
//         field: field || "",
//         yearOfCompletion: yearOfCompletion ? Number(yearOfCompletion) : null,
//       },
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     // 🧠 Condition:
//     // If user already exists → do nothing
//     // If user doesn't exist → save new user
//     if (doc.exists) {
//       return res.json({
//         message: "User already logged in. No action taken.",
//         user: doc.data(),
//       });
//     } else {
//       await userRef.set(userData);
//       return res.json({
//         message: "New user onboarded successfully!",
//         user: userData,
//       });
//     }
//   } catch (error) {
//     console.error("❌ Error:", error);
//     res.status(500).json({message: "Server error", error: error.message});
//   }
// });
// exports.getMessage = functions.https.onRequest((req, res) => {
//   res.json({
//     status: "success",
//     message: "Serverless function executed ",
//   });
// });

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
