# HIIT-Happens - up2115791

## Features

### Progressive Web App

- Install - The browser should offer an installation prompt/button. Once the app is installed, it should be in a standalone window.
- Works offline - The page should still load and function completely while offline. Bring the page offline in:
    - Chrome: DevTools > Network > No Throttling > Offline
    - Firefox: File > Work Offline

The service worker implements precaching when it is installed, and live caching using the stale-while-revalidate strategy. I chose this strategy because it offers better freshness that cache-then-network.

## AI

### App Name

> I'm developing an app for HIIT exercises, what would be some good names for it?

I ended up using none of the names, but came up with my own based on the types of wordplay it came up with.

### Exercises

> What exercises could one do in their living room?

The workouts were split into: warm-up, strength, and cool-down exercises. I used the exercises it came up with (`client/components/exercises.json`), and assigned each a colour based on its category.

> Could you give me some more cool down exercises?

The response to this prompt was unhelpful: it elicited more specifics on the cool down exercises it had already told me about, rather than additional exercises.
