
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();
exports.rejectRequest = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({success: false, message: "Only POST method allowed"});
  }

  const {adminUid, targetUid} = req.body;

  if (!adminUid || !targetUid) {
    return res.status(400).json({success: false, message: "Missing adminUid or targetUid"});
  }

  const adminDoc = await db.collection("admins").doc(adminUid).get();
  if (!adminDoc.exists) {
    return res.status(403).json({success: false, message: "Not admin"});
  }

  const reqDoc = await db.collection("Requests").doc(targetUid).get();
  if (!reqDoc.exists) {
    return res.status(404).json({success: false, message: "Request not found"});
  }

  await db.collection("Requests").doc(targetUid).delete();

  return res.status(200).json({
    success: true,
    message: "Request rejected successfully",
  });
});

// exports.rejectCounsellorRequest = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     return {success: false, message: "User not authenticated"};
//   }

//   const adminUid = context.auth.adminUid;
//   const targetUid = data.targetUid;

//   if (!targetUid) {
//     return {success: false, message: "Missing uid"};
//   }


//   const adminDoc = await db.collection("admins").doc(adminUid).get();
//   if (!adminDoc.exists) {
//     return {success: false, message: "You are not an admin"};
//   }

//   const reqDoc = await db.collection("Requests").doc(targetUid).get();
//   if (!reqDoc.exists) {
//     return {success: false, message: "Request not found"};
//   }

//   await db.collection("Requests").doc(targetUid).delete();

//   return {success: true, message: "Request rejected successfully"};
// });

