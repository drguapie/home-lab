# 03 — Front end: HTML, CSS, and the DOM

## The responsibilities

- **HTML** gives content meaning and structure: headings, forms, buttons, images.
- **CSS** controls layout, spacing, typography, Polaroid appearance, and overlays.
- **JavaScript** reacts to events and changes what is displayed.

Our public page is `index.html`; the management page is `admin.html`. Both use `css/style.css`.

## Example: creating a Polaroid

```javascript
const polaroid = document.createElement('div');
polaroid.className = 'polaroid';
polaroid.addEventListener('click', () => openMemory(memory));
container.appendChild(polaroid);
```

- `document.createElement` constructs a DOM element in memory.
- `className` assigns a CSS class for styling.
- `addEventListener` registers a callback for user interaction.
- `appendChild` inserts the element into the document.

A DOM element is not automatically a database record. It is a visual representation of data returned by the server.

## Forms

The admin page collects title, location, date, description, and an optional photo. JavaScript intercepts submission and sends API requests. Browser-side `required` checks improve usability but do **not** replace backend validation.

## Accessibility to improve

Ensure keyboard navigation, meaningful image alternative text, clear labels, and focus management in modal overlays. A clickable `div` needs special keyboard handling; native buttons are often simpler.

## Check yourself

1. What happens if CSS fails but HTML loads?
2. Why does a `click` handler not permanently save anything by itself?
3. Why should the backend validate fields even if the form already does?
