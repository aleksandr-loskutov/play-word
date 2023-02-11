export type Collection = {
  id: number
  name: string
  description: string
  image: string
  userId: number
  isPublic: boolean
}

export type RequestCollectionCreate = {
  name: string
  description?: string
  image?: string
  isPublic?: boolean
}

export type RequestCollectionUpdate = Partial<Omit<Collection, 'userId'>>
