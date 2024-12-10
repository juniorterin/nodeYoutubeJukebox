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
- Clique em **Selecionar Projeto** > **Novo Projet** e nomeie como desejar. Aguarde a criação então selecione
- Acesse novamente **https://console.cloud.google.com/**
- Vá em **APIs e Serviço** > **Ativar APIs e Serviço**, selecione **Youtube API v3** e ative
- Vá para **Configurar Tela de Consentimento**
- User Type: externo > **Criar**
- Preenche todos os campos obrigatórios. Em **Domínio autorizado** você irá colocar a URL base do projeto
- Dê um **Salvar e Continuar** até o fim das etapas
- Vá para a sessão **Credenciais** e clique em **Criar Credenciais** > **ID do Cliente do OAuth**
- Selecione tipo de aplicativo **Aplicativo da Web** e nomeie
- Adicionei as URI de acordo com a hospedagem em **Origens JavaScript autorizadas** e em 'URIs de redirecionamento autorizados' coloque a *url-do-seu-projeto.com/oauth2callback* e clique em **Criar**
- '**ID do Cliente**' será a variavel de ambiente *CLIENT_ID* e '**Chave secreta do cliente**' será *CLIENT_SECRET*
- Depois vá para a sessão **Tela de permissão OAuth** dentro de seu projeto no Google Console Cloud e clique em **Publicar Aplicativo**
- Agora entre no Youtube usando sua conta Google, crie uma **Playlist**, deixe como pública e obtenha o ID da mesma (ex. em https://www.youtube.com/watch?v=ASGFwahy3D8&list=**PLHgQy7iGRTQBZrxXphjLLXfoHCdKJkwfp** )
- Essa ID será a variável de ambiente *YOUTUBE_PLAYLIST_ID*
- Atualize o link no arquivo *index.html* na pasta **frontend**
- Defina a variável de ambiente *REDIRECT_URI* como sendo *https://url-do-seu-projeto.com/oauth2callback*, é a partir dessa URL que será salvo seu *token* após a autenticação
- Vá para https://firebase.google.com/ e faça login utilizando sua conta Google
- Crie um **Projeto Firebase**
- Nomeie o projeto. Ao nomear será dado uma slug/identificador do seu projeto (ex. você nomeou como "Meu Projeto", então abaixo está a slug como *meu-projeto*) e siga os passos a seguir na tela
- Na página de **Visão Geral** vá para **Configurações do Projeto** e na aba **Contas de Serviço** gere uma nova chave privada
- O arquivo JSON baixado deverá ficar na pasta **.data** do projeto com o nome **firebase-service-account.json**
- Utilizando a **slug** do seu projeto no Firebase, acesse https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=**slug-do-projeto**
- **Ative** a API do Firestore
- Volte no console do Firebase, https://firebase.google.com/, e dentro do seu projeto criado vá em **Criação** > **Firestore Database** > **Criar banco de dados** > **Modo de produção** e **Criar**
- Reinicie seu servidor e acesse **https://url-do-seu-projeto.com/auth-url** para fazer a autenticação na conta Google (isso irá salvar seu token para alterar a playlist no Youtube no banco de dados do Firebase)
- Reinicie novamente o servidor com um **npm run start**
 
 Caso queira hospedar o projeto no Glitch.com basta clonar esse repositório e preencher as variáveis de ambiente da plataforma

Free Palestine