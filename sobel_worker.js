importScripts('sobel.js')

self.onconnect = function(event) {
  const port = event.ports[0];

  port.onmessage = function(event) {
    let msg = event.data;
    let newImageData
    switch(msg.cmd){
      case 'sobelEdgeDetection':
        newImageData = sobelEdgeDetection(...msg.param)
      break;
      case 'adjustBrightnessAndContrast':
        newImageData = adjustBrightnessAndContrast2(...msg.param)
      break;
    }
    port.postMessage({callback: msg.callback, param: [newImageData] })
  };

  port.onerror = function(error) {
    console.error('Error in shared worker:', error);
  };
};

function convertToImageData(data, width, height){
  return new ImageData(data, width, height)
}

function sobelEdgeDetection(imageData, sigma) {
  const grayImageData = grayscale(imageData)
  //const histogramEq = histogramEqualization(imageData)
  const blurredImageData = gaussianBlur(grayImageData, sigma)
  const edges = sobelOperator(blurredImageData)
  return new ImageData(invert(edges), imageData.width, imageData.height)
}
