# NeuroBot

NeuroBot is a simple Express and React application that connects to the OpenAI API to support conversations with chatbots powered by OpenAI's models.

## Installation

### Dependencies

NeuroBot depends on Git, Node.js, and Yarn (or NPM).
In this section, we go over how to install these dependencies.

#### Git

You will need to install Git on your machine.
This will depend on your OS.
More instructions [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

#### Node.js 16+

Neurobot requires Node.js version 16 or later.
We recommend you install Node.js using [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm), which simplifies version management for Node.
Installation with `curl` or `wget` is really straightforward.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Once installed, you can run `nvm install 18` to install Node.js version 18.

To confirm that `node` is pointing to the right version, you can run `node --version`.

#### Yarn

If you've installed Node with NVM, installing Yarn is straightforward.

Simply run `corepack enable` and the `yarn` binary should be made available.

### NeuroBot

You are now ready to install NeuroBot.
To do so, clone this repository using the command line.

```bash
git clone https://github.com/juancarlosfarah/neurobot.git
```

Once you have cloned the repository, you can run the installer using Yarn.
To do this, go into the repository you have just cloned (`cd neurobot`) and run `yarn`.
This will install all the dependencies.

#### Environment

Create a `.env` file with the content below.
Make sure to replace `<YOUR_OPENAI_API_KEY>` with the correct value.

```bash
VITE_PORT=3005
VITE_API_HOST=localhost
VITE_MOCK_API=true
VITE_GRAASP_APP_ID=45678-677889
VITE_VERSION=latest
VITE_OPENAI_API_URL=http://localhost:3500/
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
```

## Running the Application

To start the application, open a new terminal window or tab, navigate to the root folder of the project, and run `yarn start`.
This will execute the React frontend and Express backend in the same terminal window.

If you want to execute the backend and frontend separately, open two different tabs or windows and run the following commands separately.

**Backend**

```
yarn start:back
```

**Frontend**

```
yarn start:front
```

Running both (or just the frontend) will open a new browser window.
If this does not happen, you can always open a browser window manually and navigate to the configured address (`http://localhost:3005` by default).

### Configuration

By default, the application opens in the configuration or `BUILDER` interface.
This interface allows you to quickly configure the settings that will be used for the interaction and to visualize each conversation.
To configure the interaction, you can click on the **Settings** tab.
Within this tab, there are two main components:

1. Prompt
2. Cue

#### Prompt

For **GPT-3.5**, which we use by default, the prompt should be a list of JSON objects, each with a `role` and `content` property.
The `role` (which can be `system`, `user`, or `assistant`) is the author of the message, while the `content` is the message itself.

In the **Prompt** field of the configuration you can input a list of JSON objects as shown in the example below (Source: [OpenAI](https://platform.openai.com/docs/guides/chat/introduction)).

```json
[
  { "role": "system", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Who won the world series in 2020?" },
  {
    "role": "assistant",
    "content": "The Los Angeles Dodgers won the World Series in 2020."
  },
  { "role": "user", "content": "Where was it played?" }
]
```

More information [here](https://platform.openai.com/docs/api-reference/chat/create).

#### Cue

The **cue** is the message that will be shown to the participant in order to start the conversation.
Note that the cue should not be the same as the last message in the **prompt**, as the cue will get automatically appended to the prompt when the participant interacts with the chatbot.

### Interaction

Once the application is configured, you can start the interaction with NeuroBot by changing the value of `DEFAULT_LOCAL_CONTEXT` in `src/config/context.ts`.
This value should be changed from `Context.BUILDER` to `Context.PLAYER` in order to switch to the interaction mode.

**Configuration Interface**

```
export const DEFAULT_LOCAL_CONTEXT = Context.BUILDER;
```

**Interaction Interface**

```
export const DEFAULT_LOCAL_CONTEXT = Context.PLAYER;
```

Saving the file should automatically update the interface.

#### Restarting an Interaction

To restart an interaction, simply stop the process running the frontend (using `Ctrl-C`) and start it again (`yarn start:front`).
This should also work if you are running both process at the same time (`Ctrl-C` followed by `yarn start`).

Note that this might open a new tab or window, which in some browsers means that you no longer have access to the configuration.
There is no need to use the new window.
You can simply refresh the window you were previously using.

#### Accessing the Logs

Currently, the conversations are stored in `sessionStorage`.
You can export the conversations by going to the _Configuration Interface_ and clicking on **Download Data**.
The logs are also accessible by opening the browser console and running:

```javascript
sessionStorage.getItem('db');
```

#### Deleting the Storage

1. Stop both processes (or the one concurrent process).
2. In the window where NeuroBot is running, open the browser console and run:

```javascript
sessionStorage.removeItem('db');
```

## Troubleshooting

In this section we go over some common issues with NeuroBot.

### No Response from OpenAI

1. Check the logs for the backend process. There might be more information there.
2. Have you added your `OPENAI_API_KEY`?
3. Try deleting the session storage and restarting the processes.

## Running the Tests

Create a `.env.test` file with the following content:

```bash
VITE_PORT=3333
VITE_API_HOST=localhost
VITE_MOCK_API=true
VITE_GRAASP_APP_ID=45678-677889
VITE_VERSION=latest
VITE_OPENAI_API_URL=http://localhost:3500/
# dont open the browser
BROWSER=none
```
