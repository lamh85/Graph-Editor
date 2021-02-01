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

# Example for helpers

```
component_helpers
  arrows
  edges
  vertices
  dom
data_helpers
  graphing
  trigonometry
  strings
```