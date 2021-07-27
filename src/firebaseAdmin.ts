import admin from 'firebase-admin';

const serviceAccountObject = JSON.parse(process.env.SERVICE_ACCOUNT_JSON_DATA ?? '{}');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountObject),
  storageBucket: process.env.STORAGE_BUCKET
});

export default admin;