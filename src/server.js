import express from 'express';
import path from 'path';
import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';

import Html from './components/Html';
import App from './components/App';

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/api/test', async (req, res) => {

  res.status(200).send({
    success: true
  });
});

app.get('/', async (req, res) => {
  const scripts = ['vendor.js', 'client.js'];

  const initialState = { initialText: 'rendered on the server' };

  const appMarkup = renderToString(
    <App {...initialState} />
  );
  const html = renderToStaticMarkup(
    <Html
      children={appMarkup}
      scripts={scripts}
      initialState={initialState}
    />
  );

  res.send(`<!doctype html>${html}`);
});

// 404
app.use((req, res) => {
  console.error("error: Page Not Found");
  res.status(404).send({
    errors: [
      {
        status: 404,
        source: req.path,
        detail: "error: Page Not Found"
      }
    ]
  });
});

app.listen(3000, () => console.log(
    `[${new Date().toISOString()}]`, `App is running: 🌎 http://localhost:3000`
));
