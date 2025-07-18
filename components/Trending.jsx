import { icons } from '@/constants';
import { ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { FlatList, Image, ImageBackground, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1.1 }
};

const zoomOut = {
  0: { scale: 1 },
  1: { scale: 0.9 }
};

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40 justify-center items-center"
            resizeMode="cover"
          >
            <Image
              source={icons.play}
              className="w-12 h-12 absolute self-center"
              resizeMode="contain"
            />
          </ImageBackground>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]?.$id || posts[0]?.$id);

  const viewabilityConfigCallbackPairs = useRef([
    {
      onViewableItemsChanged: ({ viewableItems }) => {
        if (viewableItems.length > 0) {
          setActiveItem(viewableItems[0].item.$id);
        }
      },
      viewabilityConfig: {
        itemVisiblePercentThreshold: 70
      }
    }
  ]);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
