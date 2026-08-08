import BaseRepository
    from './BaseRepository.js'

import {
    POINTS_FILE,
} from '../config/paths.js'

class PointsRepository
    extends BaseRepository {

    constructor() {

        super(
            POINTS_FILE
        )

    }

}

const pointsRepository = new PointsRepository()

export default pointsRepository