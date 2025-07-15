import React from 'react';
import { Text, View } from 'react-native';

const VideoCard = ({video}) => {
  console.log(video);
  
  return (
    <View className='flex-col items-center px-4 mb-14'>
      <Text className='text-2xl text-white'>{}</Text>
    </View>
  )
}

export default VideoCard