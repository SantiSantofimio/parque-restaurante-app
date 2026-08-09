import contentRepository
  from '../repositories/contentRepository.js'

const contentService = {

  obtenerContenido() {

    return contentRepository.getContent()

  },

}

export default contentService