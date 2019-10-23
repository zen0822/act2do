import EXIF from 'exif-js'

export default async function clipImage(file, callback) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const image = new Image()

  image.onload = async () => {
    const wScale = image.width / 1920
    const hScale = image.height / 1080
    let w, h

    if (wScale > hScale) {
      w = image.width / wScale
      h = image.height / wScale
    } else {
      w = image.width / hScale
      h = image.height / hScale
    }

    canvas.width = w
    canvas.height = h

    getPhotoOrientation(file, (orient) => {
      switch (orient) {
        case 2:
          context.translate(w, 0)
          context.scale(-1, 1)
          context.drawImage(image, w, 0, w, h)
          break
        case 3:
          context.rotate(180 * Math.PI / 180)
          context.drawImage(image, -w, -h, w, h)
          break
        case 4:
          context.translate(w, 0)
          context.scale(-1, 1)
          context.rotate(180 * Math.PI / 180)
          context.drawImage(image, -w, -h, w, h)
          break
        case 5:
          context.translate(w, 0)
          context.scale(-1, 1)
          context.rotate(90 * Math.PI / 180)
          context.drawImage(image, 0, -w, h, w)
          break
        case 6:
          canvas.width = h
          canvas.height = w
          context.rotate(90 * Math.PI / 180)
          context.drawImage(image, 0, 0, w, -h)
          break
        case 7:
          context.translate(w, 0)
          context.scale(-1, 1)
          context.rotate(270 * Math.PI / 180)
          context.drawImage(image, -h, 0, h, w)
          break
        case 8:
          context.rotate(270 * Math.PI / 180)
          context.drawImage(image, -h, 0, h, w)
          break
        default:
          context.drawImage(image, 0, 0, w, h)
      }

      image.crossOrigin = 'anonymous'
      const data = canvas.toDataURL('image/jpeg')
      callback(data.split(',')[1], data)
    })
  }

  image.src = getObjectURL(file)
}

function getObjectURL(file) {
  let url = null
  if (window.createObjectURL !== undefined) {
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) {
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

function getPhotoOrientation(image, callback) {
  const reader = new FileReader()
  reader.onload = function(event) {
    // 文件里的文本会在这里被打印出来
  }

  reader.readAsText(image)

  let orient
  EXIF.getData(image, function () {
    orient = EXIF.getTag(this, 'Orientation')
    callback(orient)
  })
}
