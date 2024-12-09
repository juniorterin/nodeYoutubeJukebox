# YouTube Jukebox

Olá! Esse projeto foi feito por Ademir Terin Junior e tem a função de criar uma plataforma que enfileira vídeos em uma playlist pública de YouTube, facilitando o trabalho de quem trabalha em estabelecimentos que atendem ao público que gosta de pedir pra por uma música. 


## Tecnologia

- Node.js 16
- HTML, JS e CSS
- Youtube API v3
- Firestore
- Glitch.com (opcional pois acho mais fácil como forma de sandbox para ir testando qualquer funcionalidade além de deixar sua máquina limpa durante o desenvolvimento)

## Passos a passo


- Crie uma conta Google Inc.
- Acesse **https://console.cloud.google.com/**
- Crie um **Projeto** e o selecione
- Vá em **Biblioteca de API**, selecione **Youtube API v3** e ative
- Vá para a sessão **Credenciais** e clique em **Criar Credenciais** > **ID do Cliente do OAuth**
- Selecione tipo de aplicativo **Aplicativo da Web** e nomeie
- Adicionei as URI de acordo com a hospedagem em **Origens JavaScript autorizadas** e em 'URIs de redirecionamento autorizados' coloque a *url-do-seu-projeto.com/oauth2callback* e clique em **Criar**
- '**ID do Cliente**' será a variavel de ambiente *CLIENT_ID* e '**Chave secreta do cliente**' será *CLIENT_SECRET*
- Agora entre no Youtube usando sua conta Google, crie uma **Playlist** e obtenha o ID da mesma (ex. em https://www.youtube.com/watch?v=ASGFwahy3D8&list=**PLHgQy7iGRTQBZrxXphjLLXfoHCdKJkwfp** )
- Essa ID será a variável de ambiente *YOUTUBE_PLAYLIST_ID*
- Atualize o link no arquivo *index.html* na pasta **frontend**
- Defina a variável de ambiente *REDIRECT_URI* como sendo *https://url-do-seu-projeto.com/oauth2callback*, é a partir dessa URL que será salvo seu *token* após a autenticação
- Volte para https://console.cloud.google.com/
- Vá em **Biblioteca de API**, selecione **Google Cloud Firestore API** e ative
- Vá para https://firebase.google.com/ e faça login utilizando sua conta Google
- Crie um **Projeto Firebase**
- Nomeie o projeto e siga os passos a seguir na tela
- Na página de **Visão Geral** vá para **Configurações do Projeto** e na aba **Contas de Serviço** gere uma nova chave privada
- O arquivo JSON baixado deverá ficar na pasta **.data** do projeto com o nome **firebase-service-account.json**
- No terminal dentro da pasta do projeto dê um **npm install && npm run start**
- No log de erro aparecerá a URL para criar um banco de dados, clique e selecione o **Modo Nativo** e **Continuar**
- Na proxima tela clique abaixo em **Criar**
- Reinicie seu servidor e acesse **https://url-do-seu-projeto.com/auth-url** para fazer a autenticação na conta Google (isso irá salvar seu token no Firebase)
- Reinicie novamente o servidor com um **npm run start**
 
 Caso queira hospedar o projeto no Glitch.com basta clonar esse repositório e preencher as variáveis de ambiente da plataforma

Free Palestine