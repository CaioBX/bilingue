/* =====================================================================
   WhatsApp Bilíngue · Hoje no Ceará · MOTOR
   Este arquivo é igual para todos os clientes. NÃO edite por cliente.
   Cada cliente define window.CLIENTE no próprio index.html.
   ===================================================================== */
(function(){
var CLIENTE = Object.assign({
  demo:false, nome:"", local:"", whatsapp:"", segmento:"hospedagem",
  idiomasFalados:["pt"], cor:"#0e6a73", linkMateria:"https://hojenoceara.com.br", assuntosExtras:[]
}, window.CLIENTE || {});
var DEMO_NOMES = { hospedagem:"Pousada Maré Alta", restaurante:"Restaurante Sal & Brasa", transfer:"Jeri Rota Transfer", passeio:"Buggy Duna Viva" };

/* estrutura da página e fontes (o index.html do cliente fica mínimo) */
(function montarPagina(){
  var f = document.createElement("link"); f.rel = "stylesheet";
  f.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";
  document.head.appendChild(f);
  document.body.insertAdjacentHTML("afterbegin",
    '<div class="wrap" id="app"></div><div class="bar" id="bar"></div>'+
    '<div class="panel" id="panel" aria-hidden="true"><div class="bg" data-act="close"></div><div class="sheet" role="dialog" aria-modal="true" id="sheet"></div></div>'+
    '<div class="toast" id="toast"></div>');
})();

/* =====================================================================
   BANCO DE PERGUNTAS  —  ordem dos idiomas: [pt, en, es, fr, it]
   ===================================================================== */
var LANGS = ["pt","en","es","fr","it"];
function L(a){ var o={}; LANGS.forEach(function(l,i){ o[l]=a[i]; }); return o; }

var Q = {
  // pagamento (compartilhado)
  cartao: L(["Aceitam cartão internacional?","Do you accept international cards?","¿Aceptan tarjetas internacionales?","Acceptez-vous les cartes internationales ?","Accettate carte internazionali?"]),
  pix: L(["Aceitam Pix ou dinheiro?","Do you accept Pix or cash?","¿Aceptan Pix o efectivo?","Acceptez-vous Pix ou les espèces ?","Accettate Pix o contanti?"]),
  sinal: L(["Precisa pagar sinal para reservar?","Is a deposit required to book?","¿Hay que pagar una seña para reservar?","Faut-il verser un acompte pour réserver ?","Serve un acconto per prenotare?"]),
  cancel: L(["Qual a política de cancelamento?","What is your cancellation policy?","¿Cuál es la política de cancelación?","Quelle est votre politique d'annulation ?","Qual è la politica di cancellazione?"]),
  taxa: L(["Cobram taxa de serviço?","Is there a service charge?","¿Cobran cargo por servicio?","Facturez-vous des frais de service ?","Applicate un costo del servizio?"]),
  estac: L(["Tem estacionamento?","Is there parking?","¿Hay estacionamiento?","Y a-t-il un parking ?","C'è un parcheggio?"]),
  buscaHotel: L(["Vocês buscam no hotel?","Do you pick up at my hotel?","¿Me recogen en el hotel?","Venez-vous me chercher à l'hôtel ?","Venite a prendermi in hotel?"]),
  privativo: L(["É privativo ou compartilhado?","Is it private or shared?","¿Es privado o compartido?","Est-ce privé ou partagé ?","È privato o condiviso?"]),
  vegano: L(["Têm opções vegetarianas ou veganas?","Do you have vegetarian or vegan options?","¿Tienen opciones vegetarianas o veganas?","Avez-vous des options végétariennes ou véganes ?","Avete opzioni vegetariane o vegane?"]),
  horario: L(["Que horas sai e que horas volta?","What time does it leave and return?","¿A qué hora sale y a qué hora vuelve?","À quelle heure part-on et revient-on ?","A che ora si parte e si torna?"])
};

var SETORES = {
  hospedagem: {
    principal: { tipo:"periodo",
      titulo:L(["Tem vaga nas minhas datas?","Available on my dates?","¿Hay lugar en mis fechas?","Disponible à mes dates ?","Disponibilità per le mie date?"]),
      msg:L(["Olá! Vocês têm disponibilidade de {d1} a {d2} para {p}?","Hello! Do you have availability from {d1} to {d2} for {p}?","¡Hola! ¿Tienen disponibilidad del {d1} al {d2} para {p}?","Bonjour ! Avez-vous des disponibilités du {d1} au {d2} pour {p} ?","Ciao! Avete disponibilità dal {d1} al {d2} per {p}?"]) },
    assuntos: [
      { ic:"tag", t:L(["Reserva e valores","Booking & rates","Reserva y precios","Réservation et tarifs","Prenotazione e prezzi"]), q:[
        L(["Qual o valor da diária?","What's the nightly rate?","¿Cuál es el precio por noche?","Quel est le prix par nuit ?","Qual è il prezzo per notte?"]),
        L(["Tem desconto para estadias longas?","Do you offer discounts for longer stays?","¿Hay descuento por estadías largas?","Proposez-vous des réductions pour les longs séjours ?","Ci sono sconti per soggiorni lunghi?"]),
        L(["Qual o número mínimo de noites?","Is there a minimum number of nights?","¿Hay un mínimo de noches?","Y a-t-il un nombre minimum de nuits ?","C'è un numero minimo di notti?"]),
        L(["Crianças pagam?","Do children pay?","¿Los niños pagan?","Les enfants paient-ils ?","I bambini pagano?"]) ]},
      { ic:"bed", t:L(["Quartos e estrutura","Rooms & facilities","Habitaciones e instalaciones","Chambres et équipements","Camere e servizi"]), q:[
        L(["Os quartos têm ar-condicionado?","Do the rooms have air conditioning?","¿Las habitaciones tienen aire acondicionado?","Les chambres sont-elles climatisées ?","Le camere hanno l'aria condizionata?"]),
        L(["Tem Wi-Fi? Funciona bem?","Is there Wi-Fi, and is it good?","¿Hay Wi-Fi? ¿Funciona bien?","Y a-t-il le Wi-Fi ? Fonctionne-t-il bien ?","C'è il Wi-Fi? Funziona bene?"]),
        L(["Tem piscina?","Is there a pool?","¿Hay piscina?","Y a-t-il une piscine ?","C'è una piscina?"]),
        L(["Tem quarto para família?","Do you have family rooms?","¿Tienen habitaciones familiares?","Avez-vous des chambres familiales ?","Avete camere familiari?"]) ]},
      { ic:"cafe", t:L(["Café e refeições","Breakfast & meals","Desayuno y comidas","Petit-déjeuner et repas","Colazione e pasti"]), q:[
        L(["O café da manhã está incluso?","Is breakfast included?","¿El desayuno está incluido?","Le petit-déjeuner est-il inclus ?","La colazione è inclusa?"]),
        L(["Qual o horário do café da manhã?","What time is breakfast served?","¿A qué hora es el desayuno?","À quelle heure est servi le petit-déjeuner ?","A che ora è servita la colazione?"]),
        L(["Têm opção sem glúten ou vegana?","Do you have gluten-free or vegan options?","¿Tienen opciones sin gluten o veganas?","Avez-vous des options sans gluten ou véganes ?","Avete opzioni senza glutine o vegane?"]),
        L(["Tem restaurante na pousada?","Is there a restaurant on site?","¿Hay restaurante en la posada?","Y a-t-il un restaurant sur place ?","C'è un ristorante nella struttura?"]) ]},
      { ic:"pin", t:L(["Chegada e saída","Arrival & departure","Llegada y salida","Arrivée et départ","Arrivo e partenza"]), q:[
        L(["Qual o horário de check-in e check-out?","What are check-in and check-out times?","¿Cuál es el horario de check-in y check-out?","Quels sont les horaires d'arrivée et de départ ?","Quali sono gli orari di check-in e check-out?"]),
        L(["Posso deixar a bagagem antes do check-in?","Can I leave my luggage before check-in?","¿Puedo dejar el equipaje antes del check-in?","Puis-je déposer mes bagages avant l'arrivée ?","Posso lasciare i bagagli prima del check-in?"]),
        L(["Como chego até vocês?","How do I get to you?","¿Cómo llego hasta ustedes?","Comment venir chez vous ?","Come posso arrivare da voi?"]),
        L(["Vocês indicam um transfer?","Can you recommend a transfer?","¿Pueden recomendar un transfer?","Pouvez-vous recommander un transfert ?","Potete consigliare un transfer?"]) ]},
      { ic:"rules", t:L(["Regras e pets","House rules & pets","Normas y mascotas","Règles et animaux","Regole e animali"]), q:[
        L(["Aceitam pets?","Are pets allowed?","¿Aceptan mascotas?","Les animaux sont-ils acceptés ?","Sono ammessi animali?"]),
        Q.estac,
        L(["Posso receber visitas?","Can I have visitors?","¿Puedo recibir visitas?","Puis-je recevoir des visiteurs ?","Posso ricevere visite?"]),
        L(["Tem acessibilidade para cadeirantes?","Is it wheelchair accessible?","¿Es accesible para silla de ruedas?","Est-ce accessible en fauteuil roulant ?","È accessibile in sedia a rotelle?"]) ]},
      { ic:"card", t:L(["Pagamento","Payment","Pago","Paiement","Pagamento"]), q:[Q.cartao,Q.pix,Q.sinal,Q.cancel] }
    ]
  },
  restaurante: {
    principal: { tipo:"data",
      titulo:L(["Reservar uma mesa","Book a table","Reservar una mesa","Réserver une table","Prenotare un tavolo"]),
      msg:L(["Olá! Gostaria de reservar uma mesa para {p} no dia {d1}.","Hello! I'd like to book a table for {p} on {d1}.","¡Hola! Quisiera reservar una mesa para {p} el {d1}.","Bonjour ! Je voudrais réserver une table pour {p} le {d1}.","Ciao! Vorrei prenotare un tavolo per {p} il {d1}."]) },
    assuntos: [
      { ic:"clock", t:L(["Reservas e horários","Bookings & hours","Reservas y horarios","Réservations et horaires","Prenotazioni e orari"]), q:[
        L(["Qual o horário de funcionamento?","What are your opening hours?","¿Cuál es el horario de atención?","Quels sont vos horaires d'ouverture ?","Quali sono gli orari di apertura?"]),
        L(["Precisa reservar ou posso ir direto?","Do I need a reservation or can I walk in?","¿Hay que reservar o puedo ir directo?","Faut-il réserver ou puis-je venir directement ?","Serve prenotare o posso venire direttamente?"]),
        L(["Tem mesa ao ar livre ou com vista?","Do you have outdoor or view tables?","¿Tienen mesas al aire libre o con vista?","Avez-vous des tables en terrasse ou avec vue ?","Avete tavoli all'aperto o con vista?"]),
        L(["Recebem grupos grandes ou eventos?","Do you host large groups or events?","¿Reciben grupos grandes o eventos?","Accueillez-vous de grands groupes ou des événements ?","Ospitate gruppi numerosi o eventi?"]) ]},
      { ic:"menu", t:L(["Cardápio","Menu","Menú","Menu","Menù"]), q:[
        L(["Podem me mandar o cardápio?","Could you send me the menu?","¿Pueden enviarme el menú?","Pouvez-vous m'envoyer le menu ?","Potete inviarmi il menù?"]),
        L(["Qual o prato mais pedido?","What's your most popular dish?","¿Cuál es el plato más pedido?","Quel est votre plat le plus demandé ?","Qual è il piatto più richiesto?"]),
        Q.vegano,
        L(["Têm opções sem glúten ou sem lactose?","Do you have gluten-free or lactose-free options?","¿Tienen opciones sin gluten o sin lactosa?","Avez-vous des options sans gluten ou sans lactose ?","Avete opzioni senza glutine o senza lattosio?"]) ]},
      { ic:"home", t:L(["Estrutura","Facilities","Instalaciones","Équipements","Servizi"]), q:[
        L(["Tem espaço para crianças?","Is there a kids' area?","¿Hay espacio para niños?","Y a-t-il un espace enfants ?","C'è un'area per bambini?"]),
        Q.estac,
        L(["Fazem delivery?","Do you deliver?","¿Hacen delivery?","Faites-vous la livraison ?","Fate consegne a domicilio?"]),
        L(["Tem música ao vivo?","Is there live music?","¿Hay música en vivo?","Y a-t-il de la musique live ?","C'è musica dal vivo?"]) ]},
      { ic:"card", t:L(["Pagamento","Payment","Pago","Paiement","Pagamento"]), q:[Q.cartao,Q.pix,Q.taxa] }
    ]
  },
  transfer: {
    principal: { tipo:"data",
      titulo:L(["Pedir um orçamento","Get a quote","Pedir un presupuesto","Demander un devis","Chiedere un preventivo"]),
      msg:L(["Olá! Quanto custa um transfer no dia {d1} para {p}? Já informo a origem e o destino.","Hello! How much is a transfer on {d1} for {p}? I'll share the pickup and drop-off.","¡Hola! ¿Cuánto cuesta un transfer el {d1} para {p}? Les indico el origen y el destino.","Bonjour ! Combien coûte un transfert le {d1} pour {p} ? Je vous indique le départ et l'arrivée.","Ciao! Quanto costa un transfer il {d1} per {p}? Vi indico partenza e arrivo."]) },
    assuntos: [
      { ic:"route", t:L(["Rotas e valores","Routes & prices","Rutas y precios","Trajets et tarifs","Percorsi e prezzi"]), q:[
        L(["Quanto custa de Fortaleza até Jericoacoara?","How much from Fortaleza to Jericoacoara?","¿Cuánto cuesta de Fortaleza a Jericoacoara?","Combien coûte le trajet Fortaleza–Jericoacoara ?","Quanto costa da Fortaleza a Jericoacoara?"]),
        L(["Quanto tempo dura a viagem?","How long is the trip?","¿Cuánto dura el viaje?","Combien de temps dure le trajet ?","Quanto dura il viaggio?"]),
        Q.privativo,
        L(["Fazem outras rotas?","Do you cover other routes?","¿Hacen otras rutas?","Proposez-vous d'autres trajets ?","Fate altri percorsi?"]) ]},
      { ic:"plane", t:L(["Embarque","Pickup","Recogida","Prise en charge","Ritiro"]), q:[
        L(["Vocês buscam no aeroporto de Fortaleza?","Do you pick up at Fortaleza airport?","¿Recogen en el aeropuerto de Fortaleza?","Venez-vous à l'aéroport de Fortaleza ?","Venite all'aeroporto di Fortaleza?"]),
        Q.buscaHotel,
        L(["E se o meu voo atrasar?","What if my flight is delayed?","¿Y si mi vuelo se retrasa?","Et si mon vol est retardé ?","E se il mio volo è in ritardo?"]),
        L(["Quais são os horários de saída?","What are the departure times?","¿Cuáles son los horarios de salida?","Quels sont les horaires de départ ?","Quali sono gli orari di partenza?"]) ]},
      { ic:"bag", t:L(["Bagagem e conforto","Luggage & comfort","Equipaje y comodidad","Bagages et confort","Bagagli e comfort"]), q:[
        L(["Cabe prancha de kite?","Is there room for a kite board?","¿Cabe una tabla de kite?","Y a-t-il de la place pour une planche de kite ?","C'è spazio per una tavola da kite?"]),
        L(["Quanta bagagem posso levar?","How much luggage can I bring?","¿Cuánto equipaje puedo llevar?","Combien de bagages puis-je emporter ?","Quanti bagagli posso portare?"]),
        L(["O carro tem ar-condicionado?","Does the car have air conditioning?","¿El auto tiene aire acondicionado?","La voiture est-elle climatisée ?","L'auto ha l'aria condizionata?"]),
        L(["Tem cadeirinha para criança?","Do you have a child seat?","¿Tienen silla para niños?","Avez-vous un siège enfant ?","Avete il seggiolino per bambini?"]) ]},
      { ic:"card", t:L(["Pagamento","Payment","Pago","Paiement","Pagamento"]), q:[Q.cartao,Q.pix,Q.sinal,Q.cancel] }
    ]
  },
  passeio: {
    principal: { tipo:"data",
      titulo:L(["Reservar o passeio","Book the tour","Reservar el paseo","Réserver l'excursion","Prenotare l'escursione"]),
      msg:L(["Olá! Gostaria de reservar o passeio no dia {d1} para {p}.","Hello! I'd like to book the tour on {d1} for {p}.","¡Hola! Quisiera reservar el paseo el {d1} para {p}.","Bonjour ! Je voudrais réserver l'excursion le {d1} pour {p}.","Ciao! Vorrei prenotare l'escursione il {d1} per {p}."]) },
    assuntos: [
      { ic:"compass", t:L(["Sobre o passeio","About the tour","Sobre el paseo","L'excursion","L'escursione"]), q:[
        L(["Quanto custa o passeio?","How much is the tour?","¿Cuánto cuesta el paseo?","Combien coûte l'excursion ?","Quanto costa l'escursione?"]),
        Q.horario,
        L(["O que está incluído?","What's included?","¿Qué está incluido?","Qu'est-ce qui est inclus ?","Cosa è incluso?"]),
        Q.privativo ]},
      { ic:"bag", t:L(["Preparação","Before you go","Antes de ir","Avant de partir","Prima di partire"]), q:[
        L(["O que devo levar?","What should I bring?","¿Qué debo llevar?","Que dois-je apporter ?","Cosa devo portare?"]),
        Q.buscaHotel,
        L(["Tem idade mínima?","Is there a minimum age?","¿Hay edad mínima?","Y a-t-il un âge minimum ?","C'è un'età minima?"]),
        L(["E se chover?","What if it rains?","¿Y si llueve?","Et s'il pleut ?","E se piove?"]) ]},
      { ic:"sun", t:L(["A experiência","The experience","La experiencia","L'expérience","L'esperienza"]), q:[
        L(["Qual a melhor época para fazer?","What's the best time of year for it?","¿Cuál es la mejor época para hacerlo?","Quelle est la meilleure période ?","Qual è il periodo migliore?"]),
        L(["Tem guia que fala inglês ou espanhol?","Is there an English or Spanish-speaking guide?","¿Hay guía que hable inglés o español?","Y a-t-il un guide anglophone ou hispanophone ?","C'è una guida che parla inglese o spagnolo?"]),
        L(["Dá para ver o pôr do sol?","Will we see the sunset?","¿Se puede ver el atardecer?","Pourra-t-on voir le coucher de soleil ?","Si può vedere il tramonto?"]),
        L(["É bom para crianças?","Is it good for kids?","¿Es bueno para niños?","Est-ce adapté aux enfants ?","È adatto ai bambini?"]) ]},
      { ic:"card", t:L(["Pagamento","Payment","Pago","Paiement","Pagamento"]), q:[Q.cartao,Q.pix,Q.sinal,Q.cancel] }
    ]
  }
};

/* =====================================================================
   TEXTOS DA INTERFACE
   ===================================================================== */
var NATIVO = {pt:"Português",en:"English",es:"Español",fr:"Français",it:"Italiano"};
var NOMES = {
  pt:{pt:"português",en:"inglês",es:"espanhol",fr:"francês",it:"italiano"},
  en:{pt:"Portuguese",en:"English",es:"Spanish",fr:"French",it:"Italian"},
  es:{pt:"portugués",en:"inglés",es:"español",fr:"francés",it:"italiano"},
  fr:{pt:"portugais",en:"anglais",es:"espagnol",fr:"français",it:"italien"},
  it:{pt:"portoghese",en:"inglese",es:"spagnolo",fr:"francese",it:"italiano"}
};
var LOCALE = {pt:"pt-BR",en:"en-US",es:"es-ES",fr:"fr-FR",it:"it-IT"};
var OLA = ["Olá","Hello","Hola","Bonjour","Ciao"];
function lista(arr,l){ var e = {pt:" e ",en:" and ",es:" y ",fr:" et ",it:" e "}[l]; return arr.length<2 ? (arr[0]||"") : arr.slice(0,-1).join(", ")+e+arr[arr.length-1]; }
var UI = {
  pt:{ title:"Pergunte no seu idioma", sub:"Escolha suas dúvidas e envie tudo de uma vez. Chega no nosso WhatsApp já traduzido.",
       primSub:"Envie suas datas e receba a resposta no WhatsApp", topics:"Escolha um assunto", n:function(n){return n+" perguntas";},
       other:"Outra pergunta", otherSub:"Escreva livremente no seu idioma", hint:"Toque para selecionar. Você pode escolher várias.", done:"Pronto",
       send:function(n){return "Enviar "+n+" "+(n>1?"perguntas":"pergunta")+" no WhatsApp";}, clear:"Limpar",
       d1:"Entrada", d2:"Saída", date:"Data", people:"Pessoas", sendW:"Enviar no WhatsApp", extra:"Suas perguntas selecionadas também serão enviadas.",
       p:function(n){return n+" "+(n>1?"pessoas":"pessoa");}, hi:"Olá!", many:"Olá! Tenho algumas perguntas:", also:"Também gostaria de saber:", otherMsg:"Olá! Tenho uma pergunta:",
       trust:function(x){return "Respondemos em "+x;}, seal:"Destaque no Guia Hoje no Ceará 2027", toast:"Abrindo o WhatsApp…" },
  en:{ title:"Ask in your language", sub:"Pick your questions and send them all at once. They reach our WhatsApp already translated.",
       primSub:"Send your dates and get a reply on WhatsApp", topics:"Choose a topic", n:function(n){return n+" questions";},
       other:"Something else", otherSub:"Write freely in your language", hint:"Tap to select. You can choose several.", done:"Done",
       send:function(n){return "Send "+n+" "+(n>1?"questions":"question")+" on WhatsApp";}, clear:"Clear",
       d1:"Check-in", d2:"Check-out", date:"Date", people:"People", sendW:"Send on WhatsApp", extra:"Your selected questions will be sent too.",
       p:function(n){return n+" "+(n>1?"people":"person");}, hi:"Hello!", many:"Hello! I have a few questions:", also:"I'd also like to know:", otherMsg:"Hello! I have a question:",
       trust:function(x){return "We reply in "+x;}, seal:"Featured in the Hoje no Ceará Guide 2027", toast:"Opening WhatsApp…" },
  es:{ title:"Pregunta en tu idioma", sub:"Elige tus dudas y envíalas todas juntas. Llegan a nuestro WhatsApp ya traducidas.",
       primSub:"Envía tus fechas y recibe la respuesta por WhatsApp", topics:"Elige un tema", n:function(n){return n+" preguntas";},
       other:"Otra pregunta", otherSub:"Escribe libremente en tu idioma", hint:"Toca para seleccionar. Puedes elegir varias.", done:"Listo",
       send:function(n){return "Enviar "+n+" "+(n>1?"preguntas":"pregunta")+" por WhatsApp";}, clear:"Borrar",
       d1:"Llegada", d2:"Salida", date:"Fecha", people:"Personas", sendW:"Enviar por WhatsApp", extra:"Tus preguntas seleccionadas también se enviarán.",
       p:function(n){return n+" "+(n>1?"personas":"persona");}, hi:"¡Hola!", many:"¡Hola! Tengo algunas preguntas:", also:"También me gustaría saber:", otherMsg:"¡Hola! Tengo una pregunta:",
       trust:function(x){return "Respondemos en "+x;}, seal:"Destacado en la Guía Hoje no Ceará 2027", toast:"Abriendo WhatsApp…" },
  fr:{ title:"Posez vos questions dans votre langue", sub:"Choisissez vos questions et envoyez-les en une fois. Elles arrivent sur notre WhatsApp déjà traduites.",
       primSub:"Envoyez vos dates et recevez la réponse sur WhatsApp", topics:"Choisissez un thème", n:function(n){return n+" questions";},
       other:"Autre question", otherSub:"Écrivez librement dans votre langue", hint:"Touchez pour sélectionner. Vous pouvez en choisir plusieurs.", done:"Terminé",
       send:function(n){return "Envoyer "+n+" "+(n>1?"questions":"question")+" sur WhatsApp";}, clear:"Effacer",
       d1:"Arrivée", d2:"Départ", date:"Date", people:"Personnes", sendW:"Envoyer sur WhatsApp", extra:"Vos questions sélectionnées seront aussi envoyées.",
       p:function(n){return n+" "+(n>1?"personnes":"personne");}, hi:"Bonjour !", many:"Bonjour ! J'ai quelques questions :", also:"J'aimerais aussi savoir :", otherMsg:"Bonjour ! J'ai une question :",
       trust:function(x){return "Nous répondons en "+x;}, seal:"À la une du Guide Hoje no Ceará 2027", toast:"Ouverture de WhatsApp…" },
  it:{ title:"Chiedi nella tua lingua", sub:"Scegli le tue domande e inviale tutte insieme. Arrivano sul nostro WhatsApp già tradotte.",
       primSub:"Invia le tue date e ricevi la risposta su WhatsApp", topics:"Scegli un argomento", n:function(n){return n+" domande";},
       other:"Altra domanda", otherSub:"Scrivi liberamente nella tua lingua", hint:"Tocca per selezionare. Puoi sceglierne più di una.", done:"Fatto",
       send:function(n){return "Invia "+n+" "+(n>1?"domande":"domanda")+" su WhatsApp";}, clear:"Cancella",
       d1:"Arrivo", d2:"Partenza", date:"Data", people:"Persone", sendW:"Invia su WhatsApp", extra:"Anche le domande selezionate verranno inviate.",
       p:function(n){return n+" "+(n>1?"persone":"persona");}, hi:"Ciao!", many:"Ciao! Ho alcune domande:", also:"Vorrei anche sapere:", otherMsg:"Ciao! Ho una domanda:",
       trust:function(x){return "Rispondiamo in "+x;}, seal:"In evidenza nella Guida Hoje no Ceará 2027", toast:"Apertura di WhatsApp…" }
};

/* =====================================================================
   ÍCONES
   ===================================================================== */
function sv(p,s){ s=s||20; return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }
var IC = {
  cal:sv('<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M8 3v3M16 3v3M3 10h18"/>',22),
  tag:sv('<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
  bed:sv('<path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M7 9V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 18v2M21 18v2"/>'),
  cafe:sv('<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3"/>'),
  pin:sv('<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  rules:sv('<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'),
  card:sv('<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>'),
  clock:sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  menu:sv('<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2-3 5s1 4 3 4v9"/>'),
  home:sv('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
  route:sv('<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>'),
  plane:sv('<path d="M10.5 13.5L3 11l1.5-1.5 7.5 1 4-4.5c1-1 2.5-1.5 3.5-.5s.5 2.5-.5 3.5L14.5 13l1 7.5L14 22l-2.5-7.5L8 18v3l-1.5 1-1-3.5L2 17.5 3 16h3z"/>'),
  bag:sv('<rect x="4" y="7" width="16" height="13" rx="2.5"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 12h16"/>'),
  compass:sv('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  sun:sv('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  chat:sv('<path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12z"/>'),
  arrow:sv('<path d="M5 12h14M13 6l6 6-6 6"/>',18),
  check:sv('<path d="M5 12.5l4.5 4.5L19 7.5"/>',14),
  x:sv('<path d="M6 6l12 12M18 6L6 18"/>',14),
  wa:'<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>'
};

/* =====================================================================
   MOTOR
   ===================================================================== */
function $(s){ return document.querySelector(s); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];}); }
function detectar(){
  var q = new URLSearchParams(location.search).get("lang"); if(q && LANGS.indexOf(q)>-1) return q;
  var nav = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language||"en"];
  for(var i=0;i<nav.length;i++){ var c=String(nav[i]).slice(0,2).toLowerCase(); if(LANGS.indexOf(c)>-1) return c; }
  return "en";
}
var lang = detectar();
var seg = (CLIENTE.demo && new URLSearchParams(location.search).get("tipo")) || CLIENTE.segmento; if(!SETORES[seg]) seg = "hospedagem";
(CLIENTE.assuntosExtras||[]).forEach(function(a){
  var lst = SETORES[CLIENTE.segmento].assuntos, pos = lst.length-1;   // antes de "Pagamento"
  lst.splice(pos, 0, { ic:a.ic||"chat", t:L(a.titulo), q:(a.perguntas||[]).map(L) });
});
var SEL = [];                       // perguntas marcadas: "assunto.pergunta"
var R = { d1:"", d2:"", p:2 };      // dados da ação principal
var painel = null;                  // "prim" | número do assunto

document.documentElement.style.setProperty("--brand", CLIENTE.cor);

function nome(){ return CLIENTE.demo ? DEMO_NOMES[seg] : CLIENTE.nome; }
function iniciais(n){ return n.replace(/&/g," ").split(/\s+/).filter(Boolean).slice(0,2).map(function(w){return w[0];}).join("").toUpperCase(); }
function hoje(a){ var d=new Date(); d.setDate(d.getDate()+(a||0)); return d.toISOString().slice(0,10); }
function fmt(iso,l){ var p=iso.split("-"); if(l==="pt") return p[2]+"/"+p[1]+"/"+p[0]; return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString(LOCALE[l],{day:"numeric",month:"short"}); }
function perg(key){ var k=key.split("."); return SETORES[seg].assuntos[+k[0]].q[+k[1]]; }
function wa(t){ return "https://wa.me/"+CLIENTE.whatsapp.replace(/\D/g,"")+"?text="+encodeURIComponent(t); }
function primOk(){ var t=SETORES[seg].principal.tipo; return t==="periodo" ? (R.d1 && R.d2 && R.d2>R.d1) : !!R.d1; }

/* ----- montagem da mensagem (idioma do turista + tradução em português) ----- */
function blocoPerguntas(l){ return SEL.map(function(k,i){ return (i+1)+". "+perg(k)[l]; }).join("\n"); }
function textoPrincipal(l){
  var m = SETORES[seg].principal.msg[l];
  return m.replace("{d1}", R.d1?fmt(R.d1,l):"").replace("{d2}", R.d2?fmt(R.d2,l):"").replace("{p}", UI[l].p(R.p));
}
function montar(l, comPrincipal){
  var u = UI[l];
  if(comPrincipal){ var t = textoPrincipal(l); return SEL.length ? t+"\n\n"+u.also+"\n"+blocoPerguntas(l) : t; }
  if(SEL.length===1) return u.hi+" "+perg(SEL[0])[l];
  return u.many+"\n"+blocoPerguntas(l);
}
function mensagem(comPrincipal){
  var turista = montar(lang, comPrincipal);
  if(lang==="pt") return turista+"\n\n— via Hoje no Ceará";
  return turista+"\n\n—\n(PT) "+montar("pt", comPrincipal)+"\n\nIdioma do cliente: "+NOMES.pt[lang]+" · via Hoje no Ceará";
}
function mensagemOutra(){
  var u = UI[lang];
  if(lang==="pt") return u.otherMsg+"\n\n— via Hoje no Ceará";
  return u.otherMsg+"\n\n—\n(PT) O cliente vai escrever uma pergunta em "+NOMES.pt[lang]+". · via Hoje no Ceará";
}

/* ----- tela principal ----- */
function render(){
  var u = UI[lang], S = SETORES[seg], n = nome();
  document.documentElement.lang = LOCALE[lang];
  document.title = u.title+" · "+n;
  var falados = CLIENTE.idiomasFalados.map(function(l){ return NOMES[lang][l]; });
  $("#app").innerHTML =
    '<header class="hero"><span class="blob a"></span><span class="blob b"></span>'+
      '<div class="top"><div class="mono">'+esc(iniciais(n))+'</div><div><b>'+esc(n)+'</b><small>'+esc(CLIENTE.local)+'</small></div>'+(CLIENTE.demo?'<span class="demo">Demo</span>':'')+'</div>'+
      '<div class="langs" role="group" aria-label="Language">'+LANGS.map(function(l){ return '<button class="lang'+(l===lang?' on':'')+'" data-lang="'+l+'">'+NATIVO[l]+'</button>'; }).join("")+'</div>'+
      '<div class="hello" aria-hidden="true"><span id="ola">'+OLA[LANGS.indexOf(lang)]+'</span></div>'+
      '<h1>'+esc(u.title)+'</h1><p>'+esc(u.sub)+'</p>'+
    '</header>'+
    '<main class="body">'+
      '<button class="primary" data-open="prim"><span class="ic">'+IC.cal+'</span><span><b>'+esc(S.principal.titulo[lang])+'</b><small>'+esc(u.primSub)+'</small></span><span class="arr">'+IC.arrow+'</span></button>'+
      '<div class="lbl">'+esc(u.topics)+'</div>'+
      '<div class="grid">'+S.assuntos.map(function(a,i){
        var c = SEL.filter(function(k){ return k.split(".")[0]==String(i); }).length;
        return '<button class="cat'+(c?' has':'')+'" data-open="'+i+'" style="animation-delay:'+(0.08+i*0.05)+'s"><span class="n">'+c+'</span><span class="ic">'+(IC[a.ic]||IC.chat)+'</span><span><b>'+esc(a.t[lang])+'</b><small>'+esc(u.n(a.q.length))+'</small></span></button>';
      }).join("")+'</div>'+
      '<a class="other" href="'+esc(wa(mensagemOutra()))+'" target="_blank" rel="noopener" data-toast><span style="width:38px;height:38px;border-radius:12px;background:#fff;border:1px solid var(--line);color:var(--brand);display:grid;place-items:center;flex:none">'+IC.chat+'</span><span><b>'+esc(u.other)+'</b><small>'+esc(u.otherSub)+'</small></span><span class="arr">'+IC.arrow+'</span></a>'+
      '<p class="trust"><i></i>'+esc(u.trust(lista(falados,lang)))+'</p>'+
      '<a class="seal" href="'+esc(CLIENTE.linkMateria)+'" target="_blank" rel="noopener"><span class="b">HNC</span>'+esc(u.seal)+'</a>'+
      (CLIENTE.demo ? '<div class="demo-box"><p>Só na demo: ver como fica para</p><div class="row">'+
        [["hospedagem","Pousada"],["restaurante","Restaurante"],["transfer","Transfer"],["passeio","Passeio"]].map(function(s){ return '<button class="'+(s[0]===seg?'on':'')+'" data-seg="'+s[0]+'">'+s[1]+'</button>'; }).join("")+
      '</div></div>' : '')+
    '</main>';
  renderBar();
  if(painel!==null) renderPainel(false);
}

function renderBar(){
  var u = UI[lang], b = $("#bar");
  if(!SEL.length || painel==="prim"){ b.classList.remove("show"); return; }
  b.innerHTML = '<div class="in"><a href="'+esc(wa(mensagem(false)))+'" target="_blank" rel="noopener" data-toast>'+IC.wa+esc(u.send(SEL.length))+'</a><button data-act="clear">'+esc(u.clear)+'</button></div>';
  b.classList.add("show");
}

/* ----- pop-ups ----- */
function renderPainel(animar){
  var u = UI[lang], S = SETORES[seg], sh = $("#sheet"), corpo, cab, pe;
  if(painel==="prim"){
    var P = S.principal;
    cab = '<span class="ic">'+IC.cal+'</span><div><h3>'+esc(P.titulo[lang])+'</h3><p>'+esc(u.primSub)+'</p></div>';
    var datas = P.tipo==="periodo"
      ? '<div class="grid2"><div class="field"><label>'+esc(u.d1)+'</label><input type="date" data-k="d1" min="'+hoje(0)+'" value="'+R.d1+'"></div><div class="field"><label>'+esc(u.d2)+'</label><input type="date" data-k="d2" min="'+(R.d1||hoje(1))+'" value="'+R.d2+'"></div></div>'
      : '<div class="field"><label>'+esc(u.date)+'</label><input type="date" data-k="d1" min="'+hoje(0)+'" value="'+R.d1+'"></div>';
    corpo = datas+'<div class="people"><b>'+esc(u.people)+'</b><div class="step"><button data-p="-1"'+(R.p<=1?' disabled':'')+'>−</button><span>'+R.p+'</span><button data-p="1"'+(R.p>=20?' disabled':'')+'>+</button></div></div>'+
      (SEL.length?'<div class="extra">'+IC.check+esc(u.extra)+'</div>':'');
    pe = '<a class="btn wa'+(primOk()?'':' off')+'" href="'+(primOk()?esc(wa(mensagem(true))):'#')+'" target="_blank" rel="noopener" data-toast>'+IC.wa+esc(u.sendW)+'</a>';
  } else {
    var a = S.assuntos[painel];
    cab = '<span class="ic">'+(IC[a.ic]||IC.chat)+'</span><div><h3>'+esc(a.t[lang])+'</h3><p>'+esc(u.hint)+'</p></div>';
    corpo = a.q.map(function(q,j){ var k = painel+"."+j, on = SEL.indexOf(k)>-1;
      return '<button class="qrow'+(on?' on':'')+'" data-q="'+k+'"><span class="ck">'+(on?IC.check:'')+'</span><span>'+esc(q[lang])+'</span></button>'; }).join("");
    pe = SEL.length
      ? '<a class="btn wa" href="'+esc(wa(mensagem(false)))+'" target="_blank" rel="noopener" data-toast>'+IC.wa+esc(u.send(SEL.length))+'</a>'
      : '<button class="btn" data-act="close">'+esc(u.done)+'</button>';
  }
  var y = $(".sb") ? $(".sb").scrollTop : 0;
  sh.innerHTML = '<div class="grip"></div><div class="sh">'+cab+'<button class="x" data-act="close" aria-label="Close">'+IC.x+'</button></div><div class="sb">'+corpo+'</div><div class="sf">'+pe+'</div>';
  if(!animar) $(".sb").scrollTop = y;
}
function abrir(id){ painel = id; renderPainel(true); $("#panel").classList.add("open"); $("#panel").setAttribute("aria-hidden","false"); renderBar(); }
function fechar(){ painel = null; $("#panel").classList.remove("open"); $("#panel").setAttribute("aria-hidden","true"); render(); }

function toast(){ var t=$("#toast"); t.innerHTML = IC.wa+esc(UI[lang].toast); t.classList.add("show"); setTimeout(function(){ t.classList.remove("show"); }, 1800); }

/* ----- saudação animada ----- */
var olaI = 0;
setInterval(function(){
  var el = $("#ola"); if(!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.classList.add("out");
  setTimeout(function(){ olaI = (olaI+1)%OLA.length; el.textContent = OLA[olaI]; el.classList.remove("out"); }, 450);
}, 2400);

/* ----- eventos ----- */
document.addEventListener("click", function(e){
  var t = e.target.closest("[data-lang],[data-seg],[data-open],[data-act],[data-q],[data-p],[data-toast]");
  if(!t) return;
  if(t.hasAttribute("data-lang")){ lang = t.getAttribute("data-lang"); render(); return; }
  if(t.hasAttribute("data-seg")){ seg = t.getAttribute("data-seg"); SEL = []; R = {d1:"",d2:"",p:2}; render(); return; }
  if(t.hasAttribute("data-open")){ var v = t.getAttribute("data-open"); abrir(v==="prim" ? "prim" : +v); return; }
  if(t.getAttribute("data-act")==="close"){ fechar(); return; }
  if(t.getAttribute("data-act")==="clear"){ SEL = []; render(); return; }
  if(t.hasAttribute("data-q")){ var k = t.getAttribute("data-q"), i = SEL.indexOf(k); if(i>-1) SEL.splice(i,1); else SEL.push(k); renderPainel(false); return; }
  if(t.hasAttribute("data-p")){ R.p = Math.max(1, Math.min(20, R.p + (+t.getAttribute("data-p")))); renderPainel(false); return; }
  if(t.hasAttribute("data-toast")){ if(t.classList.contains("off")){ e.preventDefault(); return; } toast(); }
});
document.addEventListener("change", function(e){
  var k = e.target.getAttribute && e.target.getAttribute("data-k"); if(!k) return;
  R[k] = e.target.value;
  if(k==="d1" && SETORES[seg].principal.tipo==="periodo" && (!R.d2 || R.d2<=R.d1)){ var n=new Date(R.d1); n.setDate(n.getDate()+1); R.d2 = n.toISOString().slice(0,10); }
  renderPainel(false);
});
document.addEventListener("keydown", function(e){ if(e.key==="Escape" && painel!==null) fechar(); });

render();
})();
