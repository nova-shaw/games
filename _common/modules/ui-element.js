/**
*  Using 'Simulated' named paramers (with defaults) - https://exploringjs.com/js/book/ch_callables.html#simulating-named-parameters
*  
*  Call like:
*  uiElement({ type: 'button', attrs: { key: 'value' } })
*/

export function uiElement({
  type       = 'div',
  id         = null,
  classes    = null,
  attrs      = null,
  data_attrs = null,
  text       = null,
  html       = null } = {})
{

  const element = document.createElement(type);

  if (id) {
    element.setAttribute('id', id);
  }
  
  if (classes) {
    element.classList = classes;
  }

  if (attrs) {
    for (const key in attrs) {
      element.setAttribute(key, attrs[key]);
    }
  }

  if (data_attrs) {
    for (const key in data_attrs) {
      element.setAttribute(`data-${key}`, data_attrs[key]);
    }
  }

  if (text) {
    element.textContent = text;
  }

  if (html) { //// This is dangerous to provide, but allows basic formatting such as <b> and <i> to be kept in the JSON
    element.innerHTML = html;
  }

  return element;
}

