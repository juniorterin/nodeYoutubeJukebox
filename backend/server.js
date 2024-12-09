const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Variáveis de ambiente
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const YOUTUBE_PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

// Inicializar Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../.data", "service-account-firebase.json"),
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

app.disable("x-powered-by");

let youtube;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Inicializar OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Conectar ao Firestore
(async () => {
  try {
    console.log("Conectado ao Firestore");

    // Carregar o refresh_token do Firestore
    const tokenDoc = await firestore
      .collection("oauth_tokens")
      .doc("youtube")
      .get();
    if (tokenDoc.exists && tokenDoc.data().refresh_token) {
      oAuth2Client.setCredentials({
        refresh_token: tokenDoc.data().refresh_token,
      });
      console.log("refresh_token carregado do Firestore");

      // Configurar a API do YouTube com o cliente autenticado
      youtube = google.youtube({
        version: "v3",
        auth: oAuth2Client,
      });
      console.log("API do YouTube configurada com o refresh_token");
    } else {
      console.log("Nenhum refresh_token encontrado. Autentique manualmente.");
    }
  } catch (error) {
    console.error(
      "Erro ao conectar ao Firestore ou configurar API do YouTube:",
      error.message
    );
  }
})();

// Função para salvar o refresh_token no Firestore
const saveRefreshToken = async (refresh_token) => {
  try {
    await firestore.collection("oauth_tokens").doc("youtube").set({
      refresh_token,
    });
    console.log("refresh_token salvo no Firestore");
  } catch (error) {
    console.error(
      "Erro ao salvar o refresh_token no Firestore:",
      error.message
    );
  }
};

// Função para obter a duração do vídeo
const getVideoDuration = async (videoId) => {
  try {
    const response = await youtube.videos.list({
      part: "contentDetails",
      id: videoId,
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error("Vídeo não encontrado.");
    }

    const duration = response.data.items[0].contentDetails.duration;

    // Converter ISO 8601 para segundos
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1] || 0, 10) || 0;
    const minutes = parseInt(match[2] || 0, 10) || 0;
    const seconds = parseInt(match[3] || 0, 10) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  } catch (error) {
    console.error("Erro ao obter a duração do vídeo:", error.message);
    throw error;
  }
};

// Função para adicionar vídeo ao YouTube com verificação de duração
const addVideoToYouTubePlaylist = async (videoId) => {
  if (!youtube) {
    throw new Error(
      "API do YouTube não está configurada. Verifique a autenticação."
    );
  }

  // Verificar a duração do vídeo antes de adicioná-lo
  const duration = await getVideoDuration(videoId);
  if (duration > 300) {
    // 300 segundos = 5 minutos
    throw new Error("Vídeos com mais de 5 minutos não são permitidos.");
  } else {
    try {
      await youtube.playlistItems.insert({
        part: "snippet",
        requestBody: {
          snippet: {
            playlistId: YOUTUBE_PLAYLIST_ID,
            resourceId: {
              kind: "youtube#video",
              videoId: videoId,
            },
          },
        },
      });
      console.log(`Vídeo ${videoId} adicionado à playlist do YouTube!`);
    } catch (error) {
      console.error(
        "Erro ao adicionar vídeo ao YouTube:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
};

// Rota para adicionar vídeo
app.post("/add-video", async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).send("URL inválida.");
  }

  const videoIdMatch = videoUrl.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (!videoIdMatch || !videoIdMatch[1]) {
    return res.status(400).send("Não foi possível extrair o ID do vídeo.");
  }

  const videoId = videoIdMatch[1];

  try {
    await addVideoToYouTubePlaylist(videoId);
    res.status(200).send("Vídeo adicionado com sucesso!");
  } catch (error) {
    res.status(400).send("Erro ao processar o vídeo: " + error.message);
  }
});

// Rota para autenticação manual
app.get("/auth-url", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.force-ssl"],
    prompt: "consent", // Força o usuário a dar consentimento novamente
  });
  res.send({ authUrl });
});

// Callback para salvar o refresh_token após autenticação manual
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Código de autenticação não fornecido.");
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    if (tokens.refresh_token) {
      await saveRefreshToken(tokens.refresh_token);
    } else {
      console.log(
        "Nenhum refresh_token foi retornado. Use um novo código de autenticação."
      );
    }

    res.send("Autenticação realizada com sucesso! O refresh_token foi salvo.");
  } catch (error) {
    res.status(500).send("Erro ao autenticar.");
  }
});

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
