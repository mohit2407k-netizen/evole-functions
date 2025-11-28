
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.approveCounsellorRequest = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({success: false, message: "Use POST method"});
    }

    const adminUid = req.body.adminUid;
    const targetUid = req.body.targetUid;

    if (!adminUid || !targetUid) {
      return res.status(400).json({success: false, message: "Missing adminUid or uid"});
    }

    const adminDoc = await db.collection("admins").doc(adminUid).get();
    if (!adminDoc.exists) {
      return res.status(403).json({success: false, message: "Not admin"});
    }

    const reqDoc = await db.collection("Requests").doc(targetUid).get();
    if (!reqDoc.exists) {
      return res.status(404).json({success: false, message: "Request not found"});
    }

    const reqData = reqDoc.data();

    const newCounsellor = await db.collection("Counsellors").add({
      uid: targetUid,
      ...reqData,
      approvedBy: adminUid,
    });

    await newCounsellor.update({counsellorId: newCounsellor.id});
    await db.collection("requests").doc(targetUid).delete();

    return res.status(200).json({
      success: true,
      message: "Counsellor request approved successfully",
      counsellorId: newCounsellor.id,
    });
  } catch (err) {
    console.error("Approve Error:", err.message);
    return res.status(500).json({success: false, message: "Internal Server Error"});
  }
});


// exports.approveCounsellorRequest = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     return {success: false, message: "Not logged in"};
//   }

//   const adminUid = context.auth.uid;
//   const targetUid = data.uid;

//   const adminDoc = await db.collection("admins").doc(adminUid).get();
//   if (!adminDoc.exists) {
//     return {success: false, message: "Not admin"};
//   }

//   const reqDoc = await db.collection("Requests").doc(targetUid).get();
//   if (!reqDoc.exists) {
//     return {success: false, message: "Request not found"};
//   }

//   const reqData = reqDoc.data();

//   await db.collection("Counsellors").doc(targetUid).set(reqData);
//   await db.collection("Requests").doc(targetUid).delete();

//   return {success: true, message: "Approved"};
// });


