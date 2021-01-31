# Levels of data (from high to low)

Transformations. EG:
* rotate
* skew

SVG coordinates

Interfaces with geometry principles. EG:
* A function that outputs special triangles

Geometry principles. EG:
* Special triangles
* Trigonometry formulas

# Directory structure

Root level - Each folder is a different type of a user and/or environment:
* testing
* webpack build
* source code
* configurations: Babel, etc

Within the source code
1. Divide by different parts of the flow
  * DOM helpers
  * React/DB data analysis
  * primitive helpers - arrays, strings, etc
  * geometry helpers
  * hooks
  * renders
  * Typescript declarations
2. Within the flow segment, divide by resource:
  * Vertices
  * Edges
  * Arrows

# Old ideas

## Rectangle tangent

Finding the cartesian quadrant before finding the intercept:

https://github.com/lamh85/Graph-Editor/blob/f178569bcd55b5f29043981cbd8a0c9e78672f83/src/geometry_helpers/get_vertex_tangent.js