# Ideas for helpers

## Triangle generator

Creates a model triangle that will provide:
* height
* width
* angles

# Circle tangent

## Problem

Given a circle and an external point,
find the point on the circle that connects the centre and the external point.

1. Get the angle between the centre and the external point.
2. Get the tangent with `f(centre point, radius, angle)`

# Rectangle tangent

## Challenge

Unlike a circle, a rectangle doesn't have a radius. At worst, there are 4 diffent ways of finding a tangent because there are 4 sides/quadrants.

## Current Solution

1. Regardless of where the external point originates, flip/rotate the orientation until the external point originates from Quadrant 4.
2. Solve the X and Y in Quadrant 4.
3. Flip/rotate the orientation back to the original.

## Old Solution

Finding the cartesian quadrant before finding the intercept:

https://github.com/lamh85/Graph-Editor/blob/f178569bcd55b5f29043981cbd8a0c9e78672f83/src/geometry_helpers/get_vertex_tangent.js

# Custom Hook for Mouse Drag

Use cases:
* resize a vertex
  * The edge of the vertex follows the cursor
* move a vertex
  * The clicked part of the vertex follows the cursor. EG: If cursor fired the mouse-down event at the top-left of a rectangle, then the top-left follows the cursor during the mouse-move.
* create a vertex, and define its size by dragging one corner to another

## Lifecycle / Flow

Mouse down
<br/>Custom hook records:
* the clicked object: client-defined payload
* The location of the click
* Boolean: has started session
* [Maybe] The clicked DOM element

Mouse move
* Update state: cursor location

Mouse up

## Flow for use case: Resize

Mouse down
* SET The vertex that is resized

Mouse move. For every pixel:
* IF there is a vertex resized, then...
  * GET cursor distance from the vertex's centre
  * GET affected vertex
  * SET vertex's radius

Mouse up.
* UNSET the vertex being resized

## Flow for use case: Move vertex
Same flow as resizing. Only difference: different attribute of the vertex.

## Flow for use case: Drag to create a vertex
Mouse down
* SET cursor coordinates

Mouse move
* Update the render of the shape

Mouse up
* Create the shape

# Coordinating different mouse tools

Only one tool can be active at a time.

EG: if paintbrush mode is enabled, then shape-drawing mode is disabled