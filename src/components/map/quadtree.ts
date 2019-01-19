import { LatLngBounds, LatLng } from './latlng'
import { Property } from '../../store/properties/types'

export interface Division {
  bounds: [[number, number], [number, number]]
  data: any
}

type StatsAux = number | StatsAuxArray
interface StatsAuxArray extends Array<StatsAux> {}

export class QuadTree<T> {
  maxObjectsPerLevel: number
  maxLevels: number
  depth: number
  elements: T[]
  nodes: QuadTree<T>[]
  bounds: LatLngBounds
  getElementBounds: (e: T) => LatLngBounds

  constructor (getBounds: (e: T) => LatLngBounds, maxObjectsPerLevel: number = 10, maxLevels: number = 8 , depthLevel: number = 0) {
    this.getElementBounds = getBounds
    this.maxObjectsPerLevel = maxObjectsPerLevel
    this.maxLevels = maxLevels
    this.depth = depthLevel
    this.elements = []
    this.nodes = []
    this.bounds = new LatLngBounds(new LatLng(0, 0), new LatLng(0, 0))
  }

  add (elem: T): QuadTree<T> {
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

  updateChildNodesBounds (): QuadTree<T> {
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

  updateChildNodesElements (): QuadTree<T> {
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

  splitNode (): QuadTree<T> {
    this.nodes = []
    for (let i of [0, 1, 2, 3]) {
      this.nodes[i] = new QuadTree(
        this.getElementBounds,
        this.maxObjectsPerLevel,
        this.maxLevels,
        this.depth + 1
      )
    }
    this.updateChildNodesBounds()
    return this
  }

  getQuadrants (bounds: LatLngBounds): number[] {
    const indexes: number[] = []
    this.nodes.forEach((node, index) => {
      if (node.bounds.intersects(bounds)) {
        indexes.push(index)
      }
    })
    return indexes
  }

  getPossibleColliders (bounds: LatLngBounds): T[] {
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

  getColliders (bounds: LatLngBounds): T[] {
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

  intersects (elem: T, bounds: LatLngBounds): boolean {
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

  _getQuadtreeStatsAux (): StatsAux {
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

  getDivisions (reducer: (elems: T[]) => any): Division[] {
    let divisions: Division[] = []
    if (this.nodes.length) {
      for (let node of this.nodes) {
        divisions = divisions.concat(node.getDivisions(reducer))
      }
    } else {
      const nw = this.bounds.northWest
      const se = this.bounds.southEast
      const div: Division = {
        bounds: [[nw.lat, nw.lng], [se.lat, se.lng]],
        data: reducer(this.elements)
      }
      divisions.push(div)
    }
    return divisions
  }
}

export function propertyQuadTree (maxObjectsPerLevel: number = 10, maxLevels: number = 8): QuadTree<Property> {
  function getBounds (elem: Property): LatLngBounds {
    let ll = new LatLng(elem.location.latitude, elem.location.longitude)
    return new LatLngBounds(ll, ll)
  }
  return new QuadTree<Property>(getBounds, maxObjectsPerLevel, maxLevels)
}
