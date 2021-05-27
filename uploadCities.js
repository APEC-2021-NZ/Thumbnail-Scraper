import admin from 'firebase-admin'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import csv from 'csv-parser'
import { City, Country } from './models/Location'

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

let cities = []

const main = async () => {
    await new Promise(function (resolve, reject) {
        fs.createReadStream('cities.csv')
            .pipe(csv())
            .on('data', async (object) => {
                cities.push(object)
            })
            .on('end', () => {
                resolve()
            })
    })

    const country = Tag.init()
    country.id = '1'
    country.name = 'New Zealand'
    await country.save()

    let count = 1

    for (const { city, country } of cities) {
        if (country !== 'New Zealand') continue

        //const imagepath = `./image/city/${city.split(' ').join('_')}.png`

        //await saveImage(imagepath)

        const cityModel = City.init()
        cityModel.id = `${count}`
        cityModel.name = city
        cityModel.country = '/Country/1'
        await cityModel.save()

        count++
    }
}

main()
