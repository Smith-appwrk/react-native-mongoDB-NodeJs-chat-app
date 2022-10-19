import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Button,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

import Icon from 'react-native-vector-icons/FontAwesome';
import {ENDPOINT} from '../Constants';
let socket;

import chatBg from '../images/defaultChatBg.png';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Chat = ({navigation, route}) => {
  const {chatId, userId, otherUserId} = route.params;
  console.log(chatId, userId, otherUserId);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const scrollViewRef = useRef();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // getData();
    setRefreshing(false);
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on('connected', () => console.log('connected'));
  }, []);

  useEffect(() => {
    socket.emit('setup', userId);
    socket.emit('join chat', chatId);
  }, []);

  const closeChat = async () => {
    try {
      await AsyncStorage.removeItem('currentChatId');
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get(
        `${ENDPOINT}/message/getAllMsgInChat/${chatId}`,
      );
      if (res) setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [chatId]);

  const sendMessage = async () => {
    try {
      const {data} = await axios.post(`${ENDPOINT}/message/sendMessage`, {
        chat: chatId,
        sender: userId,
        content: message,
      });
      setMessage('');
      socket.emit('new message', {
        newRecivedMessage: data,
        chat: chatId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on('message recived', data => {
      setMessages(prev => [...prev, data]);
      scrollViewRef.current.scrollToEnd({animated: true});
    });
    console.log('running');
  }, []);

  const handleLogout = () => {
    closeChat();
    navigation.navigate('Home');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <ImageBackground
        source={{
          uri: 'https://raw.githubusercontent.com/codewithsahil/mern-socket-io-chat-app/main/frontend/src/images/defaultChatBg.png',
        }}
        resizeMode="stretch"
        style={styles.img}>
        <View style={styles.header}>
          <Icon
            onPress={() => navigation.openDrawer()}
            name="bars"
            size={25}
            color="#fff"
          />
          <Icon onPress={handleLogout} name="sign-out" size={25} color="#fff" />
        </View>
        <ScrollView
          ref={scrollViewRef}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          style={styles.scrollView}>
          {messages.length > 0 &&
            messages?.map(message => {
              return message.sender !== userId ? (
                <View key={message._id} style={[styles.other, styles.message]}>
                  <Text style={styles.messageText}>{message.content}</Text>
                </View>
              ) : (
                <View
                  key={message._id}
                  style={[styles.current, styles.message]}>
                  <Text style={[styles.messageText, , {color: 'white'}]}>
                    {message.content}
                  </Text>
                </View>
              );
            })}
        </ScrollView>
        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            onChangeText={e => setMessage(e)}
            value={message}
            placeholder="type message .........."
          />
          <Button
            style={styles.button}
            color="#eb5526"
            title="Send"
            onPress={sendMessage}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  scrollView: {
    flexDirection: 'column',
    padding: 10,
    paddingBottom: 30,
    marginBottom: 10,
  },
  message: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 7,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 20,
  },
  current: {
    backgroundColor: '#0f58a5',
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: '#eaeaea',
    alignSelf: 'flex-start',
  },
  header: {
    padding: 20,
    backgroundColor: '#0f58a5',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontWeight: '500',

    color: '#fff',
    fontSize: 20,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.4,
    borderTopColor: '#f9f9f9',
    backgroundColor: '#eaeaea',
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 7,
    width: '80%',
  },
  button: {
    borderRadius: 7,
    cursor: 'pointer',
    width: '20%',
  },
});

export default Chat;
