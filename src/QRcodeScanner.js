import React, { Component } from 'react';
import QrReader from 'react-weblineindia-qrcode-scanner';

class QRcodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: 'No result',
    };

    this.handleScan = this.handleScan.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    this.requestCameraPermission();
  }

  requestCameraPermission() {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        // Access granted, initialize your scanner here
        this.initScanner(stream);
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        // Handle errors, show user a message, etc.
      });
  }

  initScanner(stream) {
    this.setState({
      previewStyle: {
        height: 240,
        width: 320,
      },
      stream: stream,
    });
  }

  componentWillUnmount() {
    // Stop the camera stream when the component is unmounted
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => track.stop());
    }
  }

  handleScan(data) {
    if (data) {
      this.setState({
        result: data,
      });
      const inputElement = document.getElementById("to");
      if (inputElement) {
        inputElement.value = data;
      }
    }
  }

  handleError(err) {
    console.error(err);
  }

  render() {
    return (
      <div>
        {this.state.stream && (
          <QrReader
            delay={this.state.delay}
            style={this.state.previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
          />
        )}
        <p>{this.state.result}</p>
        
      </div>
    );
  }
}

export default QRcodeScanner;
