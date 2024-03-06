# ACABM v3

With the evolution of ACABM over the years coming from a simple Reddit post before Cookie Clicker was released on Steam. I have worked to refactor ACABM to essentially create a Cookie Clicker mod that is a lot easier to manage the codebase, add more features faster, and allow the community to contribute or just take the code and make their own mod from it.

ACABM v3 is a work in progress (WIP) as I build out more UI elements and migrate current ACABM v2.X features over.

⚠ Expect some bugs and less features before using

Want to use the Mod on Cookie Clicker Steam Version before it's updated in the Steam Workshop?

1. Clone or Download the files `info.txt`, `main.js` from https://github.com/elliotks/ACABM/tree/main/ACABM
2. Navigate to your Cookie Clicker Steam Folder
   `.\Steam\steamapps\common\Cookie Clicker\resources\app\mods\local`
3. Create folder `ACABM`
4. Copy `info.txt`, `main.js` into the `ACABM` folder.
5. Run Cookie Clicker
6. Navitage to: Options -> Mods -> Manage Mods
7. Disable the original `Auto Click and Buy Mod`
8. Enable `ACABM`

Want to use the Mod on Cookie Clicker Web Version?
https://orteil.dashnet.org/cookieclicker/

1. Open Developer Tools in your Web Browser (usually F12 works)
2. Click on the Console tab
3. Copy and paste the following script in the Console window

```
javascript:(function() {
    Game.LoadMod('https://elliotks.com/ACABM/ACABM/main.js');
}());
```

If above fails to load, try.

```
javascript:(function() {
    Game.LoadMod('https://cdn.jsdelivr.net/gh/elliotks/ACABM/ACABM/main.js');
}());
```

## Current Features
⚠ This is a work in progress, I will be migrating over features to the new mod structure.
- **Auto-Click BigCookie** - With option to adjust click speed from 50ms to 3,000ms (1000ms = 1second)
- **Auto-Click Shimmers** - Golden cookie, Reindeer, Wrath. This can now be customized further in the options menu.
- **Auto-Buy** - Buy "best CPS" buildings and upgrades (excluding **Vaulted**) automatically. You can also "Vault" (exclude) Tech upgrades and buildings so Auto-Buy does not buy them through the options menu. "Chocolate Egg" although considered an upgrade you can Vault once you unlock Inspired Checklist, I manually added it in the mod Options menu to exclude from Auto-Buy.

  It does not just "buy" buildings/upgrades you can afford, but attempts to buy the best buildings/upgrades. If you do not see the script buying. It is waiting for the best option to become available.

- **Auto-Buy Protect** - Calculates Lucky and Frenzy requirements so that Auto-Buy doesn't go below them. If Auto-Buy seems "stuck" try disabling this option.

## How to add a new module:

⚠ This is a work in progress, I will be documenting further as the mod framework reaches completion.

1. Create a new module object with the following properties:

- id: Unique identifier for the module
- name: Friendly name of the module
- settings: Object containing the settings for the module
- settingsUI: Object containing the settings UI for the module
- nextProc: Timestamp for the next processing of the module
- statusMessage: Status message for the module
- logic: Function that performs the logic for the module
- start: Function that starts the module
- stop: Function that stops the module
- init: Function that initializes the modulek

2. Add the module to the UIManager and MainController

```js
/**
Example of a module.
This module automatically clicks the cookie at a specified speed.
*/
const exampleModule = {
  id: "exampleModule", // Unique identifier
  name: "Example-Module", // Friendly name of the exampleModule module
  settings: {
    // Settings for the exampleModule module, can be added to the settingsUI
    enabled: false, // Indicates whether the exampleModule is enabled or not
    delay: 50, // The delay (in milliseconds) between each click
    cool: false, // Example of a custom setting
  },
  settingsUI: {
    enabled: {
      // Define the toggle setting for enabling/disabling the module
      type: "toggle", // Type of the toggle setting
      label: "Example-Module", // Label for the toggle setting
      description: "Automatically clicks the cookie at a specified speed.", // Description for the toggle setting
      actions: {
        // Define custom actions for this toggle, not required for basic toggles
        start: () => exampleModule.start(), // Start the module when the toggle is enabled
        stop: () => exampleModule.stop(), // Stop the module when the toggle is disabled
      },
    },
    delay: {
      // Define the slider setting for specifying the click speed
      type: "slider", // Type of the slider setting
      label: "Auto-Click Speed (ms)", // Label for the slider setting
      min: 50, // Minimum value for the slider setting
      max: 3000, // Maximum value for the slider setting
      step: 50, // Step value for the slider setting
      unit: "ms", // Specifying the unit for the delay setting
    },
    cool: {
      // Example of a custom setting
      type: "toggle", // Type of the toggle setting
      label: "Cool Setting", // Label for the toggle setting
      description: "This is a cool setting.", // Description for the toggle setting
    },
  },
  nextProc: 0, // Timestamp for the next click
  statusMessage: this.name + " initializing...",
  /**
   * Performs the logic for the autoClicker.
   * If the autoClicker is enabled, it clicks the cookie based on the specified delay.
   */
  logic() {
    if (!this.settings.enabled) return; // If the module is not enabled, return
    const now = Date.now(); // Get the current timestamp
    if (now >= this.nextProc) {
      // If the current timestamp is greater than or equal to the nextProc timestamp
      Game.ClickCookie(); // Click the cookie
      if (this.settings.cool) {
        // Example of a custom setting
        // Perform a cool action
        UIManager.updateModuleStatusMessage(
          // Update the status message for the module, displayed below the first module toggle.
          this.id,
          " thinks you are so Cool!"
        );
      }

      this.nextProc = now + this.settings.delay; // Set the nextProc timestamp to the current timestamp plus the delay
    }
  },
  /**
   * Starts the module.
   */
  start() {
    this.settings.enabled = true;
    // Update settings in SettingsManager
    SettingsManager.updateModuleSettings(this.id, { enabled: true });
  },
  /**
   * Stops the module.
   */
  stop() {
    this.settings.enabled = false;
    // Update settings in SettingsManager
    SettingsManager.updateModuleSettings(this.id, { enabled: false });
  },
  /**
   * Initializes the module.
   * Loads settings from SettingsManager and starts the module if enabled.
   */
  init() {
    var loadedSettings = SettingsManager.loadModuleSettings(this.id);
    if (loadedSettings) {
      this.settings = { ...this.settings, ...loadedSettings };
      if (this.settings.enabled) {
        this.start();
      }
    }
  },
};
```

3. After you have created your module, you need to add it to the UIManager and MainController. Add your new module to the following sections of code.

### UIManager

```js
var UIManager = {
  createOptionsMenu() {
    // ... (other modules)
    Game.UpdateMenu = () => {
      // Dynamically add settings for each module, including autoClicker and autoBuy
      this.addModuleSettingsToMenu([
        autoBuy,
        autoClicker,
        shimmerClicker,
        exampleModule, // Example-Module module
        /* Add other modules here */
        ,
      ]);
    };
    // ... (other modules)
  },
};
```

### MainController

```js
const MainController = {
  init() {
    // Initialize SettingsManager with default settings from modules
    SettingsManager.init([
      autoBuy,
      autoClicker,
      shimmerClicker,
      exampleModule, // Example-Module module
      /* Add other modules here */
    ]);

    autoBuy.init(); // autoBuy initialization with settings
    autoClicker.init(); // autoClicker initialization with settings
    shimmerClicker.init(); // shimmerClicker initialization with settings
    exampleModule.init(); // Example-Module module initialization with settings
    /* Add other modules here */
```

#### MainController continued...

```js
    // ... (other modules)
    const modHooks = {
      logic: () => {
        autoBuy.logic();
        autoClicker.logic();
        shimmerClicker.logic();
        exampleModule.logic(); // Example-Module module logic
        /* Add other modules here */
      },
      reset: (hard) => {
        if (hard) {
          // Here we reinitialize the modules with their default settings
          // Reset settings to default on hard reset
          SettingsManager.resetToDefault();

          // Reinitialize each module to apply default settings
          autoBuy.init();
          autoClicker.init();
          shimmerClicker.init();
          exampleModule.init(); // Example-Module module initialization with default settings
          /* Add other modules here */
        }
      },
    };
  }, // End of MainController init()
  // ... (other modules)
```

#### MainController continued...

```js
  load(saveString) {
    const savedSettings = JSON.parse(saveString);
    // Iterate over each registered module
    Object.keys(savedSettings).forEach((moduleId) => {
      if (SettingsManager.settings.hasOwnProperty(moduleId)) {
        // ... (other modules)
        Object.keys(savedSettings[moduleId]).forEach((settingKey) => {
          // ... (other modules)
        });

        /**
         * Registry of modules.
         *
         * @type {Object}
         */
        const moduleRegistry = {
          autoClicker: autoClicker,
          autoBuy: autoBuy,
          shimmerClicker: shimmerClicker,
          exampleModule: exampleModule, // Example-Module module
          /* Add other modules here */
        };

        // ... (other modules)
      }
    });
  },
};
```
