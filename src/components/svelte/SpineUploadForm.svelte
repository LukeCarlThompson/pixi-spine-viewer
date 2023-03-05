<script lang="ts">
  import { reveal } from '$lib/cascade-reveal';
  import FileInput from './FileInput.svelte';

  let rawJsonFile: Blob | undefined = undefined;
  let rawAtlasFile: Blob | undefined = undefined;
  let rawPngFile: Blob | undefined = undefined;

  type FormData = {
    json: Record<string, unknown>;
    atlas: string;
    png: string;
  };

  export let onSubmit: (data: FormData) => void = () => undefined;

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

    // TODO: Throw error and display message to user if files don't exist or are the wrong kind
    if (!rawJsonFile || !rawAtlasFile || !rawPngFile) return;

    // TODO: clear and hide form after upload

    // TODO: Add upload progress indicator

    const [jsonFile, pngFile, atlasFile] = await Promise.all([
      JSON.parse(await convertToText(rawJsonFile)),
      convertBase64(rawPngFile),
      convertToText(rawAtlasFile),
    ]);

    onSubmit({
      json: jsonFile,
      atlas: atlasFile,
      png: pngFile,
    });
  };
</script>

<form class="upload-form" id="upload" method="POST" on:submit={formSubmit}>
  <div class="upload-form__inner">
    <FileInput
      id={'json-file'}
      label=".json"
      fileType={'.json'}
      onChange={(e) => {
        rawJsonFile = e.target.files ? e.target.files[0] : undefined;
      }}
    />

    <FileInput
      id={'atlas-file'}
      label=".atlas"
      fileType={'.atlas'}
      onChange={(e) => {
        rawAtlasFile = e.target.files ? e.target.files[0] : undefined;
      }}
    />

    <FileInput
      id={'png-file'}
      label=".png"
      fileType={'.png'}
      onChange={(e) => {
        rawPngFile = e.target.files ? e.target.files[0] : undefined;
      }}
    />
  </div>

  <button class="upload-button" type="submit" use:reveal data-reveal="fade-up">Upload</button>
</form>

<style lang="scss">
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
      align-items: flex-start;
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
</style>
