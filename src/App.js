import React, { Component } from 'react';
import { ImageCapture } from 'image-capture';

import './App.css';

class App extends Component {
  mediaDevices = navigator.mediaDevices;
  constructor() {
    super();
    this.state = {
      isOpenCamera: false,
      video: null,
      videoFrame: null
    };
  }

  initCamera() {
    this.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.refs.videoContainer.srcObject = stream;
      this.refs.videoContainer.play();
      this.setState({ isOpenCamera: true });
    });
  }

  processFrame(vidElm, imageCapture) {
    const stream = vidElm.srcObject;
    const mediaStreamTrack = stream.getVideoTracks()[0];
    imageCapture = new ImageCapture(mediaStreamTrack);
    imageCapture.grabFrame().then(imageBitmap => {
      this.refs.canvasVideo.width = imageBitmap.width;
      this.refs.canvasVideo.height = imageBitmap.height;
      this.refs.canvasVideo.getContext('2d').drawImage(imageBitmap, 0, 0);
    });
    if (this.state.isOpenCamera) {
      const videoFrame = setTimeout(() =>
        this.processFrame(vidElm, imageCapture)
      );
      this.setState({ videoFrame });
    }
  }

  closeCamera() {
    const video = this.refs.videoContainer;
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });
    video.srcObject = null;
    const canvas = this.refs.canvasVideo;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearTimeout(this.state.videoFrame);
    this.setState({ video, isOpenCamera: false });
  }

  render() {
    return (
      <div>
        Hello
        {!this.state.isOpenCamera ? (
          <button onClick={this.initCamera.bind(this)}>Open Camera</button>
        ) : (
          <button onClick={this.closeCamera.bind(this)}>Close Camera</button>
        )}
        <video
          ref="videoContainer"
          onPlay={() => this.processFrame(this.refs.videoContainer)}
          style={{ display: 'none' }}
        />
        <canvas ref="canvasVideo" />
      </div>
    );
  }
}

export default App;
