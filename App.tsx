import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const window = Dimensions.get('window');
const screenWidth = window.width;
const screenHeight = window.height;

const App = () => {
  const [pdfFilePath, setPdfFilePath] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const selectImagesFromCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel) {
        const source = {  uri: response.assets[0].uri };
        setSelectedImages((prevImages) => [...prevImages, source]); 
      }
    });
  };

  const selectImagesFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel) {
        const source = { uri: response.assets[0].uri }; 
        setSelectedImages((prevImages) => [...prevImages, source]);
      }
    });
  };

  const createPDF = async () => {
    try {
      const dpi = 300;
      const inchesToPixels = (inches) => inches * dpi;
  
      const pdfWidth = inchesToPixels(8.27);
      const pdfHeight = inchesToPixels(11.69);
  
      let pdfContent = '';
      selectedImages.forEach((image, index) => {
        // Calculate image dimensions to fit PDF width and height
        const imageWidth = pdfWidth;
        const imageHeight = pdfHeight;

        console.log(image.uri,'selected')
  
        // Apply page break style to all images except the last one
        const pageBreakStyle = index !== selectedImages.length - 1 ? 'page-break-after: always;' : '';
  
        const imageHtml = `<div style="width: ${pdfWidth}px; height: ${pdfHeight}px; ${pageBreakStyle}"><img src="${image.uri}" style="width: ${imageWidth}px; height: ${imageHeight}px;" /></div>`;
        pdfContent += imageHtml;
      });
  
      const options = {
        html: `<html><body>${pdfContent}</body></html>`,
        fileName: 'output',
        directory: 'Documents',
        width: pdfWidth,
        height: pdfHeight,
      };
  
      const pdf = await RNHTMLtoPDF.convert(options);
      setPdfFilePath(pdf.filePath);
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
  };  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <Button title="Select Images from Camera" onPress={selectImagesFromCamera} />
          <Button title="Select Images from Gallery" onPress={selectImagesFromGallery} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {selectedImages.map((image, index) => (
              <Image key={index} source={image} style={{ width: 200, height: 200, margin: 5 }} />
            ))}
          </View>
          <Button title="Create PDF" onPress={createPDF} />
          {pdfFilePath !== '' && (
            <View style={{ marginTop: 20 }}>
              <Text>PDF saved to:</Text>
              <Text>{pdfFilePath}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
