import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }  
    }
  }
};

const app = new Clarifai.App({
 apiKey: '582ab23cae4e40daa34ab500d3771f39'
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
 
  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({ box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
    console.log(event.target.value)
  }

  onBtnSubmit = (event) => {
    this.setState({ imageUrl: this.state.input });
    console.log('clicked');
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if(route === 'home'){
      this.setState({ isSignedIn: true })
    }
    this.setState({ route })
  }

  render() {
    const { isSignedIn, imageUrl, box, route } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
            params={{ particlesOptions }}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          (route === 'home') 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm  onInputChange={this.onInputChange} onBtnSubmit={this.onBtnSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div> 
          : ( 
              route === 'signin' 
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;




































