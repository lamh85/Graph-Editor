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