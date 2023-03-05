<script lang="ts">
  import { reveal } from '$lib/cascade-reveal';
  import { slide } from 'svelte/transition';
  import downArrow from '$lib/images/down-arrow.svg?raw';
  export let fileType: string;
  export let id: string;
  export let label: string;
  export let onChange: (e: InputChangeEvent) => void = () => undefined;

  type InputChangeEvent = Event & { target: HTMLInputElement };

  let fileDetails: string | undefined;

  const handleInputChange = (e: Event) => {
    onChange(e as InputChangeEvent);

    const target = e.target as HTMLInputElement;
    if (!target || !target.files) return;
    const file = target.files[0];
    fileDetails = file ? `${file.name} - ${(file.size / 1000).toFixed(2)}KB` : undefined;
  };
</script>

<div class="file-input" use:reveal data-reveal="fade-up">
  <p class="file-input__instruction">Drop file here or click to browse</p>
  <div>
    <input
      class="file-input__input"
      on:change={handleInputChange}
      type="file"
      {id}
      accept={fileType}
    />
    <label class="file-input__label" for={id}>
      <div class="file-input__label__svg-wrap">
        {@html downArrow}
      </div>
      <span class="file-input__label__text">
        {label}
      </span>
    </label>
  </div>
  <span>
    {#if fileDetails}
      <p class="file-input__file-details" transition:slide>{fileDetails}</p>
    {/if}
  </span>
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
    max-width: 100%;
    border: 4px dashed rgb(181, 181, 250);

    &__instruction {
      margin: 0;
    }

    &__label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      position: relative;
      padding: 0;
      margin: 0;
      cursor: pointer;
      pointer-events: none;

      &__text {
        font-family: var(--font-headings);
        font-weight: 700;
        font-size: 2rem;
        background: linear-gradient(135deg, #6ebeff, #6562be);
        text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        transition: transform 0.4s cubic-bezier(0.5, 0, 0, 1),
          text-shadow 0.4s cubic-bezier(0.5, 0, 0, 1);
      }

      &__svg-wrap {
        width: 30px;
      }
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
          #{$component}__label__text {
            transform: scale(1.1);
            text-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
          }
        }
      }
      &:focus-visible {
        + #{$component}__label {
          #{$component}__label__text {
            transform: scale(1.02);
            outline: 4px solid black;
          }
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
