const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const db = admin.firestore();

exports.onboardUser = onCall(async (request) => {
  console.log("Context auth:", request.auth);

  if (!request.auth) {
    return { success: false, message: "User not authenticated" };
  }

  const uid = request.auth.uid;
  const data = request.data;

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
      return { success: false, message: `Missing field: ${field}` };
    }
  }

  await db.collection("Users").add({
    uid: uid,
    ...data,
  });

  return { success: true, message: "User onboarded successfully" };
});
