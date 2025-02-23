import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import Angry from "./assets/Angry";
import Neutral from "./assets/Neutral";
import Happy from "./assets/Happy";
import Sad from "./assets/Sad";
import Fearful from "./assets/Fearful";
import Surprised from "./assets/Surprised";
import Disgusted from "./assets/Disgusted";

function faceProvider(expression){
  if(expression=="sad"){
    return <Sad></Sad>;
  }else if(expression=="happy"){
    return <Happy></Happy>;
  }else if(expression=="angry"){
    return <Angry></Angry>
  }else if(expression == "fearful"){
    return <Fearful></Fearful>
  }else if(expression == "surprised"){
    return <Surprised></Surprised>
  }else if(expression == "disgusted"){
    return <Disgusted></Disgusted>
  }else{
    return <Neutral></Neutral>
  }
};

const App = () => {
  const [expression, setExpression] = useState("");
  const [camError,setCamError] = useState("");


  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

      // Load models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          detectExpressions(stream);
        })
        .catch((err) => {console.error("Error accessing webcam:", err)
          setCamError("error while accesing cam");
        });
    };

    const detectExpressions = async (stream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.addEventListener("loadeddata", async () => {
        console.log("i am listner");
        setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (detections.length > 0) {
            console.log(detections);
            const { expressions } = detections[0];
            const topExpression = Object.entries(expressions).reduce((prev, current) =>
              prev[1] > current[1] ? prev : current
            );
            console.log(topExpression);
            setExpression(topExpression[0]); // Set the expression name with the highest confidence
          }
        }, 1000);
      });
    };

    loadModels();
  }, []);

  return (
    <div>
      <h1>Face Expression Recognition : {expression}</h1>
        {faceProvider(expression)}
      {/* <p><strong>Detected Expression:</strong> {expression}</p> */}
      <p>{camError}</p>
    </div>
  );
};

export default App;


// neutral
// happy
// sad
// angry
// fearful
// disgusted
// surprised

// it can detect this faces
