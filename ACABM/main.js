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
      ascendluckMReqHC:
        'Not enough Heavenly Chips to purchase "{0}". Required: {1}, Current total with Ascend: {2}.',
      krumblorName: "Auto-Pet Krumblor",
      krumblorDescription:
        "Pets Krumblor when you reach lvl 4 to unlock Dragon drops. Krumblor's Menu must be open and own the Heavenly Upgrade 'Pet the dragon'. Turns off if you have all 4 drops, or do not meet the requirements.",
      krumblorMReq:
        "You do not meet the following requirements to Pet Krumblor:",
      krumblorMReqHU: "You do not own Heavenly Upgrade:",
      krumblorMReqMenu: "Krumblor menu is not open.",
      krumblorMReqDL: "Dragon level is under 4.",
      krumblorMReqEnd:
        "Turn the option back on once you fulfill these requirements.",
      krumblorMCompleted: "You have unlocked all Krumblor upgrades:",
      krumblorMRUnlocks: "Petting Krumblor for the remaining unlock(s):",
      sellAllBuildingsButton: "Sell All",
      autobuyMSellMode:
        "You are currently in Sell mode, switch back to: Buy Mode in the Store Menu.",
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
   * Calculator class for calculating the best item to buy based on the current game state.
   *
   * @class
   */
  class Calculator {
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
     * Calculates the cps_acc value.
     * @memberof Calculator
     * @param {number} base_cps - The base cps value.
     * @param {number} new_cps - The new cps value.
     * @param {number} price - The price of the object.
     * @returns {number} The cps_acc value.
     */
    cps_acc(base_cps, new_cps, price) {
      return (base_cps * base_cps * (new_cps - base_cps)) / (price * price);
    }

    /**
     * Calculates the ecps value.
     * @memberof Calculator
     * @returns {number} The ecps value.
     */
    ecps() {
      return Game.cookiesPs * (1 - Game.cpsSucked);
    }

    /**
     * Calculates the bonus value.
     * @memberof Calculator
     * @param {Object} item - The item to calculate the bonus for.
     * @param {Function} list_generator - The list generator function.
     * @param {number} mouse_rate - The mouse rate value.
     * @returns {Array} The bonus value.
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
     * Finds the best value.
     * @memberof Calculator
     * @param {number} mouse_rate - The mouse rate value.
     * @returns {Object} The best value.
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
  }

  /**
   * Represents an Auto-Clicker module.
   * @typedef {Object} autoClicker
   * @property {string} id - Unique identifier for the Auto-Clicker module.
   * @property {string} name - Friendly name of the Auto-Clicker module.
   * @property {Object} settings - Settings for the Auto-Clicker module.
   * @property {boolean} settings.collapsed - Indicates whether the settings are collapsed or not.
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
      collapsed: false,
      enabled: false,
      delay: 50,
      frenzy: false,
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
      frenzy: {
        type: "toggle",
        label: "Frenzy",
        description: "Only Auto-click BigCookie during frenzy/click frenzy.",
      },
      delay: {
        type: "slider",
        label: "Auto-Click Speed (ms)",
        min: 50,
        max: 3000,
        step: 50,
        unit: "ms", // Specifying the unit for the delay setting
        description: "The delay between each click in milliseconds.",
      },
    },
    nextProc: 0,
    /**
     * Performs the logic for the autoClicker.
     * If the autoClicker is enabled, it clicks the cookie based on the specified delay.
     */
    logic() {
      // Exit early if disabled, during ascend or ascend timer is active
      if (!this.settings.enabled || Game.OnAscend || Game.AscendTimer > 0) {
        return;
      }

      const now = Date.now();

      // Check if the auto-clicker should only click during frenzy/click frenzy
      if (this.settings.frenzy) {
        // Click the cookie only if the game has the "Frenzy" or "Click frenzy" buff
        if (Game.hasBuff("Frenzy") || Game.hasBuff("Click frenzy")) {
          Game.ClickCookie(0);
        }
      } else {
        // Click the cookie
        Game.ClickCookie(0);
      }

      // Update next processing time
      this.nextProc = now + this.settings.delay;
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
   * @property {boolean} settings.collapsed - Indicates whether the settings are collapsed or not.
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
      collapsed: false,
      enabled: false, // Overall module toggle
      delay: 100, // Delay between checks
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
        description:
          "While Shimmer Auto-Clicker enabled, Golden Cookies will be clicked.",
      },
      wrath: {
        type: "toggle",
        label: "Wrath Cookies",
        description:
          "While Shimmer Auto-Clicker enabled, Wrath Cookies will be clicked.",
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
        description:
          "While Shimmer Auto-Clicker enabled, Reindeer will be clicked.",
      },
    },
    nextProc: 0, // Next process for the shimmerClicker
    /**
     * Performs the logic for the ACABM feature.
     * If the ACABM feature is enabled, it checks the current time and processes the shimmers accordingly.
     * The shimmers are popped based on the settings provided.
     */
    logic() {
      // Exit early if disabled, during ascend or ascend timer is active
      if (!this.settings.enabled || Game.OnAscend || Game.AscendTimer > 0) {
        return;
      }

      const now = Date.now();

      // Process each shimmer
      Game.shimmers.forEach((shimmer) => {
        const isGolden = shimmer.type === "golden";
        const isReindeer = shimmer.type === "reindeer";
        const shouldPopGolden =
          isGolden &&
          ((this.settings.golden && !shimmer.wrath) ||
            (this.settings.wrath && shimmer.wrath));
        const shouldSkipForcedWrath =
          isGolden &&
          shimmer.wrath &&
          shimmer.force === "wrath" &&
          this.settings.skipForcedWrath;
        const shouldPopReindeer = isReindeer && this.settings.reindeer;

        if ((shouldPopGolden && !shouldSkipForcedWrath) || shouldPopReindeer) {
          shimmer.pop();
        }
      });

      // Update next processing time
      this.nextProc = now + this.settings.delay;
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
   * Represents the Fortune Auto-Clicker module.
   * @typedef {Object} FortuneClicker
   * @property {string} id - Unique identifier for the module.
   * @property {string} name - Friendly name of the module.
   * @property {Object} settings - Module settings.
   * @property {boolean} settings.collapsed - Indicates whether the settings are collapsed or not.
   * @property {boolean} settings.enabled - Indicates if the module is enabled.
   * @property {number} settings.delay - Delay between logic checks.
   * @property {Object} settingsUI - User interface settings for the module.
   * @property {Object} settingsUI.enabled - Toggle settings for enabling/disabling the module.
   * @property {string} settingsUI.enabled.type - Type of the toggle setting.
   * @property {string} settingsUI.enabled.label - Label for the toggle setting.
   * @property {string} settingsUI.enabled.description - Description for the toggle setting.
   * @property {Object} settingsUI.enabled.actions - Actions to be performed when the toggle setting is changed.
   * @property {Function} settingsUI.enabled.actions.start - Function to start the module.
   * @property {Function} settingsUI.enabled.actions.stop - Function to stop the module.
   * @property {number} nextProc - Next process for the fortuneClicker.
   * @property {Function} logic - The logic function for the fortuneClicker module.
   * @property {Function} start - Starts the module.
   * @property {Function} stop - Stops the module.
   * @property {Function} init - Initializes the module.
   */
  const fortuneClicker = {
    id: "fortuneClicker", // Unique identifier for the module
    name: "Fortune Auto-Clicker", // Friendly name of the module
    settings: {
      collapsed: false,
      enabled: false, // By default, the module is not enabled
      delay: 2000, // Delay between logic checks
    },
    settingsUI: {
      enabled: {
        type: "toggle",
        label: "Fortune Clicker",
        description:
          "Automatically clicks on Fortune News Tickers. (Requires 'Fortune cookies' upgrade)",
        actions: {
          start: () => fortuneClicker.start(),
          stop: () => fortuneClicker.stop(),
        },
      },
    },
    nextProc: 0, // Next process for the fortuneClicker
    /**
     * The logic function for the fortuneClicker module.
     * Automatically clicks the fortune ticker if the "Fortune cookies" upgrade is unlocked.
     */
    logic() {
      // Exit early if disabled, during ascend or ascend timer is active
      if (!this.settings.enabled || Game.OnAscend || Game.AscendTimer > 0) {
        return;
      }

      const now = Date.now();

      const hasUnlockedFortune = Game.HasUnlocked("Fortune cookies");
      if (hasUnlockedFortune) {
        if (Game.TickerEffect && Game.TickerEffect.type === "fortune") {
          Game.tickerL.click();
        }
      } else {
        // Implementing a placeholder for message handling regarding the "Fortune cookies" unlock requirement
        UIManager.updateModuleStatusMessage(
          this.id,
          'You need to unlock "Fortune cookies" to use the Fortune Clicker feature.'
        );
        this.stop();
      }

      // Update the next process time
      this.nextProc = now + this.settings.delay;
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
   * Represents a module for automatically popping wrinklers in the game.
   * @typedef {Object} wrinklersPopper
   * @property {string} id - The unique identifier of the module.
   * @property {string} name - The name of the module.
   * @property {Object} settings - The settings for the module.
   * @property {boolean} settings.collapsed - Indicates whether the settings are collapsed or not.
   * @property {boolean} settings.enabled - Indicates whether the module is enabled or not.
   * @property {number} settings.delay - The delay between checks in milliseconds.
   * @property {boolean} settings.popShiny - Indicates whether to pop shiny wrinklers or not.
   * @property {number} settings.maxWrinklers - The maximum number of wrinklers to pop.
   * @property {Object} settingsUI - The user interface settings for the module.
   * @property {Object} settingsUI.enabled - The toggle setting for enabling/disabling the module.
   * @property {Object} settingsUI.popShiny - The toggle setting for popping shiny wrinklers.
   * @property {Object} settingsUI.maxWrinklers - The slider setting for the maximum number of wrinklers.
   * @property {number} nextProc - The timestamp of the next process.
   * @property {Function} logic - Performs the logic for popping wrinklers based on the specified settings.
   * @property {Function} init - Initializes the module and loads settings.
   * @property {Function} start - Starts the module.
   * @property {Function} stop - Stops the module.
   */
  const wrinklersPopper = {
    id: "wrinklersPopper",
    name: "Wrinklers Auto-Popper",
    settings: {
      collapsed: false,
      enabled: false, // Module is disabled by default.
      delay: 2000, // Delay between checks
      popShiny: false, // By default, do not pop shiny wrinklers.
      maxWrinklers: -1, // Default value to determine when to pop wrinklers.
    },
    settingsUI: {
      enabled: {
        type: "toggle",
        label: "Wrinklers Auto-Popper",
        description:
          "Automatically pops the fattest normal wrinkler when reaching max wrinklers.",
        actions: {
          start: () => wrinklersPopper.start(),
          stop: () => wrinklersPopper.stop(),
        },
      },
      popShiny: {
        type: "toggle",
        label: "Pop Shiny Wrinklers",
        description:
          "Allows popping of shiny wrinklers if no normal wrinklers are available.",
      },
      maxWrinklers: {
        type: "slider",
        label: "Max Wrinklers",
        min: 1,
        max: 9,
        step: 1,
        description:
          "The maximum number of wrinklers to pop. The max value is your max wrinklers - 1.",
      },
    },
    nextProc: 0,
    /**
     * Performs the logic for popping wrinklers based on the specified settings.
     */
    logic() {
      // Exit early if disabled, during ascend or ascend timer is active
      if (!this.settings.enabled || Game.OnAscend || Game.AscendTimer > 0) {
        return;
      }

      const now = Date.now();

      if (Game.elderWrath > 0) {
        let wrinklersMax = Game.getWrinklersMax() - 1;
        if (this.settingsUI.maxWrinklers.max != wrinklersMax) {
          if (this.settings.maxWrinklers === this.settingsUI.maxWrinklers.max) {
            this.settings.maxWrinklers = wrinklersMax;
            SettingsManager.updateModuleSettings(this.id, {
              maxWrinklers: wrinklersMax,
            });
            this.settingsUI.maxWrinklers.max = wrinklersMax;
          } else {
            this.settingsUI.maxWrinklers.max = wrinklersMax;
          }
        }

        let wrinklersNormal = Game.wrinklers.filter(
          (w) => w.type == 0 && w.sucked > 0
        );
        let wrinklersShiny = Game.wrinklers.filter(
          (w) => w.type !== 0 && w.sucked > 0
        );

        if (
          wrinklersNormal.length + wrinklersShiny.length >
            this.settings.maxWrinklers ||
          wrinklersNormal.length + wrinklersShiny.length >=
            Game.getWrinklersMax()
        ) {
          // Pop the fattest normal wrinkler
          if (wrinklersNormal.length > 0) {
            Game.wrinklers[
              wrinklersNormal.reduce((max, w) =>
                w.sucked > max.sucked ? w : max
              ).id
            ].hp = 0;
            UIManager.updateModuleStatusMessage(
              this.id,
              "Popping most valuable normal Wrinkler."
            );
          }
          // Pop the fattest shiny wrinkler if enabled and no normal wrinklers are available
          if (
            this.settings.popShiny &&
            wrinklersShiny.length > 0 &&
            wrinklersNormal.length == 0
          ) {
            Game.wrinklers[
              wrinklersShiny.reduce((max, w) =>
                w.sucked > max.sucked ? w : max
              ).id
            ].hp = 0;
            UIManager.updateModuleStatusMessage(
              this.id,
              "Popping most valuable shiny Wrinkler."
            );
          }
        }

        // Update the next process time
        this.nextProc = now + this.settings.delay;
      }
    },
    /**
     * Initializes the module.
     * Loads settings from SettingsManager and starts the module if enabled.
     */
    init() {
      // Initialize maxWrinklers setting if not already set

      var loadedSettings = SettingsManager.loadModuleSettings(this.id);
      if (loadedSettings) {
        this.settings = { ...this.settings, ...loadedSettings };
        if (this.settings.enabled) {
          this.start();
        }
      }

      if (this.settings.maxWrinklers == -1) {
        this.settings.maxWrinklers = Game.getWrinklersMax() - 1;
        this.settingsUI.maxWrinklers.max = this.settings.maxWrinklers;
        SettingsManager.updateModuleSettings(this.id, {
          maxWrinklers: this.settings.maxWrinklers,
        });
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
  };

  /**
   * Auto-Pet Krumblor module.
   * Automatically pets Krumblor when the dragon menu is open, unlocking dragon upgrades if available.
   *
   * @typedef {Object} autopetKrumblor
   * @property {string} id - The unique identifier for the module.
   * @property {string} name - The name of the module.
   * @property {Object} settings - The settings for the module.
   * @property {boolean} settings.collapsed - Indicates whether the settings are collapsed or not.
   * @property {boolean} settings.enabled - Indicates whether the module is enabled or disabled.
   * @property {number} settings.delay - The delay between logic checks.
   * @property {Object} settingsUI - The user interface settings for the module.
   * @property {Object} settingsUI.enabled - The toggle settings for enabling/disabling the module.
   * @property {string} settingsUI.enabled.type - The type of the toggle setting.
   * @property {string} settingsUI.enabled.label - The label for the toggle setting.
   * @property {string} settingsUI.enabled.description - The description for the toggle setting.
   * @property {Object} settingsUI.enabled.actions - The actions to be performed when the toggle setting is changed.
   * @property {Function} settingsUI.enabled.actions.start - The function to start the module.
   * @property {Function} settingsUI.enabled.actions.stop - The function to stop the module.
   * @property {number} nextProc - The timestamp of the next process time.
   * @property {Function} logic - The logic function for the module.
   * @property {Function} init - Initializes the module.
   * @property {Function} start - Starts the module.
   * @property {Function} stop - Stops the module.
   */
  const autopetKrumblor = {
    id: "autopetKrumblor",
    name: "Auto-Pet Krumblor",
    settings: {
      collapsed: false,
      enabled: false, // Module is disabled by default.
      delay: 500, // Delay between logic checks
    },
    settingsUI: {
      enabled: {
        type: "toggle",
        label: "Auto-Pet Krumblor",
        description:
          "Automatically pets Krumblor when the dragon menu is open, unlocking dragon upgrades if available.",
        actions: {
          start: () => autopetKrumblor.start(),
          stop: () => autopetKrumblor.stop(),
        },
      },
    },
    nextProc: 0,
    logic() {
      // Exit early if disabled, during ascend or ascend timer is active
      if (!this.settings.enabled || Game.OnAscend || Game.AscendTimer > 0) {
        return;
      }

      const now = Date.now();

      const unlockMsg = [];
      const offReasons = [];

      const hasUnlockedScale = Game.HasUnlocked("Dragon scale");
      const hasUnlockedClaw = Game.HasUnlocked("Dragon claw");
      const hasUnlockedFang = Game.HasUnlocked("Dragon fang");
      const hasUnlockedTeddy = Game.HasUnlocked("Dragon teddy bear");
      const hasPetDragon = Game.HasUnlocked("Pet the dragon");
      const dragonLevel = Game.dragonLevel;
      const isKrumblorMenuOpen = Game.specialTab === "dragon";

      if (
        hasUnlockedScale &&
        hasUnlockedClaw &&
        hasUnlockedFang &&
        hasUnlockedTeddy
      ) {
        this.stop();
        unlockMsg.push(
          modTranslate("krumblorMCompleted") +
            " Dragon scale, Dragon claw, Dragon fang, Dragon teddy bear."
        );
      } else if (dragonLevel >= 4 && hasPetDragon) {
        if (!isKrumblorMenuOpen && Game.specialTab === "") {
          Game.specialTab = "dragon"; // Open the dragon menu if it's not already open and the user doesn't have another special menu open
        } else if (isKrumblorMenuOpen) {
          unlockMsg.push(modTranslate("krumblorMRUnlocks"));
          if (!hasUnlockedScale) unlockMsg.push("Dragon scale");
          if (!hasUnlockedClaw) unlockMsg.push("Dragon claw");
          if (!hasUnlockedFang) unlockMsg.push("Dragon fang");
          if (!hasUnlockedTeddy) unlockMsg.push("Dragon teddy bear");

          Game.ClickSpecialPic();
        }
      } else {
        if (!hasPetDragon) {
          offReasons.push(
            modTranslate("krumblorMReqHU") + ' "Pet the dragon" '
          );
        } else {
          if (!isKrumblorMenuOpen)
            offReasons.push(modTranslate("krumblorMReqMenu"));
          if (dragonLevel < 4) offReasons.push(modTranslate("krumblorMReqDL"));
        }

        unlockMsg.push(
          modTranslate("krumblorMReq"),
          ...offReasons,
          modTranslate("krumblorMReqEnd")
        );
        this.stop();
      }

      UIManager.updateModuleStatusMessage(this.id, unlockMsg.join("<br>"));

      // Update the next process time
      this.nextProc = now + this.settings.delay;
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
  };

  /**
   * Represents the Ascend Luck module.
   * @typedef {Object} ascendLuck
   * @property {string} id - The unique identifier of the module.
   * @property {string} name - The name of the module.
   * @property {Object} settings - The settings of the module.
   * @property {boolean} settings.collapsed - Indicates whether the settings are collapsed or not.
   * @property {boolean} settings.enabled - Indicates whether the module is enabled or not.
   * @property {Object} settingsUI - The user interface settings of the module.
   * @property {Object} settingsUI.enabled - The settings for enabling the module.
   * @property {string} settingsUI.enabled.type - The type of the settings (toggle).
   * @property {string} settingsUI.enabled.label - The label for the settings.
   * @property {string} settingsUI.enabled.description - The description for the settings.
   * @property {Object} settingsUI.enabled.actions - The actions associated with the settings.
   * @property {Function} settingsUI.enabled.actions.start - The function to start the module.
   * @property {Function} settingsUI.enabled.actions.stop - The function to stop the module.
   * @property {Function} logic - The logic function of the module.
   * @property {Function} canBePurchased - Checks if an upgrade can be purchased.
   * @property {Function} doAscendLuck - Performs the Ascend action for luck upgrades.
   * @property {Function} init - Initializes the module.
   * @property {Function} start - Starts the module.
   * @property {Function} stop - Stops the module.
   */
  const ascendLuck = {
    id: "ascendLuck",
    name: "Ascend Luck",
    settings: {
      collapsed: false,
      enabled: false, // Module is disabled by default.
      delay: 30, // Delay between logic checks
    },
    settingsUI: {
      enabled: {
        type: "toggle",
        label: "Ascend Luck",
        description:
          "Used for unlocking Lucky digit, Lucky number, and Lucky payout. Automatically Ascends you when conditions are met and toggles this feature to off. Turn back on manually if you have more to unlock. Does not buy the Heavenly upgrade for you.",
        actions: {
          start: () => ascendLuck.start(),
          stop: () => ascendLuck.stop(),
        },
      },
    },
    nextProc: 0, // Next process time
    // Adjusted logic for checking conditions related to '7's in the prestige and ascend meter levels
    logic() {
      if (!this.settings.enabled || Game.OnAscend || Game.AscendTimer > 0) {
        return;
      }

      // set the current time
      const now = Date.now();

      // Ensure all luck-related upgrades are unlocked
      if (
        Game.HasUnlocked("Lucky digit") &&
        Game.HasUnlocked("Lucky number") &&
        Game.HasUnlocked("Lucky payout")
      ) {
        UIManager.updateModuleStatusMessage(
          this.id,
          "All luck-related upgrades have been unlocked."
        );
        this.stop();
        return;
      }

      if (!Game.HasUnlocked("Heavenly luck")) {
        UIManager.updateModuleStatusMessage(
          this.id,
          "Heavenly luck has not been unlocked yet."
        );
        this.stop();
        return;
      }

      // Adjusted logic for "Lucky digit"
      if (!Game.HasUnlocked("Lucky digit")) {
        if (
          this.canBePurchased("Lucky digit") &&
          (Game.prestige + Game.ascendMeterLevel).toString().split("7").length -
            1 >=
            1
        ) {
          this.doAscendLuck();
        } else {
          UIManager.updateModuleStatusMessage(
            this.id,
            "Conditions for Lucky digit not met."
          );
        }
      }

      // Adjusted logic for "Lucky number"
      else if (!Game.HasUnlocked("Lucky number")) {
        if (Game.HasUnlocked("Lasting fortune")) {
          if (
            this.canBePurchased("Lucky number") &&
            (Game.prestige + Game.ascendMeterLevel).toString().split("7")
              .length -
              1 >=
              2
          ) {
            this.doAscendLuck();
          } else {
            UIManager.updateModuleStatusMessage(
              this.id,
              "Conditions for Lucky number not met."
            );
          }
        } else {
          UIManager.updateModuleStatusMessage(
            this.id,
            "Missing required upgrade: Lasting fortune."
          );
          this.stop();
        }
      }

      // Adjusted logic for "Lucky payout"
      else if (!Game.HasUnlocked("Lucky payout")) {
        if (Game.HasUnlocked("Decisive fate")) {
          if (
            this.canBePurchased("Lucky payout") &&
            (Game.prestige + Game.ascendMeterLevel).toString().split("7")
              .length -
              1 >=
              4
          ) {
            this.doAscendLuck();
          } else {
            UIManager.updateModuleStatusMessage(
              this.id,
              "Conditions for Lucky payout not met."
            );
          }
        } else {
          UIManager.updateModuleStatusMessage(
            this.id,
            "Missing required upgrade: Decisive fate."
          );
          this.stop();
        }
      }
      // Update the next process time
      this.nextProc = now + this.settings.delay;
    },

    canBePurchased(upgradeName) {
      const upgrade = Game.UpgradesByPool["prestige"].find(
        (upg) => upg.name === upgradeName
      );
      if (!upgrade) return false; // Upgrade not found

      const hcCost = upgrade.getPrice();
      const hcTotal =
        Math.floor(
          Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned)
        ) -
        Math.floor(Game.HowMuchPrestige(Game.cookiesReset)) +
        Game.heavenlyChips;

      if (hcTotal >= hcCost) {
        return true; // Sufficient Heavenly Chips
      } else {
        let message = modTranslate(
          "ascendluckMReqHC",
          upgradeName,
          hcCost,
          hcTotal
        );
        UIManager.updateModuleStatusMessage(this.id, message);
        return false; // Insufficient Heavenly Chips
      }
    },

    doAscendLuck() {
      if (Game.ascensionMode !== 0) return;
      Game.Ascend(1);
      Game.ClosePrompt();
      this.settings.enabled = false;
      UIManager.updateModuleStatusMessage(
        this.id,
        "Ascension performed for luck upgrades."
      );
    },

    init() {
      var loadedSettings = SettingsManager.loadModuleSettings(this.id);
      if (loadedSettings) {
        this.settings = { ...this.settings, ...loadedSettings };
        if (this.settings.enabled) {
          this.start();
        }
      }
    },

    start() {
      this.settings.enabled = true;
      SettingsManager.updateModuleSettings(this.id, { enabled: true });
    },

    stop() {
      this.settings.enabled = false;
      SettingsManager.updateModuleSettings(this.id, { enabled: false });
    },
  };

  /**
   * Object representing the "Sell All Buildings" feature.
   * @typedef {Object} sellAll
   * @property {string} id - The ID of the feature.
   * @property {string} name - The name of the feature.
   * @property {Object} settings - The settings for the feature.
   * @property {boolean} settings.collapsed - Indicates whether the settings are collapsed or not.
   * @property {boolean} settings.enabled - Indicates whether the feature is enabled or disabled.
   * @property {number} settings.delay - The delay in milliseconds between each execution of the feature.
   * @property {boolean} settings.ascendAfterSelling - Indicates whether to automatically ascend after selling all buildings.
   * @property {Object} settingsUI - The user interface settings for the feature.
   * @property {Object} settingsUI.enabled - The toggle settings for enabling or disabling the feature.
   * @property {string} settingsUI.enabled.type - The type of the toggle setting.
   * @property {string} settingsUI.enabled.label - The label for the toggle setting.
   * @property {string} settingsUI.enabled.description - The description for the toggle setting.
   * @property {Object} settingsUI.enabled.actions - The actions to perform when the toggle setting is changed.
   * @property {Function} settingsUI.enabled.actions.start - The function to start the feature.
   * @property {Function} settingsUI.enabled.actions.stop - The function to stop the feature.
   * @property {Object} settingsUI.ascendAfterSelling - The toggle settings for ascending after selling all buildings.
   * @property {string} settingsUI.ascendAfterSelling.type - The type of the toggle setting.
   * @property {string} settingsUI.ascendAfterSelling.label - The label for the toggle setting.
   * @property {string} settingsUI.ascendAfterSelling.description - The description for the toggle setting.
   * @property {number} nextProc - The timestamp of the next execution of the feature.
   * @property {boolean} sellAllButtonCreated - Indicates whether the sell all button has been created.
   * @property {Function} logic - The logic function that determines when to create or remove the sell all button.
   * @property {Function} createSellAllButton - Creates the sell all button.
   * @property {Function} removeSellAllButton - Removes the sell all button.
   * @property {Function} sellAllBuildings - Sells all buildings and optionally ascends.
   * @property {Function} init - Initializes the feature and loads the settings.
   * @property {Function} start - Starts the feature.
   * @property {Function} stop - Stops the feature.
   */
  const sellAll = {
    id: "sellAll",
    name: "Sell All Buildings",
    settings: {
      collapsed: false,
      enabled: false,
      delay: 1000,
      ascendAfterSelling: false,
    },
    settingsUI: {
      enabled: {
        type: "toggle",
        label: "Sell All Buildings",
        description:
          'Adds a "Sell All" button to the store that sells all buildings, with option to Ascend after selling.',
        actions: {
          start: () => sellAll.start(),
          stop: () => sellAll.stop(),
        },
      },
      ascendAfterSelling: {
        type: "toggle",
        label: "Ascend After Selling",
        description:
          "Automatically ascends after selling all buildings if enabled.",
      },
    },
    nextProc: 0,
    sellAllButtonCreated: false, // Track if the button has been created to minimize DOM access
    logic() {
      // Exit early if disabled, during ascend or ascend timer is active
      if (!this.settings.enabled || Game.OnAscend || Game.AscendTimer > 0) {
        return;
      }

      const now = Date.now();

      // Only proceed to create or remove the button based on its current state to minimize DOM operations
      const buttonExists = !!document.getElementById("sellAllBuildingsButton");
      if (this.settings.enabled && !buttonExists) {
        this.start();
      } else if (!this.settings.enabled && buttonExists) {
        this.stop();
      }
      // Update the next process time
      this.nextProc = now + this.settings.delay;
    },
    createSellAllButton() {
      let storeBulkMax = document.getElementById("storeBulkMax");
      if (storeBulkMax && !this.sellAllButtonCreated) {
        let sellAllButton = document.createElement("div");
        sellAllButton.id = "sellAllBuildingsButton";
        sellAllButton.className = "storePreButton storeBulkAmount";
        sellAllButton.style.cursor = "pointer";
        sellAllButton.style.position = "absolute";
        sellAllButton.style.visibility = "visible";
        sellAllButton.style.left = storeBulkMax.offsetLeft + "px";
        sellAllButton.style.top = "0px";
        sellAllButton.textContent = modTranslate("sellAllBuildingsButton");
        sellAllButton.onclick = () => this.sellAllBuildings();
        storeBulkMax.parentNode.insertBefore(
          sellAllButton,
          storeBulkMax.nextSibling
        );
        this.sellAllButtonCreated = true; // Update state to reflect the button's creation
      }
    },
    removeSellAllButton() {
      let sellAllButton = document.getElementById("sellAllBuildingsButton");
      if (sellAllButton) {
        sellAllButton.remove();
        this.sellAllButtonCreated = false; // Update state to reflect the button's removal
      }
    },
    sellAllBuildings() {
      if (autoBuy.settings.enabled) {
        Game.storeBulkButton(1);
      }

      // Only sell buildings that have a non-zero amount
      Game.ObjectsById.forEach((building) => {
        if (building.amount > 0) {
          building.sell(building.amount);
        }
      });

      if (this.settings.ascendAfterSelling) {
        Game.Ascend(1);
        Game.ClosePrompt();
      }
    },
    init() {
      this.removeSellAllButton(); // Ensure the button is removed when the feature is initialized for reset hard refreshes
      var loadedSettings = SettingsManager.loadModuleSettings(this.id);
      if (loadedSettings) {
        this.settings = { ...this.settings, ...loadedSettings };
        if (this.settings.enabled) {
          this.start();
        }
      }
    },

    start() {
      this.settings.enabled = true;
      SettingsManager.updateModuleSettings(this.id, { enabled: true });
      this.createSellAllButton();
    },

    stop() {
      this.settings.enabled = false;
      SettingsManager.updateModuleSettings(this.id, { enabled: false });
      this.removeSellAllButton();
    },
  };

  /**
   * The `autoBuy` object represents an auto-buy module that automatically buys the best building or upgrade based on the current game state.
   * @type {Object}
   * @property {string} id - Unique identifier for the autoBuy module.
   * @property {string} name - Name of the autoBuy module.
   * @property {Object} settings - Settings for the autoBuy module.
   * @property {boolean} settings.collapsed - Indicates whether the settings are collapsed or not.
   * @property {boolean} settings.enabled - Indicates whether the autoBuy module is enabled or not.
   * @property {number} settings.delay - Delay between purchases.
   * @property {boolean} settings.protect - Indicates whether the autoBuy module should protect against going under Lucky and Frenzy requirements.
   * @property {number[]} settings.upgradebyidVault - Stores IDs of upgrades to add to the upgradeVault menu.
   * @property {number[]} settings.upgradeVault - Stores IDs of upgrades.
   * @property {number[]} settings.techVault - Stores IDs of tech upgrades.
   * @property {number[]} settings.buildingVault - Stores IDs of buildings.
   * @property {Object} settingsUI - UI settings for the autoBuy module.
   * @property {Object} settingsUI.enabled - UI settings for the enabled toggle.
   * @property {string} settingsUI.enabled.type - Type of UI element (toggle).
   * @property {string} settingsUI.enabled.label - Label for the toggle.
   * @property {string} settingsUI.enabled.description - Description for the toggle.
   * @property {Object} settingsUI.enabled.actions - Custom actions for the toggle.
   * @property {Function} settingsUI.enabled.actions.start - Function to start the autoBuy module.
   * @property {Function} settingsUI.enabled.actions.stop - Function to stop the autoBuy module.
   * @property {Object} settingsUI.upgradeVault - UI settings for the upgradeVault complex element.
   * @property {string} settingsUI.upgradeVault.type - Type of UI element (complex).
   * @property {Function} settingsUI.upgradeVault.action - Action to be performed when the UI element is interacted with.
   * @property {Object} settingsUI.techVault - UI settings for the techVault complex element.
   * @property {string} settingsUI.techVault.type - Type of UI element (complex).
   * @property {Function} settingsUI.techVault.action - Action to be performed when the UI element is interacted with.
   * @property {Object} settingsUI.buildingVault - UI settings for the buildingVault complex element.
   * @property {string} settingsUI.buildingVault.type - Type of UI element (complex).
   * @property {Function} settingsUI.buildingVault.action - Action to be performed when the UI element is interacted with.
   * @property {Object} settingsUI.protect - UI settings for the protect toggle.
   * @property {string} settingsUI.protect.type - Type of UI element (toggle).
   * @property {string} settingsUI.protect.label - Label for the toggle.
   * @property {string} settingsUI.protect.description - Description for the toggle.
   */
  const autoBuy = {
    id: "autoBuy", // Unique identifier
    name: "Auto-Buy", // Name of the autoBuy module
    settings: {
      collapsed: false,
      enabled: false,
      delay: 1000, // delay between purchases
      protect: false, // Indicates whether
      upgradebyidVault: [227], // Stores IDs of upgrades to add to upgradeVault menu.
      upgradeVault: [], // Stores IDs of upgrades
      techVault: [], // Stores IDs of tech upgrades
      buildingVault: [], // Stores IDs of buildings
      popupWindowMessage: false,
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
      popupWindowMessage: {
        type: "toggle",
        label: "Popup Window",
        description:
          "Displays Auto-Buy status message in a draggable popup window under big cookie.",
        actions: {
          // Define custom actions for this toggle
          stop: () => autoBuy.closePopupWindow(),
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
    calculator: new Calculator(), // Calculator class for calculating the best item to buy based on the current game state
    target: { name: undefined, price: -1 }, // Target object for the autoBuy module
    total: -1, // Total value for the autoBuy module
    nextProc: 0, // Next process for the autoBuy module
    statusMessage: "", // Status message for the autoBuy module
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
      // Exit early if disabled, during ascend or ascend timer is active
      if (!this.settings.enabled || Game.OnAscend || Game.AscendTimer > 0) {
        return;
      }

      const now = Date.now();

      // Check if the user is in sell mode
      if (Game.buyMode === -1) {
        let message = `${modTranslate("autobuyMSellMode")}`;
        UIManager.updateModuleStatusMessage(this.id, message);
        return; // Early exit if the user is in sell mode to prevent buying
      }

      // Calculate the best item to buy based on the current game state
      var info = this.calculator.find_best(
        autoClicker.settings.enabled ? 1000 / autoClicker.settings.delay : 0
      );

      // attempts to protect you from going under Lucky and Frenzy requirements.
      var protect =
        this.protect && Game.Has("Get lucky") != 0
          ? (Game.hasBuff("Frenzy") != 0 ? 1 : 7) * Game.cookiesPs * 1200
          : 0;
      var wait = (protect + info.price - Game.cookies) / this.calculator.ecps();

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
            return !autoBuy.settings.buildingVault.includes(building.id);
          });

          // Check if buildings are available after filtering
          if (availableBuildings.length === 0) {
            return;
          }

          // Find the cheapest building not in the vault
          const cheapestBuilding = availableBuildings.reduce(function (
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
          "Waiting for enough cookies to buy building: " +
            `"${info.obj.name}"` +
            " for " +
            `"${info.obj.price}"` +
            " cookies to continue."
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
      } else if (wait < 0) {
        UIManager.updateModuleStatusMessage(
          this.id,
          "Buying: " + `"${info.obj.name}"`
        );

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

        // Execute purchase
        if (info.obj.name === "One mind") {
          Game.UpgradesById["69"].buy(1);
          Game.ClosePrompt();
        } else {
          info.obj.buy();
        }
        this.total++;
      }
      // Update the next process time
      var nextProcWait = wait * 1000 / 2; // convert seconds to milliseconds - divide by 2 to cut the wait time in half to account for wait variation.
      this.nextProc = (now + this.settings.delay) + (nextProcWait > 0 ? nextProcWait : 0);
      // console.log("Now: ", now, "Setting delay: ", this.settings.delay, "Wait: ", wait, "NPW: ", nextProcWait, "nextProc: ", this.nextProc);
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
      UIManager.removePopup();
    },
    closePopupWindow() {
      UIManager.removePopup();
    },
    /**
     * Initializes the module.
     * Loads settings from SettingsManager and starts the module if enabled.
     */
    init() {
      this.closePopupWindow();
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
   * The UIManager object handles the creation and management of the options menu for the game.
   * It provides methods for adding module settings to the menu, creating toggle buttons, sliders, and dynamic settings UI.
   *
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
            shimmerClicker,
            fortuneClicker,
            wrinklersPopper,
            ascendLuck,
            autopetKrumblor,
            sellAll,
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
      const menu = document.getElementById("menu");
      const sections = menu.querySelector(".section");

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

      modules.forEach((module) => {
        // Create module title container
        const moduleTitle = document.createElement("div");
        moduleTitle.className = "title";
        moduleTitle.style.fontSize = "1rem";
        moduleTitle.textContent = `${module.name} `;
        subsection.appendChild(moduleTitle);

        // Create toggle button within moduleTitle
        const toggleButton = document.createElement("span");
        toggleButton.textContent = "[+]";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.marginLeft = "4px";
        moduleTitle.appendChild(toggleButton);

        // Create settings container
        const listing = document.createElement("div");
        listing.className = "listing";
        listing.style.display = "none"; // Initially collapsed
        subsection.appendChild(listing);

        // Toggle visibility on click
        toggleButton.addEventListener("click", function () {
          const isVisible = listing.style.display !== "none";
          listing.style.display = isVisible ? "none" : "block";
          toggleButton.textContent = isVisible ? "[+]" : "[-]";

          // Update module settings for persistence (assumed structure, adjust as needed)
          module.settings.collapsed = isVisible;
          // Save settings (this will vary based on your mod's implementation)
          SettingsManager.updateModuleSettings(module.id, {
            collapsed: isVisible,
          });
        });

        // Populate listing based on module.settingsUI
        Object.keys(module.settingsUI).forEach((key) => {
          const setting = module.settingsUI[key];
          const element = this.createUIElement(module, key, setting, listing);
          if (element) {
            listing.appendChild(element);
          }
        });

        // Restore visibility state from module settings
        if (!module.settings.collapsed) {
          listing.style.display = "block";
          toggleButton.textContent = "[-]";
        }
      });

      menu.insertBefore(block, sections.nextSibling.nextSibling.nextSibling);
    },
    /**
     * Creates a UI element based on the provided setting type.
     *
     * @param {Object} module - The module object.
     * @param {string} key - The key of the setting.
     * @param {Object} setting - The setting object.
     * @param {HTMLElement} container - The container element to append the UI element to.
     * @returns {HTMLElement|null} The created UI element or null if the setting type is unsupported.
     */
    createUIElement(module, key, setting, container) {
      switch (setting.type) {
        case "toggle":
          return this.createToggleButton(
            module,
            key,
            setting.label,
            setting.description,
            container,
            setting.actions || {}
          );
        case "slider":
          return this.createSlider(module, key, setting, container);
        case "complex":
          // Assuming setting.action is a function that correctly appends custom complex UI to the container
          if (typeof setting.action === "function") {
            return setting.action(container);
          }
          /*
          console.warn(
            `No action defined for complex setting ${key} in module ${module.name}.`
          ); 
          */
          return null; // Return null or appropriate fallback
        default:
          /*
           console.warn(
            `Unsupported setting type '${setting.type}' for key '${key}' in module '${module.name}'.`
          ); 
          */
          return null; // Return null or appropriate fallback for unsupported types
      }
    },

    /**
     * Creates a toggle button element with the specified properties and attaches it to the parent element.
     *
     * @param {object} module - The module object.
     * @param {string} settingKey - The key of the setting in the module's settings object.
     * @param {string} labelText - The text to display on the button.
     * @param {string} descriptionText - The description text to display next to the button (optional).
     * @param {HTMLElement} parent - The parent element to attach the button to.
     * @param {object} actions - The actions to perform when the button is clicked (optional).
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
      // Create the wrapper for the slider
      const wrapper = document.createElement("div");
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

      // Add the sliderBox to the wrapper
      wrapper.appendChild(sliderBox);

      // Add description label to the wrapper if it exists
      if (setting.description) {
        const descriptionLabel = document.createElement("label");
        descriptionLabel.textContent = `(${setting.description})`;
        wrapper.appendChild(descriptionLabel); // Add the description next to the slider box
      }

      // Append the wrapper to the parent, instead of just the sliderBox
      parent.appendChild(wrapper);
      parent.appendChild(document.createElement("br")); // Ensure there's a break after the slider for clean layout

      return wrapper; // Return the wrapper for reference if needed
    },
    /**
     * Creates a dynamic settings UI for a module.
     *
     * @param {Object} module - The module object.
     * @param {string} title - The title of the settings UI.
     * @param {string} description - The description of the settings UI.
     * @param {string} vaultArrayName - The name of the vault array used to access and modify the specific setting in module.settings.
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
     * @param {string} message - The new status message to be set.
     */
    updateModuleStatusMessage(moduleId, message) {
      // Check if the module has a custom popup message setting
      var settings = SettingsManager.loadModuleSettings(moduleId);
      if (settings.popupWindowMessage) {
        this.updatePopupContent(message);
      } else {
        // Fallback to original behavior if popupMessage is false or not set

        // First, find the button related to the moduleName using data-module-name attribute
        const button = document.querySelector(
          `[data-module-name="${moduleId}"]`
        );
        if (!button) return; // Exit if the button is not found

        // Get the parent element of the button, which should be the div container
        const listingDiv = button.parentElement;

        // Ensure the message area for the module exists; if not, create it
        let messageArea = document.getElementById(`${moduleId}-StatusMessage`);
        if (!messageArea) {
          // Create the message area since it doesn't exist
          messageArea = document.createElement("div");
          messageArea.id = `${moduleId}-StatusMessage`;
          messageArea.style.fontSize = "0.8rem"; // Adjust font size as needed
          listingDiv.appendChild(messageArea); // Append the message area to the listing div
        }

        // Check if the current message in the area is different from the new message to be set
        const currentMessage = messageArea.querySelector("h2")
          ? messageArea.querySelector("h2").innerHTML
          : "";
        if (currentMessage !== message) {
          // Update the message content only if it's different
          messageArea.innerHTML = `<p><h2 style="font-size:1em;">${message}</h2></p>`;
        }
      }
    },

    createDraggablePopup() {
      if (!document.getElementById(`${modID}Popup`)) {
        var modPopup = document.createElement("div");
        modPopup.id = `${modID}Popup`;
        modPopup.style.position = "fixed";
        modPopup.style.zIndex = "10000";
        modPopup.style.background = "rgba(0,0,0,0.2)";
        modPopup.style.borderRadius = "5px";
        modPopup.style.padding = "10px";
        modPopup.style.boxShadow = "3px 3px 5px rgba(0,0,0,0.3)";

        var header = document.createElement("div");
        header.id = `${modID}PopupHeader`;
        header.className = "content";
        header.style.marginBottom = "10px";
        header.style.fontWeight = "bold";
        // header.style.textAlign = "center";
        header.style.cursor = "move";
        header.textContent = "Auto-Buy Status";

        var content = document.createElement("div");
        content.id = `${modID}PopupContent`;
        content.textContent = "Initializing...";

        var sectionRight = document.getElementById("sectionRight");
        if (sectionRight) {
          var rightRect = sectionRight.getBoundingClientRect();
          modPopup.style.width = `${rightRect.width}px`; // Set the popup width to match sectionRight
        }

        modPopup.appendChild(header);
        modPopup.appendChild(content);

        // Append the popup
        document.querySelector("#game").appendChild(modPopup);

        // Position the popup under #bigCookie
        var bigCookie = document.getElementById("bigCookie");
        if (bigCookie) {
          var rect = bigCookie.getBoundingClientRect();
          modPopup.style.position = "fixed";
          modPopup.style.left = `${
            rect.left +
            window.scrollX +
            bigCookie.offsetWidth / 2 -
            modPopup.offsetWidth / 2
          }px`;
          modPopup.style.top = `${rect.bottom + window.scrollY + 200}px`; // 10px for a little spacing from the bottom
        }

        // Add dragging functionality
        this.addDragFunctionality(modPopup);
      }
    },

    removePopup() {
      var popup = document.getElementById(`${modID}Popup`);
      if (popup) {
        popup.parentNode.removeChild(popup);
      }
    },

    updatePopupContent(message) {
      var modPopup = document.getElementById(`${modID}Popup`);
      if (modPopup) {
        // document.getElementById(`${modID}PopupHeader`).textContent = title;
        document.getElementById(`${modID}PopupContent`).textContent = message;
      } else {
        this.createDraggablePopup(); // Create the popup if it doesn't exist
        this.updatePopupContent(message); // Update content after creation
      }
    },

    addDragFunctionality(modPopup) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      var modPopupHeader = document.getElementById(`${modID}PopupHeader`);

      modPopupHeader.onmousedown = function (e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      };

      function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        modPopup.style.top = modPopup.offsetTop - pos2 + "px";
        modPopup.style.left = modPopup.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
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
    modules: [], // Array to store modules

    // Method to add modules
    registerModule(module) {
      this.modules.push(module);
    },

    // Main update loop
    update() {
      const now = Date.now();
      this.modules.forEach((module) => {
        // Ensure module has a logic method and is time for it to execute
        if (!module.settings.enabled) return; // Skip if module is disabled
        if (module.logic && (!module.nextProc || now >= module.nextProc)) {
          // console.log(`Executing logic for module: ${module.id} - ${module.nextProc} - ${now}`);
          module.logic(); // Execute module logic
        }
      });
    },
    /**
     * Initializes the mod framework and its modules.
     */
    init() {
      // Initialize SettingsManager with default settings from modules
      SettingsManager.init([
        autoBuy,
        autoClicker,
        shimmerClicker,
        fortuneClicker,
        wrinklersPopper,
        ascendLuck,
        autopetKrumblor,
        sellAll,
      ]);
      autoBuy.init(); // autoBuy initialization with settings
      autoClicker.init(); // autoClicker initialization with settings
      shimmerClicker.init(); // shimmerClicker initialization with settings
      fortuneClicker.init(); // fortuneClicker initialization with settings
      wrinklersPopper.init(); // wrinklersPopper initialization with settings
      ascendLuck.init(); // ascendLuck initialization with settings
      autopetKrumblor.init(); // autopetKrumblor initialization with settings
      sellAll.init(); // sellAll initialization with settings
      // Additional module initializations...

      UIManager.createOptionsMenu(); // Create or extend the options menu

      this.registerModule(autoClicker); // Register autoClicker module
      this.registerModule(autoBuy); // Register autoBuy module
      this.registerModule(shimmerClicker); // Register shimmerClicker module
      this.registerModule(fortuneClicker); // Register fortuneClicker module
      this.registerModule(wrinklersPopper); // Register wrinklersPopper module
      this.registerModule(ascendLuck); // Register ascendLuck module
      this.registerModule(autopetKrumblor); // Register autopetKrumblor module
      this.registerModule(sellAll); // Register sellAll module
      // Register other modules as needed

      // Start the update loop, example with setInterval
      setInterval(() => this.update(), 1000 / Game.fps); // Adjust interval as appropriate

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
        logic: () => {},
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
            fortuneClicker.init();
            wrinklersPopper.init();
            ascendLuck.init();
            autopetKrumblor.init();
            sellAll.init();
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
            fortuneClicker: fortuneClicker,
            wrinklersPopper: wrinklersPopper,
            ascendLuck: ascendLuck,
            autopetKrumblor: autopetKrumblor,
            sellAll: sellAll,
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
