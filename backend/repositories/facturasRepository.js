import BaseRepository
    from './BaseRepository.js'

import {
    FACTURAS_FILE,
} from '../config/paths.js'

class FacturasRepository
    extends BaseRepository {

    constructor() {

        super(
            FACTURAS_FILE
        )

    }

}

const facturasRepository = new FacturasRepository()

export default facturasRepository