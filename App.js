
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  LogBox,
} from 'react-native';
import {Button} from 'react-native-elements';
import ProgressBar from 'react-native-progress/Bar';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      menu: true,
      dataSource: null,
      loading: null,
      output: null,
    }
  }

  selectGalleryImage(){
    const options = {
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel){
          console.log('User Cancelled');
      } else if(response.error){
          console.error('Error');
      }else if(response.customButton){
          console.log('Clicked a custom Button');
      } else{
          console.log(response.uri);
          this.setState({
            dataSource : response.base64,
          });
          this.colorize();
        }
    });
  }

  colorize(){
    // console.log(this.state);
    console.log('Started Axios Call');
    this.setState({
      loading: true,
    });

    axios.post('http://809e6be800e5.ngrok.io/', {
      'imageBase64': this.state.dataSource,
    }).then(res =>{
      console.log('request completed!');
      // console.log(res.data);
      this.setState({
        output: res.data,
        loading:null,
      });
    }).catch(err => {
      console.log(err);
    });

  }

  render(){
    const {dataSource, output, loading} = this.state;
    return(
      <View style={styles.mainContainer}>
        <View style={styles.titleContainer}> 
          <Text style={styles.title}> Image Cartoonifier </Text>
          <Text style={styles.subtitle}> Make your image cartoon </Text>
        </View>
        <View style={styles.imageContainer}>
          {
            dataSource ?
              loading ?
                <ProgressBar indeterminate={true}></ProgressBar>
                :
                <Image source={{uri: `data:image/png;base64,${output}` }} style={styles.displayImage}></Image>
              :
            <Image source={require('./assets/oldcam.png')} style={styles.displayImage}></Image>
          }
          
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="Select Image"
            titleStyle={{fontSize: 20}}
            buttonStyle={styles.button}
            onPress={this.selectGalleryImage.bind(this)}>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    backgroundColor: '#faf0b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer:{
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle:{
    fontSize: 20,
  },
  imageContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer:{
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 70,
  },
  button:{
    width: 200,
    height: 57,
    backgroundColor: 'black',
    borderRadius: 8,
  },
  displayImage:{
    width: 250,
    height: 250,
  },

})

