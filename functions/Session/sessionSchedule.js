const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.scheduleSession = functions.https.onRequest(async (req, res) => {
  try {
    const {counsellorUID, sessionID, status, scheduledAt} = req.body;

    if (!counsellorUID || !sessionID || !status || !scheduledAt) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const sessionRef = db.collection("Sessions").doc(sessionID);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.json({success: false, message: "Session not found"});
    }

    const session = sessionSnap.data();

    if (session.status !== "pending") {
      return res.json({
        success: false,
        message: "Only pending sessions can be scheduled",
      });
    }

    if (session.counsellorID !== counsellorUID) {
      return res.json({
        success: false,
        message: "Not authorized (different counsellor)",
      });
    }

    await sessionRef.update({
      status,
      scheduledAt,
    });


    return res.json({
      success: true,
      message: "Session scheduled successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
});

// exports.createSessionRequest = functions.https.onCall(async (request) => {
//   try {
//     const {userUID, counsellorID} = request.data;

//     if (!userUID || !counsellorID) {
//       return {success: false, message: "All fields are required"};
//     }


//     const userSnap = await db.collection("users").doc(userUID).get();
//     if (!userSnap.exists) {
//       return {success: false, message: "User not found"};
//     }

//     const cSnap = await db.collection("counsellors").doc(counsellorID).get();
//     if (!cSnap.exists) {
//       return {success: false, message: "Counsellor not found"};
//     }

//     const requestRef = db.collection("sessions").doc();
//     const sessionData = {
//       sessionId: requestRef.id,
//       userID: userUID,
//       counsellorID,
//       status: "pending",
//     };

//     await requestRef.set(sessionData);

//     return {success: true, message: "Session Request sent successfully"};
//   } catch (err) {
//     return {
//       success: false,
//       message: err.message || "Something went wrong",
//     };
//   }
// });

