const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();
exports.submitSessionRequest = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({success: false, message: "Only POST allowed"});
  }

  const {userID, counsellorID} = req.body;

  if (!userID || !counsellorID) {
    return res.status(400).json({
      success: false,
      message: "userID & counsellorID are required",
    });
  }

  const userDoc = await db.collection("Users").doc(userID).get();
  if (!userDoc.exists) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const counsellorDoc = await db.collection("Counsellors").doc(counsellorID).get();
  if (!counsellorDoc.exists) {
    return res.status(404).json({
      success: false,
      message: "Counsellor not found",
    });
  }

  const sessionRef = await db.collection("Sessions").add({
    userID,
    counsellorID,
    status: "pending",
    scheduledAt: null,
  });


  return res.status(200).json({
    success: true,
    message: "Session Request sent successfully",
    sessionID: sessionRef.id,
  });
});

// exports.submitSessionRequest = functions.https.onCall(async (data, context) => {

//   if (!context.auth) {
//     return {success: false, message: "User not authenticated"};
//   }

//   const userID = data.userID;
//   const counsellorID = data.counsellorID;

//   if (!userID || !counsellorID) {
//     return {success: false, message: "userID & counsellorID are required"};
//   }


//   const userDoc = await db.collection("Users").doc(userID).get();
//   if (!userDoc.exists) {
//     return {success: false, message: "User does not exist"};
//   }


//   const counsellorDoc = await db.collection("Counsellors").doc(counsellorID).get();
//   if (!counsellorDoc.exists) {
//     return {success: false, message: "Counsellor does not exist"};
//   }

//   const session = await db.collection("Sessions").add({
//     userID,
//     counsellorID,
//     status: "pending",
//     scheduledAt: null,
//   });


//   return {
//     success: true,
//     message: "Session Request sent successfully",
//     sessionID: session.id,
//   };
// });
