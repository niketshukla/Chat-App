import React from 'react';
import { View, Text} from 'react-native';


export default class Chat extends React.Component {
  render() {

    let name = this.props.route.params.name;
    let bgColor = this.props.route.params.bgColor;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor}}>
        <Text>Hello Chatters!</Text>
      </View>
    )
  }
}