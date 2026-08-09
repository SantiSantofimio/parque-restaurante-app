import {
  readJsonFile,
} from '../utils/jsonStorage.js'

import {
  BANNERS_FILE,
  SERVICES_FILE,
  PROMOTIONS_FILE,
  NEWS_FILE,
  EVENTS_FILE,
  TOURS_FILE,
  RESTAURANT_FILE,
} from '../config/paths.js'

class ContentRepository {

  getContent() {

    return {

      banners:
        readJsonFile(
          BANNERS_FILE
        ),

      services:
        readJsonFile(
          SERVICES_FILE
        ),

      promotions:
        readJsonFile(
          PROMOTIONS_FILE
        ),

      news:
        readJsonFile(
          NEWS_FILE
        ),

      events:
        readJsonFile(
          EVENTS_FILE
        ),

      tours:
        readJsonFile(
          TOURS_FILE
        ),

      restaurant:
        readJsonFile(
          RESTAURANT_FILE
        ),

    }

  }

}

const contentRepository =
  new ContentRepository()

export default
  contentRepository