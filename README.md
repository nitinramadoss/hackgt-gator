# Canvas Board

Goal: Reimaging virtual education, providing educators a virtual whiteboard to make teaching easier. This idea is an alternative for educators who screen share paint applications when drawing out concepts in classes such as physics, linear algebra, database modeling and more. With this convenient whiteboard, educators can optimize class time for teaching concepts instead of dealing with the inconveniences of drawing via their mouse while streaming to their class.

Features:
1) NLP Speech to Text to capture educator’s voice, render drawings to screen on keywords (i.e. draw circle, draw rectangle, draw arrow)
2) Handtrack.js to capture educator’s gestures to draw shapes on the screen when the educator is trying to teach a concept (i.e. physics problems, free body diagrams [vector arrows, rectangles for objects, circles for gaussian surfaces])

How it works:
Canvas Board uses Microsoft speech-to-text to accept verbal commands for drawing. The user, the educator, can say basic commands such as "Canvas write <input text said by user>, to render a textbox with the input, and Canvas <draw shape name>, to render a specific shape, to the screen. NLP through Microsoft LUIS-AI converts inputs into actions for Canvas Board to run. Using handtrack.js, Canvas Board allows the user to drag and resize these visual elements across their screen and build diagrams using the "Place" voice command to anchor the element. There are additional commands for color input, angle orientation, and opacity for personalization.
  
How to run:
0) Start Local Dev Server
1) Clone Repository
2) Open index.html
3) Showtime!

How to use:
0) Say Canvas ______
  - Draw/Create/Whatever cuz NLP ya know + shape + transpareny etc to start drawing a object
  - Delete to clear CanvasBoard
  - Drop to place object on board
  - Write --whatever-- to write text to board

Some Technologies We Used:
1) Microsoft Azure Cognitive Speech-to-Text
2) Microsoft Azure LUIS-AI
3) HandTrack.js
4) GitHub (everyone's favorite :)

Languages:
1) JavaScript
2) HTML5
3) CSS

Having Trouble Running?
Check your microphone and webcam functionallities.
Check API tokens (maybe api shutdown)
I'm sorry.... send me a message :(

A cool game to play to pass the time (if you're a real OG you know whats up)
https://candybox2.github.io/

The song of the hackathon (my vibe):
Talking Body by Tove Lo

Our "breakthrough moments"
  these are moments that the boys went a little wild
  1) Getting BoardAction to App.js
  2) Rendering the rectange on the video
  3) Rendering multiple shapes on voice commmand

The source of the cooking cat casually watching lecture on our lecture call
  https://www.youtube.com/watch?v=NZN2RpDFqJA
  HE'S REALLY CUTE AND ABSOLUTELY AMAZING! WATCH HIM CHEF IT UP HERE ^

