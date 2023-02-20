<script lang="ts">
  import { page } from '$app/stores';
  import { reveal } from '$lib/cascade-reveal';
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  import type { PixiApp } from '../pixi/app';
  import { Spine, TextureAtlas, SpineDebugRenderer } from 'pixi-spine';
  import { Assets } from 'pixi.js';
  import FileInput from './FileInput.svelte';
  import NumberInput from './NumberInput.svelte';
  import Select from './Select.svelte';
  import { damp } from 'maath/easing/dist/maath-easing.cjs.js';
  import { append } from 'svelte/internal';

  let canvasWrap: HTMLDivElement;
  let jsonInput: HTMLInputElement;
  let atlasInput: HTMLInputElement;
  let pngInput: HTMLInputElement;
  let pixiApp: PixiApp;
  let spineAnimation: Spine;
  let scale = 1;
  let positionX = 0;
  let positionY = 0;
  let timeScale = 1;
  let isGrabbing = false;
  let mouseLastPos = {
    x: 0,
    y: 0,
  };

  let animationNames: string[] = ['test'];
  let skinNames: string[] = ['test'];

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

  // TODO: Add in controls to scale the spine anim and move around canvas
  // TODO: Add in grid with labelled coordinates

  const formSubmit = async (e: Event) => {
    e.preventDefault();

    // TODO: Throw error and display message to user if files don't exist or are the wrong kind
    if (!jsonInput.files?.length || !atlasInput.files?.length || !pngInput.files?.length) return;

    // TODO: clear and hide form after upload

    // TODO: Add upload progress indicator

    const [jsonFile, pngFile, atlasFile] = await Promise.all([
      JSON.parse(await convertToText(jsonInput.files[0])),
      convertBase64(pngInput.files[0]),
      convertToText(atlasInput.files[0]),
    ]);

    animationNames = Object.keys(jsonFile.animations);
    skinNames = Object.keys(jsonFile.skins);

    createSpine({
      jsonFile,
      pngFile,
      atlasFile,
    });
  };

  type CreateSpineProps = {
    jsonFile: Record<string, any>;
    pngFile: string;
    atlasFile: string;
  };

  const createSpine = async ({ jsonFile, pngFile, atlasFile }: CreateSpineProps) => {
    const texture = await Assets.load(pngFile);

    let textureAtlas = await new Promise<TextureAtlas>(
      (resolve) => new TextureAtlas(atlasFile, (line, callback) => callback(texture), resolve)
    );

    const runtimeVersion = jsonFile.skeleton.spine.substring(0, 3);
    // TODO: Show the spine version detected

    // TODO: Allow user to manually set runtime version
    let spineRuntime;
    switch (runtimeVersion) {
      case '3.7':
        spineRuntime = await import('@pixi-spine/runtime-3.7');
        break;
      case '3.8':
        spineRuntime = await import('@pixi-spine/runtime-3.8');
        break;
      case '4.0':
        spineRuntime = await import('@pixi-spine/runtime-4.0');
        break;
      case '4.1':
        spineRuntime = await import('@pixi-spine/runtime-4.1');
        break;
      default:
        spineRuntime = await import('@pixi-spine/runtime-4.1');
    }

    const { AtlasAttachmentLoader, SkeletonJson } = spineRuntime as any;

    let spineAtlasLoader = new AtlasAttachmentLoader(textureAtlas);

    let parser = new SkeletonJson(spineAtlasLoader);

    let spineData = parser.readSkeletonData(jsonFile);

    if (spineAnimation) {
      spineAnimation.destroy(true);
    }
    spineAnimation = new Spine(spineData);
    spineAnimation.interactive = true;
    spineAnimation.state.setAnimation(0, animationNames[0], true);
    spineAnimation.skeleton.setSkinByName(skinNames[0]);

    spineAnimation.on('mouseenter', (e) => {
      document.body.style.cursor = 'grab';
    });
    spineAnimation.on('mouseleave', (e) => {
      document.body.style.cursor = '';
    });
    spineAnimation.on('mousedown', (e) => {
      document.body.style.cursor = 'grabbing';
      isGrabbing = true;
      mouseLastPos.x = e.clientX;
      mouseLastPos.y = e.clientY;
    });
    spineAnimation.on('mouseup', (e) => {
      document.body.style.cursor = 'grab';
      isGrabbing = false;
    });

    canvasWrap.addEventListener('mousemove', (e) => {
      if (!isGrabbing) return;
      positionX = JSON.parse((positionX + e.clientX - mouseLastPos.x).toFixed(2));
      positionY = JSON.parse((positionY + e.clientY - mouseLastPos.y).toFixed(2));
      mouseLastPos.x = e.clientX;
      mouseLastPos.y = e.clientY;
    });

    positionX = pixiApp.renderer.width * 0.5;
    positionY = pixiApp.renderer.height * 0.5;
    // spineAnimation.pivot.x = spineAnimation.width * 0.5;
    // spineAnimation.pivot.y = spineAnimation.height * -0.5;

    // TODO: Display an option to turn the debugger on and off
    // spineAnimation.debug = new SpineDebugRenderer();

    pixiApp.stage.addChild(spineAnimation);

    pixiApp.ticker.add((delta) => {
      damp(spineAnimation.scale, 'x', scale, 5, delta);
      damp(spineAnimation.scale, 'y', scale, 5, delta);
      damp(spineAnimation.position, 'x', positionX, 5, delta);
      damp(spineAnimation.position, 'y', positionY, 5, delta);
      damp(spineAnimation.state, 'timeScale', timeScale, 5, delta);
    });
  };

  onMount(async () => {
    if (pixiApp) return;
    const { PixiApp } = await import('../pixi/app');
    pixiApp = new PixiApp({ el: canvasWrap });
  });
</script>

<form class="upload-form" id="upload" method="POST" on:submit={formSubmit}>
  <div class="upload-form__inner">
    <FileInput id={'json-file'} label=".json" fileType={'.json'} bind:inputElement={jsonInput} />

    <FileInput
      id={'atlas-file'}
      label=".atlas"
      fileType={'.atlas'}
      bind:inputElement={atlasInput}
    />

    <FileInput id={'png-file'} label=".png" fileType={'.png'} bind:inputElement={pngInput} />
  </div>

  <button class="upload-button" type="submit" use:reveal data-reveal="fade-up">Upload</button>
</form>

<div class="canvas-wrap" bind:this={canvasWrap} use:reveal data-reveal="fade">
  {#if spineAnimation}
    <div class="controls" transition:slide>
      {#if animationNames.length}
        <Select
          label="Animation"
          id="anim"
          options={animationNames}
          onChange={(e) => {
            if (!e.target || !e.target.value) return;
            spineAnimation.state.setAnimation(0, e.target.value, true);
          }}
        />
      {/if}
      {#if skinNames.length}
        <Select
          label="Skin"
          id="skin"
          options={skinNames}
          onChange={(e) => {
            if (!e.target || !e.target.value) return;
            spineAnimation.skeleton.setSkinByName(e.target.value);
          }}
        />
      {/if}
      <NumberInput label="Scale" id="scale" step={0.1} bind:value={scale} />
      <NumberInput label="Position X" id="position-x" step={10} bind:value={positionX} />
      <NumberInput label="Position Y" id="position-y" step={10} bind:value={positionY} />
      <NumberInput label="Time scale" id="time-scale" step={0.1} bind:value={timeScale} />
    </div>
  {/if}
</div>

<style lang="scss">
  .canvas-wrap {
    position: relative;
    min-height: 200px;
    width: 100%;
    background: rgba(100, 100, 100, 0.1);
    border-radius: 8px;
    display: flex;
    &:after {
      content: '';
      padding-top: 50%;
    }
  }

  .upload-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    margin: 0 auto 60px;

    &__inner {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-m);
    }
  }

  .upload-button {
    display: block;
    position: relative;
    border: none;
    font-size: 2rem;
    min-width: 200px;
    padding: 10px 20px;
    margin-top: 30px;
    border-radius: 100px;
    background: linear-gradient(135deg, #6ebeff, #6562be);
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.5, 0, 0, 1),
      box-shadow 0.4s cubic-bezier(0.5, 0, 0, 1);
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
  }

  .controls {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 20px;
    top: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    padding: 10px;
  }
</style>
