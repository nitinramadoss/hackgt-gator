function draw(options) {
    let canvas = document.getElementById('canvas');
    const context = canvas.getContext("2d");
    if (canvas.getContext) {
      context.strokeRect(options[0], options[1], options[2] - 50, options[3] - 50);
    }
}

export default draw