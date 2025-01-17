
export type ExifData = {
  iso: string,
  shutterSpeed: string,
  focalLength: string,
  aperture: string,
  type: string,
  lens: string,
  model: string,
  date: Date,
  gps: {
    latitude: string
    longitude: string
  }
}