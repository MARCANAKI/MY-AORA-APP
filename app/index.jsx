import { Redirect, router } from 'expo-router';
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from '@/context/GlobalProvider';
import { images } from '../constants';


export default function App() {
  const {isLoading, isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href= '/(tabs)/home' />
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4"> 
          <Image
          source={images.logo}
          className="w-[130px] h-[84px]"
          resizeMode="contain"
          />
          <Image
          source={images.cards}
          className="max-w-[380px] w-full h-[300px]"
          resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">Discover Endless Posibilities with{' '}
              <Text className="text-secondary-200">Aora!</Text>
            </Text>

            <Image 
            source={images.path}
            className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
            resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>
          <CustomButton
            title="Continue with email"
            handlePress={() => router.push ('/(auth)/sign-in')}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
    
    </SafeAreaView>
  );
}


 