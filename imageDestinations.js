import fs from 'fs'
import csv from 'csv-parser'
import { firstImage, resize } from './image'

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

    for (const { destination, city } of destinations) {
        console.log(destination)

        const image = await firstImage(`${destination} ${city}`)
        resize(image.url, 'destination', destination)
    }
}

main()
