# HIIT-Happens - up2115791

## Features

### Progressive Web App

- Install - The browser should offer an installation prompt/button. Once the app is installed, it should be in a standalone window.
- Works offline - The page should still load and function completely while offline. Bring the page offline in...
    - Chrome: DevTools > Network > No Throttling > Offline
    - Firefox: File > Work Offline

The service worker implements precaching when it is installed, and live caching using the stale-while-revalidate strategy. This is advantageous strategy because it offers better freshness than cache-then-network, while beating network-then-cache in worst case speed.

### Visual Cues

While the timer is running, the colour of the progress bar and backdrop change according to the category the workout is in. When creating or editing a workout, the colours of the buttons in the exercise picker correspond to the colour the timer will be.

This visual cue will particularly help users who are very familiar with the workout they are running, as they won't need to read the text to know which exercise the colour corresponds to.

### Download/Upload Workouts

The user may download or upload workouts as JSON files. This format is appropriate as the workouts are already serialised using `JSON.stringify` when they are stored in `localStorage`.

Download workouts via the 'Download Workouts' button, and click on the name of the workout you want to download.

## AI

### App Name

> I'm developing an app for HIIT exercises, what would be some good names for it?

I ended up using none of the names, but came up with my own based on the types of wordplay it came up with.

### Exercises

> What exercises could one do in their living room?

The workouts were split into: warm-up, strength, and cool-down exercises. I used the exercises it came up with (`client/components/exercises.json`), and assigned each a colour based on its category.

> Could you give me some more cool down exercises?

The response to this prompt was unhelpful: it elicited more specifics on the cool down exercises it had already told me about, rather than additional exercises.
