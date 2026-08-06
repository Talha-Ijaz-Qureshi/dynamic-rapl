<script lang="ts">
  import { onMount } from "svelte";
  import { loadIcons } from '@iconify/svelte';
  import Toc from "$lib/components/Toc.svelte";
  import RightPanel from "$lib/components/rightpanel.svelte";
  import { Grid, Row, Column, ComboBox } from "carbon-components-svelte";
  import "carbon-components-svelte/css/all.css";
  import { currentSource } from "$lib/stores/contentStore";
  const currentYear = new Date().getFullYear();
  import Icon from "@iconify/svelte";
  import { tocOpen } from "$lib/stores/toc";
  import { preferencesOpen } from "$lib/stores/preferences";
  
  // Initialize with default to prevent hydration issues
  $: topicTitle = $currentSource[0].topic;
  const description = "drapl is a lightweight Linux daemon that dynamically applies PL1/PL2 power limits on Intel CPUs based on your TLP power profile and AC/battery state. Six independent power states, auto-reload on config change, systemd-integrated.";
  const keywords = "RAPL, Intel RAPL, PL1, PL2, power limit, TLP, Linux power management, systemd daemon, laptop battery life, CPU power capping, intel-rapl-mmio, Turbo Boost, Linux";
  const url = "https://talha-ijaz-qureshi.github.io/dynamic-rapl";
  import { menuOpen } from "$lib/stores/menu";
  import {
	blur,
	crossfade,
	draw,
	fade,
	fly,
	scale,
	slide
} from 'svelte/transition';    


  function toggleMenu() {
    menuOpen.update(state => !state);
    if ($tocOpen || $preferencesOpen) {
      tocOpen.set(false);
      preferencesOpen.set(false);
    }
  }

  function toggleToc() {
    tocOpen.update(state => !state);
    if (!$tocOpen) {
      menuOpen.set(false);
    }
  }

  function togglePreferences() {
    preferencesOpen.update(state => !state);
    if (!$preferencesOpen) {
      menuOpen.set(false);
    }
  }

  let isLargeScreen = false;

  onMount(() => {
    
    const checkScreenSize = () => {
      isLargeScreen = window.innerWidth >= 1200;
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    loadIcons([
    'carbon:menu',
    'carbon:side-panel-open', 
    'carbon:side-panel-close-filled',
    'carbon:settings',
    'carbon:settings-view'
  ]); 

    return () => window.removeEventListener('resize', checkScreenSize);

  });
</script>

<svelte:head>
  <title>{topicTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="author" content="Talha Ijaz Qureshi" />
  
  
  <!-- Open Graph -->
  <meta property="og:title" content={`Dynamic RAPL daemon`} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:site_name" content="Dynamic RAPL daemon for intel processors" />
    
  <!-- Schema.org -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Dynamic RAPL daemon",
      "applicationCategory": "DeveloperApplication",
      "description": "${description}",
      "author": {
        "@type": "Person",
        "name": "Talha Ijaz Qureshi"
      }
    }
  </script>

  <meta
    name="viewport"
    content="height=device-height, 
                      width=device-width, initial-scale=1.0, 
                      minimum-scale=1.0, maximum-scale=1.0, 
                      user-scalable=no, target-densitydpi=device-dpi"
  />
</svelte:head>

<div class="btnSlider" class:slideright={$preferencesOpen} >
  {#if !$menuOpen && !$tocOpen && !$preferencesOpen}
    <button class="menu-toggle" on:click={toggleMenu} aria-label="Open menu"
    in:blur={{ amount: 5, duration: 300, delay: 0 }} out:slide
    >
      <Icon
        icon="carbon:menu"
        width="32"
        height="32"
        style="color: var(--cds-text-primary)"
        
      />
    </button>
  {:else}
    <button class="toc-toggle" class:active={$tocOpen} on:click={toggleToc} aria-label="Toggle menu"
    in:fade={{delay: 0}} out:slide >
      <Icon
        icon={isLargeScreen ? ($tocOpen ? "carbon:side-panel-open" : "carbon:side-panel-close-filled") 
                           : ($tocOpen ? "carbon:side-panel-close-filled" : "carbon:side-panel-open")}
        width="32"
        height="32"
        style="color: var(--cds-text-primary)"
      />
    </button>

    <button
      class="preferences-toggle"
      class:active={$preferencesOpen}
      on:click={togglePreferences}
      aria-label="Toggle preferences"
      in:fly={{ y: -100, duration: 200, delay: 20 }} out:slide={{delay: 0}}
    >
      <Icon
        icon={isLargeScreen ? ($preferencesOpen ? "carbon:settings" : "carbon:settings-view") 
                           : ($preferencesOpen ? "carbon:settings-view" : "carbon:settings")}
        width="32"
        height="32"
        style="color: var(--cds-text-primary)"
      />
    </button>
  {/if}
</div>

<div class="layout-container">
  <Toc />
  <main class="content-area" class:marginClosed={$tocOpen}>
    
    <slot />
    <footer class="footer">
      <div class="footer-content">
        <h1>{topicTitle}</h1>
        <h2>Copyright (c) {currentYear} - Talha "tal" Ijaz</h2>

        <div class="logo">
          <Icon
            icon="carbon:doc"
            width="600"
            height="600"
            style="color: #78a9ff"
          />
        </div>
        <div class="lic">
          <h3>drapl, a state-aware daemon for dynamic RAPL MMIO profiles</h3>
          <p>
Your contributions are very welcomed, whether its opening an issue or a PR. Feel free to do so! <a href="https://github.com/talha-ijaz-qureshi/dynamic-rapl" target="_blank">https://github.com/talha-ijaz-qureshi/dynamic-rapl</a>
          </p>
        </div>

        <div class="lic two">
          <h3>MIT License</h3>
          <p>
This project is licensed under the MIT License
<a
            href="https://mit-license.org/"
            target="_blank"
            >Full license terms</a>
          </p>
        </div>

        <div class="speshal">
          <div class="flexitem">

            
            <!-- add your own icons here -->
            <Icon
            icon="carbon:linux"
            width="32"
            height="32"
            style="color: #78a9ff"
          />
          <Icon
            icon="carbon:code"
            width="32"
            height="32"
            style="color: #78a9ff"
          />
          </div>
          <div class="flexitem" style="">
            <a
            href="https://www.linkedin.com/in/talha-ijaz-qureshi"
            style="margin-left: auto;"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              icon="mdi:linkedin"
              width="32"
              height="32"
              style="color: #78a9ff"
            />
          </a>
          <a
            href="https://github.com/talha-ijaz-qureshi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              icon="mdi:tool-kit"
              width="32"
              height="32"
              style="color: #78a9ff"
            />
          </a>
          <a
            href="https://github.com/talha-ijaz-qureshi/dynamic-rapl"
            target="_blank"
            style="text-decoration:none;"
            rel="noopener noreferrer"
          >
            <code>&lt;/&gt;</code>
          </a>

          </div>
        </div>
      </div>
    </footer>
  </main>
  <RightPanel />
</div>

<style>



  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap');
  
  :global(*) {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  
  :global(html) {
     scroll-behavior: smooth; 
  }

  :global(bx--content) {
    max-width: 100%;
    padding: 2rem;
  }

  :global(nopad) {
    padding: 0 !important;
  }
  .logo {
    position: absolute;
    z-index: 0;
    right: -2em;
    opacity: 0.2;
    top: -2em;
    filter: blur(.3em) saturate(2);

  }

  .hide {
    display: none;
  }
  
  h1 {
    font-size: 5rem;
    color: #78a9ff;
    font-family: "IBM Plex Serif", serif;
    font-weight: 900;
    opacity: 1;
    z-index: 1;
    line-height: 0.9;
    margin-bottom: 0.5rem;
  }
  h2 {
    font-size: 1rem;
    color: #78a9ff;
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 900;
    opacity: 0.9;
    z-index: 1;
  }
  h3 {
    font-family: "IBM Plex Serif", serif;
    font-weight: 400;
    margin: 0.5em 0;
    color: #c6c6c6;
  }
  .footer {
    background-color: #262626;
    color: var(--cds-text-primary);
    padding: 1rem 2rem;
    padding-top: 2rem;
    margin-top: 10vh;
    border-top: 1px solid #393939;
    font-size: 0.875rem;
    height: fit-content;
    position: relative;
    overflow: hidden;
    border-radius: 1px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 5px 12px 15px #00000042;
    border-radius: 1em 1em 0 0;
    margin-bottom: 0;
  }
  .lic {
    background-color: #2e3b44;
    padding: 1rem;
    padding-top: 1rem;
    padding-top: 0;
    border-radius: 5px;
    margin-top: 2rem;
    z-index: 1;
    width: 100%;
    font-family: "IBM Plex Sans", sans-serif;
    border-bottom: 1px solid #393939;
    margin-bottom: 1rem;
  }
  .lic p {
    font-size: 1.1rem;
    line-height: 1.7;
    margin: 0.5em 0;
    color: #c6c6c6;
  }

  .two {
    padding: .5em;
    background-color: transparent;
    margin-top: 0;
    
  }
  .two h3 {
    font-size: .75rem;
  }
  .two p {
    font-size: .65rem;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    justify-content: center;
  }

  .footer a {
    color: var(--cds-link-primary);
  }

  .footer a:hover {
    text-decoration: underline;
  }

  
  .toc-toggle,
  .preferences-toggle {
    left: 0.5rem;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 1002;
    opacity: .9;

  }

  .toc-toggle {
    top: 1rem;

  }

  .preferences-toggle {
    top: 4rem;

  }

  /* .toc-toggle:active, .preferences-toggle:active, .menu-toggle:active {

  } */

  .btnSlider {
    position: fixed;
    z-index: 1002;
    display: flex;
    flex-direction: column;
    top: 0;
    right: 18rem;
    background-color: transparent;
    padding: .1em;
    padding-top: .2em;
    backdrop-filter: blur(.1em);
      -webkit-backdrop-filter: blur(.1em);
      -moz-backdrop-filter: blur(.1em);
    transition: all 200ms cubic-bezier(1, 0, 0.01, 1);

    margin: 1.2em;
    transform: translateX(0rem);
  }

  .menu-toggle {
    display: block;
    background: none;
    border: none;
    cursor: pointer;
    color: #78a9ff;
  }

  /* .active {
    background: rgba(120, 169, 255, 0.1);
    border-radius: 4px;

  } */

  .layout-container {
    display: flex;
    width: 80%;
    min-height: 100vh;
    position: relative;
  }


  .content-area {
    width: 100%;
    margin-left: 350px;
    padding: 0 2rem;
    flex: 1;
    transition: all 200ms cubic-bezier(1, 0, 0.01, 1);
  }



  @media (min-width: 768px) and (max-width: 1500px) {
    .marginClosed {
      margin-left: 100px;
    }
    .btnSlider{
      right: 1rem;
    }
    .slideright {
      transform: translateX(-520%);
    }
  }

  @media (max-width: 1199px) {
    h1 {
      font-size: 3rem;
      margin-left: 1rem;
    }
    h2 {
      font-size: 1rem;
      margin-left: 1rem;
    }
    h3 {
      font-size: 1.5rem;
    }
    p {
      font-size: 0.75rem;
      line-height: 1.7;
    }

    .footer {
      padding: 1.2rem 0;
      width: 100%;
    }



    .toc-toggle,
    .preferences-toggle {
      display: block;
    }
    .btnSlider {
      display: block;
      right: 1rem;
      border-radius: .7em;
      /* border: 1px solid var(--cds-border-subtle);
      box-shadow: 1px 0 4px rgba(0, 0, 0, 0.1); */

    }

    .layout-container {
      flex-direction: column;
      width: 100%;
    }

    .content-area {
      margin-left: auto;
      margin-right: auto;
      width: 80%;
    }
  }

  @media (max-width: 767px) {
        .slideright {
    transform: translateX(0);
  }

    .content-area {
      width: 100%;
      padding: 0rem;
    }

    .btnSlider {
      right: 0em;
      padding: .1em;
      padding-top: .2em;
      margin: .5em;
    }

    .footer {
      width: 100%;
      padding: 1.2rem 0;
      padding-top: 2rem;
      z-index: 1200;
    }


    .lic {
      border-radius: 0;
    }
  }

  .speshal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: 1000;
  }

  .flexitem {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 0 1rem;
    background-color: var(--cds-ui-background);
    border-radius: 1.5em;
		box-shadow: inset 1px 1px 7px #00000098;
    padding: .4rem .6rem;

  }



  code {
    color: #78a9ff;
    font-size: 1.2rem;
    font-weight: bold;
  }
</style>
