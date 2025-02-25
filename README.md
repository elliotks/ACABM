# 🍪 Cookie Clicker - Auto Click and Buy Mod

✔️ Achievements are **not** disabled with this mod.

This repo is the official repo for Cookie Clicker - Auto Click and Buy Mod.

If you own a copy of Cookie Clicker on Steam you can Subscribe at: [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=2823633161) for receiving the latest updates.

Want to use the Mod on Cookie Clicker Web Version?
https://orteil.dashnet.org/cookieclicker/

1. Open Developer Tools in your Web Browser (usually F12 works)
2. Click on the Console tab
3. Copy and paste the following script in the Console window

```
javascript:(function() {
    Game.LoadMod('https://elliotks.com/ACABM/autoclickandbuyMod/main.js');
}());
```
If above fails to load, try.
```
javascript:(function() {
    Game.LoadMod('https://cdn.jsdelivr.net/gh/elliotks/ACABM/autoclickandbuyMod/main.js');
}());

```

4. press enter.

## Features

- **Translations** - 🇬🇧 EN (English), 🇫🇷 FR (French), 🇩🇪 DE (German), 🇳🇱 NL (Dutch), 🇨🇿 CS (Czech), 🇵🇱 PL (Polish), 🇮🇹 IT (Italian), 🇪🇸 ES (Spanish), 🇧🇷 PT-BR (Portuguese), 🇯🇵 JA (Japanese), 🇨🇳 ZH-CN (Chinese), and 🇷🇺 RU (Russian)
- **Auto-Click BigCookie** - option to adjust click speed from 50ms to 3,000ms (1000ms = 1second)
- **Auto-Click Special** (Shimmers) - Golden cookie, Reindeer, Wrath. This can now be customized further in the options menu.
- **Auto-Click BigCookie** - during frenzy/click frenzy.
- **Auto-Buy** - Buy "best CPS" buildings and upgrades (excluding **Vaulted**) automatically. You can also "Vault" (exclude) Tech upgrades and buildings so Auto-Buy does not buy them through the options menu. "Chocolate Egg" although considered an upgrade you can Vault once you unlock Inspired Checklist, I manually added it in the mod Options menu to exclude from Auto-Buy.

  It does not just "buy" buildings/upgrades you can afford, but attempts to buy the best buildings/upgrades. If you do not see the script buying. It is waiting for the best option to become available. When the item is calculated to be available to purchase within 120 seconds, it will be added to queue for purchase.

- **Auto-Buy Protect** - Calculates Lucky and Frenzy requirements so that Auto-Buy doesn't go below them. If Auto-Buy seems "stuck" try disabling this feature.
- **Auto Fortune** - Auto click on News ticker fortunes.
- **Auto Wrinklers** - Pop the single fattest normal (excluding Shiny) wrinkler if you are at your max. This can now be customized further in the options menu to choose your Max Wrinkler count and include Shiny if needed.
- **AutoPet Krumblor** - Pets Krumblor when you reach lvl 4 to unlock Dragon drops. Krumblor's Menu must be open. Turns off if you have all 4 drops.
- **Ascend Luck** - Used for unlocking Lucky digit, Lucky number, and Lucky payout. Automatically Ascends you when conditions are met and toggles this feature to off. Turn back on manually if you have more to unlock. Does not buy the Heavenly upgrade for you.
- **Hotkeys (Keyboard Shortcuts)** - This option allows you to change settings via keyboard. Enable/Disable in the Options menu for the mod.
- **Sell All** - Adds a "Sell All" Button to the store that sells all buildings, with option to Ascend after selling.

## Notes

- When you start the mod, all options will be Off. To enable / disable please use the Options menu - mod options are saved, so when you reload the game your previously enabled options will be enabled automatically.
- After you Ascend and buying 1 each is too slow, you can change the buy amount to 100 or 10 until buying "slows down" then change back to 1. This option is available naively above the Buildings
- This is a stand-alone mod that does not rely on CCES. If you use CCES and encounter an issue with this mod, please let me know.
