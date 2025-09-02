import { icons } from '@/constants';
import { MaterialIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
  findNodeHandle,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

import { isBookmarked, removeBookmark, saveBookmark } from '@/lib/storage';

const VideoCard = ({
  video: { $id, title, thumbnail, video, creator: { username, avatar } },
  isBookmarkedPage = false,
  onRemove,
}) => {
  const [play, setPlay] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 50, right: 20 });
  const menuButtonRef = useRef(null);

  // Check if already bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      const exists = await isBookmarked($id);
      setSaved(exists);
    };
    checkBookmark();
  }, [$id]);

  const handleMenuPress = () => {
    if (menuButtonRef.current) {
      UIManager.measure(
        findNodeHandle(menuButtonRef.current),
        (x, y, width, height, pageX, pageY) => {
          setMenuPosition({ top: pageY + height + 5, right: 20 });
          setMenuVisible(true);
        }
      );
    }
  };

  const handleSave = async () => {
    await saveBookmark({ $id, title, thumbnail, video, creator: { username, avatar } });
    setSaved(true);
  };

  const handleRemove = async () => {
    await removeBookmark($id);
    setSaved(false);
    if (onRemove) onRemove($id); // notify parent
  };

  const handleSelectOption = (option) => {
    setMenuVisible(false);
    if (option === 'save') {
      handleSave();
    } else if (option === 'delete') {
      handleRemove();
    }
  };

  const menuOptions = [
    { icon: 'bookmark', label: 'Save', action: 'save' },
    { icon: 'delete', label: 'Delete', action: 'delete' },
  ];

  return (
    <View className="flex-col items-center px-4 mb-14">
      {/* Header with avatar + menu */}
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>

        {/* Menu Button */}
        <TouchableOpacity ref={menuButtonRef} onPress={handleMenuPress}>
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Popup Menu */}
      <Modal transparent animationType="fade" visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: menuPosition.top,
              right: menuPosition.right,
              backgroundColor: '#1A1A1A',
              borderRadius: 8,
              paddingVertical: 8,
              minWidth: 140,
            }}
          >
            {menuOptions.map((opt) => (
              <TouchableOpacity
                key={opt.action}
                onPress={() => handleSelectOption(handleSave)}
                className="flex-row items-center px-3 py-2"
              >
                <MaterialIcons name={opt.icon} size={24} color="#CDCDE0" />
                <Text style={{ color: 'white', marginLeft: 8 }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Video / Thumbnail */}
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          style={{ height: 288, width: 288 }}
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
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {/* Save / Remove Button */}
      
  
    </View>
  );
};

export default VideoCard;
