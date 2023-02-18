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
  <p>Drop file here or click to browse</p>
  <input
    class="file-input__input"
    on:change={handleInputChange}
    bind:this={inputElement}
    type="file"
    {id}
    accept={fileType}
  />
  <label class="file-input__label" for="file">{label}</label>
  {#if fileDetails}
    <p transition:slide>{fileDetails}</p>
  {/if}
</div>

<style lang="scss">
  .file-input {
    $component: &;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 30px;
    border: 5px solid rgb(181, 181, 250);
    background-color: rgb(240, 240, 255);
    border-radius: 8px;

    &__label {
      font-size: 2rem;
      display: block;
      position: relative;
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
      pointer-events: none;
      transition: transform 0.3s ease-out;
    }

    &__input {
      cursor: pointer;
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
          transform: scale(1.04);
        }
      }
      &:focus-visible {
        + #{$component}__label {
          transform: scale(1.02);
          outline: 4px solid black;
        }
      }
    }
  }
</style>
