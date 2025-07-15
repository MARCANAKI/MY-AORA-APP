import React from 'react'
import { FlatList, Text } from 'react-native'

const Trending = ({posts}) => {
  return (
    <FlatList 
    data={posts}
    keyExtractor={(item) => item.$id}
    renderItem={({item}) => (
        <Text className='text-3xl'>{item.id}</Text>
    )}
    horizontal
    />
  )
}

export default Trending