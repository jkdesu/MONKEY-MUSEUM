const canvas = document.getElementById("pixel-bg");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const size = 10;
const cols = Math.floor(width / size);
const rows = Math.floor(height / size);

const pixels = [];

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    pixels.push({
      x: x * size,
      y: y * size,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      alpha: Math.random()
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  pixels.forEach((p) => {
    ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, ${p.alpha})`;
    ctx.fillRect(p.x, p.y, size - 1, size - 1);
    p.alpha += (Math.random() - 0.5) * 0.05;
    p.alpha = Math.max(0.1, Math.min(1, p.alpha));
  });
  requestAnimationFrame(draw);
}

draw();

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});
