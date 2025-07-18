import React, { useState } from 'react'
import { Image, TextInput, TouchableOpacity, View } from 'react-native'

import { icons } from '../constants'

const SearchInput = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
  const [showPassword, setshowPassword] = useState(false)
 
  return (

      <View className={`border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl
        items-center flex-row space-x-4`}
        >
        
      
        <TextInput 
        className='flex-1 text-white font-pregular text-base mt-0.5'
        value={value}
        placeholder="Search for a video topic"
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        secureTextEntry={title === 'Password' && !showPassword}
        />

        <TouchableOpacity>
            <Image 
            source={icons.search}
            className='w-5 h-5'
            resizeMode='contain'
            />
        </TouchableOpacity>
      </View>
  )
}

export default SearchInput