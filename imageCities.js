import fs from 'fs'
import csv from 'csv-parser'
import { firstImage, resize } from './image'

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

    for (const { city, country } of cities) {
        if (country !== 'New Zealand') continue
        console.log(city)

        const image = await firstImage(`${city} ${country}`)
        resize(image.url, 'city', city)
    }
}

main()
