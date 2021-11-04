const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore()
const auth = admin.auth()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.register = functions.https.onCall(async (data, context) => {
    // response.send("Hello from Firebase!");
    const users = db.collection('users')
    try {
        console.log(data.email);
        const user = await auth.createUser({
            email: data.email,
            password: data.password,

        })
        if (user) {
            await users.doc(user.uid).set({
                email: data.email,
                username: data.username,
                address: data.address,
                isAdmin: data.isAdmin ? true : false,
                isStaff: data.isStaff ? true : false,
                isCustomer: data.isCustomer ? true : false,
                created: new Date(),
                active: false
            })
            return {
                success: true,
                user: user
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
});

exports.deleteUser = functions.https.onCall(async (data, context) => {
    console.log(context.auth.token.email);
    try {
        let doc = await db.collection('users').doc(context.auth.uid).get()
        let isAdmin = doc.get('isAdmin')
        if (isAdmin) {
            admin.auth().deleteUser(data)
            await db.collection('users').doc(data).delete();
            return {
                success: true,
            }

        }
        else {
            return {
                sucess: false,
                error: "not admin"
            }
        }
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            error: error.message
        }
    }
})