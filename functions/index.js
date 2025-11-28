const admin = require("firebase-admin");

admin.initializeApp();

const {onboardUser} = require("./User/onboard");
const {createCounsellorRequest} = require("./Counsellor/createRequest");
const {approveCounsellorRequest} = require("./Counsellor/requestApproved");
const {rejectRequest} = require("./Counsellor/requestDelete");
const {submitCounsellingForms} = require("./SeekGuidance/seekGuidance");
const {submitSessionRequest} = require("./Session/sessionRequest");
const {scheduleSession} = require("./Session/sessionSchedule");


exports.onboardUser = onboardUser;
exports.createCounsellorRequest = createCounsellorRequest;
exports.approveCounsellorRequest = approveCounsellorRequest;
exports.rejectRequest = rejectRequest;
exports.submitCounsellingForms = submitCounsellingForms;
exports.submitSessionRequest = submitSessionRequest;
exports.scheduleSession = scheduleSession;
