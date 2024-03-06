/**
 * @file Auto Click and Buy Mod for Cookie Clicker.
 * @version 3.0.0
 * @license GPLv3-or-later https://www.gnu.org/licenses/gpl-3.0.html
 * @see {@link https://steamcommunity.com/sharedfiles/filedetails/?id=2823633161&tscn=1690261417 Steam Workshop}
 * @description This file contains the implementation of the Auto Click and Buy Mod for Cookie Clicker.
 */

(function ACABM() {
  const modName = "Auto Click and Buy Mod"; // Friendly name of the mod
  const modID = "ACABM"; // Unique identifier for the mod - used for div IDs, and Game.registerMod
  // const modVersion = "3.0"; // Version of the mod

  // Define a constant called modTranslations that contains an object with translations for mod
  // The object contains translations for the following languages:
  // EN (English), FR (French), DE (German), NL (Dutch), CS (Czech), PL (Polish), IT (Italian), ES (Spanish), PT-BR (Portuguese), JA (Japanese), ZH-CN (Chinese), and RU (Russian).
  // Some translations contain placeholders for dynamic values such as {0} and {1}. Please retain these placeholders when translating to other languages.
  // Also \"{0}\" and \"{1}\" are used to escape the double quotes in the translations.

  const modTranslations = {
    EN: {
      // English
      notifyDescriptionText: "Turn settings On/Off in the",
      notifyDescriptionLink: "Options",
      notifyDescriptionMenu: "Menu.",
    },
    FR: {
      // French
    },
    DE: {
      // German
    },
    NL: {
      // Dutch
    },
    CS: {
      // Czech
    },
    PL: {
      // Polish
    },
    IT: {
      // Italian
    },
    ES: {
      // Spanish
    },
    "PT-BR": {
      // Portuguese (Brazil)
    },
    JA: {
      // Japanese
    },
    "ZH-CN": {
      // Chinese (Simplified)
    },
    RU: {
      // Russian
    },
  };

  function modTranslate(key, ...placeholders) {
    // Fetch the current language setting from Cookie Clicker
    const lang = locId || "EN"; // Default to 'EN' if locId is not set

    // Access the translation string using the key; fallback to English if the key doesn't exist in the current language
    let translation =
      modTranslations[lang][key] || modTranslations["EN"][key] || key;

    // Replace placeholders in the translation string with provided arguments
    placeholders.forEach((value, index) => {
      translation = translation.replace(`{${index}}`, value);
    });

    return translation;
  }

  /**
   * Represents an Auto-Clicker module.
   * @typedef {Object} autoClicker
   * @property {string} id - Unique identifier for the Auto-Clicker module.
   * @property {string} name - Friendly name of the Auto-Clicker module.
   * @property {Object} settings - Settings for the Auto-Clicker module.
   * @property {boolean} settings.enabled - Indicates whether the Auto-Clicker is enabled or not.
   * @property {number} settings.delay - The delay (in milliseconds) between each click.
   * @property {Object} settingsUI - User interface settings for the Auto-Clicker module.
   * @property {Object} settingsUI.enabled - Toggle setting for enabling/disabling the Auto-Clicker.
   * @property {string} settingsUI.enabled.type - Type of the toggle setting.
   * @property {string} settingsUI.enabled.label - Label for the toggle setting.
   * @property {string} settingsUI.enabled.description - Description for the toggle setting.
   * @property {Object} settingsUI.delay - Slider setting for specifying the click speed.
   * @property {string} settingsUI.delay.type - Type of the slider setting.
   * @property {string} settingsUI.delay.label - Label for the slider setting.
   * @property {number} settingsUI.delay.min - Minimum value for the slider setting.
   * @property {number} settingsUI.delay.max - Maximum value for the slider setting.
   * @property {number} settingsUI.delay.step - Step value for the slider setting.
   * @property {string} settingsUI.delay.unit - Unit for the slider setting.
   * @property {number} nextProc - Timestamp for the next click.
   * @property {Function} logic - Performs the logic for the Auto-Clicker module.
   * @property {Function} start - Starts the Auto-Clicker module.
   * @property {Function} stop - Stops the Auto-Clicker module.
   * @property {Function} init - Initializes the Auto-Clicker module.
   */
  const autoClicker = {
    id: "autoClicker", // Unique identifier
    name: "Auto-Clicker", // Friendly name of the AutoClicker module
    settings: {
      enabled: false,
      delay: 50,
    },
    settingsUI: {
      enabled: {
        type: "toggle",
        label: "Auto-Clicker",
        description: "Automatically clicks the cookie at a specified speed.",
        actions: {
          // Define custom actions for this toggle
          start: () => autoClicker.start(),
          stop: () => autoClicker.stop(),
        },
      },
      delay: {
        type: "slider",
        label: "Auto-Click Speed (ms)",
        min: 50,
        max: 3000,
        step: 50,
        unit: "ms", // Specifying the unit for the delay setting
      },
    },
    nextProc: 0,
    /**
     * Performs the logic for the autoClicker.
     * If the autoClicker is enabled, it clicks the cookie based on the specified delay.
     */
    logic() {
      if (!this.settings.enabled) return;
      const now = Date.now();
      if (now >= this.nextProc) {
        Game.ClickCookie();
        this.nextProc = now + this.settings.delay;
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

  /**
   * Represents a shimmer auto-clicker module.
   * @typedef {Object} ShimmerClicker
   * @property {string} id - The unique identifier of the shimmer clicker.
   * @property {string} name - The name of the shimmer auto-clicker.
   * @property {Object} settings - The settings for the shimmer auto-clicker.
   * @property {boolean} settings.enabled - Overall module toggle.
   * @property {number} settings.delay - Delay between checks.
   * @property {boolean} settings.golden - Whether to click on golden cookies.
   * @property {boolean} settings.wrath - Whether to click on wrath cookies.
   * @property {boolean} settings.skipForcedWrath - Whether to skip clicking on wrath cookies with forced wrath.
   * @property {boolean} settings.reindeer - Whether to click on reindeer.
   * @property {Object} settingsUI - The UI settings for the shimmer auto-clicker.
   * @property {Object} settingsUI.enabled - The toggle setting for the shimmer auto-clicker.
   * @property {string} settingsUI.enabled.type - The type of the toggle setting.
   * @property {string} settingsUI.enabled.label - The label for the toggle setting.
   * @property {string} settingsUI.enabled.description - The description for the toggle setting.
   * @property {Object} settingsUI.enabled.actions - The actions for the toggle setting.
   * @property {Function} settingsUI.enabled.actions.start - The function to start the shimmer auto-clicker.
   * @property {Function} settingsUI.enabled.actions.stop - The function to stop the shimmer auto-clicker.
   * @property {Object} settingsUI.golden - The toggle setting for golden cookies.
   * @property {string} settingsUI.golden.type - The type of the toggle setting.
   * @property {string} settingsUI.golden.label - The label for the toggle setting.
   * @property {string} settingsUI.golden.description - The description for the toggle setting.
   * @property {Object} settingsUI.wrath - The toggle setting for wrath cookies.
   * @property {string} settingsUI.wrath.type - The type of the toggle setting.
   * @property {string} settingsUI.wrath.label - The label for the toggle setting.
   * @property {string} settingsUI.wrath.description - The description for the toggle setting.
   * @property {Object} settingsUI.skipForcedWrath - The toggle setting for skipping forced wrath cookies.
   * @property {string} settingsUI.skipForcedWrath.type - The type of the toggle setting.
   * @property {string} settingsUI.skipForcedWrath.label - The label for the toggle setting.
   * @property {string} settingsUI.skipForcedWrath.description - The description for the toggle setting.
   * @property {Object} settingsUI.reindeer - The toggle setting for reindeer.
   * @property {string} settingsUI.reindeer.type - The type of the toggle setting.
   * @property {string} settingsUI.reindeer.label - The label for the toggle setting.
   * @property {string} settingsUI.reindeer.description - The description for the toggle setting.
   * @property {number} nextProc - The next process for the shimmerClicker.
   * @property {Function} logic - The logic function for the shimmerClicker.
   * @property {Function} start - The function to start the shimmerClicker.
   * @property {Function} stop - The function to stop the shimmerClicker.
   * @property {Function} init - The initialization function for the shimmerClicker.
   */
  const shimmerClicker = {
    id: "shimmerClicker",
    name: "Shimmer Auto-Clicker",
    settings: {
      enabled: false, // Overall module toggle
      delay: 50, // Delay between checks
      golden: true,
      wrath: true,
      skipForcedWrath: false,
      reindeer: true,
    },
    settingsUI: {
      enabled: {
        type: "toggle",
        label: "Shimmer Auto-Clicker",
        description:
          "Automatically clicks on shimmers (Golden Cookies, Reindeer, Wrath Cookies).",
        actions: {
          start: () => shimmerClicker.start(),
          stop: () => shimmerClicker.stop(),
        },
      },
      golden: {
        type: "toggle",
        label: "Golden Cookies",
        description: "While Shimmer Auto-Clicker enabled, Golden Cookies will be clicked.",
      },
      wrath: {
        type: "toggle",
        label: "Wrath Cookies",
        description: "While Shimmer Auto-Clicker enabled, Wrath Cookies will be clicked.",
      },
      skipForcedWrath: {
        type: "toggle",
        label: "Skip Forced Wrath",
        description:
          "While Shimmer Auto-Clicker enabled, Wrath Cookies with Forced Wrath will not be clicked.",
      },
      reindeer: {
        type: "toggle",
        label: "Reindeer",
        description: "While Shimmer Auto-Clicker enabled, Reindeer will be clicked.",
      },
    },
    nextProc: 0, // Next process for the shimmerClicker
    /**
     * Performs the logic for the ACABM feature.
     * If the ACABM feature is enabled, it checks the current time and processes the shimmers accordingly.
     * The shimmers are popped based on the settings provided.
     */
    logic() {
      if (!this.settings.enabled) return;
      const now = Date.now();
      if (now >= this.nextProc) {
        Game.shimmers.forEach((shimmer) => {
          if (
            shimmer.type === "golden" &&
            this.settings.golden &&
            !shimmer.wrath
          ) {
            shimmer.pop();
          } else if (
            shimmer.type === "golden" &&
            this.settings.wrath &&
            shimmer.wrath
          ) {
            if (shimmer.force === "wrath" && this.settings.skipForcedWrath) {
              return;
            } else {
              shimmer.pop();
            }
          } else if (shimmer.type === "reindeer" && this.settings.reindeer) {
            shimmer.pop();
          }
        });
        this.nextProc = now + this.settings.delay;
      }
    },
    /**
     * Starts the module.
     */
    start() {
      this.settings.enabled = true;
      SettingsManager.updateModuleSettings(this.id, { enabled: true });
    },
    /**
     * Stops the module.
     */
    stop() {
      this.settings.enabled = false;
      SettingsManager.updateModuleSettings(this.id, { enabled: false });
    },
    /**
     * Initializes the module.
     * Loads settings from SettingsManager and starts the module if enabled.
     */
    init() {
      let loadedSettings = SettingsManager.loadModuleSettings(this.id);
      if (loadedSettings) {
        this.settings = { ...this.settings, ...loadedSettings };
        if (this.settings.enabled) {
          this.start();
        }
      }
    },
  };

  /**
   * Represents the Auto-Buy module.
   * @type {Object}
   * @property {string} id - Unique identifier.
   * @property {string} name - Name of the autoBuy module.
   * @property {Object} settings - Settings for the autoBuy module.
   * @property {boolean} settings.enabled - Indicates whether the autoBuy module is enabled or not.
   * @property {number} settings.delay - Delay between purchases.
   * @property {number[]} settings.upgradebyidVault - Stores IDs of upgrades to add to upgradeVault menu.
   * @property {number[]} settings.upgradeVault - Stores IDs of upgrades.
   * @property {number[]} settings.techVault - Stores IDs of tech upgrades.
   * @property {number[]} settings.buildingVault - Stores IDs of buildings.
   * @property {Object} settingsUI - UI settings for the autoBuy module.
   * @property {Object} settingsUI.enabled - UI settings for the enabled toggle.
   * @property {string} settingsUI.enabled.type - Type of UI element (toggle).
   * @property {string} settingsUI.enabled.label - Label for the UI element.
   * @property {string} settingsUI.enabled.description - Description for the UI element.
   * @property {Object} settingsUI.upgradeVault - UI settings for the upgradeVault.
   * @property {string} settingsUI.upgradeVault.type - Type of UI element (complex).
   * @property {Function} settingsUI.upgradeVault.action - Action to perform when the UI element is interacted with.
   * @property {Object} settingsUI.techVault - UI settings for the techVault.
   * @property {string} settingsUI.techVault.type - Type of UI element (complex).
   * @property {Function} settingsUI.techVault.action - Action to perform when the UI element is interacted with.
   * @property {Object} settingsUI.buildingVault - UI settings for the buildingVault.
   * @property {string} settingsUI.buildingVault.type - Type of UI element (complex).
   * @property {Function} settingsUI.buildingVault.action - Action to perform when the UI element is interacted with.
   * @property {Calculator} Calculator - Calculator class for calculating the best item to buy based on the current game state.
   * @property {Calculator} calculator - Instance of the Calculator class.
   * @property {boolean} protect - Indicates whether the autoBuy module is protected or not.
   * @property {Object} target - Target object for the autoBuy module.
   * @property {string} target.name - Name of the target object.
   * @property {number} target.price - Price of the target object.
   * @property {number} total - Total value for the autoBuy module.
   * @property {number} nextProc - Next process for the autoBuy module.
   * @property {string} statusMessage - Status message for the autoBuy module.
   */
  const autoBuy = {
    id: "autoBuy", // Unique identifier
    name: "Auto-Buy", // Name of the autoBuy module
    settings: {
      enabled: false,
      delay: 50, // delay between purchases
      protect: false, // Indicates whether
      upgradebyidVault: [227], // Stores IDs of upgrades to add to upgradeVault menu.
      upgradeVault: [], // Stores IDs of upgrades
      techVault: [], // Stores IDs of tech upgrades
      buildingVault: [], // Stores IDs of buildings
    },
    settingsUI: {
      enabled: {
        type: "toggle",
        label: "Auto-Buy",
        description:
          "Automatically buys the best building or upgrade based on current game state.",
        actions: {
          // Define custom actions for this toggle
          start: () => autoBuy.start(),
          stop: () => autoBuy.stop(),
        },
      },
      upgradeVault: {
        type: "complex",
        action: (parent) => {
          UIManager.createDynamicSettingsUI(
            autoBuy,
            "Upgrade Vault",
            'Select which upgrades to exclude from Auto-Buy. Useful if you do not own "Inspired Checklist".',
            "upgradeVault",
            autoBuy.settings.upgradebyidVault
              .map((id) => Game.UpgradesById[id])
              .filter(Boolean), // Filter for static upgrades defined in upgradebyidVault.
            parent
          );
        },
      },
      techVault: {
        type: "complex",
        action: (parent) =>
          UIManager.createDynamicSettingsUI(
            autoBuy,
            "Tech Vault",
            "Select which tech upgrades to exclude from Auto-Buy.",
            "techVault",
            Game.UpgradesByPool["tech"],
            parent
          ),
      },
      buildingVault: {
        type: "complex",
        action: (parent) =>
          UIManager.createDynamicSettingsUI(
            autoBuy,
            "Building Vault",
            "Select which buildings to exclude from Auto-Buy.",
            "buildingVault",
            Game.ObjectsById,
            parent
          ),
      },
      protect: {
        type: "toggle",
        label: "Protect",
        description:
          "Protects against going under Lucky and Frenzy requirements.",
      },
      // Include UI elements for other settings as needed
    },

    /**
     * Calculator class for calculating the best item to buy based on the current game state.
     * @memberof autoBuy
     * @class
     */
    Calculator: class {
      /**
       * Creates an instance of Calculator.
       * @memberof Calculator
       */
      constructor() {
        /**
         * Schema for the Calculator class.
         * @type {Array}
         * @property {Function} objects - Returns an array of objects to be used in the schema.
         * @property {Object} accessors - Accessors for the objects in the schema.
         * @property {Function} accessors.add - Adds an object to the schema.
         * @property {Function} accessors.sub - Removes an object from the schema.
         * @property {Function} accessors.price - Returns the price of an object.
         * @property {Function} accessors.lasting - Returns the lasting value of an object.
         */
        this.schema = [
          {
            objects: function () {
              return Game.UpgradesInStore.filter(function (e) {
                return (
                  [].indexOf(e.id) < 0 &&
                  e.pool != "prestige" &&
                  e.pool != "toggle" &&
                  !Game.vault.includes(e.id) &&
                  !autoBuy.settings.upgradeVault.includes(e.id) &&
                  !autoBuy.settings.techVault.includes(e.id)
                );
              });
            },
            accessors: {
              add: function (e) {
                e.bought = 1;
              },
              sub: function (e) {
                e.bought = 0;
              },
              price: function (e) {
                return e.basePrice;
              },
              lasting: function (e) {
                return e.lasting;
              },
            },
          },
          {
            objects: function () {
              return Game.ObjectsById.filter(function (e) {
                return (
                  [].indexOf(e.id) < 0 &&
                  !autoBuy.settings.buildingVault.includes(e.id)
                );
              });
            },
            accessors: {
              add: function (e) {
                e.amount++;
              },
              sub: function (e) {
                e.amount--;
              },
              price: function (e) {
                return e.price;
              },
              lasting: function (e) {
                return e.lasting;
              },
            },
          },
        ];
      }

      /**
       * Calculates the CPS acceleration based on the base CPS, new CPS, and price.
       *
       * @param {number} base_cps - The base CPS (Cookies Per Second).
       * @param {number} new_cps - The new CPS.
       * @param {number} price - The price.
       * @returns {number} The CPS acceleration.
       */
      cps_acc(base_cps, new_cps, price) {
        return (base_cps * base_cps * (new_cps - base_cps)) / (price * price);
      }

      /**
       * Calculates the effective cookies per second (ecps).
       * The ecps is calculated by multiplying the current cookies per second (cps) by the fraction of cps that is not being sucked by wrinklers.
       * @memberof Calculator
       * @returns {number} The effective cookies per second.
       */
      ecps() {
        return Game.cookiesPs * (1 - Game.cpsSucked);
      }

      /**
       * Calculates the bonus for an item based on the given parameters.
       *
       * @param {Object} item - The item for which to calculate the bonus.
       * @param {Function} list_generator - A function that generates a list of items.
       * @param {number} mouse_rate - The mouse rate to be used in the calculation.
       * @returns {Array} An array of objects containing the calculated bonus for each item.
       */
      calc_bonus(item, list_generator, mouse_rate) {
        // Temporarily override Game.Win
        var funcGW = Game.Win;
        Game.Win = function () {}; // Temporarily replace with no-op function

        // Temporarily override Game.CalculateGains
        // Clone the necessary game state
        var originalState = {
          CalculateGains: Game.CalculateGains,
          cookiesPsRawHighest: Game.cookiesPsRawHighest,
          // Clone other necessary variables or states
        };

        // Temporarily override Game.CalculateGains with a version that does not modify cookiesPsRawHighest
        Game.CalculateGains = function () {
          var originalRawHighest = Game.cookiesPsRawHighest;
          originalState.CalculateGains.call(Game); // Call the original CalculateGains
          Game.cookiesPsRawHighest = originalRawHighest; // Restore cookiesPsRawHighest after the call
        };

        var res = list_generator().map(
          function (e) {
            var lasting = this.item.lasting(e);
            var price = Math.round(this.item.price(e));
            // -- Garden Upgrade Calc -- currently the only upgrades using lasting.
            if (lasting) {
              price = Math.round(price * Game.cookiesPs * 60);
            }
            // -- Dragon Upgrade Calc -- currently the only upgrades with price 999.
            if (price == 999) {
              price =
                Game.unbuffedCps *
                60 *
                30 *
                (Game.dragonLevel < Game.dragonLevels.length - 1 ? 1 : 0.1);
            }

            this.item.add(e);
            Game.CalculateGains();
            var cps = this.calc.ecps() + Game.computedMouseCps * this.rate;
            this.item.sub(e);
            Game.CalculateGains();
            return {
              obj: e,
              price: price,
              acc: this.calc.cps_acc(this.base_cps, cps, price),
            };
          }.bind({
            item: item,
            calc: this,
            rate: mouse_rate,
            base_cps:
              (Game.cookiesPs ? this.ecps() : 0.001) +
              Game.computedMouseCps * mouse_rate,
          })
        );

        Game.Win = funcGW; // Restore Game.Win
        Game.CalculateGains = originalState.CalculateGains; // Restore Game.CalculateGains
        Game.cookiesPsRawHighest = originalState.cookiesPsRawHighest; // Restore cookiesPsRawHighest

        return res;
      }

      /**
       * Finds the best object based on the given mouse rate.
       * @memberof Calculator
       * @param {number} mouse_rate - The mouse rate to calculate the bonus.
       * @returns {Object} - The best object based on the mouse rate.
       */
      find_best(mouse_rate) {
        var pool = [];
        var zero_buy = Math.sqrt(Game.cookiesEarned * Game.cookiesPs);

        for (var i = 0; i < this.schema.length; i++)
          pool = pool.concat(
            this.calc_bonus(
              this.schema[i].accessors,
              this.schema[i].objects,
              mouse_rate || 0
            )
          );

        return pool.reduce(function (m, v) {
          return m.acc == 0 && m.price < zero_buy
            ? m
            : v.acc == 0 && v.price < zero_buy
            ? v
            : m.acc < v.acc
            ? v
            : m;
        }, pool[0]);
      }
    },
    calculator: null, // Placeholder for an instance of the Calculator class
    target: { name: undefined, price: -1 }, // Target object for the autoBuy module
    total: -1, // Total value for the autoBuy module
    nextProc: 0, // Next process for the autoBuy module
    statusMessage: this.name + " is initializing...", // Status message for the autoBuy module
    /**
     * Performs the logic for determining what to buy next based on the current settings and game state.
     * If the auto-clicker is enabled, it calculates the best item to buy and waits for the appropriate time to make the purchase.
     * If the auto-clicker is disabled, it checks if there are any buildings available in the building vault and buys the cheapest one if possible.
     * If there are no buildings available, it skips the logic and returns.
     * If the wait time is too long or negative, it skips the logic and returns.
     * If the wait time is positive, it waits for the specified time and then buys the item.
     * If the wait time is less than -1, it checks if the conditions are met for buying the item and then buys it.
     * @returns {void}
     */
    logic() {
      if (!this.settings.enabled) {
        return;
      }
      // Logic to use the Calculator
      if (!this.calculator) {
        this.calculator = new this.Calculator(); // Instantiate the Calculator when needed
      }

      const now = Date.now();
      if (now >= this.nextProc) {
        // Calculate the best item to buy based on the current game state
        var info = this.calculator.find_best(
          autoClicker.settings.enabled ? 1000 / autoClicker.settings.delay : 0
        );

        // attempts to protect you from going under Lucky and Frenzy requirements.
        var protect =
          this.protect && Game.Has("Get lucky") != 0
            ? (Game.hasBuff("Frenzy") != 0 ? 1 : 7) * Game.cookiesPs * 1200
            : 0;
        var wait =
          (protect + info.price - Game.cookies) / this.calculator.ecps();

        // Update the target object based on the calculated info
        // Used for guarding against buying before having enough cookies, and if the user bought something manually.
        this.target.name = info.obj.name ? info.obj.name : undefined;
        this.target.price = info.price ? info.price : -1;

        if (!isFinite(wait)) {
          if (Game.BuildingsOwned === 0) {
            // Filter out buildings that are not in the building vault
            const availableBuildings = Game.ObjectsById.filter(function (
              building
            ) {
              return autoBuy.settings.buildingVault.includes(building.id);
            });

            // Check if buildings are available after filtering
            if (availableBuildings.length === 0) {
              return;
            }

            // Find the cheapest building not in the vault // availableBuildings.reduce(function (
            const cheapestBuilding = Game.ObjectsById.reduce(function (
              prev,
              curr
            ) {
              return prev.price < curr.price ? prev : curr;
            });

            if (cheapestBuilding.price <= Game.cookies) {
              // Switch to buy Mode
              Game.storeBulkButton(0);
              // Buy the cheapest building
              UIManager.updateModuleStatusMessage(
                this.id,
                "Buying: " + `"${cheapestBuilding.name}"`
              );
              cheapestBuilding.buy(1);
              return;
            }
          }
          UIManager.updateModuleStatusMessage(
            this.id,
            "Too long to wait, skipping: " + `"${info.obj.name}"`
          );
          return;
        }
        if (wait > 0) {
          UIManager.updateModuleStatusMessage(
            this.id,
            "Waiting: " +
              this.beautifySeconds(wait) +
              ", to buy: " +
              `"${info.obj.name}"`
          );
        } else if (wait < -1) {
          // Guard against buying before having enough cookies.
          var t = this.total;
          this.total =
            1000 * (Game.hasBuff("Frenzy") != 0 ? 1 : 0) +
            Game.BuildingsOwned +
            Game.UpgradesOwned;

          if (
            t != this.total ||
            this.target.price >= Game.cookies - this.calculator.ecps()
          ) {
            return; // Early exit if conditions are met
          }

          UIManager.updateModuleStatusMessage(
            this.id,
            "Buying: " + `"${info.obj.name}"`
          );
          // Execute purchase
          if (info.obj.name === "One mind") {
            Game.UpgradesById["69"].buy(1);
            Game.ClosePrompt();
          } else {
            info.obj.buy();
          }
          this.total++;
        }

        this.nextProc = now + this.settings.delay;
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
    /**
     * Converts a given number of seconds into a human-readable format.
     * @param {number} seconds - The number of seconds to convert.
     * @returns {string} The formatted time string.
     */
    beautifySeconds(seconds) {
      var days = Math.floor(seconds / 86400); // Calculate days
      seconds %= 86400; // Update seconds
      var hours = Math.floor(seconds / 3600); // Calculate hours
      seconds %= 3600; // Update seconds
      var minutes = Math.floor(seconds / 60); // Calculate minutes
      seconds %= 60; // Update seconds
      var parts = [];

      if (days > 0) parts.push(days + " " + (days == 1 ? "Day" : "Days"));
      if (hours > 0) parts.push(hours + " " + (hours == 1 ? "Hour" : "Hours"));
      if (minutes > 0)
        parts.push(minutes + " " + (minutes == 1 ? "Minute" : "Minutes"));

      // If there are minutes, don't apply parseFloat
      if (minutes === 0 && seconds < 60) {
        seconds = parseFloat(seconds).toFixed(2); // Less than a minute, keep decimals
      } else {
        seconds = Math.floor(seconds); // Over a minute, round down
      }

      // Only add seconds if they are greater than 0 or if it's the only component
      if (seconds > 0 || (days === 0 && hours === 0 && minutes === 0)) {
        parts.push(seconds + " " + (seconds = 1 ? "Seconds" : "Second"));
      }

      return parts.join(", ");
    },
    // Additional methods as needed for autoBuy functionality
  };

  /**
   * The UIManager object handles the creation and extension of the options menu for the mod.
   * @namespace
   */
  var UIManager = {
    /**
     * Creates the options menu for the game.
     * Overrides the original `Game.UpdateMenu` method to add custom settings for each module.
     */
    createOptionsMenu() {
      const originalUpdateMenu = Game.UpdateMenu;
      Game.UpdateMenu = () => {
        originalUpdateMenu.call(Game);
        // Only proceed if we're on the "prefs" menu
        if (Game.onMenu === "prefs") {
          // Clear any previous settings to avoid duplicates
          const existingBlock = document.getElementById(
            `${modID}SettingsBlock`
          );
          if (existingBlock) existingBlock.remove();

          // Dynamically add settings for each module, including autoClicker and autoBuy
          this.addModuleSettingsToMenu([
            autoBuy,
            autoClicker,
            shimmerClicker /* Add other modules here */,
            ,
          ]);
        }
      };
    },
    /**
     * Adds module settings to the menu.
     *
     * @param {Array} modules - An array of modules.
     * @returns {void}
     */
    addModuleSettingsToMenu(modules) {
      const menu = l("menu");
      const sections = menu.getElementsByClassName("block");
      const lastSection = sections[sections.length - 1];

      const block = document.createElement("div");
      block.className = "block";
      block.id = `${modID}SettingsBlock`;
      block.style.padding = "0px";
      block.style.margin = "8px 4px";

      const subsection = document.createElement("div");
      subsection.className = "subsection";
      subsection.style.padding = "0px";
      block.appendChild(subsection);

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = `${modName}`;
      subsection.appendChild(title);

      // Start Temporary code to display settings for the Auto-Clicker module
      /*
      const description = document.createElement("div");
      description.className = "listing";
      description.textContent = `Settings for the ${modName} mod.`;
      description.appendChild(document.createElement("br"));
      const settings = SettingsManager.settings;
      Object.keys(settings).forEach((key) => {
        const setting = settings[key];
        const settingLabel = document.createElement("div");
        settingLabel.className = "listing";
        settingLabel.textContent = `${key}: ${setting}`;
        subsection.appendChild(settingLabel);

        if (typeof setting === "object") {
          Object.keys(setting).forEach((subKey) => {
            const subSetting = setting[subKey];
            const subSettingLabel = document.createElement("div");
            subSettingLabel.className = "listing";
            subSettingLabel.textContent = `${subKey}: ${subSetting}`;
            subsection.appendChild(subSettingLabel);
          });
        }
      });
      subsection.appendChild(description);
      */
      // End Temporary code to display settings for the Auto-Clicker module

      modules.forEach((module) => {
        const moduleTitle = document.createElement("div");
        moduleTitle.className = "title";
        moduleTitle.style.fontSize = "1rem";
        moduleTitle.textContent = `${module.name}`;
        subsection.appendChild(moduleTitle);
        const listing = document.createElement("div");
        listing.className = "listing";
        subsection.appendChild(listing);

        Object.keys(module.settingsUI).forEach((key) => {
          const setting = module.settingsUI[key];
          switch (setting.type) {
            case "toggle":
              const toggleButton = this.createToggleButton(
                module,
                key,
                setting.label,
                setting.description,
                listing,
                setting.actions || {} // Pass the actions if defined
              );
              listing.appendChild(toggleButton);
              break;
            case "slider":
              const sliderElement = this.createSlider(
                module,
                key,
                setting,
                listing
              );
              listing.appendChild(sliderElement);
              break;
            case "complex":
              if (typeof setting.action === "function") {
                setting.action(listing); // Dynamically create complex UI components
              }
              break;
            // Include other UI elements as necessary
          }
        });
      });
      menu.insertBefore(block, lastSection.nextSibling);
    },
    /**
     * Extended version of createToggleButton to support specific start/stop function calls.
     *
     * @param {Object} module - The module object.
     * @param {string} settingKey - The key of the setting in the module's settings object.
     * @param {string} labelText - The text to display on the button.
     * @param {string} descriptionText - The description text to display below the button (optional).
     * @param {HTMLElement} parent - The parent element to append the toggle button to.
     * @param {Object} [actions] - Optional actions to override module's start/stop methods.
     * @returns {HTMLElement} - The created toggle button element.
     */
    createToggleButton(
      module,
      settingKey,
      labelText,
      descriptionText,
      parent,
      actions = {}
    ) {
      const initialState = module.settings[settingKey];
      const listing = document.createElement("div");
      listing.style.marginTop = "4px";
      listing.style.marginBottom = "4px";
      const button = document.createElement("a");
      button.className = `smallFancyButton prefButton option ${
        initialState ? "" : "off"
      }`;
      button.textContent = `${labelText} ${initialState ? "ON" : "OFF"}`;
      button.setAttribute("data-module-name", module.id);
      button.setAttribute("id", `${module.id}-${settingKey}-toggle`);

      button.onclick = () => {
        const newState = !module.settings[settingKey];
        module.settings[settingKey] = newState;
        button.classList.toggle("off");
        button.textContent = `${labelText} ${newState ? "ON" : "OFF"}`;

        // Determine which actions to perform based on newState and provided actions.
        if (newState) {
          // Call the start action if defined, otherwise update the setting.
          if (actions.start) actions.start();
          // Update settings in SettingsManager
          SettingsManager.updateModuleSettings(module.id, {
            [settingKey]: newState,
          });
        } else {
          // Call the stop action if defined, otherwise update the setting.
          if (actions.stop) actions.stop();
          // Update settings in SettingsManager
          SettingsManager.updateModuleSettings(module.id, {
            [settingKey]: newState,
          });
        }
      };

      listing.appendChild(button);

      if (descriptionText) {
        const label = document.createElement("label");
        label.textContent = `(${descriptionText})`;
        listing.appendChild(label);
      }

      listing.appendChild(document.createElement("br"));
      parent.appendChild(listing);
      return listing;
    },

    /**
     * Creates a slider element with labels and functionality.
     *
     * @param {Object} module - The module object.
     * @param {string} settingKey - The key of the setting.
     * @param {Object} setting - The setting object.
     * @param {HTMLElement} parent - The parent element to append the slider to.
     * @returns {HTMLElement} The constructed sliderBox element.
     */
    createSlider(module, settingKey, setting, parent) {
      // Create the container for the slider and its labels
      const sliderBox = document.createElement("div");
      sliderBox.className = "sliderBox";

      // Create the label for the left side (description of the slider)
      const leftLabel = document.createElement("div");
      leftLabel.className = "smallFancyButton"; // Using this class for consistency in styling
      leftLabel.style.float = "left";
      leftLabel.textContent = setting.label;

      // Create the label for the right side (dynamic value of the slider)
      const rightLabel = document.createElement("div");
      rightLabel.className = "smallFancyButton"; // Using this class for consistency in styling
      rightLabel.style.float = "right";
      rightLabel.id = `${module.id}${settingKey}SliderRightText`;
      rightLabel.textContent = `${module.settings[settingKey]}${
        setting.unit || ""
      }`;

      // Create the slider element itself
      const slider = document.createElement("input");
      slider.type = "range";
      slider.className = "slider";
      slider.style.clear = "both";
      slider.min = setting.min;
      slider.max = setting.max;
      slider.step = setting.step;
      slider.value = module.settings[settingKey];
      slider.onchange = slider.oninput = () => {
        module.settings[settingKey] = Number(slider.value);
        rightLabel.textContent = `${slider.value}${setting.unit || ""}`;
        SettingsManager.updateModuleSettings(module.id, {
          [settingKey]: Number(slider.value),
        });
        if (setting.onChange) setting.onChange(module.settings[settingKey]); // module.settings[settingKey]
      };

      // Assemble the slider box
      sliderBox.appendChild(leftLabel);
      sliderBox.appendChild(rightLabel);
      sliderBox.appendChild(slider);

      // Optional: Play sound on mouseup event for slider
      slider.onmouseup = () => {
        PlaySound("snd/tick.mp3");
      };
      parent.appendChild(sliderBox);
      parent.appendChild(document.createElement("br"));
      return sliderBox; // Make sure to return the constructed sliderBox element
    },
    /**
     * Creates a dynamic settings UI for a module.
     *
     * @param {Object} module - The module object.
     * @param {string} title - The title of the settings UI.
     * @param {string} description - The description of the settings UI.
     * @param {string} vaultArrayName - The name of the vault array in the module settings.
     * @param {Array} objects - An array of objects used to create UI components.
     * @param {HTMLElement} parent - The parent element where the UI components will be appended.
     */
    createDynamicSettingsUI(
      module,
      title,
      description,
      vaultArrayName, // Ensure to use the original vaultArrayName to access and modify the specific setting in module.settings
      objects,
      parent
    ) {
      // First, clear existing UI components for the given setting to avoid duplicates. Not required since Game.UpdateMenu refreshes the entire menu.
      /*
      const containerId = `${module.id}-${vaultArrayName.replace(
        /\s+/g,
        "-"
      )}-UI`;
      let container = document.getElementById(containerId);
      if (container) {
        container.remove(); // Remove the existing container to avoid duplicate UI components
      } */

      container = document.createElement("div");
      container.setAttribute("data-module-name", module.id);
      container.id = `${module.id}-${vaultArrayName.replace(/\s+/g, "-")}-UI`; // Use the corrected ID based on the original vaultArrayName

      const titleElement = document.createElement("div");
      titleElement.style.fontSize = "1em";
      titleElement.style.fontWeight = "bold";
      titleElement.style.marginTop = "10px";
      titleElement.style.marginBottom = "10px";
      titleElement.textContent = title;

      container.appendChild(titleElement);

      const descriptionElement = document.createElement("label");
      descriptionElement.style.fontWeight = "normal";
      descriptionElement.textContent = description;
      titleElement.appendChild(descriptionElement);
      container.appendChild(titleElement);

      // Iterate over the objects to create UI components
      objects.forEach((obj) => {
        const isSelected = module.settings[vaultArrayName].includes(obj.id); // Access the vaultArray using its name from module.settings
        const button = document.createElement("a");
        button.className = `smallFancyButton prefButton option ${
          isSelected ? "" : "off"
        }`;
        button.textContent = `${obj.name} ${isSelected ? "ON" : "OFF"}`;

        // Toggle selection on click
        button.onclick = () => {
          const index = module.settings[vaultArrayName].indexOf(obj.id);
          if (index > -1) {
            module.settings[vaultArrayName].splice(index, 1); // Remove from the array
          } else {
            module.settings[vaultArrayName].push(obj.id); // Add to the array
          }
          button.classList.toggle("off"); // Visual feedback
          button.textContent = `${obj.name} ${index ? "ON" : "OFF"}`; // Update the button text
        };

        container.appendChild(button);
      });

      parent.appendChild(container);
    },

    /**
     * Updates the status message for a module.
     *
     * @param {string} moduleId - The ID of the module.
     * @param {string} message - The message to be displayed.
     */
    updateModuleStatusMessage(moduleId, message) {
      // First, find the button related to the moduleName using data-module-name attribute
      const button = document.querySelector(`[data-module-name="${moduleId}"]`);
      if (!button) return; // Exit if the button is not found

      // Get the parent element of the button, which should be the div container
      const listingDiv = button.parentElement;

      // Ensure the message area for the module exists; if not, create it
      let messageArea = document.getElementById(`${moduleId}-StatusMessage`);
      if (!messageArea) {
        // Create the message area since it doesn't exist
        messageArea = document.createElement("div");
        messageArea.id = `${moduleId}-StatusMessage`;
        // messageArea.className = "modStatusMessage"; // A class for styling
        messageArea.style.fontSize = "0.8rem"; // Adjust font size as needed

        // Append the message area right after the button (which includes the label and br)
        listingDiv.appendChild(messageArea);
      }

      // Update the message content
      messageArea.innerHTML = `<p><h2 style="font-size:1em;">${message}</h2></p>`;
    },

    // Additional UI creation methods as needed
  };

  /**
   * Manages the settings for different modules.
   * @namespace SettingsManager
   */
  var SettingsManager = {
    // Object to store settings for each module
    settings: {},
    defaultSettings: {},

    /**
     * Loads the settings for a specific module.
     * @memberof SettingsManager
     * @param {string} moduleId - The name of the module.
     * @returns {Object} The settings for the requested module.
     */
    loadModuleSettings(moduleId) {
      return this.settings[moduleId];
    },

    /**
     * Updates the settings for a specific module.
     * @memberof SettingsManager
     * @param {string} moduleId - The name of the module.
     * @param {Object} newSettings - The new settings to be updated.
     */
    updateModuleSettings(moduleId, newSettings) {
      this.settings[moduleId] = {
        ...this.settings[moduleId],
        ...newSettings,
      };
    },

    /**
     * Resets the settings to their default values.
     * @memberof SettingsManager
     */
    resetToDefault() {
      this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
    },

    /**
     * Retrieves the default settings for a given module ID.
     * @memberof SettingsManager
     * @param {string} moduleId - The ID of the module.
     * @returns {object} - The default settings for the module.
     */
    getDefaultSettings(moduleId) {
      return this.defaultSettings[moduleId];
    },

    /**
     * Initializes default settings for all modules provided.
     * @memberof SettingsManager
     * @param {Array} modules - An array of modules.
     */
    init(modules) {
      modules.forEach((module) => {
        this.settings[module.id] = module.settings;
        this.defaultSettings[module.id] = { ...module.settings };
      });
    },
  };

  /**
   * The main controller object responsible for initializing the mod framework and its modules.
   * @namespace MainController
   */
  const MainController = {
    /**
     * Initializes the mod framework and its modules.
     */
    init() {
      // Initialize SettingsManager with default settings from modules
      SettingsManager.init([
        autoBuy,
        autoClicker,
        shimmerClicker /* other modules as needed */,
        ,
      ]);
      autoBuy.init(); // autoBuy initialization with settings
      autoClicker.init(); // autoClicker initialization with settings
      shimmerClicker.init(); // shimmerClicker initialization with settings
      // Additional module initializations...

      UIManager.createOptionsMenu(); // Create or extend the options menu

      /**
       * Object representing the mod hooks.
       * @typedef {Object} ModHooks
       * @property {Function} logic - Logic to be called every logic tick.
       * @property {Function} draw - Called every draw tick.
       * @property {Function} reset - Called whenever the player resets. The parameter is true if this is a hard reset, false if it's an ascension.
       * @property {Function} reincarnate - Called when the player reincarnates after an ascension.
       * @property {Function} ticker - Called when determining news ticker text, should return an array of possible choices to add.
       * @property {Function} cps - Called when determining the CpS, parameter is the current CpS, should return the modified CpS.
       * @property {Function} cookiesPerClick - Called when determining the cookies per click, parameter is the current value, should return the modified value.
       * @property {Function} click - Called when the big cookie is clicked.
       * @property {Function} create - Called after the game declares all buildings, buffs, upgrades, and achievements. Use this to declare your own.
       * @property {Function} check - Called for periodic checks (e.g., for upgrade/achievement unlock conditions). Called every few seconds when we check for upgrade/achievement unlock conditions.
       */
      const modHooks = {
        // Logic to be called every logic tick
        logic: () => {
          autoBuy.logic();
          autoClicker.logic();
          shimmerClicker.logic();
        },
        // Called every draw tick
        draw: () => {},
        // Called whenever the player resets. The parameter is true if this is a hard reset, false if it's an ascension.
        reset: (hard) => {
          if (hard) {
            // Here we reinitialize the modules with their default settings
            // Reset settings to default on hard reset
            SettingsManager.resetToDefault();

            // Reinitialize each module to apply default settings
            autoBuy.init();
            autoClicker.init();
            shimmerClicker.init();
          }
        },
        // Called when the player reincarnates after an ascension
        reincarnate: () => {},
        // Called when determining news ticker text, should return an array of possible choices to add
        ticker: () => {},
        // Called when determining the CpS, parameter is the current CpS, should return the modified CpS
        cps: () => {},
        // Called when determining the cookies per click, parameter is the current value, should return the modified value
        cookiesPerClick: () => {},
        // Called when the big cookie is clicked
        click: () => {},
        // Called after the game declares all buildings, buffs, upgrades, and achievements. use this to declare your own - note that while the game distinguishes between vanilla and non-vanilla content, saving/loading functionality for custom content (including stuff like active buffs or permanent upgrade slotting) is not explicitly implemented and may be unpredictable and broken
        create: () => {},
        // Called for periodic checks (e.g., for upgrade/achievement unlock conditions) called every few seconds when we check for upgrade/achiev unlock conditions, you can also use this for other checks that you don't need happening every logic frame
        check: () => {},
      };

      // Dynamically register all mod hooks that have actual implementations
      Object.entries(modHooks).forEach(([hookName, hookFunction]) => {
        // Convert function to string and remove spaces to check if it's empty
        const functionAsString = hookFunction.toString().replace(/\s+/g, "");
        // Check if the function body is not empty, indicating implementation exists
        if (
          !functionAsString.includes("{/*") &&
          !functionAsString.includes("{}")
        ) {
          Game.registerHook(hookName, hookFunction);
        }
      });

      Game.Notify(
        `${modName}`,
        `${modTranslate(
          "notifyDescriptionText"
        )} <b><a href="#" onclick=Game.ShowMenu("prefs");>${modTranslate(
          "notifyDescriptionLink"
        )}</a></b> ${modTranslate("notifyDescriptionMenu")}`,
        [30, 6],
        20
      );
    },
    /**
     * Converts current module settings into a save string.
     * @returns {string} The save string representing the module settings.
     * @memberof MainController
     */
    save() {
      // Convert current module settings into a save string
      return JSON.stringify(SettingsManager.settings);
    },
    /**
     * Loads the saved settings and applies them to the corresponding modules.
     * @param {string} saveString - The string representation of the saved settings.
     * @memberof MainController
     */
    load(saveString) {
      const savedSettings = JSON.parse(saveString);

      // Iterate over each registered module
      Object.keys(savedSettings).forEach((moduleId) => {
        if (SettingsManager.settings.hasOwnProperty(moduleId)) {
          const moduleSettings = SettingsManager.getDefaultSettings(moduleId);
          const filteredSettings = {};

          // Only apply saved settings that exist in the module's current default settings
          Object.keys(savedSettings[moduleId]).forEach((settingKey) => {
            if (moduleSettings.hasOwnProperty(settingKey)) {
              filteredSettings[settingKey] =
                savedSettings[moduleId][settingKey];
            }
          });

          // Update the module's settings with the filtered settings
          SettingsManager.updateModuleSettings(moduleId, filteredSettings);

          /**
           * Registry of modules.
           *
           * @type {Object}
           */
          const moduleRegistry = {
            autoClicker: autoClicker,
            autoBuy: autoBuy,
            shimmerClicker: shimmerClicker,
            // Add other modules here
          };

          /**
           * Represents a module in the module registry.
           * @type {Object}
           */
          const module = moduleRegistry[moduleId];
          if (module && typeof module.init === "function") {
            module.init();
          }
        }
      });
    },
  };

  // Register the mod with Cookie Clicker's modding API
  Game.registerMod(modID, {
    init: MainController.init.bind(MainController),
    save: MainController.save.bind(MainController),
    load: MainController.load.bind(MainController),
  });
})();
