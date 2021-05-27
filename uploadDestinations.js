import admin from 'firebase-admin'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import csv from 'csv-parser'
import { Destination } from './models/Destination'

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

let destinations = []

const main = async () => {
    await new Promise(function (resolve, reject) {
        fs.createReadStream('destinations.csv')
            .pipe(csv())
            .on('data', async (object) => {
                destinations.push(object)
            })
            .on('end', () => {
                resolve()
            })
    })

    let count = 1

    for (const { destination, city } of destinations) {
        const imagepath = `./image/destination/${destination
            .split(' ')
            .join('_')}.png`

        const imageUrl = await saveImage(imagepath)

        const destinationModel = Destination.init()
        destinationModel.id = `${count}`
        destinationModel.name = destination
        destinationModel.image = imageUrl
        destinationModel.city = `/City/${city}`
        await destinationModel.save()

        count++
    }
}

main()
