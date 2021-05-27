import fs from 'fs'
import csv from 'csv-parser'
import { firstImage, resize } from './image'

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

    for (const { tag } of tags) {
        const country = 'New Zealand'
        console.log(tag)

        const image = await firstImage(`${tag} ${country}`)
        resize(image.url, 'tag', tag)
    }
}

main()
