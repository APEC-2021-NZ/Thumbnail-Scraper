import admin from 'firebase-admin'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import csv from 'csv-parser'
import { Experience } from './models/Experience'

dotenv.config()

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: 'gs://apec-2021-nz.appspot.com',
})

const saveImage = async (imagePath) => {
    const stream = fs.createReadStream(imagePath)

    const file = admin
        .storage()
        .bucket()
        .file(uuidv4() + path.extname(imagePath))

    // Upload the file to gcs
    await new Promise((resolve, reject) => {
        const writeStream = file.createWriteStream()
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
        stream.pipe(writeStream)
    })

    return file.publicUrl()
}

let experiences = []

const main = async () => {
    await new Promise(function (resolve, reject) {
        fs.createReadStream('experiences.csv')
            .pipe(csv())
            .on('data', async (object) => {
                experiences.push(object)
            })
            .on('end', () => {
                resolve()
            })
    })

    let count = 1

    for (const { experience } of experiences) {
        const imagepath = `./image/experience/${experience
            .split(' ')
            .join('_')}.png`

        const imageUrl = await saveImage(imagepath)

        const experienceModel = Experience.init()
        experienceModel.id = `${count}`
        experienceModel.name = experience
        experienceModel.image = imageUrl
        await experienceModel.save()

        count++
    }
}

main()
