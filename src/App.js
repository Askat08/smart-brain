import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 0,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
 apiKey: '582ab23cae4e40daa34ab500d3771f39'
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
    console.log(event.target.value)
  }

  onBtnSubmit = (event) => {
    this.setState({ imageUrl: this.state.input });
    console.log('clicked');
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      function(response) {
        // do something with response
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
      },
      function(err) {
        // there was an error
      } 
    )
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
            params={{ particlesOptions }}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm  onInputChange={this.onInputChange} onBtnSubmit={this.onBtnSubmit} />
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div> 
    );
  }
}

export default App;






