# What's InPaint?

InPaint is a web application that helps user remove graffiti on pictures.

## Frontend

> [!TIP]
> Please install [Node.js](https://nodejs.org/en/download/current) and [yarn](https://yarnpkg.com/getting-started/install) first.

The source code of frontend is saved in `/app`, you should move to `/app` as below:

```bash
cd app
```

Then install all needed package:

```bash
yarn install
```

Last, start the dev server and open <http://localhost:3000>:

```bash
yarn dev
```

## Backend

### setup

#### 1.Environment

```bash
pip install numpy torch blobfile tqdm pyYaml pillow
```

#### 2. start the server

```bash
python -m server.core.flask.app
```
