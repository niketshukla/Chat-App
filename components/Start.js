import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, TouchableOpacity, Pressable } from 'react-native';

export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      bgColor: this.colors.blue
    };
  }

  // function to update the state with the new background color for Chat Screen chosen by the user
  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  colors = {
    red: "#fe4a49",
    green: "#2ab7ca",
    yellow: "#fed766",
    gray: "#e6e6ea",
    blue: "#b3cde0",
  };

  render() {
    return (
      <ImageBackground source={require('../assets/login.png')} style={{width: '100%', height: '100%'}}>
        <View style={[styles.container]}>
          <Text style={styles.title}>Meet App</Text>
        </View>
        <View style={[styles.loginContainer]}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({name: text})}
            value={this.state.name}
            placeholder='Your Name'
          />
          <Text style={styles.chooseBackground}>Choose Background Color:</Text>
          <View style={styles.colorSelect}>
            <TouchableOpacity
              style={[styles.circle, styles.red]}
              onPress={() => this.changeBgColor(this.colors.red)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.circle, styles.green]}
              onPress={() => this.changeBgColor(this.colors.green)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.circle, styles.yellow]}
              onPress={() => this.changeBgColor(this.colors.yellow)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.circle, styles.gray]}
              onPress={() => this.changeBgColor(this.colors.gray)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.circle, styles.blue]}
              onPress={() => this.changeBgColor(this.colors.blue)}
            ></TouchableOpacity>
          </View>
          <Pressable
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  bgColor: this.state.bgColor,
                })
              }
            >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </Pressable>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#fff',
  },
  loginContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 15,
    padding:15,
    backgroundColor: '#fff',
  },
  textInput: {
    width: '100%',
    height: 50,
    borderColor: 'rgba(117, 112, 131, 0.5)',
    borderWidth: 2,
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
    paddingHorizontal: 15,
    borderRadius: 3,
    marginBottom: 30
  },
  chooseBackground: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20
  },
  colorSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '80%',
    marginBottom: 30
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 50
  },
  red: {
    backgroundColor: "#fe4a49"
  },
  green: {
    backgroundColor: "#2ab7ca"
  },
  yellow: {
    backgroundColor: "#fed766"
  },
  gray: {
    backgroundColor: "#e6e6ea"
  },
  blue: {
    backgroundColor: "#b3cde0"
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 3,
    backgroundColor: "#757083",
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});