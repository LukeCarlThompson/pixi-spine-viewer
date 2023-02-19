<script>
  import { page } from '$app/stores';
  import githubIcon from '$lib/images/github-icon.svg?raw';
</script>

<header class="header">
  <h1 class="title">Pixi Spine viewer</h1>
  <a class="github-link" href="https://github.com/LukeCarlThompson/pixi-spine-viewer">
    {@html githubIcon}
  </a>
</header>

<style>
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    gap: 20px;
    margin: 20px 30px;
  }

  h1 {
    text-align: center;
  }

  .title {
    flex: 1;
  }

  .github-link {
    width: 30px;
  }
</style>
