const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

const formsMap = {
  quick: ["basicinfo", "academic_info", "hobbies", "quiz"],
  deep: [
    "basicinfo",
    "academic_info",
    "hobbies",
    "quiz",
    "background_detail",
    "lifestyle",
  ],
};

exports.submitCounsellingForms = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Only POST allowed",
      });
    }

    const {uid, mode, forms} = req.body;

    if (!uid || !mode || !forms) {
      return res.status(400).json({
        success: false,
        message: "uid, mode, forms are required",
      });
    }

    if (mode !== "quick" && mode !== "deep") {
      return res.status(400).json({
        success: false,
        message: "Invalid mode. Allowed: quick, deep",
      });
    }

    const requiredForms = formsMap[mode];

    for (const f of requiredForms) {
      if (!forms[f]) {
        return res.status(400).json({
          success: false,
          message: `Missing required form: ${f}`,
        });
      }
    }

    const batch = db.batch();
    const userRef = db.collection("Users").doc(uid);

    requiredForms.forEach((formName) => {
      const formRef = userRef.collection("forms").doc(formName);
      batch.set(formRef, forms[formName]);
    });

    batch.set(
        userRef,
        {
          counsellingMode: mode,
        },
        {merge: true},
    );

    await batch.commit();

    return res.status(200).json({
      success: true,
      message: "Forms saved successfully",
      mode: mode,
      savedForms: requiredForms,
    });
  } catch (err) {
    console.error("Error:", err);

    if (err.code === "ECONNRESET") {
      return res.status(500).json({
        success: false,
        message: "Connection reset. Please try again.",
        errorCode: "ECONNRESET",
      });
    }
  }
});

// exports.submitCounsellingForms = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     return {success: false, message: "User not authenticated"};
//   }

//   const uid = context.auth.uid;

//   const mode = data.mode;
//   const forms = data.forms;

//   if (mode !== "quick" && mode !== "deep") {
//     return {success: false, message: "Invalid mode. Use quick or deep"};
//   }

//   const requiredForms = {
//     deep: ["basicinfo", "academic_info", "hobbies", "quiz", "background_detail", "lifestyle"],
//     quick: ["basicinfo", "academic_info", "hobbies", "quiz"],
//   };

//   const needed = requiredForms[mode];

//   for (const f of needed) {
//     if (!forms[f]) {
//       return {
//         success: false,
//         message: `Missing required form: ${f}`,
//       };
//     }
//   }

//   const batch = admin.firestore().batch();
//   const userRef = admin.firestore().collection("Users").doc(uid);

//   needed.forEach(formName => {
//     const formRef = userRef.collection("forms").doc(formName);
//     batch.set(formRef, forms[formName]);
//   });

//   batch.set(userRef, {
//     mode: mode,
//   }, {merge: true});

//   await batch.commit();

//   return {
//     success: true,
//     message: `Forms submitted successfully in ${mode} mode`,
//   };
// });
