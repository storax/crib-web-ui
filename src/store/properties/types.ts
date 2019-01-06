export interface PropertiesState {
  gettingProperties: boolean,
  properties: Property[],
  currentProperty: Property | null
  showMap: boolean,
}

export interface Property {
  id: string,
}
