
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import tensorflow as tf
import numpy as np
import uvicorn

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model and class names
model = tf.keras.models.load_model("D:/Thuwa Eruma maadu/Potato Diseses/Backend/0.h5")
class_names = ["Healthy", "Early Blight", "Late Blight"]  # Example classes

def predict(model, img):
    img = img.resize((224, 224))  # Resize image to match model input size
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = round(100 * np.max(predictions[0]), 2)
    return predicted_class, confidence


@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    try:
        # Load the image
        image = Image.open(file.file)
        
        # Predict
        predicted_class, confidence = predict(model, image)

        # Return response
        return JSONResponse({
            "predicted_class": predicted_class,
            "confidence": confidence
        })
    

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

if __name__=="__main__":
   uvicorn.run(app,host='0.0.0.0',port=8010)