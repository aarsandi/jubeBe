const admin = require('firebase-admin')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: process.env.FIREBASE_CLIENTEMAIL,
        privateKey: process.env.FIREBASE_PRIVATEKEY,
        projectId: process.env.FIREBASE_PROJECTID
    }),
    storageBucket: process.env.CLOUD_BUCKET
})
const bucket = admin.storage().bucket();
const db = getFirestore();

// notifier
const setUserNotificiation = async ({userId, title, message, category, role}) => {
    try {
        const res = await db.collection('notification').add({
            title, message, category, userId, role,
            read: false,
            createdAt: Timestamp.now()
        });
    } catch(err) {
        console.log(err, 'error firestore')
    }
}

const setAdminNotificiation = async ({ role, title, message, category }) => {
    try {
        const res = await db.collection('adminNotification').add({
            category, message, role, title,
            read: false,
            createdAt: Timestamp.now()
        });
    } catch(err) {
        console.log(err, 'error firestore')
    }
}

// upload image
const upload = (file, folder = 'other', cb) => {
    if (file) {
        sendUploadImage(file, folder, (err, data) => {
            if (err) {
                file.cloudStorageError = err
                cb(null, file);
            } else {
                file.cloudStorageObject = data.cloudStorageObject
                file.cloudStoragePublicUrl = data.cloudStoragePublicUrl
                cb(null, file);
            }
        })
    } else if (file && file.length) {
        file.forEach((image, index) => {
            sendUploadImage(image, folder, (err, data) => {
                if (err) {
                    file[index].cloudStorageError = err
                    cb(null, file);
                } else {
                    file[index].cloudStorageObject = data.cloudStorageObject
                    file[index].cloudStoragePublicUrl = data.cloudStoragePublicUrl
                    cb(null, file);
                }
            })
        });
    } else {
        cb("file required", null);
    }
};

const uploadSIP = async (file, folder = "other") => {
    return await new Promise((resolve, reject) => {
        if (file) {
            if (file.mimetype === 'application/pdf') {
                sendUploadPdf(file, folder, async (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        file.cloudStoragePublicUrl = data.cloudStoragePublicUrl
                        resolve(file);
                    }
                })
            } else {
                reject({err: "file SIP field must be in pdf format."})
            }
        } else {
            reject({err: "file document required."})
        }
    })
}

const deleteFile = async (file, folder = "other", cb) => {
//   await bucket.file('1653497689123avatar-big-01.jpg').delete()

  // pakai ini jika ada foldernya
  // await bucket.file('folder/1653497689123avatar-big-01.jpg').delete()
  cb("error", null)
}

// helper
const sendUploadImage = (image, folder, cb) => {
    const gcsname = `${folder}/` + Date.now() + image.originalname.replace(/\s/g, "");
    const file = bucket.file(gcsname);
    const stream = file.createWriteStream({
        metadata: {
            contentType: image.mimetype,
        },
    });
    stream.on("finish", async () => {
        try {
            await file.makePublic();
            cb(null, {
                cloudStorageObject: gcsname,
                cloudStoragePublicUrl: `https://storage.googleapis.com/${process.env.CLOUD_BUCKET}/${gcsname}`
            })
        } catch (error) {
            cb(error, null)
        }
    });
    stream.on("error", (err) => {
        cb(err, null)
    });
    stream.end(image.buffer);
};

const sendUploadPdf = (pdf, folder, cb) => {
    const gcsname = `${folder}/` + Date.now() + pdf.originalname.replace(/\s/g, "");
    const file = bucket.file(gcsname);
    if (pdf) {
        file.save(pdf.buffer)
            .then(async () => {
                await file.makePublic();
                cb(null, {
                    cloudStoragePublicUrl: `https://storage.googleapis.com/${process.env.CLOUD_BUCKET}/${gcsname}`
                })
            }).
            catch((err) => {
                cb(err, null)
            })
    }
};

module.exports = {
    upload, uploadSIP,
    setAdminNotificiation,
    setUserNotificiation
};
