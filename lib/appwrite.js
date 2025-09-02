import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';


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
const storage = new Storage(client);

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
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )
    
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}
export const searchPosts = async (query) => {
  console.log(query);
  
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    )
    console.log(posts.documents)
    return posts.documents
  } catch (error) {
    console.log('No Result Found', error)
    throw new Error(error);
  }
}
export const getUserPosts = async (userId) => {
  
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('creator', userId)]
    )
    console.log(posts.documents)
    return posts.documents
  } catch (error) {
    console.log('No Result Found', error)
    throw new Error(error);
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');

    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  console.log("storageId", storageId, "file ID", fileId );
  

  try {
    if(type === 'video') {
      fileUrl = await storage.getFileViewURL(config.storageId, fileId);
          console.log("url", fileUrl);
        } else if(type === 'image') {
      // ✅ Safe on free plan: no transformation
      fileUrl = await storage.getFileViewURL(config.storageId, fileId);
      console.log("url", fileUrl);
      
    } else {
      throw new Error('Invalid file type');
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if(!file) return;


  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  }

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    console.log("uploadedFile", uploadedFile);
    

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])
    console.log('Upload Succesful')

    const newPost = await databases.createDocument(
      databaseId, videoCollectionId, ID.unique(), {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId
      }
    )
    console.log('Document Created')
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

