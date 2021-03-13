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

## Comparing flows:

Resize
* mouse down: vertex's outline -> select the vertex
* mouse move -> update the vertex and render
* mouse up -> de-select the vertex

Move
* mouse down: vertex -> select the vertex
* mouse move -> update the vertex and render
* mouse up -> de-select the vertex

Draw a vertex
* mouse down: empty space -> sets one x-y pair
* mouse move -> update the second x-y pair, render a tentative vertex
* mouse up -> create vertex

Place a vertex
* mouse move -> render a tentative vertex
* mouse down: anywhere -> create a vertex

## Flow consolidated by mouse events

Mouse down
* set state: origin coordinates (already provided when initializing the custom hook)
* set state: vertex, IF resizing or moving location
* set state: tool selected
* set state: paintbrush shape
* Create a vertex IF paintrbrush mode

Mouse move
* set state: the build of the vertex IF paintbrush mode
* update vertex IF resizing or moving location

Mouse up
* create IF drag-to-create

## Interaction between different tools

Flow pattern 1
* User choose paintbrush
* User attempts to resize a vertex
* App does nothing because it is still in paintbrush mode
* Use cliciks a button to disable paintrbrush mode
* Now user can resize a vertex

Flow pattern 2
* User mouse-down on a vertex to start moving it
* While mouse-moving the vertex, no other modes can be enabled because mouse-moving prevents clicking. All other tools require clicking on a vertex or clicking a menu item.

## Possible design patterns

Template: https://refactoring.guru/design-patterns/template-method/ruby/example#example-0
* Super class defines the high-level logical flow
* Subclasses define the modules of that flow

Strategy: https://refactoring.guru/design-patterns/strategy/ruby/example#example-0
* The subclasses control the flow
* The super class defines some of the details for all different strategies.
* EG: Navigation app. A strategy is a mean of transportation. But all strategies must have a starting point, end point, same API stardards for retrieving map data, etc.

MVC:
* "Controller" = request handler
* "Model" = states, and logic for CRUD state

Chain of listeners
* custom hook listens to the components
* the create/update services listen to the hook (more applicable to mousemove event)

## Random thoughts

A state for keeping the payload of the tool.
* Why? A tool can be for either editing or creating. Designing the tool as a payload is more flexible than constraining it to a vertex ID, etc. This will push the datatype definition of the payload to the creator/updater function.