<script lang="ts">
  export let label: string;
  export let id: string;
  export let options: string[];
  export let selected: string = options[0];
  export let onChange: (e: SelectEvent) => void = () => undefined;

  type SelectEvent = Event & { target: HTMLSelectElement };

  const changeHandler = (e: Event) => {
    onChange(e as SelectEvent);
  };
</script>

<div class="select">
  <label class="select__label" for={id}>{label}</label>
  <div class="select__input-wrap">
    <select class="select__input" {id} bind:value={selected} on:change={changeHandler}>
      {#each options as option}
        <option class="select__option" value={option}>{option}</option>
      {/each}
    </select>
  </div>
</div>

<style lang="scss">
  .select {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;

    &__label {
      font-size: 1.2rem;
    }

    &__input-wrap {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        display: block;
        top: 14px;
        right: 10px;
        height: 12px;
        width: 18px;
        background-color: grey;
        clip-path: polygon(100% 0%, 0 0%, 50% 100%);
        pointer-events: none;
      }
    }

    &__input {
      position: relative;
      display: flex;
      appearance: none;
      min-width: 15ch;
      border: 1px solid grey;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 1rem;
      cursor: pointer;
      line-height: 1.1;
      background: linear-gradient(to top, #f9f9f9, #fff 33%);
      padding-right: 20px;
    }
  }
</style>
