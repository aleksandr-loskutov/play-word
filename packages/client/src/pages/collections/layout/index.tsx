import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../../../components/hooks/store'
import { getUserCollections } from '../../../store/action-creators/collection'
import CollectionPage from '../collection'
import CollectionsPage from '../index'

const CollectionsLayout: React.FC = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getUserCollections())
  }, [dispatch])
  return <>{!id ? <CollectionsPage /> : <CollectionPage />}</>
}

export default CollectionsLayout
