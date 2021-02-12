export interface Shape {
  type: 'circle' | 'rectangle'
}

export interface Circle extends Shape {
  radius: number
}

export interface Rectangle extends Shape {
  height: number,
  width: number
}

// module.export = {
//   Circle,
//   Rectangle
// }
