# Chatbot App

<a href="https://gitlocalize.com/repo/9564/fr?utm_source=badge"> <img src="https://gitlocalize.com/repo/9564/fr/badge.svg" /> </a>
<a href="https://gitlocalize.com/repo/9564/de?utm_source=badge"> <img src="https://gitlocalize.com/repo/9564/de/badge.svg" /> </a>
<a href="https://gitlocalize.com/repo/9564/it?utm_source=badge"> <img src="https://gitlocalize.com/repo/9564/it/badge.svg" /> </a>
<a href="https://gitlocalize.com/repo/9564/es?utm_source=badge"> <img src="https://gitlocalize.com/repo/9564/es/badge.svg" /> </a>

## Running the app

Create a `.env.development` file with the following content:

```bash
VITE_PORT=3005
VITE_API_HOST=http://localhost:3000
VITE_ENABLE_MOCK_API=true
VITE_GRAASP_APP_KEY=45678-677889
VITE_VERSION=latest
```

## Running the tests

Create a `.env.test` file with the following content:

```bash
VITE_PORT=3333
VITE_API_HOST=http://localhost:3636
VITE_ENABLE_MOCK_API=true
VITE_GRAASP_APP_KEY=45678-677889
VITE_VERSION=latest

# dont open browser
BROWSER=none
```
