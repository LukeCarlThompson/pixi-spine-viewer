<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { PixiApp } from '../pixi/app';
  import { Spine, TextureAtlas } from 'pixi-spine';
  import { SkeletonJson, AtlasAttachmentLoader } from '@pixi-spine/runtime-3.7';
  import { Assets } from 'pixi.js';

  let canvasWrap: HTMLDivElement;
  let jsonInput: HTMLInputElement;
  let atlasInput: HTMLInputElement;
  let pngInput: HTMLInputElement;
  let pixiApp: PixiApp;

  const convertBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const convertToText = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const formSubmit = async (e: Event) => {
    e.preventDefault();

    // TODO: Throw error and display message to user.
    if (jsonInput.files === null || atlasInput.files === null || pngInput.files === null) return;

    const [jsonFile, pngFile, atlasFile] = await Promise.all([
      JSON.parse(await convertToText(jsonInput.files[0])),
      convertBase64(pngInput.files[0]),
      convertToText(atlasInput.files[0]),
    ]);

    createSpine({
      jsonFile,
      pngFile,
      atlasFile,
    });
  };

  type CreateSpineProps = {
    jsonFile: Record<any, any>;
    pngFile: string;
    atlasFile: string;
  };

  const createSpine = async ({ jsonFile, pngFile, atlasFile }: CreateSpineProps) => {
    const texture = await Assets.load(pngFile);

    let textureAtlas = await new Promise<TextureAtlas>(
      (resolve) => new TextureAtlas(atlasFile, (line, callback) => callback(texture), resolve)
    );

    let spineAtlasLoader = new AtlasAttachmentLoader(textureAtlas);

    let parser = new SkeletonJson(spineAtlasLoader);

    let spineData = parser.readSkeletonData(jsonFile);

    const spine = new Spine(spineData);

    spine.x = pixiApp.renderer.width * 0.5;
    spine.y = pixiApp.renderer.height * 0.5;
    spine.pivot.x = spine.width * 0.5;
    spine.pivot.y = spine.height * -0.5;

    pixiApp.stage.addChild(spine);
  };

  onMount(() => {
    if (pixiApp) return;

    pixiApp = new PixiApp({ el: canvasWrap });
  });
</script>

<form id="upload" method="POST" on:submit={formSubmit}>
  <label for="file">JSON file</label>
  <input bind:this={jsonInput} type="file" id="file" accept=".json" />

  <label for="file">Atlas file</label>
  <input bind:this={atlasInput} type="file" id="file" accept=".atlas" />

  <label for="file">PNG file</label>
  <input bind:this={pngInput} type="file" id="file" accept="image/png" />

  <button type="submit">Upload</button>
</form>

<div class="canvas-wrap" bind:this={canvasWrap} />

<style lang="scss">
  .canvas-wrap {
    position: absolute;
    height: 100%;
    width: 100%;
  }
</style>
