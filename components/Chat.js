import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

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
    }
    /*Integrate configuration info into chat.js file to allow app to connect to Firestore.*/
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //create reference to the messages collection in the database:
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  componentDidMount() {
    // Reference to load messages via Firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");
    
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
      this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
      this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
    });
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
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),() => {
      this.addMessage();
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

  render() {
    let name = this.props.route.params.name;
    let bgColor = this.props.route.params.bgColor;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1, backgroundColor: bgColor}}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
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