export class LatLng {
  readonly lat: number
  readonly lng: number
  constructor (lat: number, lng: number) {
    this.lat = lat
    this.lng = lng
  }
}

export class LatLngBounds {
  private _southWest: LatLng
  private _northEast: LatLng

  constructor (corner1: LatLng, corner2: LatLng) {
    this._southWest = corner1
    this._northEast = corner1
    this._extend(corner2, corner2)
  }

  private _extend (sw2: LatLng, ne2: LatLng) {
    const sw = this._southWest
    const ne = this._northEast
    this._southWest = new LatLng(
      Math.min(sw2.lat, sw.lat),
      Math.min(sw2.lng, sw.lng)
    )
    this._northEast = new LatLng(
      Math.max(ne2.lat, ne.lat),
      Math.max(ne2.lng, ne.lng)
    )
  }

  get northEast (): LatLng {
    return this._northEast
  }
  get southWest (): LatLng {
    return this._southWest
  }
  get northWest (): LatLng {
    return new LatLng(this.north, this.west)
  }
  get southEast (): LatLng {
    return new LatLng(this.south, this.east)
  }
  get west (): number {
    return this.southWest.lng
  }
  get south (): number {
    return this.southWest.lat
  }
  get east (): number {
    return this.northEast.lng
  }
  get north (): number {
    return this.northEast.lat
  }

  get center () {
    return new LatLng(
      (this.southWest.lat + this.northEast.lat) / 2,
      (this.southWest.lng + this.northEast.lng) / 2
    )
  }

  extend (bounds: LatLngBounds) {
    const sw2 = bounds.southWest
    const ne2 = bounds.northEast
    this._extend(sw2, ne2)
  }

  intersects (bounds: LatLngBounds) {
    const sw = this.southWest
    const ne = this.northEast
    const sw2 = bounds.southWest
    const ne2 = bounds.northEast
    const latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat)
    const lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng)

    return latIntersects && lngIntersects
  }
}
