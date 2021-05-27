import fs from 'fs'
import csv from 'csv-parser'
import { firstImage, resize } from './image'

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

    for (const { experience } of experiences) {
        const country = 'New Zealand'
        console.log(experience)

        const image = await firstImage(`${experience} ${country}`)
        resize(image.url, 'experience', experience)
    }
}

main()
