# Glide React Documentation

Interactive documentation and examples for Glide React.

## Structure

- `index.html` - Main HTML entry point
- `index.js` - React app entry point
- `docs.js` - Main documentation component
- `demos.js` - Demos container component
- `examples/` - Individual example components
- `api.md` - Complete API reference
- `common.md` - Common patterns and best practices
- `*.css` - Styling files

## Running the Docs Locally

### Option 1: Using a bundler (Webpack/Vite)

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run docs:dev
```

3. Open http://localhost:3000 in your browser

### Option 2: Using a simple HTTP server

```bash
# From the project root
npx serve docs
```

## Building for Production

```bash
npm run docs:build
```

This will create a production build in `docs/dist`.

## Examples Included

- **Simple Slider** - Basic slider with dots
- **Multiple Items** - Show multiple slides at once
- **Responsive** - Different settings at different breakpoints
- **Auto Play** - Automatic slide progression
- **Auto Play Methods** - Control autoplay programmatically
- **Center Mode** - Center active slide with partial views
- **Fade** - Fade transitions instead of sliding
- **Vertical Mode** - Vertical slide direction
- **Custom Arrows** - Custom navigation arrow components
- **Custom Paging** - Custom dot indicators
- **Previous/Next Methods** - Programmatic navigation
- **Dynamic Slides** - Add/remove slides dynamically
- **Slide Change Hooks** - Track slide changes with callbacks
- **RTL** - Right-to-left mode

## Documentation Files

- **api.md** - Complete prop reference, methods, and TypeScript types
- **common.md** - Usage patterns, best practices, and tips

## Contributing

To add a new example:

1. Create a new file in `docs/examples/`
2. Import and add it to `docs/demos.js`
3. Follow the existing example format with demo section, description, and code sample

## License

MIT
