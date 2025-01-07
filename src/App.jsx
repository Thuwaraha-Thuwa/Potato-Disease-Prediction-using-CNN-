import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("http://127.0.0.1:8010/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to get a prediction. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Potato Disease Prediction</h1>
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
        {preview && (
          <div className="preview">
            <h3>Image Preview:</h3>
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}
        <button onClick={handleUpload} className="button">
          Predict
        </button>
      </div>
      {result && (
        <div className="result-section">
          <h3>Prediction Result:</h3>
          <p>
            <strong>Class:</strong> {result.predicted_class}
          </p>
          <p>
            <strong>Confidence:</strong> {result.confidence}%
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
