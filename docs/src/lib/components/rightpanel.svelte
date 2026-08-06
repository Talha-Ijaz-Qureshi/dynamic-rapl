<script lang="ts">
  import { Select, SelectItem, Theme, Toggle, Dropdown } from "carbon-components-svelte";
  import Icon from "@iconify/svelte";
  import { preferencesOpen, slugifyEnabled, camelCaseEnabled, selectedTheme } from "$lib/stores/preferences";

  $: isOpen = $preferencesOpen;

  function handleMouseOver() {
    preferencesOpen.set(true);
  }

  function handleMouseLeave() {
    preferencesOpen.set(false);
  }

  function stopPropagation(event: Event) {
    event.stopPropagation();
  }
  function handleClick() {
    preferencesOpen.update(state => !state);
  }

  $: {
    if (typeof document !== 'undefined') {
      if ($selectedTheme === "amoled") {
        document.body.classList.add('amoled-theme');
      } else {
        document.body.classList.remove('amoled-theme');
      }
    }
  }

  function handleSlugifyToggle() {
    if ($slugifyEnabled) {
      camelCaseEnabled.set(false);
    }
  }

  function handleCamelCaseToggle() {
    if ($camelCaseEnabled) {
      slugifyEnabled.set(false);
    }
  }
</script>

<Theme theme={$selectedTheme === "amoled" ? "g100" : $selectedTheme} />

<div
  class="preferences-panel"
  on:click={handleClick}
  class:open={isOpen}
  role="button"
  tabindex="0"
  on:keydown={(e) => { if(e.key === 'Enter' || e.key === ' ') handleClick(); }}
>
  <h1 style="opacity: 0.8;">Preferences</h1>
  <div 
       on:click={stopPropagation}
       role="button"
       tabindex="0"
       on:keydown={(e) => { if(e.key === 'Enter' || e.key === ' ') stopPropagation(e); }}>
    <Dropdown
      titleText="Select Theme"
      bind:selectedId={$selectedTheme}
      items={[
        { id: "white", text: "White" },
        { id: "g10", text: "Gray 10" },
        { id: "g80", text: "Gray 80" },
        { id: "g90", text: "Gray 90" },
        { id: "g100", text: "Dark"   },
        { id: "amoled", text: "AMOLED" }
      ]}
      size="sm"
    />
    
    <div style="margin-top: 1rem;">
      <Toggle 
        labelText="Slugify Headings" 
        bind:toggled={$slugifyEnabled}
        on:toggle={handleSlugifyToggle}
        size="sm"
      />
    </div>
    
    <div style="margin-top: 1rem;">
      <Toggle 
        labelText="CamelCase Headings" 
        bind:toggled={$camelCaseEnabled}
        on:toggle={handleCamelCaseToggle}
        size="sm"
      />
    </div>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap');
  :global(.bx--list-box--expanded.bx--list-box--sm .bx--list-box__menu) {
    max-height: fit-content;
  }
 
  /* :global(body) {
        --cds-support-02: #F55875 !important;
  } */
  :global(body.amoled-theme) {
    --cds-background: #000000 !important;
    --cds-layer: #000000 !important;
    --cds-layer-01: #000000 !important;
    --cds-layer-02: #000000 !important;
    --cds-layer-03: #000000 !important;
    --cds-field: #000000 !important;
    --cds-ui-background: #000000 !important;
    --cds-notification-background-info: #000000 !important;
    --cds-notification-background-warning: #000000 !important;
    --cds-notification-background-error: #000000 !important;
    --cds-notification-background-success: #000000 !important;
    --cds-field-01: #1a1a1a !important;
  }
  .preferences-panel {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);

    right: 0em;
    height: 97%;
    border-radius: 1em 0 0 1em;
    width: 300px;
    padding: 1rem;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    transition: 200ms cubic-bezier(1, 0, 0.01, 1);
    z-index: 1004;
    border: 1px solid var(--cds-border-subtle, #e0e0e0);
    
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  .preferences-panel * {
    -webkit-tap-highlight-color: transparent;
  }
  .preferences-panel.open {
      opacity: 1;
      transform: translateY(-50%) translateX(90%);
    }

  @media (min-width: 768px) and (max-width: 1500px) {
    .preferences-panel {
      position: fixed;
      /* left: 0; */
      /* transform: translateX(-100%); */
      top: 50%;
      transform: translateY(-50%) translateX(90%);
      backdrop-filter: blur(1em);
      -webkit-backdrop-filter: blur(1em);
      -moz-backdrop-filter: blur(1em);
      border-right: 1px solid var(--cds-border-subtle, #e0e0e0);
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      opacity: 0.5;
      width: 250px;
    }
    .preferences-panel.open {
      opacity: 1;
      transform: translateX(0) translateY(-50%);
    }
  }

  @media (max-width: 767px) {
    .preferences-panel {
      transform: translateX(-100%) translateY(-50%);
      width: 270px;
      position: fixed;
      left: 0;
      backdrop-filter: blur(1em);
      -webkit-backdrop-filter: blur(1em);
      -moz-backdrop-filter: blur(1em);

      border-right: 1px solid var(--cds-border-subtle, #e0e0e0);
      border-radius: 0 1em 1em 0;

      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }
    .preferences-panel.open {
      transform: translateX(0) translateY(-50%);
    }
  }
</style>
