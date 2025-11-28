const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();


exports.createCounsellorRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return {success: false, message: "User not authenticated"};
  }

  const uid = context.auth.uid;

  const user = await db.collection("Users").doc(uid).get();
  if (!user.exists) {
    return {success: false, message: "User not found"};
  }

  const required = [
    "basicDetail",
    "qualification",
    "counsellingDomain",
    "availability",
    "approach",
  ];

  for (const field of required) {
    if (!data[field]) {
      return {success: false, message: `Missing field: ${field}`};
    }
  }

  await db.collection("Requests").doc(uid).set({
    ...data,
  });

  return {success: true, message: "Request created successfully"};
});
// exports.createCounsellorRequest = functions.https.onRequest(async (req, res) => {
//   try {
//     if (req.method !== "POST") {
//       return res.status(405).json({success: false, message: "Only POST method allowed"});
//     }

//     const data = req.body;

//     const uid = data.uid;
//     if (!uid) {
//       return res.status(400).json({success: false, message: "uid is required"});
//     }

//     const required = [
//       "basicDetail",
//       "qualification",
//       "counsellingDomain",
//       "availability",
//       "approach",
//     ];

//     for (const field of required) {
//       if (!data[field]) {
//         return res.status(400).json({
//           success: false,
//           message: `Missing field: ${field}`,
//         });
//       }
//     }

//     const user = await db.collection("Users").where("uid", "==", uid).get();
//     if (user.empty) {
//       return res.status(404).json({success: false, message: "User not found"});
//     }

//     const requestRef = await db.collection("Requests").add({
//       uid: uid,
//       ...data,
//     });

//     await requestRef.update({requestId: requestRef.id});

//     return res.status(200).json({
//       success: true,
//       message: "Counsellor request created successfully",
//       requestId: requestRef.id,
//     });
//   } catch (error) {
//     console.error("Error in createCounsellorRequest:", error);
//     return res.status(500).json({success: false, message: "Internal Server Error"});
//   }
// });
