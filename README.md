# notes-system

A markdown notes system based on ReactJS. 

## Usage

1. Open command prompt (terminal) inside the cloned repository folder. 

2. Install all required dependencies using the command:

    ```
    npm install
    ```

3. Open the website locally using the command:

    ```
    npm run dev
    ```

    If you want local narration API support at the same time:

    ```
    npm run dev:with-tts
    ```

    or

    ```
    npx vite
    ```

## Narration audio prebuild (ElevenLabs)

Set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` in `.env.local`, then:

```
npm run ai-agents:narration:batch -- --course python
```

4. Publish and Deploy  

    As long as push in `main` branch or pull request to `main` branch is detected, the website will be automatically built, deployed to `gh-pages` branch and published to [https://gavin-op.github.io/notes-system/](https://gavin-op.github.io/notes-system/).