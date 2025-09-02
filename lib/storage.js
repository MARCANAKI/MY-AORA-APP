import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = "bookmark";

// Save a new video
export const saveBookmark = async (video) => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKMARKS_KEY);
    let bookmarks = jsonValue != null ? JSON.parse(jsonValue) : [];

    // avoid duplicates
    const exists = bookmarks.find((item) => item.$id === video.$id);
    if (!exists) {
      bookmarks.push(video);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (e) {
    console.log("Error saving bookmark:", e);
  }
};

// Get all bookmarks
export const getBookmarks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log("Error fetching bookmarks:", e);
    return [];
  }
};

// Remove a bookmark
export const removeBookmark = async (videoId) => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKMARKS_KEY);
    let bookmarks = jsonValue != null ? JSON.parse(jsonValue) : [];

    bookmarks = bookmarks.filter((item) => item.$id !== videoId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.log("Error removing bookmark:", e);
  }
};
