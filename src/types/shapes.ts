interface Shape {
  type: 'circle' | 'rectangle'
}

interface Circle extends Shape {
  radius: number
}

interface Rectangle extends Shape {
  height: number,
  width: number
}
