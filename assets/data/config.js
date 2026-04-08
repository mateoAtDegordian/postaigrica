window.APP_CONFIG = {
  brand: {
    name: "Hrvatska pošta Mostar",
    shortName: "HP Mostar",
    primary: "#FFF201",
    dark: "#050505",
    light: "#FFFFFF",
    logo: "./assets/hp-mostar-logo.png",
  },
  kiosk: {
    title: "Interaktivni kutak",
    subtitle:
      "Odaberite kratku igru, zabavite se i nastavite digitalno uz HP Mostar.",
    inactivityMs: 900000,
    endScreenReturnMs: 900000,
  },
  introHighlights: [
    "Memory s HP Mostar uslugama",
    "Pitalica točno ili netočno",
  ],
  memory: {
    title: "Memory",
    description:
      "Spojite sve parove što brže i s što manje promašaja.",
    pairs: [
      {
        id: "brza-posta",
        label: "Brza pošta",
        image: "./assets/memory-logos/brzaposta.png",
      },
      {
        id: "epostshop",
        label: "ePostShop",
        image: "./assets/memory-logos/epostshop.png",
      },
      {
        id: "posta",
        label: "Pošta",
        image: "./assets/memory-logos/posta.png",
      },
      {
        id: "postbox",
        label: "PostBox",
        image: "./assets/memory-logos/postbox.png",
      },
      {
        id: "postcash",
        label: "PostCash",
        image: "./assets/memory-logos/postcash.png",
      },
      {
        id: "postpak",
        label: "PostPak",
        image: "./assets/memory-logos/postpak.png",
      },
    ],
  },
  quiz: {
    title: "Pitalica",
    description:
      "Odgovorite točno ili netočno na pitanja o uslugama Hrvatske pošte Mostar.",
    questions: [
      {
        prompt: "PostCash uslugom se šalju kućni ljubimci?",
        options: ["Točno", "Netočno"],
        correctIndex: 1,
        explanation: "Netočno. PostCash služi za slanje novca.",
      },
      {
        prompt: "Besplatan broj korisničke službe Hrvatske pošte Mostar je 080 088 088?",
        options: ["Točno", "Netočno"],
        correctIndex: 0,
        explanation: "Točno. To je besplatan broj korisničke službe.",
      },
      {
        prompt: "Pošiljke Brze pošte se šalju na području cijele BiH?",
        options: ["Točno", "Netočno"],
        correctIndex: 0,
        explanation: "Točno. Brza pošta pokriva područje cijele BiH.",
      },
      {
        prompt: "Web adresa Hrvatske pošte Mostar je www.post.ba?",
        options: ["Točno", "Netočno"],
        correctIndex: 0,
        explanation: "Točno. Službena web adresa je www.post.ba.",
      },
      {
        prompt: "Poštanski broj Mostara je 99000?",
        options: ["Točno", "Netočno"],
        correctIndex: 1,
        explanation: "Netočno. Poštanski broj Mostara je 88000.",
      },
      {
        prompt: "U Hrvatskoj pošti se mogu preuzeti pošiljke putem mreže PostBox paketomata?",
        options: ["Točno", "Netočno"],
        correctIndex: 0,
        explanation: "Točno. PostBox paketomati dostupni su i u više gradova u Hercegovini.",
      },
      {
        prompt:
          "Filatelija je hobi i znanstvena disciplina koja obuhvaća skupljanje i proučavanje poštanskih maraka, omotnica, žigova i drugog poštanskog materijala.",
        options: ["Točno", "Netočno"],
        correctIndex: 0,
        explanation: "Točno. To je osnovna definicija filatelije.",
      },
      {
        prompt: "Usluga mjenjačnice nije dostupna u poštanskim uredima HP Mostar.",
        options: ["Točno", "Netočno"],
        correctIndex: 1,
        explanation: "Netočno. U poštanskim uredima HP Mostar moguće je mijenjati valute.",
      },
      {
        prompt: "0001 je broj Brze pošte?",
        options: ["Točno", "Netočno"],
        correctIndex: 1,
        explanation: "Netočno. Broj Brze pošte je 1323.",
      },
      {
        prompt: "Poštanske marke se lijepe na automobilima?",
        options: ["Točno", "Netočno"],
        correctIndex: 1,
        explanation: "Netočno. Poštanske marke lijepe se na pisma i pakete.",
      },
      {
        prompt: "Brza pošta je dostupna i preko Viber kanala?",
        options: ["Točno", "Netočno"],
        correctIndex: 0,
        explanation: "Točno. Potraži je pod imenom Brza pošta 1323.",
      },
      {
        prompt: "PostPak je usluga slanja otkupnih pošiljaka na području BiH, Srbije i Crne Gore?",
        options: ["Točno", "Netočno"],
        correctIndex: 0,
        explanation: "Točno. PostPak pokriva ta tržišta.",
      },
      {
        prompt: "PostCash uputnice se koriste za slanje novca unutar BiH.",
        options: ["Točno", "Netočno"],
        correctIndex: 1,
        explanation:
          "Netočno. PostCash je za međunarodni promet s Hrvatskom, Crnom Gorom i Srbijom, a PostNet za slanje unutar BiH.",
      },
      {
        prompt: "Web stranica za internet trgovinu Hrvatske pošte Mostar naziva se ePostShop i nalazi se na www.epostshop.ba.",
        options: ["Točno", "Netočno"],
        correctIndex: 0,
        explanation: "Točno. ePostShop je službena internet trgovina Hrvatske pošte Mostar.",
      },
      {
        prompt: "Hrvatska pošta Mostar nema profil na Instagramu.",
        options: ["Točno", "Netočno"],
        correctIndex: 1,
        explanation: "Netočno. Hrvatska pošta Mostar ima Instagram profil.",
      },
    ],
  },
  qrCards: [
    {
      id: "postbox-android",
      title: "PostBox Android",
      caption: "Preuzmi aplikaciju na Google Playu",
      image: "./assets/qr/postbox-googleplay.svg",
      fallbackUrl: "https://play.google.com/store/apps/details?id=com.locker_hpmo.postbox",
    },
    {
      id: "postbox-ios",
      title: "PostBox iPhone",
      caption: "Preuzmi aplikaciju na App Storeu",
      image: "./assets/qr/postbox-appstore.svg",
      fallbackUrl: "https://apps.apple.com/us/app/postbox/id6680197729",
    },
    {
      id: "viber",
      title: "Viber Brza pošta 1323",
      caption: "Pridruži se službenom Viber botu",
      image: "./assets/qr/viber-bot.svg",
      fallbackUrl: "https://www.post.ba/brza-posta/viber-zajednica-brze-poste-1323",
    },
  ],
};
