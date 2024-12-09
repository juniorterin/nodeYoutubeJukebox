const apiUrl = window.location.origin;

// Gerar ou obter ID único do usuário
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const userId = getUserId();

// Adicionar vídeo
document.getElementById('add-video-btn').addEventListener('click', async () => {
  const videoUrl = document.getElementById('video-url').value;
  const messageEl = document.getElementById('message');

  // Trava de 5 minutos
  const lastPostTime = localStorage.getItem('lastPostTime');
  const now = Date.now();

  if (lastPostTime && now - lastPostTime < 5 * 60 * 1000) { // 5 minutos em milissegundos
    const timeLeft = Math.ceil((5 * 60 * 1000 - (now - lastPostTime)) / 1000);
    messageEl.textContent = `Espere ${timeLeft} segundos para adicionar outro vídeo.`;
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/add-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl, userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      messageEl.textContent = errorText;
    } else {
      messageEl.textContent = 'Vídeo adicionado com sucesso!';
      localStorage.setItem('lastPostTime', now); // Atualizar o horário do último envio
      document.getElementById('video-url').value = ''; // Limpar o campo de entrada
    }
  } catch {
    messageEl.textContent = 'Erro ao adicionar vídeo.';
  }

  setTimeout(() => {
    messageEl.textContent = '';
  }, 3000);
});

// Canvas para animação
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurações do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Propriedades dos quadrados
const squareConfig = {
  num: 100,
  colors: ['cyan', '#FE0155', '#7701FE'],
  speed: 1,
  sizeMax: 60,
  sizeMin: 50,
  sizeMultiplier: 2,
  range: 50,
  speedChange: 10,
};

let squares = [];
let mousePos = { x: undefined, y: undefined };

// Gerar velocidades possíveis
const generateSpeedOptions = (speed) => {
  const options = [];
  for (let i = -speed; i <= speed; i++) {
    if (i !== 0) options.push(i);
  }
  return options;
};

const speedOptions = generateSpeedOptions(squareConfig.speed);

// Gerar tamanho do quadrado
const randomSquareSize = () =>
  Math.ceil(Math.random() * (squareConfig.sizeMax - squareConfig.sizeMin)) +
  squareConfig.sizeMin;

// Criar quadrados
for (let i = 0; i < squareConfig.num; i++) {
  squares.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: randomSquareSize(),
    minSize: squareConfig.sizeMin,
    color: squareConfig.colors[Math.floor(Math.random() * squareConfig.colors.length)],
    dx: speedOptions[Math.floor(Math.random() * speedOptions.length)],
    dy: speedOptions[Math.floor(Math.random() * speedOptions.length)],
    updateSize(mouseX, mouseY) {
      const distX = Math.abs(this.x - mouseX);
      const distY = Math.abs(this.y - mouseY);
      if (distX < squareConfig.range && distY < squareConfig.range && this.size < squareConfig.sizeMax * squareConfig.sizeMultiplier) {
        this.size += squareConfig.speedChange;
      } else if (this.size > this.minSize) {
        this.size -= squareConfig.speedChange;
      }
    },
    move() {
      if (this.x + this.size > canvas.width || this.x < 0) this.dx = -this.dx;
      if (this.y + this.size > canvas.height || this.y < 0) this.dy = -this.dy;

      this.x += this.dx;
      this.y += this.dy;
    },
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
    },
  });
}

// Atualizar posição do mouse
window.addEventListener('mousemove', (event) => {
  mousePos.x = event.x;
  mousePos.y = event.y;
});

// Redimensionar o canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Animar quadrados
const animateSquares = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  squares.forEach((square) => {
    square.updateSize(mousePos.x || 0, mousePos.y || 0);
    square.move();
    square.draw();
  });

  requestAnimationFrame(animateSquares);
};

// Iniciar animação
animateSquares();