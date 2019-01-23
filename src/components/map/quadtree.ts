import tinygradient from 'tinygradient'

import { LatLngBounds, LatLng } from './latlng'
import { Property } from '../../store/properties/types'

export interface Division<T> {
  bounds: [[number, number], [number, number]]
  data: T
}

type StatsAux = number | StatsAuxArray
interface StatsAuxArray extends Array<StatsAux> {}

abstract class QuadTree<T, DT> {
  private maxObjectsPerLevel: number
  private maxLevels: number
  private depth: number
  private elements: T[]
  private nodes: QuadTree<T, DT>[]
  private bounds: LatLngBounds
  protected abstract getElementBounds (e: T): LatLngBounds

  constructor (maxObjectsPerLevel: number = 10, maxLevels: number = 8 , depthLevel: number = 0) {
    this.maxObjectsPerLevel = maxObjectsPerLevel
    this.maxLevels = maxLevels
    this.depth = depthLevel
    this.elements = []
    this.nodes = []
    this.bounds = new LatLngBounds(new LatLng(0, 0), new LatLng(0, 0))
  }

  add (elem: T): QuadTree<T, DT> {
    const elemBounds = this.getElementBounds(elem)

    if (0 === this.depth && 0 === this.elements.length && 0 === this.nodes.length) {
      this.bounds = elemBounds
    }

    if (0 === this.depth && !this.bounds.intersects(elemBounds)) {
      // Extend quadtree
      this.bounds.extend(elemBounds)
      this.updateChildNodesBounds()
      this.updateChildNodesElements()
      return this.add(elem)
    } else if (0 !== this.nodes.length) {
      // Propagate the insert to the child nodes it intersects
      const quadrants = this.getQuadrants(elemBounds)
      for (let quad of quadrants) {
        this.nodes[quad].add(elem)
      }
      return this
    }

    this.elements.push(elem)

    if (this.maxObjectsPerLevel < this.elements.length &&
        this.depth < this.maxLevels &&
        0 === this.nodes.length) {
      // Node is full, haven't reached max depth and there are no children
      // so split
      this.splitNode()
      this.updateChildNodesElements()
    }

    return this

  }

  private updateChildNodesBounds (): QuadTree<T, DT> {
    if (0 !== this.nodes.length) {
      const nwChild: LatLng = this.bounds.northWest
      const seChild: LatLng = this.bounds.southEast
      const center: LatLng = this.bounds.center

      this.nodes[0].bounds = new LatLngBounds(
        new LatLng(center.lat, nwChild.lng),
        new LatLng(nwChild.lat, center.lng)
      )
      this.nodes[0].updateChildNodesBounds()

      this.nodes[1].bounds = new LatLngBounds(
        new LatLng(center.lat, center.lng),
        new LatLng(nwChild.lat, seChild.lng)
      )
      this.nodes[1].updateChildNodesBounds()

      this.nodes[2].bounds = new LatLngBounds(
        new LatLng(seChild.lat, nwChild.lng),
        new LatLng(center.lat, center.lng)
      )
      this.nodes[2].updateChildNodesBounds()

      this.nodes[3].bounds = new LatLngBounds(
        new LatLng(seChild.lat, center.lng),
        new LatLng(center.lat, seChild.lng)
      )
      this.nodes[3].updateChildNodesBounds()

    }
    return this
  }

  private updateChildNodesElements (): QuadTree<T, DT> {
    if (0 !== this.nodes.length) {
      const elements = this.getColliders(this.bounds)
      if (this.maxObjectsPerLevel < elements.length &&
          this.depth < this.maxLevels) {
        this.splitNode()

        for (let elem of elements) {
          const quadrants = this.getQuadrants(this.getElementBounds(elem))
          for (let quad of quadrants) {
            this.nodes[quad].add(elem)
          }
        }
        this.elements = []
      } else {
        this.elements = elements
        this.nodes = []
      }
    }

    return this
  }

  private splitNode (): QuadTree<T, DT> {
    this.nodes = []
    for (let i of [0, 1, 2, 3]) {
      this.nodes[i] = new (this.constructor as any)(
        this.maxObjectsPerLevel,
        this.maxLevels,
        this.depth + 1
      )
    }
    this.updateChildNodesBounds()
    return this
  }

  private getQuadrants (bounds: LatLngBounds): number[] {
    const indexes: number[] = []
    this.nodes.forEach((node, index) => {
      if (node.bounds.intersects(bounds)) {
        indexes.push(index)
      }
    })
    return indexes
  }

  private getPossibleColliders (bounds: LatLngBounds): T[] {
    let colliders: T[] = []
    const intersects = this.bounds.intersects(bounds)
    if (intersects) {
      colliders = colliders.concat(this.elements)
      for (let node of this.nodes) {
        colliders = colliders.concat(node.getPossibleColliders(bounds))
      }
    }
    return colliders
  }

  private getColliders (bounds: LatLngBounds): T[] {
    const realColliders: T[] = []
    const colliders = this.getPossibleColliders(bounds)
    for (let elem of colliders) {
      const collides = this.intersects(elem, bounds)
      if (collides) {
        realColliders.push(elem)
      }
    }
    return realColliders
  }

  private intersects (elem: T, bounds: LatLngBounds): boolean {
    const elemBounds = this.getElementBounds(elem)
    return bounds.intersects(elemBounds)
  }

  clear (): void {
    this.elements = []
    for (let node of this.nodes) {
      node.clear()
    }
    this.nodes = []
  }

  getQuadtreeStats (): StatsAux {
    return this._getQuadtreeStatsAux()
  }

  private _getQuadtreeStatsAux (): StatsAux {
    const children = []
    if (this.nodes.length) {
      for (let node of this.nodes) {
        children.push(node._getQuadtreeStatsAux())
      }
    } else {
      children.push(this.elements.length)
    }

    return children
  }

  getDivisions (reducer: (elems: T[]) => any | null): Division<DT>[] {
    let divisions: Division<DT>[] = []
    if (this.nodes.length) {
      for (let node of this.nodes) {
        divisions = divisions.concat(node.getDivisions(reducer))
      }
    } else if (this.elements.length) {
      const nw = this.bounds.northWest
      const se = this.bounds.southEast
      const data = reducer(this.elements)
      if (data) {
        const div: Division<DT> = {
          bounds: [[nw.lat, nw.lng], [se.lat, se.lng]],
          data: data
        }
        divisions.push(div)
      }
    }
    return divisions
  }
}

export interface DivisionData {
  color: string
  average: number,
  text: string
}

export class PropertyQuadTree extends QuadTree<Property, DivisionData> {
  private maxPrice: number
  private minPrice: number
  private maxDurationToWork: number
  private minDurationToWork: number
  gradient = tinygradient(
    '#3FFBE0',
    '#40D1E0',
    '#64A5CA',
    '#777BA4',
    '#755474',
    '#603546'
  )

  constructor (maxObjectsPerLevel: number = 10, maxLevels: number = 8, depthLevel: number = 0) {
    super(maxObjectsPerLevel, maxLevels, depthLevel)
    this.maxPrice = 0
    this.minPrice = Number.MAX_SAFE_INTEGER
    this.maxDurationToWork = 0
    this.minDurationToWork = Number.MAX_SAFE_INTEGER
  }

  addProperty (prop: Property): void {
    const amount = prop.price.amount
    this.maxPrice = Math.max(this.maxPrice, amount)
    this.minPrice = Math.min(this.minPrice, amount)
    if (prop.toWork.overview_polyline) {
      const duration = prop.toWork.duration.value
      this.maxDurationToWork = Math.max(this.maxDurationToWork, duration)
      this.minDurationToWork = Math.min(this.minDurationToWork, duration)
    }
    this.add(prop)
  }

  protected getElementBounds (prop: Property): LatLngBounds {
    let ll = new LatLng(prop.location.latitude, prop.location.longitude)
    return new LatLngBounds(ll, ll)
  }

  getAveragePrices (): Division<DivisionData>[] {
    return this.getDivisions(this.priceReducer)
  }

  private get priceReducer (): (a: Property[]) => DivisionData {
    const n = normalize(this.minDurationToWork, this.maxDurationToWork)
    return (properties: Property[]) => {
      const sum = properties.reduce((total, prop) => total + prop.price.amount, 0)
      const avg = sum / properties.length
      return {
        color: this.gradient.rgbAt(n(avg)).toHexString(),
        average: avg,
        text: `£${avg}`
      }
    }
  }

}

export function normalize (min: number, max: number): (v: number) => number {
  const delta = max - min
  return function (val: number): number {
    return (val - min) / delta
  }
}
