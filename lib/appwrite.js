import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

// Appwrite config
export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.jsm.aorapp',
  projectId: '686acaf1001249043b34',
  databaseId: '686aced0002308b8e955',
  userCollectionId: '686acf2800106dd2a028',
  videoCollectionId: '686acf7a002ba60c4589',
  storageId: '686ad24f00129b4e6406',
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Create user account
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password
    );

    if (!newAccount) throw new Error('User account creation failed');

    const avatarUrl = `https://i.pravatar.cc/150?u=${email}`;

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log('createUser error:', error);
    throw new Error(error.message || 'An unexpected error occurred during sign up');
  }
};

// Sign in user
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log('signIn error:', error);
    throw new Error(error.message || 'Sign In failed');
  }
};



export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error('No current account found');

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser || currentUser.total === 0) {
      throw new Error('User document not found');
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log('getCurrentUser error:', error);
    return null;
  }
};


export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    )
    
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
      [Query.orderDesc('$createAt', Query.limit(7))]
    )
    
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}
