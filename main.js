// star width
document.querySelectorAll('.star').forEach(star => {
  const size = Math.floor(Math.random() * 50) + 200;
  star.style.width = `${size}px`;
});

const SPEED_MIN = 0.6;
const SPEED_MAX = 1.4;

// quote
document.addEventListener("DOMContentLoaded", () => {
  const quotes = Array.from(document.querySelectorAll(".quote"));
  const active = [];
  let shownCount = 0;

  quotes.forEach(q => q.style.display = "none");

  //click and generate
  function activateQuote(quote) {
    quote.style.display = "inline-block";
    quote.style.position = "absolute";
    quote.style.left = "0px";
    quote.style.top = "0px";
    quote.style.right = "auto";
    quote.style.bottom = "auto";
    quote.style.transform = "none";
  
    const rect = quote.getBoundingClientRect();
    const w = window.innerWidth;
    const h = window.innerHeight;
  
    //generate at the center
    let x = (w - rect.width) / 2;
    let y = (h - rect.height) / 2;
  
    const dx = (Math.random() < 0.5 ? -1 : 1) * (SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN));
    const dy = (Math.random() < 0.5 ? -1 : 1) * (SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN));
  
    quote.dataset.x = x;
    quote.dataset.y = y;
    quote.dataset.dx = dx;
    quote.dataset.dy = dy;
  
    quote.style.transform = `translate(${x}px, ${y}px)`;
    active.push(quote);
  }
  
  //quote float motion
  function tick() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const q of active) {
      let x = parseFloat(q.dataset.x);
      let y = parseFloat(q.dataset.y);
      let dx = parseFloat(q.dataset.dx);
      let dy = parseFloat(q.dataset.dy);
      const rect = q.getBoundingClientRect();
      x += dx;
      y += dy;

      //if touch edge then bounce back 
      if (x <= 0 || x + rect.width >= w) {
        dx = -dx;
        x = Math.max(0, Math.min(x, w - rect.width));
      }
      if (y <= 0 || y + rect.height >= h) {
        dy = -dy;
        y = Math.max(0, Math.min(y, h - rect.height));
      }
      q.dataset.x = x;
      q.dataset.y = y;
      q.dataset.dx = dx;
      q.dataset.dy = dy;
      q.style.transform = `translate(${x}px, ${y}px)`;
    }
    requestAnimationFrame(tick);
  }
  tick();

  function onClick() {
    if (shownCount < quotes.length) {
      const q = quotes[shownCount++];
      activateQuote(q);
    }
  }
  window.addEventListener("click", onClick, { capture: true });

  
  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const q of active) {
      const rect = q.getBoundingClientRect();
      let x = parseFloat(q.dataset.x);
      let y = parseFloat(q.dataset.y);
      x = Math.max(0, Math.min(x, w - rect.width));
      y = Math.max(0, Math.min(y, h - rect.height));
      q.dataset.x = x;
      q.dataset.y = y;
      q.style.transform = `translate(${x}px, ${y}px)`;
    }
  });
});
