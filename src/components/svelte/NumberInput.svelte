<script lang="ts">
  export let id: string;
  export let label: string;
  export let value = 0;
  export let step = 1;
  export let onChange: (e: InputChangeEvent) => void = () => undefined;

  type InputChangeEvent = Event & { target: HTMLInputElement };

  const handleInputChange = (e: Event) => {
    onChange(e as InputChangeEvent);
  };
</script>

<div class="number-input">
  <label class="number-input__label" for={id}>
    {label}
  </label>
  <input
    class="number-input__input"
    bind:value
    {step}
    on:change={handleInputChange}
    type="number"
    {id}
  />
</div>

<style lang="scss">
  .number-input {
    $component: &;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    border-radius: 8px;

    &__label {
      font-family: var(--font-headings);
      font-weight: 700;
      font-size: 1rem;
    }

    &__input {
      display: block;
      width: 140px;
      border: 1px solid grey;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 1rem;
      cursor: pointer;
      line-height: 1.1;
    }
  }
</style>
