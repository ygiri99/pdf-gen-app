import { useState, useRef } from 'react';
import { Page, Text, Image, pdf, Document, StyleSheet } from '@react-pdf/renderer';
import {saveAs} from 'file-saver';
import './App.css';

const styles = StyleSheet.create({
  image: {
    padding: 15,
    marginTop:20,
  }
});

function App() {
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const convertToPdf = () => {
    const files = fileInputRef.current.files;
    const images = [];
    
    for(let i=0;i<files.length;i++){
      const file= files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        images.push(event.target.result);

        if(images.length === files.length){
          pdfDownload(images);
          fileInputRef.current.value ="";
        }
      };
      reader.onerror = (error) => {
        console.log(`Error reading file: ${error}`);
      };
      reader.readAsDataURL(file);
    }
  }

  const pdfDownload = (images) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      if(currentProgress > 100){
        clearInterval(interval);
        generatePdf(images);
        setProgress(0);
      }
      else{
        setProgress(currentProgress);
      }
    }, 300);
  }

  const generatePdf = async(images) => {
    try {
      const doc = (
        <Document>
          {images.map((img, index) => (
            <Page key={index}>
              <Image src={img} style={styles.image} />
            </Page>
          ))}
        </Document>
      );

      const asPdf = pdf();

      asPdf.updateContainer(doc);
      const pdfBlob = await asPdf.toBlob();
      saveAs(pdfBlob, 'converted');

    } catch (error) {
      console.error(`Generating error: ${error}`);
    }
  }

  return (
    <>
      <h1>Image to PDF Converter</h1>
      <div className="container">
        <input className='button' type='file' ref={fileInputRef} multiple/>
        <button onClick={convertToPdf}>Convert to pdf</button>
      </div>
      <div className="download">
          <div className="progress"
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#32dc20",
            transition: "width 0.3s ease-in-out"
          }}>
          </div>
        </div>
    </>
  )
}

export default App;