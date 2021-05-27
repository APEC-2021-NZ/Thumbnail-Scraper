import { Model, Field } from 'fireo'

class Destination extends Model {
    id = Field.ID()
    name = Field.Text({ required: true })
    image = Field.Text({ required: true })
    city = Field.Reference({ required: true })
}

export { Destination }
