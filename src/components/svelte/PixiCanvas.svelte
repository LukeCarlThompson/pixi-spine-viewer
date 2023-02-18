<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { PixiApp } from '../pixi/app';
  import { Spine, TextureAtlas, SpineDebugRenderer } from 'pixi-spine';
  import { SkeletonJson, AtlasAttachmentLoader } from '@pixi-spine/runtime-3.7';
  import { Assets } from 'pixi.js';
  import FileInput from './FileInput.svelte';

  let canvasWrap: HTMLDivElement;
  let jsonInput: HTMLInputElement;
  let atlasInput: HTMLInputElement;
  let pngInput: HTMLInputElement;
  let pixiApp: PixiApp;
  let spineAnimation: Spine;

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

    // TODO: Throw error and display message to user if files don't exist
    if (!jsonInput.files || !atlasInput.files || !pngInput.files) return;

    // TODO: clear and hide form after upload

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

    spineAnimation = new Spine(spineData);

    spineAnimation.x = pixiApp.renderer.width * 0.5;
    spineAnimation.y = pixiApp.renderer.height * 0.5;
    spineAnimation.pivot.x = spineAnimation.width * 0.5;
    spineAnimation.pivot.y = spineAnimation.height * -0.5;

    // spineAnimation.debug = new SpineDebugRenderer();

    pixiApp.stage.addChild(spineAnimation);
  };

  onMount(() => {
    if (pixiApp) return;
    pixiApp = new PixiApp({ el: canvasWrap });
  });
</script>

<h2>Upload exported Spine files for Pixijs</h2>
<form class="upload-form" id="upload" method="POST" on:submit={formSubmit}>
  <div class="upload-form__inner">
    <FileInput
      id={'json-file'}
      label=".json file"
      fileType={'.json'}
      bind:inputElement={jsonInput}
    />

    <FileInput
      id={'atlas-file'}
      label=".atlas file"
      fileType={'.atlas'}
      bind:inputElement={atlasInput}
    />

    <FileInput id={'png-file'} label=".png file" fileType={'.png'} bind:inputElement={pngInput} />
  </div>

  <button class="upload-button" type="submit">Upload</button>
</form>

<div class="canvas-wrap" bind:this={canvasWrap} />

<style lang="scss">
  .canvas-wrap {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .upload-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 30px;
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;

    &__inner {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
    }
  }

  .upload-button {
    display: block;
    position: relative;
    border: none;
    font-size: 2rem;
    min-width: 200px;
    padding: 10px 20px;
    border-radius: 100px;
    background: linear-gradient(135deg, #6ebeff, #6562be);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s ease-out;
  }
</style>
