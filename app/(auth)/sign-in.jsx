import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { images } from '../../constants';

import { signIn } from '@/lib/appwrite';

const SignIn = () => {

  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", 'Please fill in all the fields')
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password,)
      

      // set it to global state...

      router.replace('/(tabs)/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false);
    }


  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='min-h-[85vh] justify-center w-full px-4 my-6'>
          <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]'/>

          <Text className='text-2xl text-white text-semibold mt-20 text-psemibold'>Log in to Aora</Text>

          <FormField 
          title='Email'
          value={form.email}
          handleChangeText={(e) => setForm({...form, email: e})}
          otherStyles="mt-7"
          keyboardType="email-address"
          />
          <FormField 
          title='Password'
          value={form.password}
          handleChangeText={(e) => setForm({...form, password: e})}
          otherStyles="mt-7"
          />

          <CustomButton 
          title='Sign In'
          handlePress={submit}
          containerStyles= "mt-7"
          isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have an account?
            </Text>
            <Link href='/(auth)/sign-up' className='text-lg font-psemibold text-secondary'>Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn