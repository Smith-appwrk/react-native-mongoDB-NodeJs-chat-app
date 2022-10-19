import {Button, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ObjectID} from 'react-native-bson';
import axios from 'react-native-axios';
import {ENDPOINT} from '../Constants';
import logo from '../images/logo-resume.jpg';

const Home = ({navigation}) => {
  const [createChatButtonStatus, setCreateChatButtonStatus] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [userId, setUserId] = useState('');
  const [formToggle, setFormToggle] = useState(true);

  const [formData, setformData] = useState({
    currentUserId: '',
    otherUserId: '',
  });
  const storeCurrentId = async () => {
    try {
      const mongoLikeId = new ObjectID();
      const value = await AsyncStorage.getItem('currentUserId');
      if (value !== null) {
        setUserId(value);
        setformData({...formData, currentUserId: value});
      } else {
        setUserId(mongoLikeId);
        const id = await AsyncStorage.setItem(
          'currentUserId',
          String(mongoLikeId),
        );
        setformData({...formData, currentUserId: id});
        await axios.post(`${ENDPOINT}/user/createUser`, {
          user: mongoLikeId.toString(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    storeCurrentId();
  }, []);

  useEffect(() => {
    if (formData.currentUserId !== '' && formData.otherUserId !== '') {
      setCreateChatButtonStatus(false);
    }
  }, [formData]);

  const handleCreateChat = async () => {
    try {
      console.log('clicked');
      const {data} = await axios.post(`${ENDPOINT}/chat/createChat`, formData);
      setChatId(data._id);
      console.log(data._id);

      if (chatId) {
        navigation.navigate('Drawer', {
          chatId: chatId,
          userId: formData.currentUserId,
          otherUserId: formData.otherUserId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCreateChat();
  }, [chatId]);

  return (
    <View style={styles.chat__screen}>
      <View style={styles.create_chat_card}>
        <Image source={logo} style={styles.image} />
        <View>
          <View>
            <Text style={styles.label}>Phone Number :</Text>
            <TextInput
              value={formData.currentUserId}
              onChangeText={e => setformData({...formData, currentUserId: e})}
              style={styles.textinput}
            />
          </View>
          <View>
            <Text style={styles.label}>Password :</Text>

            <TextInput
              value={formData.otherUserId}
              onChangeText={e => setformData({...formData, otherUserId: e})}
              style={styles.textinput}
            />
          </View>

          {formToggle === false && (
            <View>
              <Text style={styles.label}>Confirm Password :</Text>

              <TextInput
                value={formData.otherUserId}
                onChangeText={e => setformData({...formData, otherUserId: e})}
                style={styles.textinput}
              />
            </View>
          )}

          <Button
            color="#eb5526"
            title="Chat"
            onPress={handleCreateChat}
            disabled={createChatButtonStatus}
          />
          <View style={{marginTop: 20}}>
            <Text
              onPress={() => {
                setFormToggle(prev => !prev);
                console.log('change');
              }}
              style={{textAlign: 'right', fontSize: 16, color: '#0f58a5'}}>
              New user? register here
            </Text>
          </View>
          <View style={{marginTop: 30}}>
            <Text>Copyrights © 2022 | APPWRK IT Solutions Pvt. Ltd</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  chat__screen: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: '#0f58a5',
  },
  image: {
    resizeMode: 'contain',
    marginBottom: 50,
    marginTop: 20,
  },
  create_chat_card: {
    marginHorizontal: 10,
    padding: 20,
    borderColor: '#f9f9f9',
    borderWidth: 0.8,
    borderBottomColor: '#ccc',
    borderRadius: 7,
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textinput: {
    borderWidth: 0.8,
    borderBottomColor: '#ccc',
    borderColor: '#eeeeee',
    borderBottomColor: '#eb5526',
    borderRadius: 7,
    marginBottom: 20,
    padding: 9,
    fontSize: 19,
    paddingLeft: 15,
    paddingRight: 15,
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    paddingBottom: 10,
    color: '#333',
  },
});
