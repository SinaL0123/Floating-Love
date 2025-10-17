// star width
document.querySelectorAll('.star').forEach(star => {
  const size = Math.floor(Math.random() * 50) + 200;
  star.style.width = `${size}px`;
});

const SPEED_MIN = 0.6;
const SPEED_MAX = 1.4;

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.querySelector('.stage');
  if (!stage) {
    console.error('[quotes] .stage not found');
    return;
  }

  const input = document.getElementById('newQuote');
  const btn   = document.getElementById('addQuote');

  const movers = [];
  const activeQuoteTexts = new Set(); // Track which quote texts are currently displayed
  
  const existingQuotes = [
    "Love is the quiet courage to stay.",
    "In your light, I learn how to glow.",
    "Love drifts through time — soft, endless, and quietly alive.",
    "Every heartbeat writes a small poem to the universe.",
    "To love is to see the ordinary shimmer."
  ];
  
  let currentQuoteIndex = 0; // Track which quote to show next
  
  const borderImages = [
    "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAACQ0lEQVR4AezcYWrCQBDF8dXD9Qw9Ys/Qy1kIRfSF5PWRF0viX1Acd3Z283NY8kG8jvLj9vV9O9KzfPmjDtre4NHqAVr+xgD9b1B3Pl4+Py5HerrrSb3p0FTM5ANqgNJhQFMxk29B9Yxx56Pma2z2Ux/W9TVOr8dt0IK6Aow/CwD67LE5AnQz4XOBGag7Y8YYzxVOHukZqz56+TNQTSDOBADNvGw2oJYoSwA087LZgFqiLAHQzMtmA2qJsoSr3lfpfVdWbgydr/F48UPX1zjdjs5XPzo0FTX5gBqgdBjQVMzkx6B6Zmi8sN79Y83fO74vvPDGrb8wbfHjGHSxEgOTAKATQ+8F0J7lVCkG1fswjaeqDy96Rmn+3rGu/7C16a1bf0oKXmLQoPZbpgJa/toBBbQsUC5HhwJaFiiXo0PfCLR8qa8pR4eWnQEFtCxQLkeHAloWKJejQwEtC5TL0aGAlgXK5ehQQMsC5XJn69AyT14O0NxsdQagqzz5IKC52eoMQFd58kFAc7PVGYCu8uSDgOZmqzN2B9XfDulvjfaOdf1VjcLg7qCFPR6qBKDlrwvQo4PqmbZ3/AevagodWuUc/Jlg2RPQOqieYXpf2F7w6PXUR/04Q8vfMKCAlgXK5ehQQMsC5XJ0KKBlgXK5WYfqfZXed22Ny/u35bbuV+f/+tz/Z1o3MAPVBOJMANDMy2YDaomyhBmonhlZufNnO58Z6PlJ9r1CQMu+gB4dVM+gveOyly1Hh1qiLAHQzMtmA2qJsoQfAAAA//8Jy75vAAAABklEQVQDAM0u8VaPORJiAAAAAElFTkSuQmCC') 28 /  28px / 0 round",
    "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAB5klEQVR4AezcQU7EMBBE0cAZZjnXmVNzHZbcAdbuKF2quBSI+UizMN0uxS8tz27eN/6iAoBGObcNUEDDAuG46Qn9+Pz6Xukz6zsNOvsAq+0HNPxGAf1t0Hpfvp6Pt5U+9XyuNxPqiol+QAWQWwbUFRP9ErTeKa/nY7gzRf7tyvX7oJ5fHUiCqgDqowCgo8f0CtBpwjFgB1rvjHqnjNvXX9XzV58qsAOtDaw9AUA9L9kNqCTyGgD1vGQ3oJLIawDU85LdgEoir+EqUO+pbtwNaPjlAQpoWCAcx4QCGhYIxzGhgIYFwnFMKKBhgXAcEwpoWCAc95cnNHzUa+IADTsDCmhYIBzHhAIaFgjHMaGAhgXCcUwooGGBcBwTCmhYIBy32oSGefw4QH2zdgegLY9fBNQ3a3cA2vL4RUB9s3YHoC2PXwTUN2t3ANry+EVAfbN2B6Atj18E1DdrdwC6bS2QWwTUFRP9gAogtwyoKyb6ARVAbhlQV0z0AyqA3DKgrpjo34G6v7Eh8pcrK58d6HICFx8I0DA4oFeDqjsj/Dx3iTt8Tib0kOZcAdBzboe7AD2kOVewQdWdWn8bbvV1ZbdBawDrUQDQ0WN6Beg04RgwDVrv1NXXI99+NQ26j/zf/wE0/P4BDYP+AAAA//9fWD0/AAAABklEQVQDAD8wXRe2h8DXAAAAAElFTkSuQmCC') 28 /  28px / 0 round",
    "url('data:image/png;base64,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') 28 /  28px / 0 round",
    "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAAAXNSR0IArs4c6QAAAoJJREFUeF7tnEFy4zAMBON8Me/cL25yTZiq7ZrCQHJ521eCINEYQhQl+fEGv7+ffz7J5nv7++PjkdjfbduOD4NvD3g3wHP8dnwCLa9Agd4NlGrkuYTInpbg2X/bfzqf0z5WKAHaDnjbv0DDXUWakNRehUJCYqDtbUM6AbKftk+XcMrnkXZo19ApMOov0GMJEjBqF+irAaUlTbeO24ppK64d768a2h6A/KUJEGh5WyJQgc7OM7eX8LZ/ukbQCrm9htIE7z4cIcBnggUangWQAATaBkrESfLUTtsm6j+tmVfH9+u0Kb23JyACDR8JCPTnrkiFkiKg/VyBeMA8HO+/6y7QcsoFKtAygbI7FSrQMoGyOxUq0DKBsjtUKN2KTm8ty/GM3U3jFeiRAoGONfnTgUCfHWh6/pjal+Mfu0vnT/Z42kQXHRpgHPGyg3T+ZC/Q4/x3KiCBbgOlZzDTDC6vYHRPS3Yaf7wPFei/XwQRaPlVIYFuA92uMVjkLjZox+tVfvsq387YxYKLh2vHq0K3FUr7sLOdtlGxZG7u4GlTOQECFWiZQNndukLL8315d3in9PIEygEKVKBlAmV3KlSgZQJldypUoGUCZXd4ODIdb3qvn54G0Xxp40796SxDoCnBwx6/AtnOYDp/FQoZfHmg2wpIayjNh9opYdP+dF7s18jtr5G3M6ZCyxkT6MVApysk7Z/apzX59ho6DTDtn9oLtPxqjUCfDShlhC4y6ZIi+2k77RvTeIiP/x8aKlqgBwFSPClaoFcDJeLTjFKNIkXc/Vdtafz4CCR1mNoLNCziKrRccwQKQKnmpgDJ33Z7+oSC4otrKAVIA1L/q9sFWiYu0CcH+gUOQbhpDjlqKgAAAABJRU5ErkJggg==') 28 /  28px / 0 round",
    "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAACPklEQVR4Xu2cy3LCMBAE8Q/mnE/MOT+YnJGr6JrakQmkue56tGqNHsaY4+anSuCoqil2E2jZBAIVaJlAWU6HCrRMoCynQ3cD/fn6/nnUxvH5cTcIaX65/lgurTfNPzk0FUjzYwLlC9J603yBLgM2nYECbQNdLb2O0Drjrs6nGf/X6j2uBpQCEOhCYDpgAv3vQGmNXOPTXZActzueHoPSfHf59i6vQ+8JTGegDt3tUHIsjSAdi3avkak+nUIoftpjqAASpDjpPztO9VNcoOGxTqCh5QkYxdGhqUC65ob9rafv7h/u8ukmMy24TjCc4tQ+9U+gyxMIgRKBZzs0rM/09cZAIl0CPkbu8vTHYmWeAhVom0BZzzVUoGUCZbnYoXTrVa7vcrlp/wRavpMSqED3rgJO+TJfgQo0TKAsp0MFWiZQltOhAi0TKMvp0FcHWq7/7eTiW8+3I1DukEAFWiZQltOhAi0TKMvpUIGWCZTldKhAywTKcjpUoGUCZTkdKtAygbKcDhVomUBZDt8CWdujdz0pv1x/LJe+/57mC3QZkqlhBCrQeJbfXZBO4TTfvxlaxid96nnKHwvAq31TffIjvYs6bT/Wv7zBcAAEWp5CLwd0LThdhNN8ArQ7ntab5nts8tg083DquDRfh+52KK2pdGtGx4yZv/pX0ymH4qfvLqhEEqQ46T87TvVTXKDhsU6goeUJGMXRoalAuuaG/a2n7+4f7vLpJjMtuE4wnOLUPvVPoP5vE3nocZwcRup0/S/luTtCwIju6gAAAABJRU5ErkJggg==') 28 /  28px / 0 round"
  ];

  function rand(min, max){ return Math.random() * (max - min) + min; }
  function nonZeroSpeed(minAbs = 0.4, maxAbs = 0.9){
    let v = rand(-maxAbs, maxAbs);
    if (Math.abs(v) < minAbs) v = (v < 0 ? -1 : 1) * minAbs;
    return v;
  }

  function setupMover(el, { start = 'random' } = {}) {
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = (start === 'center')
      ? (vw - rect.width) / 2
      : rand(0, Math.max(0, vw - rect.width));

    let y = (start === 'center')
      ? (vh - rect.height) / 2
      : rand(0, Math.max(0, vh - rect.height));

    let dx = nonZeroSpeed();
    let dy = nonZeroSpeed();

    el.style.opacity = '0';
    el.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 400ms ease';
      el.style.opacity = '1';
    });

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Delete this quote?')) {
        const quoteText = el.querySelector('span').textContent;
        activeQuoteTexts.delete(quoteText);
        mover.alive = false;
        el.remove();
        // Remove from movers array
        const moverIndex = movers.indexOf(mover);
        if (moverIndex !== -1) {
          movers.splice(moverIndex, 1);
        }
      }
    });

    const mover = {
      el,
      get w(){ return el.offsetWidth;  },
      get h(){ return el.offsetHeight; },
      x, y, dx, dy,
      alive: true
    };
    movers.push(mover);
  }

  function tick(){
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (const m of movers){
      if (!m.alive) continue;

      m.x += m.dx;
      m.y += m.dy;

      // 反弹
      if (m.x <= 0 || m.x + m.w >= vw) m.dx = -m.dx;
      if (m.y <= 0 || m.y + m.h >= vh) m.dy = -m.dy;

      m.el.style.transform = `translate(${m.x}px, ${m.y}px)`;
    }
    requestAnimationFrame(tick);
  }

  // Don't initialize existing quotes - they should be hidden until user clicks
  // document.querySelectorAll('.quote').forEach(q => {
  //   const quoteText = q.querySelector('span').textContent;
  //   activeQuoteTexts.add(quoteText);
  //   
  //   // Add random border style to existing quotes too
  //   const randomBorderStyle = borderStyles[Math.floor(Math.random() * borderStyles.length)];
  //   q.classList.add(randomBorderStyle);
  //   
  //   setupMover(q, { start: 'center' });
  // });
  tick();

  window.addQuote = function(text){
    const t = (text || '').trim();
    if (!t) return;

    // Check if this quote text is already displayed
    if (activeQuoteTexts.has(t)) {
      // Find and remove the existing quote with this text
      const existingMoverIndex = movers.findIndex(m => m.el.querySelector('span').textContent === t);
      if (existingMoverIndex !== -1) {
        const existingMover = movers[existingMoverIndex];
        existingMover.alive = false;
        existingMover.el.remove();
        movers.splice(existingMoverIndex, 1); // Remove from movers array
        activeQuoteTexts.delete(t);
      }
    }

    const q = document.createElement('div');
    q.className = 'quote';
    
    // Add random border-image directly
    const randomBorderImage = borderImages[Math.floor(Math.random() * borderImages.length)];
    q.style.borderImage = randomBorderImage;
    q.style.borderWidth = '28px';
    q.style.borderStyle = 'solid';
    
    // Make the quote visible
    q.style.display = 'block';
    
    const span = document.createElement('span');
    span.textContent = t;
    q.appendChild(span);
    stage.appendChild(q);

    // Add this quote text to our tracking set
    activeQuoteTexts.add(t);

    requestAnimationFrame(() => setupMover(q, { start: 'center' }));
  }

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.addQuote(input?.value);
      if (input) { input.value = ''; input.focus(); }
    });
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.addQuote(input.value);
        input.value = '';
      }
    });
  }

  window.addEventListener('resize', () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    movers.forEach(m => {
      if (!m.alive) return;
      if (m.x + m.w > vw) m.x = Math.max(0, vw - m.w);
      if (m.y + m.h > vh) m.y = Math.max(0, vh - m.h);
    });
  });

  // Click handler for adding quotes in sequential order
  window.addEventListener("click", (e) => {
    // Don't trigger on input/button/record icon clicks
    if (e.target.tagName === 'INPUT' || 
        e.target.tagName === 'BUTTON' || 
        e.target.id === 'bgm-icon') return;
    
    const currentQuote = existingQuotes[currentQuoteIndex];
    window.addQuote(currentQuote);
    
    // Move to next quote, cycle back to 0 when reaching the end
    currentQuoteIndex = (currentQuoteIndex + 1) % existingQuotes.length;
  }, { capture: true });

  console.log('[quotes] ready:', { quotes: document.querySelectorAll('.quote').length });
});

// add music and control by icon
let gif = document.querySelector("#bgm-icon");
let music = document.querySelector("#bgm-music");
let isPlaying = false;

gif.addEventListener("click", function () {
    if (isPlaying) {
        // Pause animation and stop music
        gif.src = "record.png";
        music.pause();
        console.log("Pause!")
    } else {
        // Resume animation and start music
        gif.src = "record.gif";
        music.play();
        console.log("Play!")
    }

    // Toggle the state
    isPlaying = !isPlaying;
});