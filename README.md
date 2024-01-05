# What is this?

This is a diagram creator/editor.

# How to run

Requires the Node version mentioned in `.nvmrc` file.

Install dependencies: `npm run start`

In the web browser, open `localhost:[PORT]`

# Features and Demo

Features:
* Move any vertex, and the lines connected to other shapes will change angles.
* Resize circles by dragging the edge.
* Can place a shape.
* Can draw a shape.
* There is a menu for right-clicking empty spaces and right-clicking any shape.
* Can CRUD arrows that connect the shapes.

# Why did I make this?

To practice React.

I am interested in graphically intensive, and graphically complex logic. EG: data visualization, video games, collision detection, etc.

# Code Quality

## Directory Structure 

Like with many apps, this codebase is a snapshot of my preferred conventions **of the time**.

**I wrote this app before I learned more about co-location.** So it currently uses the Rails convention for the directory structure, which groups files based on application layer: views, controllers, models, services, etc.

In hindsight, I should have structured the directories based on co-location. My interpretation of co-location:
* Dependent code should share the same directory.
* General UX flows should share the same directory.

To use Google Maps as an example, co-location would make the directory structure look like this:
```
📂 src
  📂 components
    📂 settings (user settings page)
      📄 index.tsx 
      📄 Heading.tsx
      📄 Body.tsx
    📂 navigation (navigation mode)
      📄 index.tsx
    📂 map (the main for searching places)
      📂 search-bar
      📂 locations (restaurants, cafes, etc)
        📂 reviews
```

## Typescript

This app currently doesn't use Typescript.