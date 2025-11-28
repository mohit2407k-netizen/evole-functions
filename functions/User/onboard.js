const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.onboardUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return {success: false, message: "User not authenticated"};
  }

  const uid = context.auth.uid;

  const required = [
    "name",
    "age",
    "gender",
    "phone",
    "currentStatus",
    "qualification",
    "stream",
    "yearOfCompletion",
  ];

  for (const field of required) {
    if (!data[field]) {
      return {success: false, message: "All Basic Info fields are required"};
    }
  }

  await db.collection("Users").add({
    uid: uid,
    ...data,
  });

  return {success: true, message: "User onboarded successfully"};
});

// exports.onboardUser = functions.https.onRequest(async (req, res) => {
//   try {
//     if (req.method !== "POST") {
//       return res.status(405).json({success: false, message: "Only POST method allowed"});
//     }

//     const data = req.body;

//     const required = [
//       "name",
//       "age",
//       "gender",
//       "phone",
//       "currentStatus",
//       "qualification",
//       "stream",
//       "yearOfCompletion",
//     ];

//     for (const field of required) {
//       if (!data[field]) {
//         return res.status(400).json({success: false, message: `Missing field: ${field}`});
//       }
//     }


//     const docRef = await admin.firestore().collection("Users").add(data);


//     await docRef.update({uid: docRef.id});

//     return res.status(200).json({
//       success: true,
//       message: "User onboarded successfully",
//       uid: docRef.id,
//     });
//   } catch (error) {
//     console.error("Error in onboardUser:", error);
//     return res.status(500).json({success: false, message: "Internal Server Error"});
//   }
// });
