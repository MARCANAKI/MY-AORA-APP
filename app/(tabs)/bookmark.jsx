// app/(tabs)/saved.jsx
import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getBookmarks, removeBookmark } from "@/lib/storage";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const saved = await getBookmarks();
      setBookmarks(saved || []);
    };
    fetchBookmarks();
  }, []);

  const handleRemove = async (videoId) => {
    await removeBookmark(videoId); // update storage too
    setBookmarks((prev) => prev.filter((item) => item.$id !== videoId));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D] px-4">
      <Text className="text-white text-2xl font-psemibold mb-3">
        Saved Videos
      </Text>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            isBookmarkedPage
            onRemove={handleRemove}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Bookmarks Yet"
            subtitle="Save videos to see them here"
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default Bookmarks;
