const ACABMdefaultSettings = {
  main: 0,
  mainspeed: 50,
  autobuy: 0,
  protect: 0,
  gold: 0,
  frenzy: 0,
  fortune: 0,
  ascendluck: 0,
  season: 0,
  wrinklers: 0,
  wrinklersmax: -1,
  krumblor: 0,
  hotkeys: 0,
  upgradevault: [],
  buildingvault: [],
  options: ["goldenAC", "wrathAC", "reindeerAC"],
};

const ACABMsettingsKeys = Object.keys(ACABMdefaultSettings);

const ACABMmenuDictionary = {
  main: {
    name: "AutoClick",
    description: "Auto click BigCookie. Autoclick speed 1000ms = 1second",
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  autobuy: {
    name: "AutoBuy",
    description:
      'Buy "best CPS" buildings and upgrades automatically. Status shown below when enabled.',
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  gold: {
    name: "AutoClick Special",
    description: "Auto click Golden cookie, Reindeer, Wrath.",
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  frenzy: {
    name: "AutoClick Frenzy",
    description:
      'Auto click BigCookie during frenzy/click frenzy, not needed if you already use the main "AutoClick" feature.',
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  wrinklers: {
    name: "Auto Wrinklers",
    description:
      "Auto Pop Wrinkers when reach the max amount set. Default is wait until max amount of Wrinklers, exclude Shiny.",
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  ascendluck: {
    name: "Ascend Luck",
    description:
      "Used for unlocking Lucky digit, Lucky number, and Lucky payout. Automatically Ascends you when conditions are met and toggles this feature to off. Turn back on manually if you have more to unlock. Does not buy the Heavenly upgrade for you.",
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  protect: {
    name: "AutoBuy Protect",
    description:
      "Calculates Lucky and Frenzy requirements so that autobuy doesn't go below them. If Autobuy seems stuck try disabling this feature",
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  fortune: {
    name: "Auto Fortune",
    description: "Auto click on News ticker fortunes.",
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  season: {
    name: "Auto Season",
    description: "Auto switches season on popup.",
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  hotkeys: {
    name: "Hotkeys",
    description:
      "Allows you to use the old way of using the mod with hotkeys. New features will not have hotkeys.",
    values: {
      0: "OFF",
      1: "ON",
    },
  },
  krumblor: {
    name: "AutoPet Krumblor",
    description:
      'Pets Krumblor when you reach lvl 4 to unlock Dragon drops. Krumblor\'s Menu must be open and own the Heavenly Upgrade "Pet the dragon". Turns off if you have all 4 drops.',
    values: {
      0: "OFF",
      1: "ON",
    },
  },
};

const ACABM = {
  init: function () {
    const ACABM = this;
    const GameUpdateMenu = Game.UpdateMenu;
    Game.UpdateMenu = function () {
      GameUpdateMenu();
      ACABM.addMenu();
    };

    Game.Notify(
      "Auto click and buy loaded!",
      'Turn settings On/Off in the <b><a href="#" onclick=Game.ShowMenu("prefs");>Options</a></b> Menu.',
      [30, 6],
      20
    );

    // --- Calculator
    function Calculator() {
      this.schema = [
        {
          objects: function () {
            return Game.UpgradesInStore.filter(function (e) {
              return (
                [].indexOf(e.id) < 0 &&
                e.pool != "prestige" &&
                e.pool != "toggle" &&
                !Game.vault.includes(e.id) &&
                !ACABM.settings.upgradevault.includes(e.id)
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
                !ACABM.settings.buildingvault.includes(e.id)
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

    Calculator.prototype = {
      cps_acc: function (base_cps, new_cps, price) {
        return (base_cps * base_cps * (new_cps - base_cps)) / (price * price);
      },
      ecps: function () {
        return Game.cookiesPs * (1 - Game.cpsSucked);
      },

      calc_bonus: function (item, list_generator, mouse_rate) {
        var func = Game.Win;
        Game.Win = function () {};

        var res = list_generator().map(
          function (e) {
            var lasting = this.item.lasting(e);
            var price = Math.round(this.item.price(e));
            // Garden Upgrade Calc - currently only upgrades using lasting.
            if (lasting) {
              price = Math.round(price * Game.cookiesPs * 60);
            }
            // Dragon Upgrade Calc - could break other items priced at 999 in the future?
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

        Game.Win = func;
        return res;
      },

      find_best: function (mouse_rate) {
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
      },
    };

    // --- Controller
    function Controller() {
      this.calc = new Calculator();
      this.protect = false;
      this.target = {
        name: undefined,
        price: -1,
      };
      this.total = -1;
      this.actions = {
        timeouts: {},
        togglesettings: {
          delay: 50,
          func: this.toggle_settings.bind(this),
        },
        guard: {
          delay: 100,
          func: this.guard.bind(this),
        },
        autobuy: {
          delay: 200,
          func: this.autobuy.bind(this),
        },
        status: {
          delay: 0,
          func: this.status.bind(this),
        },
        protect: {
          delay: 0,
          func: this.toggle_protect.bind(this),
        },
        main: {
          delay: ACABM.settings.mainspeed,
          func: function () {
            Game.ClickCookie(0);
          },
        },
        krumblor: {
          delay: 200,
          func: function () {
            if (
              Game.HasUnlocked("Dragon scale") &&
              Game.HasUnlocked("Dragon claw") &&
              Game.HasUnlocked("Dragon fang") &&
              Game.HasUnlocked("Dragon teddy bear")
            ) {
              ACABM.settings["krumblor"] = 0;
              ACABM.abmessage["AKmsg"] =
                "You have already unlocked all Krumblor upgrades: Dragon scale, Dragon claw, Dragon fang and Dragon teddy bear.";
              Game.UpdateMenu();
              return;
            }
            if (
              Game.specialTab == "dragon" &&
              Game.dragonLevel >= 4 &&
              Game.HasUnlocked("Pet the dragon")
            ) {
              ACABM.abmessage["AKmsg"] =
                "Petting Krumblor for the remaining unlock(s): <br>" +
                (Game.HasUnlocked("Dragon scale") ? "" : "Dragon scale <br>") +
                "  " +
                (Game.HasUnlocked("Dragon claw") ? "" : "Dragon claw <br>") +
                "  " +
                (Game.HasUnlocked("Dragon fang") ? "" : "Dragon fang <br>") +
                "  " +
                (Game.HasUnlocked("Dragon teddy bear")
                  ? ""
                  : "Dragon teddy bear <br>") +
                "  ";

              Game.ClickSpecialPic();
            } else {
              ACABM.settings["krumblor"] = 0;
              ACABM.abmessage["AKmsg"] =
                "You do not meet the following requirements to Pet Krumblor: <br>" +
                (Game.specialTab == "dragon"
                  ? ""
                  : "Krumblor menu is not open <br>") +
                "  " +
                (Game.dragonLevel >= 4 ? "" : "Dragon level is under 4 <br>") +
                "  " +
                (Game.Has("Pet the dragon")
                  ? ""
                  : 'You do not own Heavenly Upgrade: "Pet the dragon" <br>') +
                " turn option back on once you fulfill these requirements.";
              Game.UpdateMenu();
            }
          },
        },
        frenzy: {
          delay: 50,
          func: function () {
            if (
              Game.hasBuff("Click Frenzy") != 0 > 0 ||
              Game.hasBuff("Frenzy") != 0 > 0
            )
              Game.ClickCookie(0);
          },
        },
        season: {
          delay: 1000,
          func: function () {
            if (Game.seasonPopup && Game.seasonPopup.life > 0)
              Game.seasonPopup.click();
          },
        },
        gold: {
          delay: 500,
          func: function () {
            if (Game.shimmers) {
              for (var h in Game.shimmers) {
                if (Game.shimmers[h] !== undefined) {
                  if (
                    Game.shimmers[h].type === "golden" &&
                    !Game.shimmers[h].wrath &&
                    ACABM.settings.options.indexOf("goldenAC") != -1
                  ) {
                    Game.shimmers[h].pop();
                  } else if (
                    Game.shimmers[h].type === "golden" &&
                    Game.shimmers[h].wrath &&
                    ACABM.settings.options.indexOf("wrathAC") != -1
                  ) {
                    Game.shimmers[h].pop();
                  } else if (
                    Game.shimmers[h].type === "reindeer" &&
                    ACABM.settings.options.indexOf("reindeerAC") != -1
                  ) {
                    Game.shimmers[h].pop();
                  }
                }
              }
            }
          },
        },
        ascendluck: {
          delay: 50,
          func: this.ascendluck.bind(this),
        },
        fortune: {
          delay: 2000,
          func: this.fortune.bind(this),
        },
        wrinklers: {
          delay: 2000,
          func: this.wrinklers.bind(this),
        },
      };
      this.toggle_action("guard");
      this.toggle_action("togglesettings");
    }

    Controller.prototype = {
      say: function (msg) {
        //I don't think anyone uses console log to reach this stuff anymore.
        //console.log(msg);
        if (ACABM.settings["hotkeys"]) {
          Game.Popup(msg, Game.windowW / 2, Game.windowH - 100);
        }
      },
      guard: function () {
        var t = this.total;
        this.total =
          1000 * (Game.hasBuff("Frenzy") != 0 ? 1 : 0) +
          Game.BuildingsOwned +
          Game.UpgradesOwned;
        if (
          this.actions.timeouts.buy &&
          (t != this.total ||
            !this.actions.autobuy.id ||
            this.target.price <= Game.cookies - this.calc.ecps())
        )
          this.unqueue_action("buy");
      },
      autobuy: function () {
        if (this.actions.timeouts.buy) {
          ACABM.abmessage["buy"] =
            "Waiting (" +
            Beautify((this.target.price - Game.cookies) / this.calc.ecps(), 1) +
            "s) for " +
            this.target.name;
          return;
        }
        var info = this.calc.find_best(
          this.actions.main.id ? 1000 / this.actions.main.delay : 0
        );
        var protect =
          this.protect && Game.Has("Get lucky") != 0
            ? (Game.hasBuff("Frenzy") != 0 ? 1 : 7) * Game.cookiesPs * 1200
            : 0;
        var wait = (protect + info.price - Game.cookies) / this.calc.ecps();
        if (!isFinite(wait) || wait > 120) {
          ACABM.abmessage["buy"] =
            'AutoBuy wants to buy: "' +
            info.obj.name +
            '" but the wait time (' +
            Beautify(wait, 1) +
            "s) is over 120 seconds";
          return;
        }

        var msg =
          (wait > 0 ? "Waiting (" + Beautify(wait, 1) + "s) for" : "Buying") +
          ' "' +
          info.obj.name +
          '"';
        ACABM.abmessage["buy"] = msg;
        //console.log("For {cps = " + Beautify(Game.cookiesPs, 1) + ", protect = " + Beautify(protect) + "} best candidate is", info);
        this.say(msg);
        if (wait > 0) {
          this.target.name = info.obj.name;
          this.target.price = protect + info.price;
          this.queue_action(
            "buy",
            1000 * (Game.cookiesPs ? wait + 0.05 : 60),
            function () {
              if (info.price <= Game.cookies) {
                this.say('Buying "' + info.obj.name + '"');
                if (info.obj.name === "One mind") {
                  Game.UpgradesById["69"].buy(1);
                  Game.ClosePrompt();
                  this.total++;
                  this.unqueue_action("buy");
                } else {
                  info.obj.buy();
                  this.total++;
                }
              }
            }.bind(this)
          );
        } else {
          if (info.obj.name === "One mind") {
            Game.UpgradesById["69"].buy(1);
            Game.ClosePrompt();
            this.total++;
          } else {
            info.obj.buy();
            this.total++;
          }
        }
      },
      status: function () {
        var act = [];
        var b2s = function (b) {
          return b ? "on".fontcolor("green") : "off".fontcolor("red");
        };

        for (var i in this.actions) {
          if (this.actions[i].delay && i != "guard") {
            // add [ before and ] after first character of the action name. autobuy = [A]utobuy
            // not all first chracters for the option match the hotkey, so adding manually.
            switch (i) {
              case "season":
                var sname = "[H]" + i;
                break;
              case "ascendluck":
                var sname = "[Z]" + i;
                break;
              case "fortune":
                var sname = "[N]" + i;
                break;
              default:
                var sname =
                  i.slice(0, 0) +
                  "[" +
                  i.slice(0, 1).toUpperCase() +
                  "]" +
                  i.slice(1);
            }
            act.push(sname + ": " + b2s(this.actions[i].id));
          }
        }
        var msg = "<p>[S]tatus</p><p>keyboard hotkeys enclosed []</p>";
        msg += "<p>" + act.join(", ") + "</p>";
        msg +=
          "<p>[P]rotect - cookie protection for max frenzy/lucky combo: " +
          b2s(this.protect) +
          "</p>";
        msg +=
          "<p>[M]ain auto click speed: " +
          this.actions["main"].delay +
          "ms</p>";
        msg +=
          "<p>Increase the auto click speed using keyboard combo shift + 1 to decrease shift + 2</p>";

        if (this.actions.timeouts.buy) {
          msg +=
            "<p>waiting " +
            Beautify((this.target.price - Game.cookies) / this.calc.ecps(), 1) +
            ' s for "' +
            this.target.name +
            '"</p>';
        }
        this.say(msg);
      },
      ascendluck: function () {
        // Access this within nested function.
        var thisfunc = this;

        function doascendluckOff() {
          ACABM.settings["ascendluck"] = 0;
          thisfunc.toggle_action("ascendluck", true);
          Game.UpdateMenu();
        }

        function doascendLuck() {
          Game.Ascend(1);
          Game.ClosePrompt();
          ACABM.settings["ascendluck"] = 0;
          thisfunc.toggle_action("ascendluck", true);
        }

        if (
          Game.HasUnlocked("Lucky digit") &&
          Game.HasUnlocked("Lucky number") &&
          Game.HasUnlocked("Lucky payout")
        ) {
          ACABM.abmessage["ALmsg"] =
            "You have already unlocked all upgrades: Lucky digit, Lucky number, and Lucky payout.";
          doascendluckOff();
          return;
        }

        if (Game.HasUnlocked("Heavenly luck")) {
          if (
            !Game.HasUnlocked("Lucky digit") &&
            Game.HasUnlocked("Heavenly luck")
          ) {
            if (
              (Game.prestige + Game.ascendMeterLevel).toString().split("7")
                .length -
                1 >=
              1
            ) {
              doascendLuck();
            } else {
              ACABM.abmessage["ALmsg"] =
                "Waiting for prestige level to contain one(1) 7";
            }
          } else if (!Game.HasUnlocked("Lucky number")) {
            if (
              Game.HasUnlocked("Lucky digit") &&
              Game.HasUnlocked("Lasting fortune")
            ) {
              if (
                (Game.prestige + Game.ascendMeterLevel).toString().split("7")
                  .length -
                  1 >=
                2
              ) {
                doascendLuck();
              } else {
                ACABM.abmessage["ALmsg"] =
                  "Waiting for prestige level to contain two(2) 7's";
              }
            } else {
              ACABM.abmessage["ALmsg"] =
                "You need to own Heavenly Upgrade(s): " +
                (Game.HasUnlocked("Lucky digit") ? "" : '"Lucky digit"') +
                " " +
                (Game.HasUnlocked("Lucky digit") +
                  Game.HasUnlocked("Lasting fortune") >
                0
                  ? ""
                  : " and ") +
                "  " +
                (Game.HasUnlocked("Lasting fortune")
                  ? ""
                  : '"Lasting fortune"') +
                " to use this feature.";
              doascendluckOff();
            }
          } else if (!Game.HasUnlocked("Lucky payout")) {
            if (
              Game.HasUnlocked("Lucky number") &&
              Game.HasUnlocked("Decisive fate")
            ) {
              if (
                (Game.prestige + Game.ascendMeterLevel).toString().split("7")
                  .length -
                  1 >=
                4
              ) {
                doascendLuck();
              } else {
                ACABM.abmessage["ALmsg"] =
                  "Waiting for prestige level to contain four(4) 7's";
              }
            } else {
              ACABM.abmessage["ALmsg"] =
                "You do not own the following required Heavenly Upgrade(s): " +
                (Game.HasUnlocked("Lucky number") ? "" : '"Lucky number"') +
                " " +
                (Game.HasUnlocked("Lucky number") +
                  Game.HasUnlocked("Decisive fate") >
                0
                  ? ""
                  : " and ") +
                "  " +
                (Game.HasUnlocked("Decisive fate") ? "" : '"Decisive fate"') +
                " to use this feature.";
              doascendluckOff();
            }
          }
        } else {
          ACABM.abmessage["ALmsg"] =
            'You do not own the following required Heavenly Upgrade: "Heavenly luck" to use this feature.';
          doascendluckOff();
        }
      },
      fortune: function () {
        if (Game.TickerEffect && Game.TickerEffect.type === "fortune") {
          Game.tickerL.click();
        }
      },
      wrinklers: function () {
        // Pop fattest normal wrinkler when you reach max wrinklers.
        if (Game.elderWrath > 0) {
          let wrinklersM;
          let wrinklersNormal = Game.wrinklers.filter(function (e) {
            return e.type == 0 && e.sucked > 0;
          });
          let wrinklersShiny = Game.wrinklers.filter(function (e) {
            return e.type !== 0 && e.sucked > 0;
          });

          if (ACABM.settings.wrinklersmax == -1) {
            ACABM.settings.wrinklersmax = Game.getWrinklersMax() - 1;
          }

          wrinklersM = ACABM.settings.wrinklersmax;

          // Is current amount of wrinklers max? Pop the fattest normal wrinkler. // && (Game.cookies * 2) >= wrinklersNormal.reduce((m, v) => m.sucked > v.sucked ? m : v).sucked
          if (
            Object.keys(wrinklersNormal).length +
              Object.keys(wrinklersShiny).length >
              wrinklersM ||
            Object.keys(wrinklersNormal).length +
              Object.keys(wrinklersShiny).length >=
              Game.getWrinklersMax()
          ) {
            /*console.log(
              "Wrinklers Normal: " +
                Object.keys(wrinklersNormal).length +
                " Wrinklers Shiny: " +
                Object.keys(wrinklersShiny).length +
                " Wrinkler Max: " +
                wrinklersM
            );*/

            // Pop Normal Wrinkler
            if (Object.keys(wrinklersNormal).length > 0) {
              Game.wrinklers[
                wrinklersNormal.reduce((m, v) =>
                  m.sucked > v.sucked ? m : v
                ).id
              ].hp = 0;
              this.say("Popping most valuable normal Wrinkler");
            }
            // Pop Shiny if enabled and no Normal Wrinklers available.
            if (
              Object.keys(wrinklersShiny).length > 0 &&
              ACABM.settings.options.indexOf("popSW") != -1 &&
              Object.keys(wrinklersNormal).length == 0
            ) {
              Game.wrinklers[
                wrinklersShiny.reduce((m, v) =>
                  m.sucked > v.sucked ? m : v
                ).id
              ].hp = 0;
              this.say("Popping most valuable shiny Wrinkler");
            }
            //console.log("Popping wrinkler best candidate is", Game.wrinklers[wrinklersNormal.reduce((m, v) => m.sucked > v.sucked ? m : v).id]);
          }
        }
      },
      toggle_protect: function () {
        if (ACABM.settings["protect"] === 0) {
          this.protect = false;
          this.unqueue_action("buy");
        } else {
          this.protect = true;
        }
      },
      toggle_action: function (name, loading) {
        var action = this.actions[name];
        var loading = loading;

        if (!action) return;

        if (name == "guard" || (name == "togglesettings" && !loading)) {
          setInterval(action.func, action.delay);
        }

        if (name == "status") {
          action.func();
        }

        if (loading && name == "protect") {
          action.func();
          //console.log("Protect " + this.protect);
        }

        if (
          loading &&
          ACABM.settings[name] === 0 &&
          action.id &&
          name !== "protect"
        ) {
          //console.log("clearInterval" + name);
          action.id = clearInterval(action.id);
        } else if (
          loading &&
          ACABM.settings[name] === 1 &&
          !action.id &&
          name !== "protect"
        ) {
          //console.log("setInterval " + name);
          action.id = setInterval(action.func, action.delay);
        }
      },
      toggle_settings: function () {
        // Handle mainspeed
        if (
          ACABM.settings["mainspeed"] &&
          typeof ACABM.settings["mainspeed"] === "number" &&
          this.actions.main.delay !== ACABM.settings["mainspeed"]
        ) {
          var action = this.actions["main"];
          if (!action) return;
          action.id = clearInterval(action.id);
          this.actions.main.delay = ACABM.settings["mainspeed"];
          action.id = setInterval(action.func, action.delay);
        }

        // Handle toggle settings
        const skipToggle = ["hotkeys"];
        for (var i in ACABM.settings) {
          if (!skipToggle.includes(i)) {
            this.toggle_action(i, true);
          }
        }
      },
      delay_speed: function (name, speedaction) {
        var action = this.actions[name];
        if (!action) return;

        // simple variable to change the this.say message.
        var actmsg = true;
        if (speedaction == "add") {
          action.id = clearInterval(action.id);
          action.delay += 50;
          ACABM.settings.mainspeed = action.delay;
          action.id = setInterval(action.func, action.delay);
        }

        if (speedaction == "sub") {
          // don't go under 50ms
          if (action.delay >= 100) {
            action.id = clearInterval(action.id);
            action.delay -= 50;
            ACABM.settings.mainspeed = action.delay;
            action.id = setInterval(action.func, action.delay);
          } else {
            actmsg = false;
          }
        }

        this.say(
          "Action: " +
            name +
            (actmsg
              ? " delay is now " + this.actions[name].delay + "ms"
              : " delay cannot be set under 50ms")
        );
        Game.UpdateMenu();
      },
      unqueue_action: function (name) {
        var to = this.actions.timeouts;
        if (to[name]) {
          clearTimeout(to[name]);
          delete to[name];
        }
      },
      queue_action: function (name, delay, func) {
        var to = this.actions.timeouts;
        this.unqueue_action(name);
        to[name] = setTimeout(function () {
          func();
          delete to[name];
        }, delay);
      },
    };

    var view = {
      ctrl: new Controller(),
      actions: {
        65 /* A */: "autobuy",
        90 /* Z */: "ascendluck",
        72 /* H */: "season",
        71 /* G */: "gold",
        70 /* F */: "frenzy",
        77 /* M */: "main",
        78 /* N */: "fortune",
        83 /* S */: "status",
        80 /* P */: "protect",
        87 /* W */: "wrinklers",
      },
    };

    document.addEventListener(
      "keydown",
      function (e) {
        if (ACABM.settings.hotkeys) {
          if (this.actions[e.keyCode]) {
            if (e.keyCode === 83) {
              this.ctrl.toggle_action(this.actions[e.keyCode]);
              return;
            }
            const value = ACABM.settings[this.actions[e.keyCode]];
            const { name, description, values } =
              ACABMmenuDictionary[this.actions[e.keyCode]];
            const newValue = (value + 1) % Object.entries(values).length;
            ACABM.settings[this.actions[e.keyCode]] = newValue;
            Game.UpdateMenu();
          }
          if (e.shiftKey) {
            if (e.which == 49) {
              this.ctrl.delay_speed("main", "add");
            }
            if (e.which == 50) {
              this.ctrl.delay_speed("main", "sub");
            }
          }
        }
      }.bind(view)
    );
  },
  save: function () {
    //If you need it, just uncomment.
    //console.log("ACABM - Saving the following settings: ", this.settings);
    const saveData = Object.fromEntries(
      Object.entries(this.settings).filter(([key]) =>
        ACABMsettingsKeys.includes(key)
      )
    );
    return JSON.stringify(saveData);
  },
  load: function (str) {
    if (str !== undefined && str.length > 0) {
      const saveData = JSON.parse(str);
      // Old Save Data conversion from true/false to number.
      saveData.autobuy = saveData.autobuy ? 1 : 0;
      saveData.ascendluck = saveData.ascendluck ? 1 : 0;
      saveData.season = saveData.season ? 1 : 0;
      saveData.gold = saveData.gold ? 1 : 0;
      saveData.frenzy = saveData.frenzy ? 1 : 0;
      saveData.main = saveData.main ? 1 : 0;
      saveData.protect = saveData.protect ? 1 : 0;
      saveData.fortune = saveData.fortune ? 1 : 0;
      saveData.wrinklers = saveData.wrinklers ? 1 : 0;
      this.settings = {
        ...this.settings,
        ...saveData,
      };
    }
  },
  settings: ACABMdefaultSettings,
  abmessage: {},
  createSlider(
    slider,
    leftText,
    rightText,
    startValueFunction,
    minVal,
    maxVal,
    stepVal,
    callback
  ) {
    if (!callback) callback = "";
    return (
      '<div class="sliderBox">' +
      '<div style="float:left;" class="smallFancyButton">' +
      leftText +
      '</div><div style="float:right;" class="smallFancyButton" id="' +
      slider +
      'RightText">' +
      rightText.replace("[$]", startValueFunction()) +
      '</div><input class="slider" style="clear:both;" type="range" min="' +
      minVal +
      '" max="' +
      maxVal +
      '" step="' +
      stepVal +
      '" value="' +
      startValueFunction() +
      '" onchange="' +
      callback +
      '" oninput="' +
      callback +
      '" onmouseup="PlaySound(\'snd/tick.mp3\');" id="' +
      slider +
      '"/></div>'
    );
  },
  addMenu() {
    if (Game.onMenu === "prefs") {
      const newBlock = this.createMenu();
      const [titleSection] = l("menu").getElementsByClassName("section");
      l("menu").insertBefore(
        newBlock,
        titleSection.nextSibling.nextSibling.nextSibling
      );
    }
  },
  createMenu() {
    const block = document.createElement("div");
    block.className = "block";
    block.style = "padding:0px;margin:8px 4px;";

    const subsection = document.createElement("div");
    subsection.className = "subsection";
    subsection.style = "padding:0px";
    block.appendChild(subsection);

    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML = `Auto Click and Buy Mod `;
    subsection.appendChild(title);

    ACABMsettingsKeys.forEach((key) => {
      const skipSetting = [
        "mainspeed",
        "wrinklersmax",
        "upgradevault",
        "buildingvault",
        "options",
      ];
      if (!skipSetting.includes(key)) {
        subsection.appendChild(this.createMenuListing(key));
      }
    });

    return block;
  },
  createMenuListing(id) {
    const ACABM = this;
    const { settings } = ACABM;
    const value = settings[id];
    const settingsid = id;
    const { name, description, values } = ACABMmenuDictionary[id];
    const UPPids = [227];

    var listing = document.createElement("div");
    listing.className = "listing";

    var a = document.createElement("a");

    a.className = `smallFancyButton prefButton option${
      value > 0 ? "" : " off"
    }`;
    a.innerText = `${name} ${values[value]}`;
    a.onclick = function () {
      const newValue = (value + 1) % Object.entries(values).length;
      settings[id] = newValue;

      if (
        settingsid === "autobuy" &&
        settings[id] &&
        settings.options.indexOf("ABExpand") == -1
      ) {
        settings.options.push("ABExpand");
      }

      if (
        settingsid === "wrinklers" &&
        settings[id] &&
        settings.options.indexOf("AWExpand") == -1
      ) {
        settings.options.push("AWExpand");
      }

      if (
        settingsid === "gold" &&
        settings[id] &&
        settings.options.indexOf("AGExpand") == -1
      ) {
        settings.options.push("AGExpand");
      }

      PlaySound("snd/tick.mp3");
      Game.UpdateMenu();
    };

    listing.appendChild(a);

    if (settingsid === "autobuy") {
      var a = document.createElement("a");
      a.className = `smallFancyButton`;
      a.innerText = `${
        settings.options.indexOf("ABExpand") != -1
          ? "Collapse Options"
          : "Expand Options"
      }`;
      a.onclick = function () {
        if (settings.options.indexOf("ABExpand") != -1) {
          settings.options.splice(settings.options.indexOf("ABExpand"), 1);
        } else {
          settings.options.push("ABExpand");
        }
        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };
      listing.appendChild(a);
    }

    if (settingsid === "wrinklers") {
      var a = document.createElement("a");
      a.className = `smallFancyButton`;
      a.innerText = `${
        settings.options.indexOf("AWExpand") != -1
          ? "Collapse Options"
          : "Expand Options"
      }`;
      a.onclick = function () {
        if (settings.options.indexOf("AWExpand") != -1) {
          settings.options.splice(settings.options.indexOf("AWExpand"), 1);
        } else {
          settings.options.push("AWExpand");
        }
        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };
      listing.appendChild(a);
    }

    if (settingsid === "gold") {
      var a = document.createElement("a");
      a.className = `smallFancyButton`;
      a.innerText = `${
        settings.options.indexOf("AGExpand") != -1
          ? "Collapse Options"
          : "Expand Options"
      }`;
      a.onclick = function () {
        if (settings.options.indexOf("AGExpand") != -1) {
          settings.options.splice(settings.options.indexOf("AGExpand"), 1);
        } else {
          settings.options.push("AGExpand");
        }
        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };
      listing.appendChild(a);
    }

    var label = document.createElement("label");
    label.innerText = `(${description})`;
    listing.appendChild(label);

    if (settingsid === "autobuy" && settings[id]) {
      var labelabmsg = document.createElement("div");
      labelabmsg.innerHTML = `<p><h2 style="font-size:1em;">${ACABM.abmessage["buy"]}</h2></p>`;
      listing.appendChild(labelabmsg);
      var a = document.createElement("a");
      a.className = `smallFancyButton`;
      a.innerText = `Manual Refresh`;
      a.onclick = function () {
        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };
      listing.appendChild(a);
      var label = document.createElement("label");
      label.innerText = `(Refresh AutoBuy Status message manually if needed.)`;
      listing.appendChild(label);
    }

    if (settingsid === "ascendluck" && ACABM.abmessage["ALmsg"]) {
      var labelalmsg = document.createElement("div");
      labelalmsg.innerHTML = `<p><h2 style="font-size:1em;">${ACABM.abmessage["ALmsg"]}</h2></p>`;
      listing.appendChild(labelalmsg);
    }

    if (settingsid === "krumblor" && ACABM.abmessage["AKmsg"]) {
      var labelakmsg = document.createElement("div");
      labelakmsg.innerHTML = `<p><h2 style="font-size:1em;">${ACABM.abmessage["AKmsg"]}</h2></p>`;
      listing.appendChild(labelakmsg);
    }

    if (
      (settingsid === "autobuy" &&
        settings[id] &&
        settings.options.indexOf("ABExpand") != -1) ||
      (settingsid === "autobuy" && settings.options.indexOf("ABExpand") != -1)
    ) {
      var labelupgrades = document.createElement("div");
      labelupgrades.innerHTML = `<p></p><p><div style="font-size:1em;">Vault Upgrades <label>While Enabled the upgrade will be removed from the AutoBuy pool. This is for people who did not get the Inspired Checklist upgrade yet to Vault upgrades. This is a static list, if you want more added submit a comment on the Steam Workshop mod site.</label></div></p>`;
      for (var i = 0; i < UPPids.length; i++) {
        let UUP = Game.UpgradesById[UPPids[i]];
        var a = document.createElement("a");
        a.className = `smallFancyButton prefButton option${
          settings.upgradevault.indexOf(UUP.id) != -1 ? "" : " off"
        }`;
        a.innerText = `${UUP.name} ${
          settings.upgradevault.indexOf(UUP.id) != -1 ? "on" : " off"
        }`;
        a.onclick = function () {
          if (settings.upgradevault.indexOf(UUP.id) != -1) {
            settings.upgradevault.splice(
              settings.upgradevault.indexOf(UUP.id),
              1
            );
          } else {
            settings.upgradevault.push(UUP.id);
          }
          PlaySound("snd/tick.mp3");
          Game.UpdateMenu();
        };
        labelupgrades.appendChild(a);
      }

      var labeltech = document.createElement("div");
      labeltech.innerHTML = `<p></p><p><div style="font-size:1em;">Vault Tech Upgrades <label>While Enabled the tech upgrade will be removed from the AutoBuy pool.</label></div></p>`;
      for (var i = 0; i < Game.UpgradesByPool["tech"].length; i++) {
        let UBP = Game.UpgradesByPool["tech"][i];
        var a = document.createElement("a");
        a.className = `smallFancyButton prefButton option${
          settings.upgradevault.indexOf(UBP.id) != -1 ? "" : " off"
        }`;
        a.innerText = `${UBP.name} ${
          settings.upgradevault.indexOf(UBP.id) != -1 ? "on" : " off"
        }`;
        a.onclick = function () {
          if (settings.upgradevault.indexOf(UBP.id) != -1) {
            settings.upgradevault.splice(
              settings.upgradevault.indexOf(UBP.id),
              1
            );
          } else {
            settings.upgradevault.push(UBP.id);
          }
          PlaySound("snd/tick.mp3");
          Game.UpdateMenu();
        };
        labeltech.appendChild(a);
      }

      var labelbuildings = document.createElement("div");
      labelbuildings.innerHTML = `<p></p><p><div style="font-size:1em;">Vault Buildings <label>While Enabled the building will be removed from the AutoBuy pool.</label></div></p>`;
      for (var i = 0; i < Game.ObjectsById.length; i++) {
        let UBI = Game.ObjectsById[i];
        var a = document.createElement("a");
        a.className = `smallFancyButton prefButton option ${
          settings.buildingvault.indexOf(UBI.id) != -1 ? "" : " off"
        }`;
        a.innerText = `${UBI.name} ${
          settings.buildingvault.indexOf(UBI.id) != -1 ? "on" : " off"
        }`;
        a.onclick = function () {
          if (settings.buildingvault.indexOf(UBI.id) != -1) {
            settings.buildingvault.splice(
              settings.buildingvault.indexOf(UBI.id),
              1
            );
          } else {
            settings.buildingvault.push(UBI.id);
          }
          PlaySound("snd/tick.mp3");
          Game.UpdateMenu();
        };
        labelbuildings.appendChild(a);
      }

      listing.appendChild(labelupgrades);
      listing.appendChild(labeltech);
      listing.appendChild(labelbuildings);
    } else if (settingsid === "hotkeys" && settings[id]) {
      const labelhotkeys = document.createElement("div");
      labelhotkeys.innerHTML = `
      <h4 style="font-size:1.25em;">Keyboard Shortcuts</h4>
      <br><br>
      <p>M (Main) <label>Autoclicks Big Cookie.</label></p>
      <div class="listing">
          <p>Shift + 1 <label>Increase Click Delay</label></p>
          <p>Shift + 2 <label>Decrease Click Delay</label></p>
      </div>
      <p>G (Gold) <label>Autoclicks Shimmers Golden cookie, Reindeer,
              ect.</label></p>
      <p>F (Frenzy) <label>Autoclicks Big Cookie during frenzy/click
              frenzy.</label></p>
      <p>A (Autobuy) <label>Buys "best CPS" buildings and upgrades
              automatically.</label></p>
      <div class="listing">It does not just "buy" buildings/upgrades you can afford, but attempts to buy
          the best buildings/upgrades.<br>If you do not see the script buying. It is waiting for the best
          option to become available.<br>When the item is calculated to be available to purchase within
          150 seconds, it will be added to queue for purchase.<br>You will see a "Waiting x to buy Y"
          pop-up and can view the remaining time in the Status popup.</div>
      <p>S (Status popup) <label>Displays mod status and if there is a buy
              waiting in queue</label></p>
      <p>P (Protect) <label>Calculates Lucky and Frenzy requirements so that
              autobuy doesn't go below them.</label></p>
      <p>N (Fortune) <label>Autoclicks on News ticker fortunes.</label></p>
      <p>W (Wrinklers) <label>Pops the single fattest normal (excluding Shiny)
              wrinkler if you are at your max.</label></p>
      <p>Z (Ascend Luck) <label>Automatically ascends you when your total
              Prestige/Ascend Meter contains "7" four(4) times to unlock 'Lucky Payout' (if you don't
              already have it)</label></p>
      <p>H (Season) <label>Auto switches season on popup</label></p></br>
      `;
      listing.appendChild(labelhotkeys);
      // && settings[id]
    } else if (settingsid === "main" && settings[id]) {
      var labelautoclick = document.createElement("div");
      var slider = this.createSlider(
        "ACABMClickSlider",
        loc("AutoClick Speed"),
        "[$]/ms",
        function () {
          return ACABM.settings["mainspeed"];
        },
        50,
        3000,
        50,
        "ACABM.settings.mainspeed=Number(l('ACABMClickSlider').value);l('ACABMClickSliderRightText').innerHTML=l('ACABMClickSlider').value + '/ms';"
      );
      labelautoclick.innerHTML = slider;
      listing.appendChild(labelautoclick);
    } else if (
      (settingsid === "wrinklers" &&
        settings[id] &&
        settings.options.indexOf("AWExpand") != -1) ||
      (settingsid === "wrinklers" && settings.options.indexOf("AWExpand") != -1)
    ) {
      if (
        settings.wrinklersmax == -1 ||
        settings.wrinklersmax > Game.getWrinklersMax() - 1
      ) {
        settings.wrinklersmax = Game.getWrinklersMax() - 1;
      }
      var labelwrinklers = document.createElement("div");
      var slider = this.createSlider(
        "ACABMWrinklersSlider",
        loc("Max Wrinklers to keep"),
        "[$]",
        function () {
          return ACABM.settings["wrinklersmax"];
        },
        0,
        Game.getWrinklersMax() - 1,
        1,
        "ACABM.settings.wrinklersmax=Number(l('ACABMWrinklersSlider').value);l('ACABMWrinklersSliderRightText').innerHTML=l('ACABMWrinklersSlider').value;"
      );
      labelwrinklers.innerHTML = slider;
      listing.appendChild(labelwrinklers);

      var a = document.createElement("a");
      a.className = `smallFancyButton prefButton option ${
        settings.options.indexOf("popSW") != -1 ? "" : " off"
      }`;
      a.innerText = `Pop Shiny Wrinklers ${
        settings.options.indexOf("popSW") != -1 ? "on" : " off"
      }`;
      a.onclick = function () {
        if (settings.options.indexOf("popSW") != -1) {
          settings.options.splice(settings.options.indexOf("popSW"), 1);
        } else {
          settings.options.push("popSW");
        }
        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };
      listing.appendChild(a);

      var label = document.createElement("label");
      label.innerText = `(If enabled, Shiny Wrinklers will be popped if no Normal Wrinklers exist and you have reacehd your Wrinkler Max)`;
      listing.appendChild(label);
    } else if (
      (settingsid === "gold" &&
        settings[id] &&
        settings.options.indexOf("AGExpand") != -1) ||
      (settingsid === "gold" && settings.options.indexOf("AGExpand") != -1)
    ) {
      var labelgold = document.createElement("div");
      listing.appendChild(labelgold);

      // Create Golden Cookies Button
      var a = document.createElement("a");
      a.className = `smallFancyButton prefButton option ${
        settings.options.indexOf("goldenAC") != -1 ? "" : " off"
      }`;
      a.innerText = `Golden Cookies ${
        settings.options.indexOf("goldenAC") != -1 ? "on" : " off"
      }`;
      a.onclick = function () {
        if (settings.options.indexOf("goldenAC") != -1) {
          settings.options.splice(settings.options.indexOf("goldenAC"), 1);
        } else {
          settings.options.push("goldenAC");
        }
        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };
      listing.appendChild(a);

      // Create Wrath Cookies Button
      var a = document.createElement("a");
      a.className = `smallFancyButton prefButton option ${
        settings.options.indexOf("wrathAC") != -1 ? "" : " off"
      }`;
      a.innerText = `Wrath Cookies ${
        settings.options.indexOf("wrathAC") != -1 ? "on" : " off"
      }`;
      a.onclick = function () {
        if (settings.options.indexOf("wrathAC") != -1) {
          settings.options.splice(settings.options.indexOf("wrathAC"), 1);
        } else {
          settings.options.push("wrathAC");
        }
        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };
      listing.appendChild(a);

      // Create Reindeer Cookies Button
      var a = document.createElement("a");
      a.className = `smallFancyButton prefButton option ${
        settings.options.indexOf("reindeerAC") != -1 ? "" : " off"
      }`;
      a.innerText = ` Reindeer Cookies ${
        settings.options.indexOf("reindeerAC") != -1 ? "on" : " off"
      }`;
      a.onclick = function () {
        if (settings.options.indexOf("reindeerAC") != -1) {
          settings.options.splice(settings.options.indexOf("reindeerAC"), 1);
        } else {
          settings.options.push("reindeerAC");
        }
        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };
      listing.appendChild(a);
    }
    return listing;
  },
};

Game.registerMod("Auto click and buy Mod", ACABM);

/*
~_~

Notes 
# Grab upgrades by pool "",cookie,debug,kitten,prestige,tech,toggle
for (var i = 0; i < Game.UpgradesByPool[""].length; i++) {
let UGH = Game.UpgradesByPool[""][i];
console.log("Upgrade ID: " + UGH.id + " Upgrade Name " + UGH.name);
}

# Grab upgrades by Id
for (var i = 0; i < Object.keys(Game.UpgradesById).length; i++) {
let UGH = Game.UpgradesById[i];
console.log("Upgrade ID: " + UGH.id + " Upgrade Name " + UGH.name);
}
*/
