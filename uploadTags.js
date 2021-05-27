import admin from 'firebase-admin'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import csv from 'csv-parser'
import { City, Country } from './models/Location'
import { Tag } from './models/Tag'

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

let tags = []

const main = async () => {
    await new Promise(function (resolve, reject) {
        fs.createReadStream('tags.csv')
            .pipe(csv())
            .on('data', async (object) => {
                tags.push(object)
            })
            .on('end', () => {
                resolve()
            })
    })

    const country = Country.init()
    country.id = '1'
    country.name = 'New Zealand'
    await country.save()

    let count = 1

    for (const { tag } of tags) {
        const imagepath = `./image/tag/${tag.split(' ').join('_')}.png`

        const imageUrl = await saveImage(imagepath)

        const tagModel = Tag.init()
        tagModel.id = `${count}`
        tagModel.name = tag
        tagModel.image = imageUrl
        await tagModel.save()

        count++
    }
}

main()
