<script>
  import Header from './Header.svelte';
  import './styles.scss';
</script>

<div class="app">
  <Header />

  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    position: relative;
    flex: 1;
    margin: 20px;
  }
</style>
