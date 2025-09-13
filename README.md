# Curl2JSON

A React-based web application that converts curl commands to JSON responses with beautiful formatting.

## Features

- **Curl Command Parser**: Paste your curl command and automatically extract URL, method, headers, and data
- **Multiline Support**: Handles multiline curl commands with backslash continuations
- **JSON Formatter**: Beautiful syntax highlighting and collapsible JSON viewer
- **Real-time Execution**: Execute HTTP requests directly from the browser
- **Responsive UI**: Optimized layout with input panel on the left and JSON response on the right

## Usage

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Paste your curl command in the text area:
   ```bash
   curl -X GET 'https://api.example.com/data' \
     -H 'Authorization: Bearer token' \
     -H 'Accept: application/json'
   ```

4. Click "Execute" or press `Ctrl+Enter`

5. View the formatted JSON response on the right panel

## Supported Curl Features

- HTTP methods: GET, POST, PUT, PATCH, DELETE
- Headers: `-H` or `--header`
- Data: `-d`, `--data`, `--data-raw`
- Request method: `-X` or `--request`
- Multiline commands with backslash continuations
- Empty data flags: `-d ''`

## Technologies Used

- React 18
- TypeScript
- CSS Grid for responsive layout
- Fetch API for HTTP requests
- Custom curl command parser

## Development

### Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

### Project Structure

```
src/
├── components/
│   ├── JsonViewer.tsx     # JSON formatting and display
│   └── JsonViewer.css     # JSON viewer styles
├── services/
│   └── curlExecutor.ts    # HTTP request execution
├── utils/
│   └── curlParser.ts      # Curl command parsing logic
├── App.tsx                # Main application component
├── App.css               # Application styles
└── index.tsx             # Entry point
```

## License

MIT