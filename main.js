const image1 = document.getElementById("image1")
const image2 = document.getElementById("image2")

const label = document.querySelector(".analyzing")
const precision = document.querySelector(".precision")

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("../lib/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../lib/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../lib/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("../lib/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("../lib/models"),
])
  .then(compareImgs)
  .catch((err) => console.error(err))

function compareImgs() {
  const detections1 = faceapi
    .detectAllFaces(image1)
    .withFaceLandmarks()
    .withFaceDescriptors()
  const detections2 = faceapi
    .detectAllFaces(image2)
    .withFaceLandmarks()
    .withFaceDescriptors()

  Promise.all([detections1, detections2])
    .then(([detections1, detections2]) => {
      const distance = faceapi.euclideanDistance(
        detections1[0].descriptor,
        detections2[0].descriptor
      )

      if (parseFloat(distance.toFixed(2)) <= 0.65) {
        label.textContent = "As imagens têm rostos idênticos"
        precision.textContent = `Distancia Euclidiana: ${distance.toFixed(2)}`
      } else {
        label.textContent = "As imagens têm rostos diferentes"
        precision.textContent = `Distancia Euclidiana: ${distance.toFixed(2)}`
      }
    })
    .catch((err) => console.error(err))
}
