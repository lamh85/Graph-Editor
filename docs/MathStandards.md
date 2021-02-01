# Math values that need to be standardized.

Some values and concepts in math don't have an obvious conversion to a value in programming.

Example:
How do you express "clockwise" and "counter clockwise"? Should we use binary or a string?

* Directions: up, down, left, right
* Rotation direction: clockwise, counter clockwise

# Solutions

Summary - Reuse the conventions that already exist in CSS and DOM.

## Directions

In DOM, positive values are right and down, and negative values are up and left.

Therefore, any object that expresses direction would be interpreted like this:

```javascript
// Up and left:
const direction = {
  x: -10,
  y: -20
}

// Down and right
const direction = {
  x: 30,
  y: 40
}
```

## Rotation

Use the CSS convention:
* positive = clockwise
* negative = counter clockwise

Given an arrow, where should it point if it's rotated at 0 degrees?