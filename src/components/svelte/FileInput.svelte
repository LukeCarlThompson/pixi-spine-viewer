<script lang="ts">
  import { slide } from 'svelte/transition';
  export let inputElement;
  export let fileType = '.json';
  export let id: string;
  export let label: string;

  let fileDetails: string;

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target || !target.files) return;
    const [file] = target.files;
    const { name, size } = file;
    fileDetails = `${name} - ${(size / 1000).toFixed(2)}KB`;
    console.log(`${name} - ${(size / 1000).toFixed(2)}KB`);
  };
</script>

<div class="file-input">
  <p class="file-input__instruction">Drop file here or click to browse</p>
  <div>
    <input
      class="file-input__input"
      on:change={handleInputChange}
      bind:this={inputElement}
      type="file"
      {id}
      accept={fileType}
    />
    <label class="file-input__label" for="file">{label}</label>
  </div>
  {#if fileDetails}
    <p class="file-input__file-details" transition:slide>{fileDetails}</p>
  {/if}
</div>

<style lang="scss">
  .file-input {
    $component: &;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 30px;
    background-color: rgb(240, 240, 255);
    border-radius: 8px;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      top: -2px;
      left: -2px;
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border: 4px dashed rgb(181, 181, 250);
      border-radius: 8px;
      pointer-events: none;
    }

    &__instruction {
      margin: 0;
    }

    &__label {
      font-size: 2rem;
      display: block;
      position: relative;
      padding: 0;
      margin: 0;
      background: linear-gradient(135deg, #6ebeff, #6562be);
      text-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      cursor: pointer;
      pointer-events: none;
      transition: transform 0.4s cubic-bezier(0.5, 0, 0, 1);
    }

    &__input {
      cursor: pointer;
      display: block;
      opacity: 0;
      width: 0;
      height: 0;
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      &:hover,
      &:focus {
        + #{$component}__label {
          transform: scale(1.1);
        }
      }
      &:focus-visible {
        + #{$component}__label {
          transform: scale(1.02);
          outline: 4px solid black;
        }
      }
    }

    &__file-details {
      margin: 0;
      padding: 6px 10px;
      border-radius: 4px;
      background: rgb(224, 230, 255);
      text-align: center;
    }
  }
</style>
