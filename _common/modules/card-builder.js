import { uiElement } from './ui-element.js';

const log = console.log;




export function buildDeck(data, mediaPath, clickCallback) {
  const deck = uiElement({ type: 'div', id: 'deck' });

  data.vocab.forEach( (item, index) => {
    const card = buildCard(item, index, mediaPath);
    card.addEventListener('click', clickCallback);
    deck.appendChild(card);
  });

  return deck;
}



export function buildCard(cardData, index, mediaPath) {

  const card  = uiElement({ type: 'div', classes: 'card',
    attrs: { 'style': `--anim-delay:${index}` },
    data_attrs: { 'index': index }
  });

  const sides = uiElement({ type: 'div', classes: 'sides' });
  const back  = uiElement({ type: 'div', classes: 'back' });
  const face  = uiElement({ type: 'div', classes: 'face' });
  
  const image = uiElement({ type: 'img', attrs: { 'src': `${mediaPath}${cardData.image}` } });
  const text  = uiElement({ type: 'p',   classes: 'text', text: cardData.text });

  face.appendChild(image);
  face.appendChild(text);

  sides.appendChild(face);
  sides.appendChild(back);
  card.appendChild(sides);


  return card;
}

