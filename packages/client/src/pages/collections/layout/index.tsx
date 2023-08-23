import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../components/hooks/store'
import CollectionPage from '../collection'
import CollectionsPage from '../index'
import { getUserCollections } from '../../../store/action-creators/collection'

const CollectionsLayout: React.FC = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUserCollections())
  }, [dispatch])

  const { isLoading } = useAppSelector(state => state.collections)

  return !isLoading && id ? <CollectionPage /> : <CollectionsPage />
}

export default CollectionsLayout
