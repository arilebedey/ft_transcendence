import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import TOSen from "./TOSen.json";
import TOSfr from "./TOSfr.json";
import TOSit from "./TOSit.json";
import TOSes from "./TOSes.json";

const resources = {
  EN: {
    translation: {
      welcome: "Connect, share, and discover with our community",
      shareContent: "✨ Share the content you watch",
      followInterest: "🌐 Follow other's interests",
      discover: "🧭 Discover!",
      signIn: "Sign in",
      createAccount: "Create account",
      signUp: "Sign up",
      login: "Login",
      emailPlaceholder: "you@example.com",
      Password: "Password",
      Name: "Name",
      Fullname: "Full name",
      iAccept: "I accept the",
      TOS: "terms of service.",
      Close: "Close",
      Friends: "Friends",
      editProfile: "Edit profile",
      follow: "Follow",
      unfollow: "Unfollow",
      save: "Save",
      followers: "Followers",
      following: "Following",
      forest: "Forest",
      darkBlue: "Dark Blue",
      light: "Light",
      language: "Language",
      createPost: "Create post",
      Cancel: "Cancel",
      Confirm: "Confirm",
      Delete: "Delete",
      EmptyContent: "Content empty.",
      LinkInclusion: "You must include a link in the post.",
      CopyLink: "Copy link",
      nav: {
        home: "Home",
        liked: "Liked",
        messages: "Messages",
      },
      liked: {
        empty: "You haven't liked any posts yet.",
      },
      dashboard: {
        title: "Dashboard",
        loading: "Loading dashboard...",
        error: "Error loading dashboard",
        accountLikesTitle: "Account likes",
        accountLikesDesc: "Evolution of the total number of likes received",
        followersTitle: "Followers",
        followersDesc: "Evolution of the number of followers",
        likesByPostTitle: "Likes per post",
        likesByPostDesc: "Select a post to see the evolution of its likes",
        totalLikes: "Total Likes",
        totalFollowers: "Total Followers",
        totalPosts: "Total Posts",
        noData: "No data available",
        noLikes: "No likes yet",
        noPosts: "No posts yet",
      },
      noBio: "This user hasn't written a bio yet.",
      profileBioPlaceholder: "Tell us about yourself...",
      InvalidUsername: "Invalid username",
      InvalidBio: "Invalid bio",
      usernameMinLength: "Username must be at least 3 characters",
      usernameMaxLength: "Username must be at most 12 characters",
      usernameRegex:
        "Lowercase letters, numbers, and underscores only (no uppercase or special characters)",
      usernameStartsWithUnderscore: "Username cannot start with an underscore",
      bioMaxLength: "Bio must be at most 160 characters",
      Bio: "Bio",
      Theme: "Theme",
      Logout: "Logout",
      User: "User",
      loadingProfile: "Loading profile...",
      unableToLoadProfile: "Unable to load profile",
      profileNotFound: "Profile not found",
      checkingUsername: "Checking username availability...",
      usernameTaken: "This username is already taken",
      "Confirm password": "Confirm password",
      chat: {
        list: {
          title: "Messages",
          conversationCount_one: "{{count}} conversation",
          conversationCount_other: "{{count}} conversations",
          newChat: "New chat",
          loading: "Loading conversations...",
          empty: "No conversations yet. Start one to test the chat flow.",
          draftSelected: "Draft conversation selected.",
          unknownUser: "Unknown user",
          noMessagesYet: "No messages yet",
        },
        search: {
          title: "New chat",
          subtitle: "Search by a user's display name.",
          placeholder: "Search users...",
          startTyping: "Start typing to find a user.",
          loading: "Searching...",
          empty: "No users found.",
        },
        conversation: {
          titleFallback: "Conversation",
          live: "Live conversation",
          new: "New conversation",
          loadingMore: "Loading...",
          loadOlder: "Load older messages",
          loadingMessages: "Loading messages...",
          empty: "No messages here yet.",
          inputPlaceholder: "Type a message...",
        },
        empty: {
          loadingTitle: "Loading conversations...",
          idleTitle: "Select a chat or start a new one",
          loadingDescription:
            "Fetching your conversation list and preparing the current thread.",
          idleDescription:
            "Use the conversation list to load existing messages or create a new thread and send the first message.",
        },
        message: {
          sending: "Sending...",
          failed: "Failed",
          retry: "Retry",
          dismiss: "Dismiss",
        },
      },
      publicApi: {
        sections: {
          keys: "Create and manage API keys",
        },
        sidebar: {
          title: "API docs",
          description:
            "Use a `seenit` key in the `Authorization: Bearer ...` header. The whole public API is limited to 15 requests per minute.",
        },
        content: {
          keysTitle: "Manage your API keys",
        },
        actions: {
          back: "Back",
          copy: "Copy",
          copied: "Copied",
          remove: "Remove",
        },
        endpoint: {
          queryParams: "Query params",
          jsonBody: "JSON body",
          copyableExample: "Copyable example",
        },
        documentation: {
          title: "Documentation",
          overview:
            "Create a personal API key to authenticate requests to the public Seenit API. Each endpoint in this page includes the route, accepted parameters, and a copyable example to help you get started quickly.",
          auth: "Send your key in the `Authorization: Bearer ...` header. The whole public API is currently limited to 15 requests per minute.",
          security:
            "Treat API keys like passwords: keep them private, store them securely, and create a new one if you think a key has been exposed.",
        },
        keys: {
          createDescription:
            "Generate and organize the keys you use for scripts, prototypes, or external integrations.",
          namePlaceholder: "Key name",
          nameRequired: "API key name is required.",
          creating: "Creating...",
          generate: "Generate key",
          copyNewKey: "Copy your new key now",
          yourKeys: "Your keys",
          yourKeysDescription:
            "Existing keys can be identified by their stored prefix/start and creation date. The full secret is only shown when a key is created.",
          loading: "Loading keys...",
          empty: "No API keys yet.",
          unnamed: "Unnamed key",
          created: "created",
          limitLabel: "Limit:",
          requestsPer: "req /",
          minutesShort: "min",
        },
        endpoints: {
          "list-posts": {
            description:
              "List posts ordered by newest first. Supports limit/offset pagination.",
          },
          "list-likes": {
            description:
              "List likes for a post and return the total like count.",
          },
          "list-followers": {
            description:
              "List followers for a user and return follower/following totals.",
          },
          "create-post": {
            description: "Create a new post owned by the API key's user.",
          },
          "update-post": {
            description: "Replace the editable fields of a post you own.",
          },
          "delete-post": {
            description: "Delete a post you own.",
          },
        },
      },
      NoUsersFound: "No users found.",
      NoResult: "No results for your search.",
      homeDefault:
        "Here you’ll see your posts and those of the users you follow, share your ideas!",
      SearchUsers: "Search users",
      SortBy: "Sort by",
      MostRecent: "Most recent",
      MostLiked: "Most liked",
      Oldest: "Oldest",
      ...TOSen,
    },
  },
  FR: {
    translation: {
      welcome: "Connectez, partagez et découvrez avec notre communauté",
      shareContent: "✨ Partagez le contenu que vous regardez",
      followInterest: "🌐 Suivez les intérêts des autres",
      discover: "🧭 Découvrez !",
      signIn: "Se connecter",
      createAccount: "Créer un compte",
      signUp: "S'inscrire",
      login: "Connexion",
      emailPlaceholder: "vous@exemple.com",
      Password: "Mot de passe",
      Name: "Nom",
      Fullname: "Nom complet",
      iAccept: "J’accepte les",
      TOS: "Conditions générales d'utilisation.",
      Close: "Fermer",
      Friends: "Amis",
      createPost: "Créer un post",
      Cancel: "Annuler",
      Confirm: "Confirmer",
      Delete: "Supprimer",
      EmptyContent: "Contenu vide.",
      LinkInclusion: "Vous devez inclure un lien dans le post.",
      CopyLink: "Copier le lien",
      nav: {
        home: "Accueil",
        liked: "Aimés",
        messages: "Messages",
      },
      liked: {
        empty: "Vous n'avez encore aimé aucun post.",
      },
      dashboard: {
        title: "Dashboard",
        loading: "Chargement du dashboard...",
        error: "Erreur lors du chargement du dashboard",
        accountLikesTitle: "Likes du compte",
        accountLikesDesc: "Évolution du nombre total de likes reçus",
        followersTitle: "Followers",
        followersDesc: "Évolution du nombre de followers",
        likesByPostTitle: "Likes par post",
        likesByPostDesc:
          "Sélectionnez un post pour voir l'évolution de ses likes",
        totalLikes: "Likes totaux",
        totalFollowers: "Followers totaux",
        totalPosts: "Posts totaux",
        noData: "Pas de données disponibles",
        noLikes: "Aucun like pour le moment",
        noPosts: "Aucun post pour le moment",
      },
      editProfile: "Modifier le profil",
      follow: "Suivre",
      unfollow: "Ne plus suivre",
      save: "Enregistrer",
      followers: "Abonnés",
      following: "Abonnements",
      forest: "Forêt",
      darkBlue: "Bleu foncé",
      light: "Clair",
      language: "Langue",
      noBio: "Cet utilisateur n'a pas encore écrit de bio.",
      profileBioPlaceholder: "Parlez-nous de vous...",
      InvalidUsername: "Nom d'utilisateur invalide",
      InvalidBio: "Bio invalide",
      usernameMinLength:
        "Le nom d'utilisateur doit comporter au moins 3 caractères",
      usernameMaxLength:
        "Le nom d'utilisateur doit comporter au maximum 12 caractères",
      usernameRegex:
        "Lettres minuscules, chiffres et underscores uniquement (pas de majuscules ni de caractères spéciaux)",
      usernameStartsWithUnderscore:
        "Le nom d'utilisateur ne peut pas commencer par un underscore",
      bioMaxLength: "La bio doit comporter au maximum 160 caractères",
      Bio: "Bio",
      Theme: "Thème",
      Logout: "Déconnexion",
      User: "Utilisateur",
      loadingProfile: "Chargement du profil...",
      unableToLoadProfile: "Impossible de charger le profil",
      profileNotFound: "Profil introuvable",
      checkingUsername:
        "Vérification de la disponibilité du nom d'utilisateur...",
      usernameTaken: "Ce nom d'utilisateur est déjà pris",
      "Confirm password": "Confirmer le mot de passe",
      chat: {
        list: {
          title: "Messages",
          conversationCount_one: "{{count}} conversation",
          conversationCount_other: "{{count}} conversations",
          newChat: "Nouvelle conversation",
          loading: "Chargement des conversations...",
          empty:
            "Aucune conversation pour le moment. Commencez-en une pour tester la messagerie.",
          draftSelected: "Brouillon de conversation sélectionné.",
          unknownUser: "Utilisateur inconnu",
          noMessagesYet: "Pas encore de messages",
        },
        search: {
          title: "Nouvelle conversation",
          subtitle: "Recherchez par nom d'affichage d'utilisateur.",
          placeholder: "Rechercher des utilisateurs...",
          startTyping: "Commencez à taper pour trouver un utilisateur.",
          loading: "Recherche en cours...",
          empty: "Aucun utilisateur trouvé.",
        },
        conversation: {
          titleFallback: "Conversation",
          live: "Conversation en direct",
          new: "Nouvelle conversation",
          loadingMore: "Chargement...",
          loadOlder: "Charger les anciens messages",
          loadingMessages: "Chargement des messages...",
          empty: "Aucun message ici pour le moment.",
          inputPlaceholder: "Écrire un message...",
        },
        empty: {
          loadingTitle: "Chargement des conversations...",
          idleTitle: "Sélectionnez une discussion ou démarrez-en une nouvelle",
          loadingDescription:
            "Récupération de votre liste de conversations et préparation du fil en cours.",
          idleDescription:
            "Utilisez la liste des conversations pour ouvrir des messages existants ou créez un nouveau fil et envoyez le premier message.",
        },
        message: {
          sending: "Envoi...",
          failed: "Échec",
          retry: "Réessayer",
          dismiss: "Ignorer",
        },
      },
      publicApi: {
        sections: {
          keys: "Créer et gérer les clés API",
        },
        sidebar: {
          title: "Documentation API",
          description:
            "Utilisez une clé `seenit` dans l'en-tête `Authorization: Bearer ...`. Toute l'API publique est limitée à 15 requêtes par minute.",
        },
        content: {
          keysTitle: "Gérer vos clés API",
        },
        actions: {
          back: "Retour",
          copy: "Copier",
          copied: "Copié",
          remove: "Supprimer",
        },
        endpoint: {
          queryParams: "Paramètres de requête",
          jsonBody: "Corps JSON",
          copyableExample: "Exemple copiable",
        },
        documentation: {
          title: "Documentation",
          overview:
            "Créez une clé API personnelle pour authentifier vos requêtes vers l'API publique de Seenit. Chaque endpoint présenté ici indique la route, les paramètres acceptés et un exemple copiable pour démarrer rapidement.",
          auth: "Envoyez votre clé dans l'en-tête `Authorization: Bearer ...`. Toute l'API publique est actuellement limitée à 15 requêtes par minute.",
          security:
            "Traitez vos clés API comme des mots de passe : gardez-les privées, stockez-les de façon sécurisée et créez-en une nouvelle si vous pensez qu'une clé a été exposée.",
        },
        keys: {
          createDescription:
            "Générez et organisez les clés que vous utilisez pour vos scripts, prototypes ou intégrations externes.",
          namePlaceholder: "Nom de la clé",
          nameRequired: "Le nom de la clé API est requis.",
          creating: "Création...",
          generate: "Générer une clé",
          copyNewKey: "Copiez votre nouvelle clé maintenant",
          yourKeys: "Vos clés",
          yourKeysDescription:
            "Les clés existantes peuvent être identifiées par leur préfixe/début enregistré et leur date de création. Le secret complet n'est affiché qu'au moment de la création.",
          loading: "Chargement des clés...",
          empty: "Aucune clé API pour le moment.",
          unnamed: "Clé sans nom",
          created: "créée le",
          limitLabel: "Limite :",
          requestsPer: "req /",
          minutesShort: "min",
        },
        endpoints: {
          "list-posts": {
            description:
              "Liste les posts du plus récent au plus ancien. Prend en charge la pagination limit/offset.",
          },
          "list-likes": {
            description:
              "Liste les likes d'un post et renvoie le nombre total de likes.",
          },
          "list-followers": {
            description:
              "Liste les abonnés d'un utilisateur et renvoie les totaux abonnés/abonnements.",
          },
          "create-post": {
            description:
              "Crée un nouveau post appartenant à l'utilisateur de la clé API.",
          },
          "update-post": {
            description:
              "Remplace les champs modifiables d'un post dont vous êtes propriétaire.",
          },
          "delete-post": {
            description: "Supprime un post dont vous êtes propriétaire.",
          },
        },
      },
      NoUsersFound: "Aucun utilisateur trouvé",
      NoResult: "Aucun résultat pour votre recherche.",
      homeDefault:
        "Ici s'afficheront vos posts et ceux des utilisateurs que vous suivez, partagez vos idées !",
      SearchUsers: "Rechercher des utilisateurs",
      SortBy: "Trier par",
      MostRecent: "Les plus récents",
      MostLiked: "Les plus aimés",
      Oldest: "Les plus anciens",
      ...TOSfr,
    },
  },
  IT: {
    translation: {
      welcome: "Connettiti, condividi e scopri con la nostra comunità",
      shareContent: "✨ Condividi il contenuto che guardi",
      followInterest: "🌐 Segui gli interessi degli altri",
      discover: "🧭 Scopri!",
      signIn: "Accedi",
      createAccount: "Crea account",
      signUp: "Iscriviti",
      login: "Accedi",
      emailPlaceholder: "tuo@esempio.com",
      Password: "Parola",
      Name: "Nome",
      Fullname: "Nome completo",
      iAccept: "Accetto i",
      TOS: "termini di servizio.",
      Close: "Chiudi",
      Friends: "Amici",
      createPost: "Crea post",
      Cancel: "Annulla",
      Confirm: "Confermare",
      Supprimer: "Elimina",
      EmptyContent: "Contenuto vuoto.",
      LinkInclusion: "Devi includere un link nel post.",
      CopyLink: "Copia il link",
      nav: {
        home: "Home",
        liked: "Piaciuti",
        messages: "Messaggi",
      },
      liked: {
        empty: "Non hai ancora messo like a nessun post.",
      },
      dashboard: {
        title: "Dashboard",
        loading: "Caricamento dashboard...",
        error: "Errore nel caricamento del dashboard",
        accountLikesTitle: "Mi piace dell'account",
        accountLikesDesc: "Evoluzione del numero totale di Mi piace ricevuti",
        followersTitle: "Followers",
        followersDesc: "Evoluzione del numero di follower",
        likesByPostTitle: "Mi piace per post",
        likesByPostDesc:
          "Seleziona un post per vedere l'evoluzione dei suoi Mi piace",
        totalLikes: "Mi piace totali",
        totalFollowers: "Follower totali",
        totalPosts: "Post totali",
        noData: "Nessun dato disponibile",
        noLikes: "Nessun mi piace per il momento",
        noPosts: "Nessun post per il momento",
      },
      editProfile: "Modifica profilo",
      follow: "Seguire",
      unfollow: "Smetti di seguire",
      save: "Salva",
      followers: "Follower",
      following: "Seguiti",
      forest: "Foresta",
      darkBlue: "Blu scuro",
      light: "Chiaro",
      language: "Lingua",
      Delete: "Elimina",
      noBio: "Questo utente non ha ancora scritto una bio.",
      profileBioPlaceholder: "Raccontaci di te...",
      InvalidUsername: "Nome utente non valido",
      InvalidBio: "Bio non valida",
      usernameMinLength: "Il nome utente deve essere di almeno 3 caratteri",
      usernameMaxLength: "Il nome utente deve essere di massimo 12 caratteri",
      usernameRegex:
        "Solo lettere minuscole, numeri e underscore (niente maiuscole o caratteri speciali)",
      usernameStartsWithUnderscore:
        "Il nome utente non può iniziare con un underscore",
      bioMaxLength: "La bio deve essere di massimo 160 caratteri",
      Bio: "Bio",
      Theme: "Tema",
      Logout: "Disconnettersi",
      User: "Utente",
      loadingProfile: "Caricamento profilo...",
      unableToLoadProfile: "Impossibile caricare il profilo",
      profileNotFound: "Profilo non trovato",
      checkingUsername: "Verifica disponibilità nome utente...",
      usernameTaken: "Questo nome utente è già in uso",
      "Confirm password": "Conferma password",
      chat: {
        list: {
          title: "Messaggi",
          conversationCount_one: "{{count}} conversazione",
          conversationCount_other: "{{count}} conversazioni",
          newChat: "Nuova chat",
          loading: "Caricamento conversazioni...",
          empty:
            "Nessuna conversazione per ora. Avviane una per testare il flusso della chat.",
          draftSelected: "Bozza di conversazione selezionata.",
          unknownUser: "Utente sconosciuto",
          noMessagesYet: "Ancora nessun messaggio",
        },
        search: {
          title: "Nuova chat",
          subtitle: "Cerca tramite il nome visualizzato di un utente.",
          placeholder: "Cerca utenti...",
          startTyping: "Inizia a digitare per trovare un utente.",
          loading: "Ricerca in corso...",
          empty: "Nessun utente trovato.",
        },
        conversation: {
          titleFallback: "Conversazione",
          live: "Conversazione attiva",
          new: "Nuova conversazione",
          loadingMore: "Caricamento...",
          loadOlder: "Carica messaggi precedenti",
          loadingMessages: "Caricamento messaggi...",
          empty: "Qui non ci sono ancora messaggi.",
          inputPlaceholder: "Scrivi un messaggio...",
        },
        empty: {
          loadingTitle: "Caricamento conversazioni...",
          idleTitle: "Seleziona una chat o avviane una nuova",
          loadingDescription:
            "Recupero dell'elenco conversazioni e preparazione del thread corrente.",
          idleDescription:
            "Usa l'elenco conversazioni per aprire messaggi esistenti o crea un nuovo thread e invia il primo messaggio.",
        },
        message: {
          sending: "Invio...",
          failed: "Non riuscito",
          retry: "Riprova",
          dismiss: "Chiudi",
        },
      },
      publicApi: {
        sections: {
          keys: "Crea e gestisci chiavi API",
        },
        sidebar: {
          title: "Documentazione API",
          description:
            "Usa una chiave `seenit` nell'header `Authorization: Bearer ...`. L'intera API pubblica è limitata a 15 richieste al minuto.",
        },
        content: {
          keysTitle: "Gestisci le tue chiavi API",
        },
        actions: {
          back: "Indietro",
          copy: "Copia",
          copied: "Copiato",
          remove: "Rimuovi",
        },
        endpoint: {
          queryParams: "Parametri di query",
          jsonBody: "Corpo JSON",
          copyableExample: "Esempio copiabile",
        },
        documentation: {
          title: "Documentazione",
          overview:
            "Crea una chiave API personale per autenticare le richieste verso l'API pubblica di Seenit. Ogni endpoint in questa pagina include il percorso, i parametri supportati e un esempio copiabile per iniziare rapidamente.",
          auth: "Invia la chiave nell'header `Authorization: Bearer ...`. L'intera API pubblica è attualmente limitata a 15 richieste al minuto.",
          security:
            "Tratta le chiavi API come password: mantienile private, conservale in modo sicuro e creane una nuova se pensi che una chiave sia stata esposta.",
        },
        keys: {
          createDescription:
            "Genera e organizza le chiavi che usi per script, prototipi o integrazioni esterne.",
          namePlaceholder: "Chiave di produzione",
          nameRequired: "Il nome della chiave API è obbligatorio.",
          creating: "Creazione...",
          generate: "Genera chiave",
          copyNewKey: "Copia subito la tua nuova chiave",
          yourKeys: "Le tue chiavi",
          yourKeysDescription:
            "Le chiavi esistenti possono essere identificate dal prefisso/inizio memorizzato e dalla data di creazione. Il segreto completo viene mostrato solo quando una chiave viene creata.",
          loading: "Caricamento chiavi...",
          empty: "Nessuna chiave API.",
          unnamed: "Chiave senza nome",
          created: "creata",
          limitLabel: "Limite:",
          requestsPer: "rich. /",
          minutesShort: "min",
        },
        endpoints: {
          "list-posts": {
            description:
              "Elenca i post ordinati dal più recente. Supporta la paginazione con limit/offset.",
          },
          "list-likes": {
            description:
              "Elenca i like di un post e restituisce il conteggio totale dei like.",
          },
          "list-followers": {
            description:
              "Elenca i follower di un utente e restituisce i totali follower/seguiti.",
          },
          "create-post": {
            description:
              "Crea un nuovo post appartenente all'utente della chiave API.",
          },
          "update-post": {
            description:
              "Sostituisce i campi modificabili di un post di tua proprietà.",
          },
          "delete-post": {
            description: "Elimina un post di tua proprietà.",
          },
        },
      },
      NoUsersFound: "Nessun utente trovato",
      NoResult: "Nessun risultato per la tua ricerca.",
      homeDefault:
        "Qui vedrai i tuoi post e quelli degli utenti che segui, condividi le tue idee!",
      SearchUsers: "Cerca utenti",
      SortBy: "Ordina per",
      MostRecent: "Più recenti",
      MostLiked: "Più apprezzati",
      Oldest: "Più vecchi",
      ...TOSit,
    },
  },
  ES: {
    translation: {
      welcome: "Conéctate, comparte y descubre con nuestra comunidad",
      shareContent: "✨ Comparte el contenido que ves",
      followInterest: "🌐 Sigue los intereses de otros",
      discover: "🧭 ¡Descubre!",
      signIn: "Iniciar sesión",
      createAccount: "Crear cuenta",
      signUp: "Registrarse",
      login: "Iniciar sesión",
      emailPlaceholder: "tú@ejemplo.com",
      Password: "Contraseña",
      Name: "Nombre",
      Fullname: "Nombre completo",
      iAccept: "Acepto los",
      TOS: "términos del servicio.",
      Close: "Cerrar",
      Friends: "Amigos",
      createPost: "Crear publicación",
      Cancel: "Cancelar",
      Confirm: "Confirmar",
      Delete: "Eliminar",
      EmptyContent: "Contenido vacío.",
      LinkInclusion: "Debes incluir un enlace en la publicación.",
      CopyLink: "Copiar enlace",
      nav: {
        home: "Inicio",
        liked: "Me gusta",
        messages: "Mensajes",
      },
      liked: {
        empty: "Todavía no te gusta ninguna publicación.",
      },
      dashboard: {
        title: "Panel",
        loading: "Cargando panel...",
        error: "Error al cargar el panel",
        accountLikesTitle: "Me gusta de la cuenta",
        accountLikesDesc: "Evolución del número total de me gusta recibidos",
        followersTitle: "Followers",
        followersDesc: "Evolución del número de seguidores",
        likesByPostTitle: "Me gusta por publicación",
        likesByPostDesc:
          "Selecciona una publicación para ver la evolución de sus me gusta",
        totalLikes: "Me gusta totales",
        totalFollowers: "Seguidores totales",
        totalPosts: "Publicaciones totales",
        noData: "No hay datos disponibles",
        noLikes: "No hay me gusta por el momento",
        noPosts: "No hay publicaciones por el momento",
      },
      editProfile: "Editar perfil",
      follow: "Seguir",
      unfollow: "Dejar de seguir",
      save: "Guardar",
      followers: "Seguidores",
      following: "Siguiendo",
      forest: "Bosque",
      darkBlue: "Azul oscuro",
      light: "Claro",
      language: "Idioma",
      noBio: "Este usuario aún no ha escrito una biografía.",
      profileBioPlaceholder: "Cuéntanos sobre ti...",
      InvalidUsername: "Nombre de usuario no válido",
      InvalidBio: "Biografía no válida",
      usernameMinLength:
        "El nombre de usuario debe tener al menos 3 caracteres",
      usernameMaxLength:
        "El nombre de usuario debe tener como máximo 12 caracteres",
      usernameRegex:
        "Solo letras minúsculas, números y guiones bajos (no mayúsculas ni caracteres especiales)",
      usernameStartsWithUnderscore:
        "El nombre de usuario no puede comenzar con un guion bajo",
      bioMaxLength: "La biografía debe tener como máximo 160 caracteres",
      Bio: "Biografía",
      Theme: "Tema",
      Logout: "Cerrar sesión",
      User: "Usuario",
      loadingProfile: "Cargando perfil...",
      unableToLoadProfile: "No se puede cargar el perfil",
      profileNotFound: "Perfil no encontrado",
      checkingUsername: "Verificando disponibilidad del nombre de usuario...",
      usernameTaken: "Este nombre de usuario ya está en uso",
      "Confirm password": "Confirmar contraseña",
      chat: {
        list: {
          title: "Mensajes",
          conversationCount_one: "{{count}} conversación",
          conversationCount_other: "{{count}} conversaciones",
          newChat: "Nuevo chat",
          loading: "Cargando conversaciones...",
          empty:
            "Todavía no hay conversaciones. Inicia una para probar el flujo del chat.",
          draftSelected: "Borrador de conversación seleccionado.",
          unknownUser: "Usuario desconocido",
          noMessagesYet: "Todavía no hay mensajes",
        },
        search: {
          title: "Nuevo chat",
          subtitle: "Busca por el nombre visible de un usuario.",
          placeholder: "Buscar usuarios...",
          startTyping: "Empieza a escribir para encontrar un usuario.",
          loading: "Buscando...",
          empty: "No se encontraron usuarios.",
        },
        conversation: {
          titleFallback: "Conversación",
          live: "Conversación activa",
          new: "Nueva conversación",
          loadingMore: "Cargando...",
          loadOlder: "Cargar mensajes anteriores",
          loadingMessages: "Cargando mensajes...",
          empty: "Todavía no hay mensajes aquí.",
          inputPlaceholder: "Escribe un mensaje...",
        },
        empty: {
          loadingTitle: "Cargando conversaciones...",
          idleTitle: "Selecciona un chat o inicia uno nuevo",
          loadingDescription:
            "Obteniendo tu lista de conversaciones y preparando el hilo actual.",
          idleDescription:
            "Usa la lista de conversaciones para abrir mensajes existentes o crea un hilo nuevo y envía el primer mensaje.",
        },
        message: {
          sending: "Enviando...",
          failed: "Error",
          retry: "Reintentar",
          dismiss: "Descartar",
        },
      },
      publicApi: {
        sections: {
          keys: "Crear y gestionar claves API",
        },
        sidebar: {
          title: "Documentación API",
          description:
            "Usa una clave `seenit` en el encabezado `Authorization: Bearer ...`. Toda la API pública está limitada a 15 solicitudes por minuto.",
        },
        content: {
          keysTitle: "Gestiona tus claves API",
        },
        actions: {
          back: "Atrás",
          copy: "Copiar",
          copied: "Copiado",
          remove: "Eliminar",
        },
        endpoint: {
          queryParams: "Parámetros de consulta",
          jsonBody: "Cuerpo JSON",
          copyableExample: "Ejemplo copiable",
        },
        documentation: {
          title: "Documentación",
          overview:
            "Crea una clave API personal para autenticar solicitudes a la API pública de Seenit. Cada endpoint de esta página incluye la ruta, los parámetros admitidos y un ejemplo copiable para empezar rápido.",
          auth: "Envía la clave en el encabezado `Authorization: Bearer ...`. Toda la API pública está limitada actualmente a 15 solicitudes por minuto.",
          security:
            "Trata las claves API como contraseñas: mantenlas privadas, guárdalas de forma segura y crea una nueva si crees que alguna se ha visto comprometida.",
        },
        keys: {
          createDescription:
            "Genera y organiza las claves que usas para scripts, prototipos o integraciones externas.",
          namePlaceholder: "Clave de producción",
          nameRequired: "El nombre de la clave API es obligatorio.",
          creating: "Creando...",
          generate: "Generar clave",
          copyNewKey: "Copia tu nueva clave ahora",
          yourKeys: "Tus claves",
          yourKeysDescription:
            "Las claves existentes pueden identificarse por su prefijo/inicio guardado y fecha de creación. El secreto completo solo se muestra cuando se crea una clave.",
          loading: "Cargando claves...",
          empty: "Todavía no hay claves API.",
          unnamed: "Clave sin nombre",
          created: "creada",
          limitLabel: "Límite:",
          requestsPer: "solic. /",
          minutesShort: "min",
        },
        endpoints: {
          "list-posts": {
            description:
              "Lista las publicaciones ordenadas de la más reciente a la más antigua. Admite paginación con limit/offset.",
          },
          "list-likes": {
            description:
              "Lista los me gusta de una publicación y devuelve el total de me gusta.",
          },
          "list-followers": {
            description:
              "Lista los seguidores de un usuario y devuelve los totales de seguidores/seguidos.",
          },
          "create-post": {
            description:
              "Crea una nueva publicación propiedad del usuario de la clave API.",
          },
          "update-post": {
            description:
              "Reemplaza los campos editables de una publicación que te pertenece.",
          },
          "delete-post": {
            description: "Elimina una publicación que te pertenece.",
          },
        },
      },
      NoUsersFound: "No se encontraron usuarios",
      NoResult: "No hay resultados para tu búsqueda.",
      homeDefault:
        "Aquí verás tus publicaciones y las de los usuarios que sigues, ¡comparte tus ideas!",
      SearchUsers: "Buscar usuarios",
      SortBy: "Ordenar por",
      MostRecent: "Más recientes",
      MostLiked: "Más gustados",
      Oldest: "Más antiguos",
      ...TOSes,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "EN",
  fallbackLng: "EN",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
