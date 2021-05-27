import Scraper from 'images-scraper'
import sharp from 'sharp'
import axios from 'axios'

const google = new Scraper()

const firstImage = async (search) => {
    try {
        const results = await google.scrape(search, 1)

        if (results.length === 0) {
            throw new Error('no image found')
        }

        return results[0]
    } catch (err) {
        throw err
    }
}

const resize = async (uri, path, filename) => {
    const pathname = `./image/${path}/${filename.split(' ').join('_')}.png`

    const { data } = await axios.get(uri, { responseType: 'arraybuffer' })

    sharp(data).resize(400, 400).png().toFile(pathname)
}

export { firstImage, resize }
