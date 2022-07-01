import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// import Firestore
const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDDwf94O1AW36y9Ew0xMu1-0NWEEnh8aQU",
  authDomain: "ichat-f17c3.firebaseapp.com",
  projectId: "ichat-f17c3",
  storageBucket: "ichat-f17c3.appspot.com",
  messagingSenderId: "144953025735",
  appId: "1:144953025735:web:800ac862745220b9bb8ae2",
  measurementId: "G-3STWTBC4XT"
}

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      loggedInText: 'Just a moment, logging in...',
      isConnected: false,
    }
    /*Integrate configuration info into chat.js file to allow app to connect to Firestore.*/
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //create reference to the messages collection in the database:
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  //function to get messages from asyncStorage
  async getMessages() {
    let messages = '';
    try {
      /*Read messages in storage. 
        If there is no storage item with that key, messages are set to be empty*/
      messages = (await AsyncStorage.getItem('messages')) || [];
      //give messages the saved data
      this.setState({
        /* asyncStorage can only store strings. 
          This converts the saved string back into a JSON object*/
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // get name prop from user input on start screen
    const { name } = this.props.route.params;
    // set the title of the chat screen to user's name
    this.props.navigation.setOptions({ title: name });
    // Reference to load messages via Firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // load messages from asyncStorage
    this.getMessages();
    
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        this.setState({ isConnected: true });
        // Check if user is signed in. If not, create a new user.
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          //update user state with currently active user data
          this.setState({
            uid: user.uid,
            loggedInText: 'Hello there',
            messages: [],
            user: {
              _id: user.uid,
              name: name,
              avatar: 'https://placeimg.com/140/140/any',
            },
          });

          // create reference to active user's messages
          // this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
          this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({ isConnected: false });
        this.props.navigation.setOptions({ title: `${name} is Offline` });
      }
    });
  }
  
  //function to save messages in the asyncStorage
  async saveMessagesOffline() {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  //Delete stored messages. To get rid of test messages during development.
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentWillUnmount() {
    //stop listening for changes
    this.unsubscribe();
    this.authUnsubscribe();
  }

  // allows user to see new messages when database updates
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages: messages,
    });
    this.saveMessagesOffline();
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),() => {
      this.addMessage();
      this.saveMessagesOffline();
    });
  }

  // Add new messages to the firebase messages collection
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      // uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#63ace5'
          }
        }}
      />
    )
  }

  // Render InputToolbar to send messages only when user is online.
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
      // hide InputToolbar
    } else {
      return <InputToolbar {...props} />;
    }
  }

  render() {
    let bgColor = this.props.route.params.bgColor;

    return (
      <View style={{flex:1, backgroundColor: bgColor}}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.user.name,
            avatar: this.state.user.avatar,
          }}
          showAvatarForEveryMessage={true}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    )
  }
}