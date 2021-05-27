import { Model, Field } from 'fireo'

class Experience extends Model {
    id = Field.ID()
    name = Field.Text({ required: true })
    image = Field.Text({ required: true })
}

export { Experience }
