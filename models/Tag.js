import { Model, Field } from 'fireo'

class Tag extends Model {
    id = Field.ID()
    name = Field.Text({ required: true })
    image = Field.Text({ required: true })
}

export { Tag }
