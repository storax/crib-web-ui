import { cribReq } from '../utils'
import { Property } from '../store/properties/types'

export const propertiesService = {
  find: (maxPrice: number, maxDuration: number, favorite: boolean, area: Object) => {
    const config = {
      method: 'post',
      url: '/properties/find',
      data: {
        max_price: maxPrice,
        max_duration: maxDuration,
        favorite: favorite || null,
        area: area
      }
    }
    return cribReq(config)
      .then(response => { return response.data })
  },
  toWork: (property: Property) => {
    const config = {
      method: 'get',
      url: '/properties/to_work',
      params: {
        prop_id: property.id,
        mode: 'transit',
        refresh: true
      }
    }
    return cribReq(config)
      .then(response => { return response.data })
  },
  rasterMap: () => {
    const config = {
      method: 'get',
      url: '/directions/raster_map'
    }
    return cribReq(config)
      .then(response => { return response.data })
  },
  toWorkDurations: (colormap: string, maxDuration: number) => {
    const config = {
      method: 'get',
      url: '/directions/to_work_durations',
      params: {
        colormap: colormap,
        maxDuration: maxDuration
      }
    }
    return cribReq(config)
      .then(response => { return response.data })
  },
  colormaps: () => {
    const config ={
      method: 'get',
      url: '/directions/colormaps'
    }
    return cribReq(config)
      .then(response => { return response.data })
  },
  get_area: (maxDuration: number) => {
    const config ={
      method: 'get',
      url: '/directions/get_area',
      params: {
        maxDuration: maxDuration
      }
    }
    return cribReq(config)
      .then(response => {return response.data})
  },
  favorite: (property: Property) => {
    const config = {
      method: 'put',
      url: '/properties/favorite',
      data: {
        prop_id: property.id,
        favorite: !property.favorite
      }
    }
    return cribReq(config)
      .then(response => { return response.data })
  },
  ban: (property: Property) => {
    const config = {
      method: 'put',
      url: '/properties/ban',
      data: {
        prop_id: property.id,
        banned: !property.banned
      }
    }
    return cribReq(config)
      .then(response => {return response.data})
  }
}
