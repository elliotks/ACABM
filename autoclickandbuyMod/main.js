/**
 * @file Auto Click and Buy Mod for Cookie Clicker.
 * @version 2.39
 * @license GPLv3-or-later https://www.gnu.org/licenses/gpl-3.0.html
 * @see {@link https://steamcommunity.com/sharedfiles/filedetails/?id=2823633161&tscn=1690261417 Steam Workshop}
 * @description This file contains the implementation of the Auto Click and Buy Mod for Cookie Clicker. The mod provides several features such as AutoClick BigCookie, AutoClick Special (Shimmers), AutoClick BigCookie during frenzy/click frenzy, AutoBuy, AutoBuy Protect, Auto Fortune, Auto Wrinklers, AutoPet Krumblor, Ascend Luck, Season, and Hotkeys. The mod also provides an options menu to customize the features. The implementation uses an Immediately Invoked Function Expression (IIFE) to avoid polluting the global namespace. The mod initializes by adding a menu to the game and overriding the UpdateMenu function. The menu is created using a dictionary that maps the feature names to their descriptions and values. The mod also defines default settings and their keys.
 */

// IIFE to avoid polluting global namespace
(function () {
  "use strict";

  // Define a constant called ACABMTranslations that contains an object with translations for the Auto click and buy mod.
  // The object contains translations for the following languages:
  // EN (English), FR (French), DE (German), NL (Dutch), CS (Czech), PL (Polish), IT (Italian), ES (Spanish), PT-BR (Portuguese), JA (Japanese), ZH-CN (Chinese), and RU (Russian).
  // Some translations contain placeholders for dynamic values such as {0} and {1}. Please retain these placeholders when translating to other languages.
  // Also \"{0}\" and \"{1}\" are used to escape the double quotes in the translations.
  const ACABMTranslations = {
    EN: {
      // English translations
      optionOn: "ON",
      optionOff: "OFF",
      optionExpand: "Expand Options",
      optionCollapse: "Collapse Options",
      mainName: "Auto-Click",
      mainDescription: "Auto-clicks BigCookie. Auto-click speed 1000ms = 1 second",
      mainSDescription: "Auto-click speed",
      mainhotkeyIncrease: "Increase Auto-Click Speed",
      mainhotkeyDecrease: "Decrease Auto-Click Speed",
      autobuyName: "Auto-Buy",
      autobuyDescription: "Buy 'best CPS' buildings and upgrades automatically. Status shown below when enabled.",
      autobuyMR: "Manual Refresh",
      autobuyMRDescription: "Manually refresh the AutoBuy status message, if needed.",
      autobuyMWaiting: "Waiting ( {0} ) for: \"{1}\"", // {0} is the time, {1} is the item
      autobuyMWaitingLong: "Auto-Buy wants to buy: \"{0}\", but the wait time is: {1}", // {0} is the item, {1} is the time
      autobuyMBuying: "Buying: \"{0}\"", // {0} is the item
      autobuyMHour: "{0} hour", // {0} is the time
      autobuyMHours: "{0} hours", // {0} is the time
      autobuyMMinute: "{0} minute", // {0} is the time
      autobuyMMinutes: "{0} minutes", // {0} is the time
      autobuyMSecond: "{0} second", // {0} is the time
      autobuyMSeconds: "{0} seconds", // {0} is the time
      autobuyVUName: "Vault Upgrades",
      autobuyVUDescription: "While Enabled the upgrade will be removed from the AutoBuy pool. This is for people who did not get the Inspired Checklist upgrade yet to Vault upgrades. This is a static list, if you want more added submit a comment on the Steam Workshop mod site.",
      autobuyVTUName: "Vault Tech Upgrades",
      autobuyVTUDescription: "While Enabled the tech upgrade will be removed from the AutoBuy pool.",
      autobuyVBName: "Vault Buildings",
      autobuyVBDescription: "While Enabled the building will be removed from the AutoBuy pool.",
      protectName: "Auto-Buy Protect",
      protectDescription: "Calculates Lucky and Frenzy requirements so that autobuy doesn't go below them. If Autobuy seems stuck try disabling this feature.",
      goldName: "Auto-Click Special",
      goldDescription: "Auto-click Golden Cookie, Reindeer, Wrath.",
      frenzyName: "Auto-Click Frenzy",
      frenzyDescription: "Auto-click BigCookie during frenzy/click frenzy, not needed if you already use the main 'AutoClick' feature.",
      fortuneName: "Auto Fortune",
      fortuneDescription: "Auto-click on News ticker fortunes.",
      ascendluckName: "Ascend Luck",
      ascendluckDescription: "Used for unlocking Lucky digit, Lucky number, and Lucky payout. Automatically Ascends you when conditions are met and toggles this feature to off. Turn back on manually if you have more to unlock. Does not buy the Heavenly upgrade for you.",
      ascendluckMReq: "You need to own Heavenly Upgrade(s):",
      ascendluckMReqHU: "You do not own the following required Heavenly Upgrade(s):",
      ascendluckMReqEnd: "to use this feature.",
      ascendluckMCompleted: "You have unlocked all Ascend Luck upgrades:",
      ascendluckMAnd: "and", // & and are different in some languages, so this is a placeholder for the word "and"
      ascendluckMOne7: "Waiting for prestige level to contain one(1) 7",
      ascendluckMTwo7: "Waiting for prestige level to contain two(2) 7's",
      ascendluckMFour7: "Waiting for prestige level to contain four(4) 7's",
      wrinklersName: "Auto Wrinklers",
      wrinklersDescription: "Auto Pop Wrinklers when reach the max amount set. Default is wait until max amount of Wrinklers, exclude Shiny.",
      wrinklersSDescription: "Max Wrinklers to keep",
      statusName: "Status popup",
      statusDescription: "Shows the status of the mod, and if Auto-Buy has an item queued.",
      popSWName: "Pop Shiny Wrinklers",
      popSWDescription: "Auto Pop Shiny Wrinklers",
      krumblorName: "Auto-Pet Krumblor",
      krumblorDescription: "Pets Krumblor when you reach lvl 4 to unlock Dragon drops. Krumblor's Menu must be open and own the Heavenly Upgrade 'Pet the dragon'. Turns off if you have all 4 drops, or do not meet the requirements.",
      krumblorMReq: "You do not meet the following requirements to Pet Krumblor:",
      krumblorMReqHU: "You do not own Heavenly Upgrade:",
      krumblorMReqMenu: "Krumblor menu is not open.",
      krumblorMReqDL: "Dragon level is under 4.",
      krumblorMReqEnd: "Turn the option back on once you fulfill these requirements.",
      krumblorMCompleted: "You have unlocked all Krumblor upgrades:",
      krumblorMRUnlocks: "Petting Krumblor for the remaining unlock(s):",
      hotkeysName: "Hotkeys",
      hotkeysDescription: "Allows you to use the old way of using the mod with hotkeys. New features will not have hotkeys.",
      hotkeysmenuTitle: "Keyboard Shortcuts",
      goldenACName: "Golden Cookies",
      goldenACDescription: "While enabled Golden Cookies will be clicked",
      wrathACName: "Wrath Cookies",
      wrathACDescription: "While enabled Wrath Cookies will be clicked",
      wrathACSName: "Skip Forced Wrath",
      wrathACSDescription: "While enabled Wrath Cookies with Forced Wrath (High % of receiving negative effects) will not be clicked",
      reindeerACName: "Reindeer Cookies",
      reindeerACDescription: "While enabled Reindeer Cookies will be clicked",
      notifyName: "Auto click and buy loaded!",
      notifyDescriptionText: "Turn settings On/Off in the",
      notifyDescriptionLink: "Options",
      notifyDescriptionMenu: "Menu.",
    },
    FR: {
      // French translations
      optionOn: "ACTIVÉ",
      optionOff: "DÉSACTIVÉ",
      optionExpand: "Développer les options",
      optionCollapse: "Réduire les options",
      mainName: "Clic Automatique",
      mainDescription: "Clique automatiquement sur le Gros Cookie. Vitesse de clic automatique 1000 ms = 1 seconde",
      mainSDescription: "Vitesse de clic automatique",
      mainhotkeyIncrease: "Augmenter la vitesse de clic automatique",
      mainhotkeyDecrease: "Diminuer la vitesse de clic automatique",
      autobuyName: "Achat Automatique",
      autobuyDescription: "Achète automatiquement les bâtiments et améliorations avec le meilleur CPS. Statut affiché ci-dessous lorsque activé.",
      autobuyMR: "Rafraîchissement Manuel",
      autobuyMRDescription: "Rafraîchir manuellement le message de statut de l'Achat Automatique, si nécessaire.",
      autobuyMWaiting: "En attente ( {0} ) pour: \"{1}\"", // {0} est le temps, {1} est l'élément
      autobuyMWaitingLong: "Auto-Achat veut acheter: \"{0}\" mais le temps d'attente est: {1}", // {0} est l'élément, {1} est le temps
      autobuyMBuying: "Achat: \"{0}\"", // {0} est l'élément
      autobuyMHour: "{0} heure", // {0} est le temps
      autobuyMHours: "{0} heures", // {0} est le temps
      autobuyMMinute: "{0} minute", // {0} est le temps
      autobuyMMinutes: "{0} minutes", // {0} est le temps
      autobuyMSecond: "{0} seconde", // {0} est le temps
      autobuyMSeconds: "{0} secondes", // {0} est le temps      
      autobuyVUName: "Mises à jour de la Voûte",
      autobuyVUDescription: "Lorsqu'activé, la mise à jour sera retirée du pool d'Achat Automatique. Pour ceux qui n'ont pas encore obtenu la mise à jour Inspirée pour Voûter les améliorations. C'est une liste statique, si vous voulez ajouter plus, soumettez un commentaire sur le site du mod Workshop Steam.",
      autobuyVTUName: "Mises à jour Tech de la Voûte",
      autobuyVTUDescription: "Lorsqu'activé, la mise à jour technique sera retirée du pool d'Achat Automatique.",
      autobuyVBName: "Bâtiments de la Voûte",
      autobuyVBDescription: "Lorsqu'activé, le bâtiment sera retiré du pool d'Achat Automatique.",
      protectName: "Protection Achat Automatique",
      protectDescription: "Calcule les exigences de Chance et de Frenzy pour que l'achat automatique ne descende pas en dessous. Si l'Achat Automatique semble bloqué, essayez de désactiver cette fonction.",
      goldName: "Clic Spécial Automatique",
      goldDescription: "Clique automatiquement sur le Cookie Doré, Renne, Colère.",
      frenzyName: "Folie du Clic Automatique",
      frenzyDescription: "Clique automatiquement sur le Gros Cookie pendant la folie/clic de folie, inutile si vous utilisez déjà la fonction 'AutoClic'.",
      fortuneName: "Fortune Automatique",
      fortuneDescription: "Clique automatiquement sur les fortunes de la bande de nouvelles.",
      ascendluckName: "Chance d'Ascension",
      ascendluckDescription: "Utilisé pour débloquer le chiffre Chanceux, le numéro Chanceux, et le paiement Chanceux. Vous fait Ascendre automatiquement lorsque les conditions sont remplies et désactive cette fonction. Réactivez manuellement si vous avez plus à débloquer. N'achète pas la mise à jour Céleste pour vous.",
      ascendluckMReq: "Vous devez posséder la(les) mise(s) à jour Céleste(s):",
      ascendluckMReqHU: "Vous ne possédez pas la(les) mise(s) à jour Céleste(s) suivante(s):",
      ascendluckMReqEnd: "pour utiliser cette fonction.",
      ascendluckMCompleted: "Vous avez débloqué toutes les mises à jour de Chance d'Ascension:",
      ascendluckMAnd: "et",
      ascendluckMOne7: "En attente que le niveau de prestige contienne un (1) 7",
      ascendluckMTwo7: "En attente que le niveau de prestige contienne deux (2) 7",
      ascendluckMFour7: "En attente que le niveau de prestige contienne quatre (4) 7",
      wrinklersName: "Rides Automatiques",
      wrinklersDescription: "Fait éclater les Rides automatiquement lorsqu'ils atteignent le nombre maximal défini. Par défaut, attendez jusqu'au nombre maximal de Rides, à l'exclusion des Brillants.",
      wrinklersSDescription: "Nombre maximal de Rides à garder",
      statusName: "Popup de statut",
      statusDescription: "Affiche le statut du mod, et si l'Achat Automatique a un objet en file d'attente.",
      popSWName: "Faire éclater les Rides Brillants",
      popSWDescription: "Fait éclater automatiquement les Rides Brillants",
      krumblorName: "Krumblor Automatique",
      krumblorDescription: "Caresse Krumblor lorsque vous atteignez le niveau 4 pour débloquer les gouttes de Dragon. Le menu de Krumblor doit être ouvert et posséder la mise à jour Céleste 'Caresser le dragon'. Se désactive si vous avez toutes les 4 gouttes, ou si vous ne répondez pas aux exigences.",
      krumblorMReq: "Vous ne répondez pas aux exigences suivantes pour caresser Krumblor:",
      krumblorMReqHU: "Vous ne possédez pas la mise à jour Céleste:",
      krumblorMReqMenu: "Le menu de Krumblor n'est pas ouvert.",
      krumblorMReqDL: "Le niveau du dragon est inférieur à 4.",
      krumblorMReqEnd: "Réactivez l'option une fois que vous remplissez ces exigences.",
      krumblorMCompleted: "Vous avez débloqué toutes les mises à jour de Krumblor:",
      krumblorMRUnlocks: "Caresser Krumblor pour le(s) déblocage(s) restant(s):",
      hotkeysName: "Raccourcis",
      hotkeysDescription: "Permet d'utiliser l'ancienne manière d'utiliser le mod avec des raccourcis. Les nouvelles fonctionnalités n'auront pas de raccourcis.",
      hotkeysmenuTitle: "Raccourcis Clavier",
      goldenACName: "Cookies Dorés",
      goldenACDescription: "Lorsqu'activé, les Cookies Dorés seront cliqués",
      wrathACName: "Cookies de Colère",
      wrathACDescription: "Lorsqu'activé, les Cookies de Colère seront cliqués",
      wrathACSName: "Ignorer la Colère Forcée",
      wrathACSDescription: "Lorsqu'activé, les Cookies de Colère avec Colère Forcée (haut % de recevoir des effets négatifs) ne seront pas cliqués",
      reindeerACName: "Cookies Rennes",
      reindeerACDescription: "Lorsqu'activé, les Cookies Rennes seront cliqués",
      notifyName: "Auto clic et achat chargé !",
      notifyDescriptionText: "Activer/Désactiver les paramètres dans les",
      notifyDescriptionLink: "Options",
      notifyDescriptionMenu: "Menu.",      
    },
    DE: {
      // German translations
      optionOn: "EIN",
      optionOff: "AUS",
      optionExpand: "Optionen erweitern",
      optionCollapse: "Optionen einklappen",
      mainName: "Auto-Klick",
      mainDescription: "Automatisches Klicken auf den Großen Keks. Klickgeschwindigkeit 1000ms = 1 Sekunde",
      mainSDescription: "Klickgeschwindigkeit",
      mainhotkeyIncrease: "Klickgeschwindigkeit erhöhen",
      mainhotkeyDecrease: "Klickgeschwindigkeit verringern",
      autobuyName: "Auto-Kauf",
      autobuyDescription: "Kauft automatisch die Gebäude und Upgrades mit dem besten KPS (Kekse pro Sekunde). Status wird unten angezeigt, wenn aktiviert.",
      autobuyMR: "Manuelles Aktualisieren",
      autobuyMRDescription: "Manuelles Aktualisieren der Auto-Kauf Statusnachricht, falls nötig.",
      autobuyMWaiting: "Warten ( {0} ) auf: \"{1}\"", // {0} ist die Zeit, {1} ist das Item
      autobuyMWaitingLong: "Auto-Kauf möchte kaufen: \"{0}\", aber die Wartezeit beträgt: {1}", // {0} ist das Item, {1} ist die Zeit
      autobuyMBuying: "Kaufe: \"{0}\"", // {0} ist das Item
      autobuyMHour: "{0} Stunde", // {0} ist die Zeit
      autobuyMHours: "{0} Stunden", // {0} ist die Zeit
      autobuyMMinute: "{0} Minute", // {0} ist die Zeit
      autobuyMMinutes: "{0} Minuten", // {0} ist die Zeit
      autobuyMSecond: "{0} Sekunde", // {0} ist die Zeit
      autobuyMSeconds: "{0} Sekunden", // {0} ist die Zeit      
      autobuyVUName: "Upgrades einlagern",
      autobuyVUDescription: "Wenn aktiviert, wird das Upgrade aus dem Auto-Kauf Pool entfernt. Dies ist für Spieler, die das Upgrade 'Inspirierter Checklisten' noch nicht erhalten haben, um Upgrades einzulagern. Dies ist eine statische Liste, wenn du mehr hinzugefügt haben möchtest, hinterlasse einen Kommentar auf der Steam Workshop Mod-Seite.",
      autobuyVTUName: "Technik-Upgrades einlagern",
      autobuyVTUDescription: "Wenn aktiviert, wird das Technik-Upgrade aus dem Auto-Kauf Pool entfernt.",
      autobuyVBName: "Gebäude einlagern",
      autobuyVBDescription: "Wenn aktiviert, wird das Gebäude aus dem Auto-Kauf Pool entfernt.",
      protectName: "Auto-Kauf Schutz",
      protectDescription: "Berechnet Glück und Raserei Anforderungen, damit Auto-Kauf nicht darunter fällt. Wenn Auto-Kauf stecken zu scheinen scheint, versuche diese Funktion zu deaktivieren.",
      goldName: "Spezial Auto-Klick",
      goldDescription: "Automatisches Klicken auf Goldene Kekse, Rentiere, Zornkekse.",
      frenzyName: "Raserei Auto-Klick",
      frenzyDescription: "Automatisches Klicken auf den Großen Keks während einer Raserei/Klickraserei, nicht nötig, wenn du bereits die Haupt-'AutoKlick'-Funktion verwendest.",
      fortuneName: "Auto-Glück",
      fortuneDescription: "Automatisches Klicken auf Nachrichten-Ticker Glücksfälle.",
      ascendluckName: "Aufstiegs-Glück",
      ascendluckDescription: "Verwendet, um Glückszahl, Glücksziffer und Glücksauszahlung freizuschalten. Steigt automatisch auf, wenn Bedingungen erfüllt sind und schaltet diese Funktion aus. Manuell wieder einschalten, wenn du mehr freischalten musst. Kauft nicht das himmlische Upgrade für dich.",
      ascendluckMReq: "Du musst das/die himmlische(n) Upgrade(s) besitzen:",
      ascendluckMReqHU: "Du besitzt folgendes erforderliche(s) himmlische(s) Upgrade(s) nicht:",
      ascendluckMReqEnd: "um diese Funktion zu nutzen.",
      ascendluckMCompleted: "Du hast alle Aufstiegs-Glück Upgrades freigeschaltet:",
      ascendluckMAnd: "und",
      ascendluckMOne7: "Warten darauf, dass die Prestigestufe eine(1) 7 enthält",
      ascendluckMTwo7: "Warten darauf, dass die Prestigestufe zwei(2) 7er enthält",
      ascendluckMFour7: "Warten darauf, dass die Prestigestufe vier(4) 7er enthält",
      wrinklersName: "Auto-Wrinklers",
      wrinklersDescription: "Lässt Wrinklers automatisch platzen, wenn die maximale Anzahl erreicht ist. Standardmäßig warten, bis die maximale Anzahl an Wrinklers erreicht ist, ausgenommen Glänzende.",
      wrinklersSDescription: "Maximale Anzahl von Wrinklers zum Behalten",
      statusName: "Status-Popup",
      statusDescription: "Zeigt den Status des Mods und ob Auto-Kauf ein Element in der Warteschlange hat.",
      popSWName: "Glänzende Wrinklers platzen lassen",
      popSWDescription: "Lässt glänzende Wrinklers automatisch platzen",
      krumblorName: "Auto-Krumblor",
      krumblorDescription: "Streichelt Krumblor, wenn du Stufe 4 erreichst, um Drachentropfen freizuschalten. Krumblors Menü muss geöffnet sein und das himmlische Upgrade 'Den Drachen streicheln' besitzen. Schaltet sich aus, wenn du alle 4 Tropfen hast oder die Anforderungen nicht erfüllst.",
      krumblorMReq: "Du erfüllst nicht die folgenden Anforderungen, um Krumblor zu streicheln:",
      krumblorMReqHU: "Du besitzt das himmlische Upgrade nicht:",
      krumblorMReqMenu: "Krumblors Menü ist nicht geöffnet.",
      krumblorMReqDL: "Drachenlevel ist unter 4.",
      krumblorMReqEnd: "Schalte die Option wieder ein, sobald du diese Anforderungen erfüllst.",
      krumblorMCompleted: "Du hast alle Krumblor-Upgrades freigeschaltet:",
      krumblorMRUnlocks: "Krumblor streicheln für die verbleibende(n) Freischaltung(en):",
      hotkeysName: "Hotkeys",
      hotkeysDescription: "Ermöglicht die Verwendung der alten Methode, das Mod mit Hotkeys zu benutzen. Neue Funktionen haben keine Hotkeys.",
      hotkeysmenuTitle: "Tastaturkürzel",
      goldenACName: "Goldene Kekse",
      goldenACDescription: "Wenn aktiviert, werden Goldene Kekse angeklickt",
      wrathACName: "Zornkekse",
      wrathACDescription: "Wenn aktiviert, werden Zornkekse angeklickt",
      wrathACSName: "Erzwungenen Zorn überspringen",
      wrathACSDescription: "Wenn aktiviert, werden Zornkekse mit erzwungenem Zorn (hohe % negativer Effekte) nicht angeklickt",
      reindeerACName: "Rentierkekse",
      reindeerACDescription: "Wenn aktiviert, werden Rentierkekse angeklickt",
      notifyName: "Auto-Klick und -Kauf geladen!",
      notifyDescriptionText: "Einstellungen Ein/Aus im",
      notifyDescriptionLink: "Optionen",
      notifyDescriptionMenu: "Menü.",
    },    
    NL: {
      // Dutch translations
      optionOn: "AAN",
      optionOff: "UIT",
      optionExpand: "Opties uitbreiden",
      optionCollapse: "Opties inklappen",
      mainName: "Auto-Klik",
      mainDescription: "Klikt automatisch op de Grote Koek. Kliksnelheid 1000ms = 1 seconde",
      mainSDescription: "Kliksnelheid",
      mainhotkeyIncrease: "Verhoog Auto-Kliksnelheid",
      mainhotkeyDecrease: "Verlaag Auto-Kliksnelheid",
      autobuyName: "Auto-Koop",
      autobuyDescription: "Koopt automatisch de 'beste CPS' gebouwen en upgrades. Status wordt hieronder weergegeven indien ingeschakeld.",
      autobuyMR: "Handmatige Verversing",
      autobuyMRDescription: "Ververs de Auto-Koop statusmelding handmatig indien nodig.",
      autobuyMWaiting: "Wachten ( {0} ) voor: \"{1}\"", // {0} is de tijd, {1} is het item
      autobuyMWaitingLong: "Auto-Koop wil kopen: \"{0}\" maar de wachttijd is: {1}", // {0} is het item, {1} is de tijd
      autobuyMBuying: "Kopen: \"{0}\"", // {0} is het item
      autobuyMHour: "{0} uur", // {0} is de tijd
      autobuyMHours: "{0} uren", // {0} is de tijd
      autobuyMMinute: "{0} minuut", // {0} is de tijd
      autobuyMMinutes: "{0} minuten", // {0} is de tijd
      autobuyMSecond: "{0} seconde", // {0} is de tijd
      autobuyMSeconds: "{0} seconden", // {0} is de tijd
      autobuyVUName: "Kluis Upgrades",
      autobuyVUDescription: "Indien ingeschakeld wordt de upgrade uit de Auto-Koop pool verwijderd. Dit is voor mensen die de 'Geïnspireerde Checklist' upgrade nog niet hebben om upgrades in de kluis te plaatsen. Dit is een statische lijst, als je meer toegevoegd wilt hebben, plaats dan een opmerking op de Steam Workshop mod site.",
      autobuyVTUName: "Technische Kluis Upgrades",
      autobuyVTUDescription: "Indien ingeschakeld wordt de technische upgrade uit de Auto-Koop pool verwijderd.",
      autobuyVBName: "Kluis Gebouwen",
      autobuyVBDescription: "Indien ingeschakeld wordt het gebouw uit de Auto-Koop pool verwijderd.",
      protectName: "Auto-Koop Bescherming",
      protectDescription: "Berekent Lucky en Frenzy vereisten zodat auto-koop niet onder deze waarden komt. Als Auto-Koop vast lijkt te zitten, probeer dan deze functie uit te schakelen.",
      goldName: "Auto-Klik Speciaal",
      goldDescription: "Klikt automatisch op Gouden Koekje, Rendier, Toornkoekjes.",
      frenzyName: "Auto-Klik Frenzy",
      frenzyDescription: "Klikt automatisch op Grote Koek tijdens frenzy/klik frenzy, niet nodig als je al de hoofd 'AutoKlik' functie gebruikt.",
      fortuneName: "Auto Fortuin",
      fortuneDescription: "Klikt automatisch op Nieuws ticker fortuinen.",
      ascendluckName: "Opstijgen Geluk",
      ascendluckDescription: "Gebruikt voor het ontgrendelen van Gelukkig getal, Gelukkig nummer, en Gelukkige uitbetaling. Laat je automatisch opstijgen wanneer de voorwaarden zijn voldaan en schakelt deze functie uit. Zet handmatig weer aan als je meer te ontgrendelen hebt. Koopt niet de Hemelse upgrade voor jou.",
      ascendluckMReq: "Je moet de volgende Hemelse Upgrade(s) bezitten:",
      ascendluckMReqHU: "Je bezit niet de volgende vereiste Hemelse Upgrade(s):",
      ascendluckMReqEnd: "om deze functie te gebruiken.",
      ascendluckMCompleted: "Je hebt alle Opstijgen Geluk upgrades ontgrendeld:",
      ascendluckMAnd: "en",
      ascendluckMOne7: "Wachten tot prestige niveau één (1) 7 bevat",
      ascendluckMTwo7: "Wachten tot prestige niveau twee (2) 7's bevat",
      ascendluckMFour7: "Wachten tot prestige niveau vier (4) 7's bevat",
      wrinklersName: "Auto-Wrinklers",
      wrinklersDescription: "Laat Wrinklers automatisch knappen wanneer het maximale aantal is bereikt. Standaard wachten tot het maximale aantal Wrinklers, exclusief Glanzende.",
      wrinklersSDescription: "Max Wrinklers om te bewaren",
      statusName: "Status popup",
      statusDescription: "Toont de status van de mod, en of Auto-Koop een item in de wachtrij heeft.",
      popSWName: "Glanzende Wrinklers laten knappen",
      popSWDescription: "Laat Glanzende Wrinklers automatisch knappen",
      krumblorName: "Auto-Krumblor",
      krumblorDescription: "Aait Krumblor wanneer je niveau 4 bereikt om Drakendruppels te ontgrendelen. Krumblors Menu moet open zijn en het Hemelse Upgrade 'Aai de draak' bezitten. Schakelt uit als je alle 4 druppels hebt, of niet aan de vereisten voldoet.",
      krumblorMReq: "Je voldoet niet aan de volgende vereisten om Krumblor te aaien:",
      krumblorMReqHU: "Je bezit de Hemelse Upgrade niet:",
      krumblorMReqMenu: "Krumblors menu is niet geopend.",
      krumblorMReqDL: "Drakenniveau is onder 4.",
      krumblorMReqEnd: "Zet de optie weer aan zodra je aan deze vereisten voldoet.",
      krumblorMCompleted: "Je hebt alle Krumblor upgrades ontgrendeld:",
      krumblorMRUnlocks: "Krumblor aaien voor de resterende ontgrendeling(en):",
      hotkeysName: "Sneltoetsen",
      hotkeysDescription: "Staat je toe om de oude manier van het mod gebruiken met sneltoetsen te gebruiken. Nieuwe functies zullen geen sneltoetsen hebben.",
      hotkeysmenuTitle: "Toetsenbord Sneltoetsen",
      goldenACName: "Gouden Koekjes",
      goldenACDescription: "Indien ingeschakeld worden Gouden Koekjes geklikt",
      wrathACName: "Toorn Koekjes",
      wrathACDescription: "Indien ingeschakeld worden Toorn Koekjes geklikt",
      wrathACSName: "Geforceerde Toorn overslaan",
      wrathACSDescription: "Indien ingeschakeld worden Toorn Koekjes met Geforceerde Toorn (hoge % van negatieve effecten) niet geklikt",
      reindeerACName: "Rendier Koekjes",
      reindeerACDescription: "Indien ingeschakeld worden Rendier Koekjes geklikt",
      notifyName: "Auto-klik en koop geladen!",
      notifyDescriptionText: "Zet instellingen Aan/Uit in de",
      notifyDescriptionLink: "Opties",
      notifyDescriptionMenu: "Menu.",
    },
    CS: {
      // Czech translations
      optionOn: "ZAPNUTO",
      optionOff: "VYPNUTO",
      optionExpand: "Rozbalit možnosti",
      optionCollapse: "Sbalit možnosti",
      mainName: "Auto-Klik",
      mainDescription: "Automatické klikání na Velké sušenky. Rychlost auto-kliku 1000ms = 1 sekunda",
      mainSDescription: "Rychlost auto-kliku",
      mainhotkeyIncrease: "Zvýšit rychlost auto-kliku",
      mainhotkeyDecrease: "Snížit rychlost auto-kliku",
      autobuyName: "Auto-Koupě",
      autobuyDescription: "Automaticky kupuje budovy a vylepšení s nejlepším CPS. Stav zobrazen níže, když aktivováno.",
      autobuyMR: "Ruční obnovení",
      autobuyMRDescription: "Manuálně obnovit stavovou zprávu Auto-Koupě, pokud je to potřeba.",
      autobuyMWaiting: "Čekání ( {0} ) na: \"{1}\"", // {0} je čas, {1} je položka
      autobuyMWaitingLong: "Auto-Nákup chce koupit: \"{0}\", ale doba čekání je: {1}", // {0} je položka, {1} je čas
      autobuyMBuying: "Kupuji: \"{0}\"", // {0} je položka
      autobuyMHour: "{0} hodina", // {0} je čas
      autobuyMHours: "{0} hodin", // {0} je čas
      autobuyMMinute: "{0} minuta", // {0} je čas
      autobuyMMinutes: "{0} minut", // {0} je čas
      autobuyMSecond: "{0} sekunda", // {0} je čas
      autobuyMSeconds: "{0} sekund", // {0} je čas      
      autobuyVUName: "Uložení Vylepšení",
      autobuyVUDescription: "Když aktivováno, vylepšení bude odstraněno z poolu Auto-Koupě. Pro ty, kteří ještě nezískali vylepšení Inspirativní kontrolní seznam pro uložení vylepšení. Jedná se o statický seznam, pokud chcete přidat další, zanechte komentář na stránce modu ve Steam Workshop.",
      autobuyVTUName: "Uložení Technických Vylepšení",
      autobuyVTUDescription: "Když aktivováno, technické vylepšení bude odstraněno z poolu Auto-Koupě.",
      autobuyVBName: "Uložení Budov",
      autobuyVBDescription: "Když aktivováno, budova bude odstraněna z poolu Auto-Koupě.",
      protectName: "Ochrana Auto-Koupě",
      protectDescription: "Vypočítá požadavky pro Lucky a Frenzy, aby auto-koupě nespadla pod tyto hodnoty. Pokud se zdá, že Auto-Koupě uvízla, zkuste tuto funkci vypnout.",
      goldName: "Auto-Klik Speciály",
      goldDescription: "Automatické klikání na Zlaté sušenky, Sobíky, Wrath sušenky.",
      frenzyName: "Auto-Klik Frenzy",
      frenzyDescription: "Automatické klikání na Velkou sušenku během frenzy/klik frenzy, není potřeba, pokud už používáte hlavní funkci 'AutoKlik'.",
      fortuneName: "Auto-Fortuna",
      fortuneDescription: "Automatické klikání na Zprávy ticker fortuny.",
      ascendluckName: "Štěstí při Vzestupu",
      ascendluckDescription: "Používá se pro odemknutí Šťastné číslice, Šťastného čísla a Šťastné výplaty. Automaticky provede Vzestup, když jsou splněny podmínky a vypne tuto funkci. Zapněte znovu ručně, pokud máte další k odemčení. Nezakoupí za vás Nebeské vylepšení.",
      ascendluckMReq: "Musíte vlastnit Nebeská Vylepšení:",
      ascendluckMReqHU: "Nevlastníte následující požadovaná Nebeská Vylepšení:",
      ascendluckMReqEnd: "pro použití této funkce.",
      ascendluckMCompleted: "Odemkli jste všechna vylepšení Štěstí při Vzestupu:",
      ascendluckMAnd: "a",
      ascendluckMOne7: "Čekání na prestižní úroveň obsahující jednu(1) 7",
      ascendluckMTwo7: "Čekání na prestižní úroveň obsahující dvě(2) 7",
      ascendluckMFour7: "Čekání na prestižní úroveň obsahující čtyři(4) 7",
      wrinklersName: "Auto-Wrinklers",
      wrinklersDescription: "Automaticky praskne Wrinklers, když dosáhne maximálního množství nastaveného. Výchozí je čekat, dokud není dosaženo maximálního počtu Wrinklers, kromě Lesklých.",
      wrinklersSDescription: "Maximální Wrinklers k ponechání",
      statusName: "Popup Stavu",
      statusDescription: "Zobrazuje stav modu a zda Auto-Koupě má položku ve frontě.",
      popSWName: "Prasknout Lesklé Wrinklers",
      popSWDescription: "Automaticky praskne Lesklé Wrinklers",
      krumblorName: "Auto-Mazlení Krumblora",
      krumblorDescription: "Mazlí Krumblora, když dosáhnete úrovně 4, pro odemknutí Drakoních dropů. Menu Krumblora musí být otevřené a musíte vlastnit Nebeské vylepšení 'Pohladit draka'. Vypne se, pokud máte všechny 4 dropy, nebo nesplňujete požadavky.",
      krumblorMReq: "Nesplňujete následující požadavky pro Mazlení Krumblora:",
      krumblorMReqHU: "Nevlastníte Nebeské vylepšení:",
      krumblorMReqMenu: "Menu Krumblora není otevřené.",
      krumblorMReqDL: "Úroveň draka je pod 4.",
      krumblorMReqEnd: "Zapněte možnost znovu, jakmile splníte tyto požadavky.",
      krumblorMCompleted: "Odemkli jste všechny upgrade Krumblora:",
      krumblorMRUnlocks: "Mazlení Krumblora pro zbývající odemčení:",
      hotkeysName: "Horké klávesy",
      hotkeysDescription: "Umožňuje používat starý způsob ovládání modu pomocí horkých kláves. Nové funkce nebudou mít horké klávesy.",
      hotkeysmenuTitle: "Klávesové zkratky",
      goldenACName: "Zlaté Sušenky",
      goldenACDescription: "Když aktivováno, Zlaté Sušenky budou kliknuty",
      wrathACName: "Sušenky Hněvu",
      wrathACDescription: "Když aktivováno, Sušenky Hněvu budou kliknuty",
      wrathACSName: "Přeskočit Vynucený Hněv",
      wrathACSDescription: "Když aktivováno, Sušenky Hněvu s Vynuceným Hněvem (vysoké % negativních efektů) nebudou kliknuty",
      reindeerACName: "Sobí Sušenky",
      reindeerACDescription: "Když aktivováno, Sobí Sušenky budou kliknuty",
      notifyName: "Auto-klik a koupě nahrány!",
      notifyDescriptionText: "Zapněte/Vypněte nastavení v",
      notifyDescriptionLink: "Možnostech",
      notifyDescriptionMenu: "Menu.",
    },
    PL: {
      // Polish translations
      optionOn: "WŁĄCZONE",
      optionOff: "WYŁĄCZONE",
      optionExpand: "Rozwiń opcje",
      optionCollapse: "Zwiń opcje",
      mainName: "Auto-Klik",
      mainDescription: "Automatyczne klikanie na Duże Ciastko. Prędkość auto-klikania 1000ms = 1 sekunda",
      mainSDescription: "Prędkość auto-klikania",
      mainhotkeyIncrease: "Zwiększ prędkość auto-klikania",
      mainhotkeyDecrease: "Zmniejsz prędkość auto-klikania",
      autobuyName: "Auto-Kup",
      autobuyDescription: "Automatyczne kupowanie budynków i ulepszeń z najlepszym CPS. Stan pokazany poniżej po włączeniu.",
      autobuyMR: "Odświeżanie Ręczne",
      autobuyMRDescription: "Ręczne odświeżanie komunikatu o stanie Auto-Kup, jeśli jest to potrzebne.",
      autobuyMWaiting: "Oczekiwanie ( {0} ) na: \"{1}\"", // {0} to czas, {1} to przedmiot
      autobuyMWaitingLong: "Auto-Zakup chce kupić: \"{0}\", ale czas oczekiwania to: {1}", // {0} to przedmiot, {1} to czas
      autobuyMBuying: "Kupowanie: \"{0}\"", // {0} to przedmiot
      autobuyMHour: "{0} godzina", // {0} to czas
      autobuyMHours: "{0} godzin", // {0} to czas
      autobuyMMinute: "{0} minuta", // {0} to czas
      autobuyMMinutes: "{0} minut", // {0} to czas
      autobuyMSecond: "{0} sekunda", // {0} to czas
      autobuyMSeconds: "{0} sekund", // {0} to czas      
      autobuyVUName: "Przechowywanie Ulepszeń",
      autobuyVUDescription: "Po włączeniu ulepszenie zostanie usunięte z puli Auto-Kup. Dla osób, które nie zdobyły jeszcze ulepszenia 'Inspirowana Lista Kontrolna' do przechowywania ulepszeń. Jest to statyczna lista, jeśli chcesz dodać więcej, zostaw komentarz na stronie moda w Steam Workshop.",
      autobuyVTUName: "Przechowywanie Ulepszeń Technicznych",
      autobuyVTUDescription: "Po włączeniu ulepszenie techniczne zostanie usunięte z puli Auto-Kup.",
      autobuyVBName: "Przechowywanie Budynków",
      autobuyVBDescription: "Po włączeniu budynek zostanie usunięty z puli Auto-Kup.",
      protectName: "Ochrona Auto-Kup",
      protectDescription: "Oblicza wymagania dla Lucky i Frenzy, aby auto-kup nie spadło poniżej nich. Jeśli Auto-Kup wydaje się zablokowane, spróbuj wyłączyć tę funkcję.",
      goldName: "Auto-Klik Specjalny",
      goldDescription: "Automatyczne klikanie na Złote Ciasteczka, Renifery, Gniewne ciasteczka.",
      frenzyName: "Auto-Klik Frenzy",
      frenzyDescription: "Automatyczne klikanie na Duże Ciastko podczas frenzy/klik frenzy, niepotrzebne jeśli używasz już głównej funkcji 'AutoKlik'.",
      fortuneName: "Auto-Fortuna",
      fortuneDescription: "Automatyczne klikanie na wiadomości ticker fortun.",
      ascendluckName: "Szczęście Wzniesienia",
      ascendluckDescription: "Używane do odblokowania Szczęśliwej cyfry, Szczęśliwej liczby i Szczęśliwej wypłaty. Automatycznie Wznosi cię, gdy warunki są spełnione i wyłącza tę funkcję. Włącz ponownie ręcznie, jeśli masz więcej do odblokowania. Nie kupuje za ciebie ulepszenia Niebiańskiego.",
      ascendluckMReq: "Musisz posiadać Niebiańskie Ulepszenie(a):",
      ascendluckMReqHU: "Nie posiadasz następujących wymaganych Niebiańskich Ulepszeń:",
      ascendluckMReqEnd: "aby użyć tej funkcji.",
      ascendluckMCompleted: "Odblokowałeś wszystkie ulepszenia Szczęścia Wzniesienia:",
      ascendluckMAnd: "i",
      ascendluckMOne7: "Oczekiwanie na poziom prestiżu zawierający jedną(1) 7",
      ascendluckMTwo7: "Oczekiwanie na poziom prestiżu zawierający dwie(2) 7",
      ascendluckMFour7: "Oczekiwanie na poziom prestiżu zawierający cztery(4) 7",
      wrinklersName: "Auto-Wrinklers",
      wrinklersDescription: "Automatyczne pękanie Wrinklers, gdy osiągną maksymalną ilość. Domyślnie czeka, aż osiągną maksymalną ilość Wrinklers, z wyjątkiem Lśniących.",
      wrinklersSDescription: "Maksymalna liczba Wrinklers do zachowania",
      statusName: "Popup Statusu",
      statusDescription: "Pokazuje status moda i czy Auto-Kup ma przedmiot w kolejce.",
      popSWName: "Pękanie Lśniących Wrinklers",
      popSWDescription: "Automatyczne pękanie Lśniących Wrinklers",
      krumblorName: "Auto-Głaskanie Krumblora",
      krumblorDescription: "Głaskanie Krumblora, gdy osiągniesz poziom 4, aby odblokować krople Smoka. Menu Krumblora musi być otwarte i posiadać Niebiańskie Ulepszenie 'Głaskanie smoka'. Wyłącza się, jeśli masz wszystkie 4 krople lub nie spełniasz wymagań.",
      krumblorMReq: "Nie spełniasz następujących wymagań do Głaskania Krumblora:",
      krumblorMReqHU: "Nie posiadasz Niebiańskiego Ulepszenia:",
      krumblorMReqMenu: "Menu Krumblora nie jest otwarte.",
      krumblorMReqDL: "Poziom smoka jest poniżej 4.",
      krumblorMReqEnd: "Włącz opcję ponownie, gdy spełnisz te wymagania.",
      krumblorMCompleted: "Odblokowałeś wszystkie ulepszenia Krumblora:",
      krumblorMRUnlocks: "Głaskanie Krumblora dla pozostałych odblokowań:",
      hotkeysName: "Skróty klawiszowe",
      hotkeysDescription: "Pozwala na używanie moda w stary sposób za pomocą skrótów klawiszowych. Nowe funkcje nie będą miały skrótów klawiszowych.",
      hotkeysmenuTitle: "Skróty klawiaturowe",
      goldenACName: "Złote Ciasteczka",
      goldenACDescription: "Gdy włączone, Złote Ciasteczka będą klikane",
      wrathACName: "Ciasteczka Gniewu",
      wrathACDescription: "Gdy włączone, Ciasteczka Gniewu będą klikane",
      wrathACSName: "Pomiń Wymuszony Gniew",
      wrathACSDescription: "Gdy włączone, Ciasteczka Gniewu z Wymuszonym Gniewem (wysokie % negatywnych efektów) nie będą klikane",
      reindeerACName: "Ciasteczka Renifera",
      reindeerACDescription: "Gdy włączone, Ciasteczka Renifera będą klikane",
      notifyName: "Auto-klik i kup załadowane!",
      notifyDescriptionText: "Włącz/Wyłącz ustawienia w",
      notifyDescriptionLink: "Opcjach",
      notifyDescriptionMenu: "Menu.",
    },
    IT: {
      // Italian translations
      optionOn: "ACCESO",
      optionOff: "SPENTO",
      optionExpand: "Espandi Opzioni",
      optionCollapse: "Comprimi Opzioni",
      mainName: "Auto-Clic",
      mainDescription: "Clic automatico sul Grande Biscotto. Velocità di auto-clic 1000ms = 1 secondo",
      mainSDescription: "Velocità auto-clic",
      mainhotkeyIncrease: "Aumenta Velocità Auto-Clic",
      mainhotkeyDecrease: "Diminuisci Velocità Auto-Clic",
      autobuyName: "Auto-Acquisto",
      autobuyDescription: "Acquista automaticamente edifici e potenziamenti con il miglior CPS. Stato mostrato sotto quando attivato.",
      autobuyMR: "Aggiornamento Manuale",
      autobuyMRDescription: "Aggiorna manualmente il messaggio di stato dell'Auto-Acquisto, se necessario.",
      autobuyMWaiting: "In attesa ( {0} ) per: \"{1}\"", // {0} è il tempo, {1} è l'oggetto
      autobuyMWaitingLong: "Auto-Acquisto vuole comprare: \"{0}\" ma il tempo di attesa è: {1}", // {0} è l'oggetto, {1} è il tempo
      autobuyMBuying: "Acquisto: \"{0}\"", // {0} è l'oggetto
      autobuyMHour: "{0} ora", // {0} è il tempo
      autobuyMHours: "{0} ore", // {0} è il tempo
      autobuyMMinute: "{0} minuto", // {0} è il tempo
      autobuyMMinutes: "{0} minuti", // {0} è il tempo
      autobuyMSecond: "{0} secondo", // {0} è il tempo
      autobuyMSeconds: "{0} secondi", // {0} è il tempo
      autobuyVUName: "Potenziamenti Cassaforte",
      autobuyVUDescription: "Quando attivato, il potenziamento verrà rimosso dal pool di Auto-Acquisto. Per coloro che non hanno ancora ottenuto l'aggiornamento Ispirato per mettere in cassaforte i potenziamenti. Questa è una lista statica, se vuoi aggiungere altro invia un commento sul sito del mod di Steam Workshop.",
      autobuyVTUName: "Potenziamenti Tecnologici Cassaforte",
      autobuyVTUDescription: "Quando attivato, il potenziamento tecnologico verrà rimosso dal pool di Auto-Acquisto.",
      autobuyVBName: "Edifici Cassaforte",
      autobuyVBDescription: "Quando attivato, l'edificio verrà rimosso dal pool di Auto-Acquisto.",
      protectName: "Protezione Auto-Acquisto",
      protectDescription: "Calcola i requisiti di Lucky e Frenzy affinché l'auto-acquisto non scenda al di sotto di essi. Se l'Auto-Acquisto sembra bloccato, prova a disabilitare questa funzione.",
      goldName: "Auto-Clic Speciale",
      goldDescription: "Clic automatico su Biscotto Dorato, Renna, Ira.",
      frenzyName: "Auto-Clic Frenesia",
      frenzyDescription: "Clic automatico sul Grande Biscotto durante la frenesia/clic frenesia, non necessario se si utilizza già la funzione principale 'AutoClic'.",
      fortuneName: "Auto Fortuna",
      fortuneDescription: "Clic automatico sulle fortune del ticker delle notizie.",
      ascendluckName: "Fortuna dell'Ascensione",
      ascendluckDescription: "Utilizzato per sbloccare Cifra Fortunata, Numero Fortunato e Pagamento Fortunato. Ascende automaticamente quando le condizioni sono soddisfatte e disattiva questa funzione. Riattiva manualmente se hai altro da sbloccare. Non acquista l'aggiornamento Celeste per te.",
      ascendluckMReq: "Devi possedere l'Aggiornamento(i) Celeste(i):",
      ascendluckMReqHU: "Non possiedi il seguente Aggiornamento(i) Celeste(i) richiesto(i):",
      ascendluckMReqEnd: "per utilizzare questa funzione.",
      ascendluckMCompleted: "Hai sbloccato tutti gli aggiornamenti della Fortuna dell'Ascensione:",
      ascendluckMAnd: "e",
      ascendluckMOne7: "In attesa che il livello di prestigio contenga un(1) 7",
      ascendluckMTwo7: "In attesa che il livello di prestigio contenga due(2) 7",
      ascendluckMFour7: "In attesa che il livello di prestigio contenga quattro(4) 7",
      wrinklersName: "Auto-Wrinklers",
      wrinklersDescription: "Scoppia automaticamente i Wrinklers quando raggiungono il numero massimo impostato. Di default aspetta fino al numero massimo di Wrinklers, esclusi quelli Lucenti.",
      wrinklersSDescription: "Massimo Wrinklers da mantenere",
      statusName: "Popup di Stato",
      statusDescription: "Mostra lo stato del mod e se l'Auto-Acquisto ha un elemento in coda.",
      popSWName: "Scoppia Wrinklers Lucenti",
      popSWDescription: "Scoppia automaticamente i Wrinklers Lucenti",
      krumblorName: "Auto-Coccole Krumblor",
      krumblorDescription: "Coccola Krumblor quando raggiungi il livello 4 per sbloccare le gocce di Drago. Il menu di Krumblor deve essere aperto e possedere l'Aggiornamento Celeste 'Coccola il drago'. Si disattiva se hai tutte e 4 le gocce, o non soddisfi i requisiti.",
      krumblorMReq: "Non soddisfi i seguenti requisiti per Coccolare Krumblor:",
      krumblorMReqHU: "Non possiedi l'Aggiornamento Celeste:",
      krumblorMReqMenu: "Il menu di Krumblor non è aperto.",
      krumblorMReqDL: "Il livello del drago è inferiore a 4.",
      krumblorMReqEnd: "Riattiva l'opzione una volta soddisfatti questi requisiti.",
      krumblorMCompleted: "Hai sbloccato tutti gli aggiornamenti di Krumblor:",
      krumblorMRUnlocks: "Coccolare Krumblor per gli sbloccaggi rimanenti:",
      hotkeysName: "Tasti di Scelta Rapida",
      hotkeysDescription: "Consente di utilizzare il mod nel modo vecchio con i tasti di scelta rapida. Le nuove funzionalità non avranno tasti di scelta rapida.",
      hotkeysmenuTitle: "Scorciatoie da Tastiera",
      goldenACName: "Biscotti Dorati",
      goldenACDescription: "Quando attivato, i Biscotti Dorati saranno cliccati",
      wrathACName: "Biscotti dell'Ira",
      wrathACDescription: "Quando attivato, i Biscotti dell'Ira saranno cliccati",
      wrathACSName: "Salta Ira Forzata",
      wrathACSDescription: "Quando attivato, i Biscotti dell'Ira con Ira Forzata (alta % di effetti negativi) non saranno cliccati",
      reindeerACName: "Biscotti Renna",
      reindeerACDescription: "Quando attivato, i Biscotti Renna saranno cliccati",
      notifyName: "Auto-clic e acquisto caricati!",
      notifyDescriptionText: "Attiva/Disattiva le impostazioni nelle",
      notifyDescriptionLink: "Opzioni",
      notifyDescriptionMenu: "Menu.",
    },    
    ES: {
      // Spanish translations
      optionOn: "ACTIVADO",
      optionOff: "DESACTIVADO",
      optionExpand: "Expandir Opciones",
      optionCollapse: "Colapsar Opciones",
      mainName: "Auto-Clic",
      mainDescription: "Clic automático en el Gran Cookie. Velocidad de auto-clic 1000ms = 1 segundo",
      mainSDescription: "Velocidad de auto-clic",
      mainhotkeyIncrease: "Aumentar velocidad de auto-clic",
      mainhotkeyDecrease: "Disminuir velocidad de auto-clic",
      autobuyName: "Auto-Compra",
      autobuyDescription: "Compra automáticamente los edificios y mejoras con mejor CPS. Estado mostrado abajo cuando está habilitado.",
      autobuyMR: "Refresco Manual",
      autobuyMRDescription: "Refrescar manualmente el mensaje de estado de Auto-Compra, si es necesario.",
      autobuyMWaiting: "Esperando ( {0} ) por: \"{1}\"", // {0} es el tiempo, {1} es el artículo
      autobuyMWaitingLong: "Auto-Compra quiere comprar: \"{0}\" pero el tiempo de espera es: {1}", // {0} es el artículo, {1} es el tiempo
      autobuyMBuying: "Comprando: \"{0}\"", // {0} es el artículo
      autobuyMHour: "{0} hora", // {0} es el tiempo
      autobuyMHours: "{0} horas", // {0} es el tiempo
      autobuyMMinute: "{0} minuto", // {0} es el tiempo
      autobuyMMinutes: "{0} minutos", // {0} es el tiempo
      autobuyMSecond: "{0} segundo", // {0} es el tiempo
      autobuyMSeconds: "{0} segundos", // {0} es el tiempo
      autobuyVUName: "Mejoras en la Bóveda",
      autobuyVUDescription: "Cuando está habilitado, la mejora será eliminada del pool de Auto-Compra. Para aquellos que aún no han obtenido la mejora Inspirada para archivar mejoras. Esta es una lista estática, si quieres añadir más, envía un comentario en el sitio del mod en Steam Workshop.",
      autobuyVTUName: "Mejoras Tecnológicas en la Bóveda",
      autobuyVTUDescription: "Cuando está habilitado, la mejora tecnológica será eliminada del pool de Auto-Compra.",
      autobuyVBName: "Edificios en la Bóveda",
      autobuyVBDescription: "Cuando está habilitado, el edificio será eliminado del pool de Auto-Compra.",
      protectName: "Protección de Auto-Compra",
      protectDescription: "Calcula los requisitos de Lucky y Frenzy para que la auto-compra no caiga por debajo de ellos. Si Auto-Compra parece atascado, intenta desactivar esta función.",
      goldName: "Auto-Clic Especial",
      goldDescription: "Clic automático en Cookie Dorada, Reno, Ira.",
      frenzyName: "Auto-Clic Frenesí",
      frenzyDescription: "Clic automático en el Gran Cookie durante frenesí/clic frenesí, no necesario si ya usas la función principal 'AutoClic'.",
      fortuneName: "Auto Fortuna",
      fortuneDescription: "Clic automático en las fortunas del ticker de noticias.",
      ascendluckName: "Suerte de Ascensión",
      ascendluckDescription: "Usado para desbloquear Dígito de la suerte, Número de la suerte y Pago de la suerte. Asciende automáticamente cuando se cumplen las condiciones y desactiva esta función. Vuelve a activar manualmente si tienes más para desbloquear. No compra la mejora Celestial por ti.",
      ascendluckMReq: "Necesitas poseer la(s) Mejora(s) Celestial(es):",
      ascendluckMReqHU: "No posees la(s) siguiente(s) Mejora(s) Celestial(es) requerida(s):",
      ascendluckMReqEnd: "para usar esta función.",
      ascendluckMCompleted: "Has desbloqueado todas las mejoras de Suerte de Ascensión:",
      ascendluckMAnd: "y",
      ascendluckMOne7: "Esperando que el nivel de prestigio contenga un(1) 7",
      ascendluckMTwo7: "Esperando que el nivel de prestigio contenga dos(2) 7",
      ascendluckMFour7: "Esperando que el nivel de prestigio contenga cuatro(4) 7",
      wrinklersName: "Auto-Wrinklers",
      wrinklersDescription: "Explota Wrinklers automáticamente cuando alcanzan la cantidad máxima establecida. Por defecto espera hasta la cantidad máxima de Wrinklers, excluyendo los Brillantes.",
      wrinklersSDescription: "Máximo de Wrinklers a mantener",
      statusName: "Popup de Estado",
      statusDescription: "Muestra el estado del mod y si Auto-Compra tiene un artículo en cola.",
      popSWName: "Explotar Wrinklers Brillantes",
      popSWDescription: "Explota automáticamente Wrinklers Brillantes",
      krumblorName: "Auto-Mascota Krumblor",
      krumblorDescription: "Acaricia a Krumblor cuando alcanzas el nivel 4 para desbloquear las gotas de Dragón. El menú de Krumblor debe estar abierto y poseer la mejora Celestial 'Acariciar el dragón'. Se desactiva si tienes todas las 4 gotas, o no cumples con los requisitos.",
      krumblorMReq: "No cumples con los siguientes requisitos para Acariciar a Krumblor:",
      krumblorMReqHU: "No posees la Mejora Celestial:",
      krumblorMReqMenu: "El menú de Krumblor no está abierto.",
      krumblorMReqDL: "El nivel del dragón está por debajo de 4.",
      krumblorMReqEnd: "Vuelve a activar la opción una vez que cumplas estos requisitos.",
      krumblorMCompleted: "Has desbloqueado todas las mejoras de Krumblor:",
      krumblorMRUnlocks: "Acariciando a Krumblor para los desbloqueos restantes:",
      hotkeysName: "Teclas de Acceso Rápido",
      hotkeysDescription: "Permite usar el mod de la manera antigua con teclas de acceso rápido. Las nuevas funciones no tendrán teclas de acceso rápido.",
      hotkeysmenuTitle: "Atajos de Teclado",
      goldenACName: "Cookies Doradas",
      goldenACDescription: "Cuando está activado, las Cookies Doradas serán clicadas",
      wrathACName: "Cookies de Ira",
      wrathACDescription: "Cuando está activado, las Cookies de Ira serán clicadas",
      wrathACSName: "Saltar Ira Forzada",
      wrathACSDescription: "Cuando está activado, las Cookies de Ira con Ira Forzada (alta % de efectos negativos) no serán clicadas",
      reindeerACName: "Cookies de Reno",
      reindeerACDescription: "Cuando está activado, las Cookies de Reno serán clicadas",
      notifyName: "Auto-clic y compra cargados!",
      notifyDescriptionText: "Activa/Desactiva los ajustes en las",
      notifyDescriptionLink: "Opciones",
      notifyDescriptionMenu: "Menú.",
    },    
    "PT-BR": {
      // Portuguese (Brazil) translations
      optionOn: "LIGADO",
      optionOff: "DESLIGADO",
      optionExpand: "Expandir Opções",
      optionCollapse: "Recolher Opções",
      mainName: "Auto-Clique",
      mainDescription: "Clique automático no Grande Cookie. Velocidade de auto-clique 1000ms = 1 segundo",
      mainSDescription: "Velocidade de auto-clique",
      mainhotkeyIncrease: "Aumentar velocidade de auto-clique",
      mainhotkeyDecrease: "Diminuir velocidade de auto-clique",
      autobuyName: "Auto-Compra",
      autobuyDescription: "Compra automática dos prédios e melhorias com melhor CPS. Status exibido abaixo quando ativado.",
      autobuyMR: "Atualização Manual",
      autobuyMRDescription: "Atualizar manualmente a mensagem de status da Auto-Compra, se necessário.",
      autobuyMWaiting: "Aguardando ( {0} ) por: \"{1}\"", // {0} é o tempo, {1} é o item
      autobuyMWaitingLong: "Auto-Compra quer comprar: \"{0}\" mas o tempo de espera é: {1}", // {0} é o item, {1} é o tempo
      autobuyMBuying: "Comprando: \"{0}\"", // {0} é o item
      autobuyMHour: "{0} hora", // {0} é o tempo
      autobuyMHours: "{0} horas", // {0} é o tempo
      autobuyMMinute: "{0} minuto", // {0} é o tempo
      autobuyMMinutes: "{0} minutos", // {0} é o tempo
      autobuyMSecond: "{0} segundo", // {0} é o tempo
      autobuyMSeconds: "{0} segundos", // {0} é o tempo
      autobuyVUName: "Melhorias no Cofre",
      autobuyVUDescription: "Quando ativado, a melhoria será removida do pool de Auto-Compra. Para aqueles que ainda não obtiveram a melhoria Inspirada para colocar melhorias no Cofre. Esta é uma lista estática, se você deseja adicionar mais, submeta um comentário no site do mod no Steam Workshop.",
      autobuyVTUName: "Melhorias Tecnológicas no Cofre",
      autobuyVTUDescription: "Quando ativado, a melhoria tecnológica será removida do pool de Auto-Compra.",
      autobuyVBName: "Edifícios no Cofre",
      autobuyVBDescription: "Quando ativado, o edifício será removido do pool de Auto-Compra.",
      protectName: "Proteção de Auto-Compra",
      protectDescription: "Calcula os requisitos para Lucky e Frenzy para que a auto-compra não caia abaixo desses. Se a Auto-Compra parecer travada, tente desativar este recurso.",
      goldName: "Auto-Clique Especial",
      goldDescription: "Clique automático em Cookie Dourado, Rena, Ira.",
      frenzyName: "Auto-Clique Frenesi",
      frenzyDescription: "Clique automático no Grande Cookie durante frenesi/clic frenesi, não necessário se você já usa a função principal 'AutoClique'.",
      fortuneName: "Auto-Fortuna",
      fortuneDescription: "Clique automático nas fortunas do ticker de notícias.",
      ascendluckName: "Sorte de Ascensão",
      ascendluckDescription: "Usado para desbloquear Dígito da Sorte, Número da Sorte e Pagamento da Sorte. Ascende automaticamente quando as condições são atendidas e desliga este recurso. Ligue novamente manualmente se você tiver mais para desbloquear. Não compra a melhoria Celestial por você.",
      ascendluckMReq: "Você precisa possuir a(s) Melhoria(s) Celestial(is):",
      ascendluckMReqHU: "Você não possui a(s) seguinte(s) Melhoria(s) Celestial(is) requerida(s):",
      ascendluckMReqEnd: "para usar este recurso.",
      ascendluckMCompleted: "Você desbloqueou todas as melhorias de Sorte de Ascensão:",
      ascendluckMAnd: "e",
      ascendluckMOne7: "Aguardando o nível de prestígio conter um(1) 7",
      ascendluckMTwo7: "Aguardando o nível de prestígio conter dois(2) 7",
      ascendluckMFour7: "Aguardando o nível de prestígio conter quatro(4) 7",
      wrinklersName: "Auto-Wrinklers",
      wrinklersDescription: "Estoura Wrinklers automaticamente quando atingem a quantidade máxima definida. Por padrão, espera até a quantidade máxima de Wrinklers, excluindo os Brilhantes.",
      wrinklersSDescription: "Máximo de Wrinklers a manter",
      statusName: "Popup de Status",
      statusDescription: "Mostra o status do mod e se a Auto-Compra tem um item na fila.",
      popSWName: "Estourar Wrinklers Brilhantes",
      popSWDescription: "Estoura Wrinklers Brilhantes automaticamente",
      krumblorName: "Auto-Pet Krumblor",
      krumblorDescription: "Acaricia Krumblor ao alcançar o nível 4 para desbloquear gotas de Dragão. O menu de Krumblor deve estar aberto e possuir a melhoria Celestial 'Acariciar o dragão'. Desliga se você tiver todas as 4 gotas, ou não cumprir os requisitos.",
      krumblorMReq: "Você não atende aos seguintes requisitos para Acariciar Krumblor:",
      krumblorMReqHU: "Você não possui a Melhoria Celestial:",
      krumblorMReqMenu: "O menu de Krumblor não está aberto.",
      krumblorMReqDL: "O nível do dragão está abaixo de 4.",
      krumblorMReqEnd: "Ative a opção novamente uma vez que cumpra esses requisitos.",
      krumblorMCompleted: "Você desbloqueou todas as melhorias de Krumblor:",
      krumblorMRUnlocks: "Acariciando Krumblor para os desbloqueios restantes:",
      hotkeysName: "Teclas de Atalho",
      hotkeysDescription: "Permite usar o mod da maneira antiga com teclas de atalho. Novas funcionalidades não terão teclas de atalho.",
      hotkeysmenuTitle: "Atalhos de Teclado",
      goldenACName: "Cookies Dourados",
      goldenACDescription: "Quando ativado, Cookies Dourados serão clicados",
      wrathACName: "Cookies de Ira",
      wrathACDescription: "Quando ativado, Cookies de Ira serão clicados",
      wrathACSName: "Ignorar Ira Forçada",
      wrathACSDescription: "Quando ativado, Cookies de Ira com Ira Forçada (alta % de efeitos negativos) não serão clicados",
      reindeerACName: "Cookies de Rena",
      reindeerACDescription: "Quando ativado, Cookies de Rena serão clicados",
      notifyName: "Auto-clique e compra carregados!",
      notifyDescriptionText: "Ative/Desative as configurações nas",
      notifyDescriptionLink: "Opções",
      notifyDescriptionMenu: "Menu.",
    },    
    JA: {
      // Japanese translations
      optionOn: "オン",
      optionOff: "オフ",
      optionExpand: "オプションを展開",
      optionCollapse: "オプションを折りたたむ",
      mainName: "自動クリック",
      mainDescription: "ビッグクッキーを自動クリックします。自動クリック速度 1000ms = 1秒",
      mainSDescription: "自動クリック速度",
      mainhotkeyIncrease: "自動クリック速度を上げる",
      mainhotkeyDecrease: "自動クリック速度を下げる",
      autobuyName: "自動購入",
      autobuyDescription: "最高のCPSを持つ建物とアップグレードを自動的に購入します。有効時に下に状態が表示されます。",
      autobuyMR: "手動リフレッシュ",
      autobuyMRDescription: "必要に応じて自動購入のステータスメッセージを手動でリフレッシュします。",
      autobuyMWaiting: "待機中 ( {0} )：{1}", // {0} は時間、{1} はアイテム
      autobuyMWaitingLong: "自動購入が求めています：{0}、しかし待ち時間は：{1}", // {0} はアイテム、{1} は時間
      autobuyMBuying: "購入中：{0}", // {0} はアイテム
      autobuyMHour: "{0} 時間", // {0} は時間
      autobuyMHours: "{0} 時間", // {0} は時間
      autobuyMMinute: "{0} 分", // {0} は時間
      autobuyMMinutes: "{0} 分", // {0} は時間
      autobuyMSecond: "{0} 秒", // {0} は時間
      autobuyMSeconds: "{0} 秒", // {0} は時間
      autobuyVUName: "アップグレードを保管",
      autobuyVUDescription: "有効時、アップグレードは自動購入プールから削除されます。これは、まだインスパイアされたチェックリストアップグレードを取得していない人向けです。これは静的なリストで、追加を希望する場合はSteam Workshopのmodページにコメントを残してください。",
      autobuyVTUName: "技術アップグレードを保管",
      autobuyVTUDescription: "有効時、技術アップグレードは自動購入プールから削除されます。",
      autobuyVBName: "建物を保管",
      autobuyVBDescription: "有効時、建物は自動購入プールから削除されます。",
      protectName: "自動購入保護",
      protectDescription: "自動購入がそれら以下にならないようにラッキーとフレンジーの要件を計算します。自動購入が停止しているように見える場合は、この機能を無効にしてみてください。",
      goldName: "スペシャル自動クリック",
      goldDescription: "ゴールデンクッキー、トナカイ、ラースを自動クリックします。",
      frenzyName: "フレンジー自動クリック",
      frenzyDescription: "フレンジー/クリックフレンジー中にビッグクッキーを自動クリックします。メインの「自動クリック」機能を既に使用している場合は不要です。",
      fortuneName: "フォーチュン自動",
      fortuneDescription: "ニュースティッカーのフォーチュンを自動クリックします。",
      ascendluckName: "昇天の運",
      ascendluckDescription: "ラッキーディジット、ラッキーナンバー、ラッキーペイアウトを解除するために使用します。条件が満たされたら自動的に昇天し、この機能をオフにします。さらに解除するものがある場合は、手動で再度オンにしてください。天国のアップグレードは自動で購入しません。",
      ascendluckMReq: "次の天国のアップグレードを所有する必要があります：",
      ascendluckMReqHU: "次の必要な天国のアップグレードを所有していません：",
      ascendluckMReqEnd: "この機能を使用するために。",
      ascendluckMCompleted: "昇天の運のアップグレードをすべて解除しました：",
      ascendluckMAnd: "と",
      ascendluckMOne7: "プレステージレベルが1つの7を含むのを待っています",
      ascendluckMTwo7: "プレステージレベルが2つの7を含むのを待っています",
      ascendluckMFour7: "プレステージレベルが4つの7を含むのを待っています",
      wrinklersName: "自動ウィンクラー",
      wrinklersDescription: "設定された最大量に達した時にウィンクラーを自動的にポップします。デフォルトでは、最大量のウィンクラーに達するまで待ちます、シャイニーを除く。",
      wrinklersSDescription: "保持する最大ウィンクラー数",
      statusName: "ステータスポップアップ",
      statusDescription: "modのステータスと自動購入がキューにアイテムを持っているかどうかを表示します。",
      popSWName: "シャイニーウィンクラーをポップ",
      popSWDescription: "シャイニーウィンクラーを自動的にポップします",
      krumblorName: "自動ペットクランブラー",
      krumblorDescription: "レベル4に達するとクランブラーをペットしてドラゴンドロップを解除します。クランブラーのメニューが開いていて、「ドラゴンをペットする」天国のアップグレードを所有している必要があります。すべての4つのドロップを持っているか、要件を満たしていない場合はオフになります。",
      krumblorMReq: "クランブラーをペットするために次の要件を満たしていません：",
      krumblorMReqHU: "次の天国のアップグレードを所有していません：",
      krumblorMReqMenu: "クランブラーのメニューが開いていません。",
      krumblorMReqDL: "ドラゴンのレベルが4未満です。",
      krumblorMReqEnd: "これらの要件を満たしたら、オプションを再度オンにしてください。",
      krumblorMCompleted: "クランブラーのすべてのアップグレードを解除しました：",
      krumblorMRUnlocks: "残りのアンロックのためにクランブラーをペットしています：",
      hotkeysName: "ホットキー",
      hotkeysDescription: "ホットキーを使用してmodを古い方法で使用できます。新機能にはホットキーがありません。",
      hotkeysmenuTitle: "キーボードショートカット",
      goldenACName: "ゴールデンクッキー",
      goldenACDescription: "有効時、ゴールデンクッキーがクリックされます",
      wrathACName: "ラースクッキー",
      wrathACDescription: "有効時、ラースクッキーがクリックされます",
      wrathACSName: "強制ラースをスキップ",
      wrathACSDescription: "有効時、強制ラース（ネガティブな効果を受ける確率が高い）のラースクッキーはクリックされません",
      reindeerACName: "トナカイクッキー",
      reindeerACDescription: "有効時、トナカイクッキーがクリックされます",
      notifyName: "自動クリックと購入がロードされました！",
      notifyDescriptionText: "設定をオン/オフにするには",
      notifyDescriptionLink: "オプション",
      notifyDescriptionMenu: "メニューで。",
    },    
    "ZH-CN": {
      // Simplified Chinese translations
      optionOn: "开启",
      optionOff: "关闭",
      optionExpand: "展开选项",
      optionCollapse: "折叠选项",
      mainName: "自动点击",
      mainDescription: "自动点击大饼干。自动点击速度1000毫秒=1秒",
      mainSDescription: "自动点击速度",
      mainhotkeyIncrease: "增加自动点击速度",
      mainhotkeyDecrease: "减少自动点击速度",
      autobuyName: "自动购买",
      autobuyDescription: "自动购买最佳CPS的建筑和升级。启用时下方显示状态。",
      autobuyMR: "手动刷新",
      autobuyMRDescription: "如有需要，手动刷新自动购买状态信息。",
      autobuyMWaiting: "等待中 ( {0} )：{1}", // {0} 是时间，{1} 是物品
      autobuyMWaitingLong: "自动购买想要购买：{0}，但等待时间是：{1}", // {0} 是物品，{1} 是时间
      autobuyMBuying: "购买中：{0}", // {0} 是物品
      autobuyMHour: "{0} 小时", // {0} 是时间
      autobuyMHours: "{0} 小时", // {0} 是时间
      autobuyMMinute: "{0} 分钟", // {0} 是时间
      autobuyMMinutes: "{0} 分钟", // {0} 是时间
      autobuyMSecond: "{0} 秒", // {0} 是时间
      autobuyMSeconds: "{0} 秒", // {0} 是时间
      autobuyVUName: "保险库升级",
      autobuyVUDescription: "启用时，将从自动购买池中移除该升级。适用于尚未获得启发式检查表升级以保险库升级的玩家。这是一个静态列表，如果你想添加更多，请在Steam Workshop的mod页面上提交评论。",
      autobuyVTUName: "保险库技术升级",
      autobuyVTUDescription: "启用时，将从自动购买池中移除技术升级。",
      autobuyVBName: "保险库建筑",
      autobuyVBDescription: "启用时，将从自动购买池中移除建筑。",
      protectName: "自动购买保护",
      protectDescription: "计算幸运和狂热要求，以防自动购买降低这些值。如果自动购买似乎卡住了，尝试禁用此功能。",
      goldName: "自动点击特殊",
      goldDescription: "自动点击金色饼干、驯鹿、愤怒饼干。",
      frenzyName: "自动点击狂热",
      frenzyDescription: "在狂热/点击狂热期间自动点击大饼干，如果你已经使用了主要的'自动点击'功能，则不需要。",
      fortuneName: "自动财富",
      fortuneDescription: "自动点击新闻提示栏的财富。",
      ascendluckName: "升天运气",
      ascendluckDescription: "用于解锁幸运数字、幸运号码和幸运支付。当条件满足时自动升天，并关闭此功能。如果你还有更多要解锁的，需要手动重新开启。不会为你购买天堂升级。",
      ascendluckMReq: "你需要拥有天堂升级：",
      ascendluckMReqHU: "你没有以下所需的天堂升级：",
      ascendluckMReqEnd: "使用此功能。",
      ascendluckMCompleted: "你已解锁所有升天运气升级：",
      ascendluckMAnd: "和",
      ascendluckMOne7: "等待声望等级包含一个(1) 7",
      ascendluckMTwo7: "等待声望等级包含两个(2) 7",
      ascendluckMFour7: "等待声望等级包含四个(4) 7",
      wrinklersName: "自动Wrinklers",
      wrinklersDescription: "当达到设置的最大数量时自动弹出Wrinklers。默认是等待直到Wrinklers达到最大数量，不包括闪亮的。",
      wrinklersSDescription: "保留的最大Wrinklers数量",
      statusName: "状态弹窗",
      statusDescription: "显示mod的状态，以及自动购买是否有项目排队。",
      popSWName: "自动弹出闪亮Wrinklers",
      popSWDescription: "自动弹出闪亮Wrinklers",
      krumblorName: "自动宠物Krumblor",
      krumblorDescription: "当你达到4级时宠物Krumblor以解锁龙掉落。Krumblor的菜单必须打开，并且拥有'宠物龙'的天堂升级。如果你拥有所有4个掉落，或不满足要求，将关闭。",
      krumblorMReq: "你不满足宠物Krumblor的以下要求：",
      krumblorMReqHU: "你没有以下天堂升级：",
      krumblorMReqMenu: "Krumblor菜单未打开。",
      krumblorMReqDL: "龙等级低于4。",
      krumblorMReqEnd: "一旦满足这些要求，再次开启选项。",
      krumblorMCompleted: "你已解锁所有Krumblor升级：",
      krumblorMRUnlocks: "宠物Krumblor以解锁剩余的：",
      hotkeysName: "快捷键",
      hotkeysDescription: "允许你使用快捷键以旧方式使用mod。新功能将不会有快捷键。",
      hotkeysmenuTitle: "键盘快捷键",
      goldenACName: "金色饼干",
      goldenACDescription: "启用时，金色饼干将被点击",
      wrathACName: "愤怒饼干",
      wrathACDescription: "启用时，愤怒饼干将被点击",
      wrathACSName: "跳过强制愤怒",
      wrathACSDescription: "启用时，具有强制愤怒（高概率接收负面效果）的愤怒饼干将不被点击",
      reindeerACName: "驯鹿饼干",
      reindeerACDescription: "启用时，驯鹿饼干将被点击",
      notifyName: "自动点击和购买已加载！",
      notifyDescriptionText: "在",
      notifyDescriptionLink: "选项",
      notifyDescriptionMenu: "菜单中开启/关闭设置。",
    },    
    RU: {
      // Russian translations
      optionOn: "ВКЛЮЧЕНО",
      optionOff: "ВЫКЛЮЧЕНО",
      optionExpand: "Развернуть опции",
      optionCollapse: "Свернуть опции",
      mainName: "Авто-Клик",
      mainDescription: "Автоматический клик по Большому Печенью. Скорость авто-клика 1000мс = 1 секунда",
      mainSDescription: "Скорость авто-клика",
      mainhotkeyIncrease: "Увеличить скорость авто-клика",
      mainhotkeyDecrease: "Уменьшить скорость авто-клика",
      autobuyName: "Авто-Покупка",
      autobuyDescription: "Автоматическая покупка зданий и улучшений с лучшим CPS. Статус отображается ниже при активации.",
      autobuyMR: "Ручное Обновление",
      autobuyMRDescription: "Ручное обновление сообщения статуса Авто-Покупки, если необходимо.",
      autobuyMWaiting: "Ожидание ( {0} ) для: \"{1}\"", // {0} это время, {1} это предмет
      autobuyMWaitingLong: "Авто-Покупка хочет купить: \"{0}\", но время ожидания: {1}", // {0} это предмет, {1} это время
      autobuyMBuying: "Покупка: \"{0}\"", // {0} это предмет
      autobuyMHour: "{0} час", // {0} это время
      autobuyMHours: "{0} часов", // {0} это время
      autobuyMMinute: "{0} минута", // {0} это время
      autobuyMMinutes: "{0} минут", // {0} это время
      autobuyMSecond: "{0} секунда", // {0} это время
      autobuyMSeconds: "{0} секунд", // {0} это время
      autobuyVUName: "Улучшения для Хранилища",
      autobuyVUDescription: "При активации улучшение будет удалено из пула Авто-Покупки. Для тех, кто еще не получил улучшение Вдохновленный Список для хранения улучшений. Это статичный список, если вы хотите добавить больше, оставьте комментарий на странице мода в Steam Workshop.",
      autobuyVTUName: "Технологические Улучшения для Хранилища",
      autobuyVTUDescription: "При активации технологическое улучшение будет удалено из пула Авто-Покупки.",
      autobuyVBName: "Здания для Хранилища",
      autobuyVBDescription: "При активации здание будет удалено из пула Авто-Покупки.",
      protectName: "Защита Авто-Покупки",
      protectDescription: "Расчет требований для Lucky и Frenzy, чтобы авто-покупка не опускалась ниже них. Если Авто-Покупка кажется застрявшей, попробуйте отключить эту функцию.",
      goldName: "Авто-Клик по Специальным",
      goldDescription: "Автоматический клик по Золотым Печеньям, Оленям, Печеньям Гнева.",
      frenzyName: "Авто-Клик Френзи",
      frenzyDescription: "Автоматический клик по Большому Печенью во время френзи/клик френзи, не нужно, если вы уже используете основную функцию 'Авто-Клик'.",
      fortuneName: "Авто-Фортуна",
      fortuneDescription: "Автоматический клик по фортунам в тикере новостей.",
      ascendluckName: "Удача Вознесения",
      ascendluckDescription: "Используется для разблокировки Счастливой Цифры, Счастливого Номера и Счастливого Выплаты. Автоматически возносит вас, когда условия выполнены, и отключает эту функцию. Включите вручную, если у вас есть еще что разблокировать. Не покупает за вас Небесное улучшение.",
      ascendluckMReq: "Вам нужно владеть Небесным(и) Улучшением(ями):",
      ascendluckMReqHU: "У вас нет следующего(их) требуемого(ых) Небесного(ых) Улучшения(й):",
      ascendluckMReqEnd: "чтобы использовать эту функцию.",
      ascendluckMCompleted: "Вы разблокировали все улучшения Удачи Вознесения:",
      ascendluckMAnd: "и",
      ascendluckMOne7: "Ожидание, пока уровень престижа будет содержать одну(1) 7",
      ascendluckMTwo7: "Ожидание, пока уровень престижа будет содержать две(2) 7",
      ascendluckMFour7: "Ожидание, пока уровень престижа будет содержать четыре(4) 7",
      wrinklersName: "Авто-Вринклеры",
      wrinklersDescription: "Автоматически лопает Вринклеров, когда достигнуто максимальное количество. По умолчанию ждет, пока не наберется максимальное количество Вринклеров, за исключением Сияющих.",
      wrinklersSDescription: "Максимум Вринклеров для сохранения",
      statusName: "Всплывающее окно статуса",
      statusDescription: "Показывает статус мода и есть ли у Авто-Покупки элемент в очереди.",
      popSWName: "Авто-Лопание Сияющих Вринклеров",
      popSWDescription: "Автоматически лопает Сияющих Вринклеров",
      krumblorName: "Авто-Питомец Крамблор",
      krumblorDescription: "Поглаживает Крамблора, когда вы достигаете 4 уровня, чтобы разблокировать драгоценные капли. Меню Крамблора должно быть открыто и иметь Небесное улучшение 'Погладить дракона'. Отключается, если у вас есть все 4 капли или не выполнены требования.",
      krumblorMReq: "Вы не удовлетворяете следующим требованиям для поглаживания Крамблора:",
      krumblorMReqHU: "У вас нет Небесного Улучшения:",
      krumblorMReqMenu: "Меню Крамблора не открыто.",
      krumblorMReqDL: "Уровень дракона ниже 4.",
      krumblorMReqEnd: "Включите опцию снова, когда выполните эти требования.",
      krumblorMCompleted: "Вы разблокировали все улучшения Крамблора:",
      krumblorMRUnlocks: "Поглаживание Крамблора для оставшихся разблокировок:",
      hotkeysName: "Горячие клавиши",
      hotkeysDescription: "Позволяет использовать мод старым способом с горячими клавишами. Новые функции не будут иметь горячих клавиш.",
      hotkeysmenuTitle: "Клавишные сочетания",
      goldenACName: "Золотые Печенья",
      goldenACDescription: "Когда включено, Золотые Печенья будут кликаться",
      wrathACName: "Печенья Гнева",
      wrathACDescription: "Когда включено, Печенья Гнева будут кликаться",
      wrathACSName: "Пропуск Принудительного Гнева",
      wrathACSDescription: "Когда включено, Печенья Гнева с Принудительным Гневом (высокий % получения негативных эффектов) не будут кликаться",
      reindeerACName: "Печенья Оленя",
      reindeerACDescription: "Когда включено, Печенья Оленя будут кликаться",
      notifyName: "Авто-клик и покупка загружены!",
      notifyDescriptionText: "Включить/Выключить настройки в",
      notifyDescriptionLink: "Опциях",
      notifyDescriptionMenu: "Меню.",
    },    
  };
  // Define a constant called ACABMdefaultSettings that contains an object with default settings for the Auto click and buy mod.
  //     autobuymaxWait: 1440, // AutoBuy Max Wait 
  const ACABMdefaultSettings = {
    main: 0, // AutoClick
    mainspeed: 50, // AutoClick speed
    autobuy: 0, // AutoBuy
    protect: 0, // AutoBuy Protect
    gold: 0, // AutoClick Special
    frenzy: 0, // AutoClick Frenzy
    fortune: 0, // Auto Fortune
    ascendluck: 0, // Ascend Luck
    wrinklers: 0, // Auto Wrinklers
    wrinklersmax: -1, // Max amount of Wrinklers to pop automatically
    krumblor: 0, // AutoPet Krumblor
    hotkeys: 0, // Hotkeys
    upgradevault: [], // List of upgrades to vault
    buildingvault: [], // List of buildings to vault
    options: ["goldenAC", "wrathAC", "reindeerAC"], // Options for AutoClick Special
  };
 
  function ACABMTranslate(key, ...placeholders) {
    // Fetch the current language setting from Cookie Clicker
    const lang = locId || 'EN'; // Default to 'EN' if locId is not set
  
    // Access the translation string using the key; fallback to English if the key doesn't exist in the current language
    let translation = ACABMTranslations[lang][key] || ACABMTranslations['EN'][key] || key;
  
    // Replace placeholders in the translation string with provided arguments
    placeholders.forEach((value, index) => {
      translation = translation.replace(`{${index}}`, value);
    });
  
    return translation;
  }

  // Define a constant called ACABMsettingsKeys that contains an array of keys from the ACABMdefaultSettings object.
  const ACABMsettingsKeys = Object.keys(ACABMdefaultSettings);

  // Define a constant called ACABMmenuDictionary that contains an object with properties for each menu item in the Auto click and buy mod.
  const ACABMmenuDictionary = {
    main: {
      name: ACABMTranslate('mainName'),
      description: ACABMTranslate('mainDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    autobuy: {
      name: ACABMTranslate('autobuyName'),
      description: ACABMTranslate('autobuyDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    gold: {
      name: ACABMTranslate('goldName'),
      description: ACABMTranslate('goldDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    frenzy: {
      name: ACABMTranslate('frenzyName'),
      description: ACABMTranslate('frenzyDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    wrinklers: {
      name: ACABMTranslate('wrinklersName'),
      description: ACABMTranslate('wrinklersDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    ascendluck: {
      name: ACABMTranslate('ascendluckName'),
      description: ACABMTranslate('ascendluckDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    protect: {
      name: ACABMTranslate('protectName'),
      description: ACABMTranslate('protectDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    fortune: {
      name: ACABMTranslate('fortuneName'),
      description: ACABMTranslate('fortuneDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    hotkeys: {
      name: ACABMTranslate('hotkeysName'),
      description: ACABMTranslate('hotkeysDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
    krumblor: {
      name: ACABMTranslate('krumblorName'),
      description: ACABMTranslate('krumblorDescription'),
      values: {
        0: ACABMTranslate('optionOff'),
        1: ACABMTranslate('optionOn'),
      },
    },
  };

  /**
   * This object contains the main logic for the Auto click and buy mod.
   * @type {Object}
   * @property {Function} init - Initializes the mod by adding a menu and notifying the user.
   */
  const ACABM = {
    init: function () {
      // Define a constant called ACABM and set its value to the current object.
      const ACABM = this;

      // Destructure the UpdateMenu function from the Game object.
      const { UpdateMenu } = Game;

      // Redefine the Game.UpdateMenu function as an arrow function that calls the original UpdateMenu function and then calls the addMenu method of the ACABM object.
      Game.UpdateMenu = () => {
        UpdateMenu();
        ACABM.addMenu();
      };

      // Destructure the Notify function from the Game object.
      const { Notify } = Game;

      // Call the Notify function with four arguments to set up a notification that informs the user that the Auto click and buy mod has been loaded and provides instructions for turning the mod on and off in the Options menu.
      Notify(
        `${ACABMTranslate('notifyName')}`,
        `${ACABMTranslate('notifyDescriptionText')} <b><a href="#" onclick=Game.ShowMenu("prefs");>${ACABMTranslate('notifyDescriptionLink')}</a></b> ${ACABMTranslate('notifyDescriptionMenu')}`,
        [30, 6],
        20
      );

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
              objects: function() {
                return Game.UpgradesInStore.filter(function(e) {
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
                add: function(e) {
                  e.bought = 1;  
                },
                sub: function(e) {
                  e.bought = 0;
                },
                price: function(e) {
                  return e.basePrice; 
                },
                lasting: function(e) {
                  return e.lasting;
                }
              }
            },
            {
              objects: function() {
                return Game.ObjectsById.filter(function(e) {
                  return [].indexOf(e.id) < 0 &&
                         !ACABM.settings.buildingvault.includes(e.id);  
                });
              },
              accessors: {
                add: function(e) {
                  e.amount++;   
                },
                sub: function(e) {
                  e.amount--;
                },
                price: function(e) {
                  return e.price;
                },
                lasting: function(e) {
                  return e.lasting;
                }
              }
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
          Game.CalculateGains = function() {
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

        /* WIP Don't use
        find_best(mouse_rate) {
          var pool = [];
          var maxWaitTimeMinutes = ACABM.settings.autobuymaxWait > 0 ? ACABM.settings.autobuymaxWait : 30; // Assume this setting exists and is in minutes
          var maxWaitTimeSeconds = maxWaitTimeMinutes * 60; // Convert minutes to seconds
          var zero_buy = Math.sqrt(Game.cookiesEarned * Game.cookiesPs);
          
          for (var i = 0; i < this.schema.length; i++)
              pool = pool.concat(
                  this.calc_bonus(
                      this.schema[i].accessors,
                      this.schema[i].objects,
                      mouse_rate || 0
                  )
              );
          
          // Filter out items with a wait time over 30 minutes
          pool = pool.filter(function(item) {
              var protect = this.protect && Game.Has("Get lucky") != 0
                  ? (Game.hasBuff("Frenzy") != 0 ? 1 : 7) * Game.cookiesPs * 1200
                  : 0;
              var waitTime = (protect + item.price - Game.cookies) / this.ecps();
              return isFinite(waitTime) && waitTime <= maxWaitTimeSeconds;
          }.bind(this));
          
          // Ensure pool is not empty after filtering
          if (pool.length === 0) {
              return null; // or however you wish to handle an empty pool
          }
      
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
        */      
      }


      /**
       * The main class for the autoclickandbuyMod.
       * @class
       * @constructor
       * @property {Calculator} calc - An instance of the Calculator class.
       * @property {boolean} protect - A boolean indicating whether the player's purchases should be protected.
       * @property {Object} target - An object containing the name and price of the target purchase.
       * @property {number} total - The total number of buildings and upgrades owned by the player.
       * @property {Object} actions - An object containing the various actions that can be performed by the mod.
       * @property {Object} actions.timeouts - An object containing the timeouts for each action.
       * @property {Object} actions.togglesettings - An object containing the delay and function for toggling the mod's settings.
       * @property {Object} actions.guard - An object containing the delay and function for updating the player's total number of buildings and upgrades.
       * @property {Object} actions.autobuy - An object containing the delay and function for automatically buying the target purchase.
       * @property {Object} actions.status - An object containing the delay and function for displaying the mod's status.
       * @property {Object} actions.protect - An object containing the delay and function for toggling the protection of the player's purchases.
       * @property {Object} actions.main - An object containing the delay and function for clicking the cookie.
       * @property {Object} actions.krumblor - An object containing the delay and function for activating Krumblor.
       * @property {Object} actions.frenzy - An object containing the delay and function for clicking the cookie during a frenzy.
       * @property {Object} actions.gold - An object containing the delay and function for clicking the golden cookie.
       * @property {Object} actions.ascendluck - An object containing the delay and function for clicking the cookie during an ascension.
       * @property {Object} actions.fortune - An object containing the delay and function for clicking the fortune cookie.
       * @property {Object} actions.wrinklers - An object containing the delay and function for popping wrinklers.
       */
      class Controller {
        constructor() {
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
                // If the player is ascending or the ascend timer is greater than 0, return.
                if (Game.OnAscend || Game.AscendTimer > 0) {
                  return;
                }

                Game.ClickCookie(0);
              },
            },
            krumblor: {
              delay: 200,
              func: this.krumblor.bind(this),
            },
            frenzy: {
              delay: 50,
              func: function () {
                // If the player is ascending or the ascend timer is greater than 0, return.
                if (Game.OnAscend || Game.AscendTimer > 0) {
                  return;
                }

                if (Game.buffs["Click Frenzy"] || Game.buffs["Frenzy"]) {
                  Game.ClickCookie(0);
                }
              },
            },
            gold: {
              delay: 250,
              func: this.gold.bind(this),
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

        say(msg) {
          // I don't think anyone uses console log to see this stuff anymore.
          // console.log(msg);
          if (ACABM.settings["hotkeys"]) {
            Game.Popup(msg, Game.windowW / 2, Game.windowH - 100);
          }
        }

        /**
         * The guard function updates the total number of buildings and upgrades owned by the player,
         * and checks whether the autobuy action should be unqueued.
         * @function
         * @name guard
         */
        guard() {
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
          // console.log("Unqueueing buy: ", this.actions.timeouts.buy);
          this.unqueue_action("buy");
        }

        /**
         * The `autobuy` function is responsible for automatically buying the best building or upgrade based on the current game state.
         * @function
         * @returns {void}
         */
        autobuy() {

          // If the player is ascending or the ascend timer is greater than 0, return.
          if (Game.OnAscend || Game.AscendTimer > 0) {
            //  console.log("Autobuy skipped due to ascend.");
            return;
          }

          // Check if no buildings are owned and queue buying a Cursor
          if (Game.BuildingsOwned === 0) {
            // Filter out buildings that are not in the building vault
            const availableBuildings = Game.ObjectsById.filter(function(building) {
              return !ACABM.settings.buildingvault.includes(building.id);
            });

            // Check if buildings are available after filtering
            if (availableBuildings.length === 0) {
                // console.log("No buildings available to buy based on autobuy settings.");
                return;
            }

            // Find the cheapest building not in the vault
            const cheapestBuilding = availableBuildings.reduce(function(prev, curr) {
              return (prev.price < curr.price) ? prev : curr;
            });

            // console.log(`Cheapest available building: ${cheapestBuilding.name}`);

            if (cheapestBuilding.price <= Game.cookies) {
              // console.log(`Buying cheapest building: ${cheapestBuilding.name}`);
              cheapestBuilding.buy(1);
              return;
            }

          }

          function beautifySeconds(seconds) {
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            var seconds = Math.floor(seconds % 60);
          
            var parts = [];
            if (hours > 0) parts.push(ACABMTranslate(hours == 1 ? 'autobuyMHour' : 'autobuyMHours', hours));
            if (minutes > 0) parts.push(ACABMTranslate(minutes == 1 ? 'autobuyMMinute' : 'autobuyMMinutes', minutes));
            if (seconds > 0 || parts.length == 0) parts.push(ACABMTranslate(seconds == 1 ? 'autobuyMSecond' : 'autobuyMSeconds', seconds));
          
            return parts.join(", ");
          }

          if (this.actions.timeouts.buy) {
            ACABM.abmessage["buy"] = ACABMTranslate(autobuyMWaiting, beautifySeconds((this.target.price - Game.cookies) / this.calc.ecps(), 1), this.target.name);
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
          // console.log("For {cps = " + Beautify(Game.cookiesPs, 1) + ", protect = " + Beautify(protect) + "} best candidate is", info);
          if (!isFinite(wait) || wait > 120) {
            ACABM.abmessage["buy"] =  ACABMTranslate("autobuyMWaitingLong",info.obj.name,beautifySeconds(wait));
            return;
          }

          var msgKey = wait > 0 ? "autobuyMWaiting" : "autobuyMBuying";
          var msg = "";
          
          if (wait > 0) {
            // If there's a wait, include both the wait time and the item name as placeholders
            msg = ACABMTranslate(msgKey, beautifySeconds(wait), info.obj.name);
          } else {
            // If there's no wait, only the item name is included as a placeholder
            msg = ACABMTranslate(msgKey, info.obj.name);
          }

          ACABM.abmessage["buy"] = msg;

          // console.log("For {cps = " + Beautify(Game.cookiesPs, 1) + ", protect = " + Beautify(protect) + "} best candidate is", info, msg);

          this.say(msg);
          if (wait > 0) {
            this.target.name = info.obj.name;
            this.target.price = protect + info.price;
            // console.log(1000 * (Game.cookiesPs ? wait + 0.05 : 60));
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
        }

        /**
         * The `status` function is responsible for displaying the current status of the autoclick and buy mod, including the current keyboard hotkeys, the status of each action, the cookie protection status, the main auto click speed, and the estimated time remaining for the next purchase.
         * @function
         * @returns {void}
         */
        status() {
          var act = [];
          var b2s = function (b) {
            return b ? "on".fontcolor("green") : "off".fontcolor("red");
          };

          for (var i in this.actions) {
            if (this.actions[i].delay && i != "guard") {
              // add [ before and ] after first character of the action name. autobuy = [A]utobuy
              // not all first chracters for the option match the hotkey, so adding manually.
              switch (i) {
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
              "<p>" +
              ACABMTranslate(autobuyMWaiting, beautifySeconds((this.target.price - Game.cookies) / this.calc.ecps(), 1), this.target.name);
              + "</p>";
          }
          this.say(msg);
        }

        /**
         * The `ascendluck` function is responsible for checking if the player has unlocked the necessary Heavenly Upgrades to ascend with Lucky digit, Lucky number, and Lucky payout. If the player has not unlocked these upgrades, the function will display a message indicating which upgrades are required. If the player has unlocked all upgrades, the function will turn off the `ascendluck` action. If the player has unlocked some but not all upgrades, the function will wait for the player to reach the required prestige level before ascending.
         * @function
         * @returns {void}
         */
        ascendluck() {
          // Access this within nested function.
          var thisfunc = this;

          function doascendluckOff() {
            ACABM.settings["ascendluck"] = 0;
            thisfunc.toggle_action("ascendluck", true);
            Game.UpdateMenu();
          }

          function doascendLuck() {
            if (Game.ascensionMode !== 0) return;
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
            ACABMTranslate('ascendluckMCompleted') + " Lucky digit, Lucky number, Lucky payout.";
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
                ACABMTranslate('ascendluckMOne7');
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
                  ACABMTranslate('ascendluckMTwo7');
                }
              } else {
                ACABM.abmessage["ALmsg"] =
                  ACABMTranslate('ascendluckMReq') +
                  (Game.HasUnlocked("Lucky digit") ? "" : '"Lucky digit"') +
                  " " +
                  (Game.HasUnlocked("Lucky digit") +
                    Game.HasUnlocked("Lasting fortune") >
                  0
                    ? ""
                    : ` ${ACABMTranslate('ascendluckMAnd')} `) +
                  "  " +
                  (Game.HasUnlocked("Lasting fortune")
                    ? ""
                    : '"Lasting fortune"') +
                    ACABMTranslate('ascendluckMReqEnd');
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
                  ACABMTranslate('ascendluckMFour7');
                }
              } else {
                ACABM.abmessage["ALmsg"] =
                ACABMTranslate('ascendluckMReqHU') +
                  (Game.HasUnlocked("Lucky number") ? "" : '"Lucky number"') +
                  " " +
                  (Game.HasUnlocked("Lucky number") +
                    Game.HasUnlocked("Decisive fate") >
                  0
                    ? ""
                    : ` ${ACABMTranslate('ascendluckMAnd')} `) +
                  "  " +
                  (Game.HasUnlocked("Decisive fate") ? "" : '"Decisive fate"') +
                  ACABMTranslate('ascendluckMReqEnd');
                doascendluckOff();
              }
            }
          } else {
            ACABM.abmessage["ALmsg"] =
              ACABMTranslate('ascendluckMReqHU') + ' "Heavenly luck" ' + ACABMTranslate('ascendluckMReqEnd');
            doascendluckOff();
          }
        }

        /**
         * The `fortune` function checks if the current ticker effect is a "fortune" effect and clicks the ticker if it is.
         * @function
         * @returns {void}
         */
        fortune() {

          // If the player is ascending or the ascend timer is greater than 0, return.
          if (Game.OnAscend || Game.AscendTimer > 0) {
            return;
          }

          if (Game.TickerEffect && Game.TickerEffect.type === "fortune") {
            Game.tickerL.click();
          }
        }

        /**
         * The `wrinklers` function is responsible for popping the most valuable wrinklers when the maximum number of wrinklers is reached. It pops the most valuable normal wrinkler first, and if there are no normal wrinklers available, it pops the most valuable shiny wrinkler if enabled.
         * @function
         * @returns {void}
         */
        wrinklers() {

          // If the player is ascending or the ascend timer is greater than 0, return.
          if (Game.OnAscend || Game.AscendTimer > 0) {
            return;
          }

          // Pop fattest normal wrinkler when you reach max wrinklers.
          if (Game.elderWrath > 0) {
            let wrinklersM;
            let wrinklersNormal = Game.wrinklers.filter(function (e) {
              return e.type == 0 && e.sucked > 0;
            });
            let wrinklersShiny = Game.wrinklers.filter(function (e) {
              return e.type !== 0 && e.sucked > 0;
            });

            // Set max wrinklers to Game.getWrinklersMax if not set.
            if (ACABM.settings.wrinklersmax == -1) {
              ACABM.settings.wrinklersmax = Game.getWrinklersMax() - 1;
            }

            wrinklersM = ACABM.settings.wrinklersmax;

            // Is current amount of wrinklers at max?
            if (
              Object.keys(wrinklersNormal).length +
                Object.keys(wrinklersShiny).length >
                wrinklersM ||
              Object.keys(wrinklersNormal).length +
                Object.keys(wrinklersShiny).length >=
                Game.getWrinklersMax()
            ) {
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
            }
          }
        }

        /**
         * The `krumblor` function is responsible for handling the logic related to Krumblor, the dragon in Cookie Clicker. It checks if the player has unlocked all Krumblor upgrades, if the Krumblor menu is open and the player has the Heavenly Upgrade "Pet the dragon", and turns off the Krumblor option if the player does not meet the requirements to pet Krumblor.
         * @function
         * @returns {void}
         */
        krumblor() {

          // If the player is ascending or the ascend timer is greater than 0, return.
          if (Game.OnAscend || Game.AscendTimer > 0) {
            return;
          }

          const unlockMsg = [];
          const offReasons = [];

          const hasUnlockedScale = Game.HasUnlocked("Dragon scale");
          const hasUnlockedClaw = Game.HasUnlocked("Dragon claw");
          const hasUnlockedFang = Game.HasUnlocked("Dragon fang");
          const hasUnlockedTeddy = Game.HasUnlocked("Dragon teddy bear");
          const hasPetDragon = Game.HasUnlocked("Pet the dragon");
          const dragonLevel = Game.dragonLevel;
          const isKrumblorMenuOpen = Game.specialTab === "dragon";

          // If all 4 Krumblor drops are unlocked, turn off.
          if (
            hasUnlockedScale &&
            hasUnlockedClaw &&
            hasUnlockedFang &&
            hasUnlockedTeddy
          ) {
            ACABM.settings["krumblor"] = 0;
            unlockMsg.push(
              ACABMTranslate('krumblorMCompleted') + " Dragon scale, Dragon claw, Dragon fang, Dragon teddy bear."
            );
          } else {
            // If Krumblor menu is open, Dragon level is 4 or higher, and you own the Heavenly Upgrade "Pet the dragon", pet Krumblor.
            if (isKrumblorMenuOpen && dragonLevel >= 4 && hasPetDragon) {
              unlockMsg.push(ACABMTranslate('krumblorMRUnlocks'));
              if (!hasUnlockedScale) unlockMsg.push("Dragon scale");
              if (!hasUnlockedClaw) unlockMsg.push("Dragon claw");
              if (!hasUnlockedFang) unlockMsg.push("Dragon fang");
              if (!hasUnlockedTeddy) unlockMsg.push("Dragon teddy bear");

              Game.ClickSpecialPic();
            } else {
              // If Krumblor menu is not open, Dragon level is under 4, or you do not own the Heavenly Upgrade "Pet the dragon", turn off.
              ACABM.settings["krumblor"] = 0;

              if (!hasPetDragon) {
                offReasons.push(
                  ACABMTranslate('krumblorMReqHU') + ' "Pet the dragon" '
                );
              } else {
                if (!isKrumblorMenuOpen)
                  offReasons.push(ACABMTranslate('krumblorMReqMenu'));

                if (dragonLevel < 4)
                  offReasons.push(ACABMTranslate('krumblorMReqDL'));
              }

              unlockMsg.push(
                ACABMTranslate('krumblorMReq'),
                ...offReasons,
                ACABMTranslate('krumblorMReqEnd')
              );
            }
          }

          ACABM.abmessage["AKmsg"] = unlockMsg.join("<br>");
          Game.UpdateMenu();
        }

        /**
         * The `gold` function checks if there are any golden cookies or reindeer on the screen and clicks them if the corresponding options are enabled.
         * @function
         * @returns {void}
         */
        gold() {

          // If the player is ascending or the ascend timer is greater than 0, return.
          if (Game.OnAscend || Game.AscendTimer > 0) {
            return;
          }

          if (Game.shimmers) {
            Game.shimmers.forEach((shimmer) => {
              if (shimmer && shimmer.type === "golden") {
                if (
                  !shimmer.wrath &&
                  ACABM.settings.options.indexOf("goldenAC") !== -1
                ) {
                  shimmer.pop();
                } else if (
                  shimmer.wrath &&
                  ACABM.settings.options.indexOf("wrathAC") !== -1
                ) {
                  if (
                    shimmer.forceObj["wrath"] &&
                    ACABM.settings.options.indexOf("wrathACS") !== -1
                  ) {
                    return;
                  } else {
                    shimmer.pop();
                  }
                }
              } else if (
                shimmer &&
                shimmer.type === "reindeer" &&
                ACABM.settings.options.indexOf("reindeerAC") !== -1
              ) {
                shimmer.pop();
              }
            });
          }
        }

        /**
         * Toggles the protection mode of the autoclickandbuyMod.
         * Used for the "Protect" option.
         * @function
         * @returns {void}
         */
        toggle_protect() {
          if (ACABM.settings["protect"] === 0) {
            this.protect = false;
            this.unqueue_action("buy");
          } else {
            this.protect = true;
          }
        }

        /**
         * The `toggle_action` function toggles the specified action based on the loading status and the corresponding settings.
         * @function
         * @param {string} name - The name of the action to toggle.
         * @param {boolean} loading - The loading status of the action.
         * @returns {void}
         */
        toggle_action(name, loading) {
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
            // console.log("Protect " + this.protect);
          }

          if (
            loading &&
            ACABM.settings[name] === 0 &&
            action.id &&
            name !== "protect"
          ) {
            // console.log("clearInterval" + name);
            action.id = clearInterval(action.id);
          } else if (
            loading &&
            ACABM.settings[name] === 1 &&
            !action.id &&
            name !== "protect"
          ) {
            // console.log("setInterval " + name);
            action.id = setInterval(action.func, action.delay);
          }
        }

        /**
         * The `toggle_settings` function handles the toggling of settings for the autoclickandbuyMod.
         * @function
         * @returns {void}
         */
        toggle_settings() {
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
        }

        /**
         * The `delay_speed` function adjusts the delay of the specified action based on the given speed action.
         * @function
         * @param {string} name - The name of the action to adjust the delay for.
         * @param {string} speedaction - The speed action to perform. Can be either "add" or "sub".
         * @returns {void}
         */
        delay_speed(name, speedaction) {
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
        }

        /**
         * The `unqueue_action` function removes a queued action by name from the `timeouts` object and clears its timeout.
         * @function
         * @param {string} name - The name of the action to remove from the `timeouts` object.
         * @returns {void}
         */
        unqueue_action(name) {
          var to = this.actions.timeouts;
          if (to[name]) {
            // console.log("Unqueueing " + to[name]);
            clearTimeout(to[name]);
            delete to[name];
          }
        }

        /**
         * The `queue_action` function queues an action to be executed after a specified delay.
         * @function
         * @param {string} name - The name of the action to queue.
         * @param {number} delay - The delay (in milliseconds) before the action is executed.
         * @param {function} func - The function to execute when the delay has elapsed.
         * @returns {void}
         */
        queue_action(name, delay, func) {
          var to = this.actions.timeouts;
          // var roundedDelay = Math.round(delay);
          // console.log("Queueing " + roundedDelay, to);
          //this.unqueue_action(name);
          to[name] = setTimeout(function () {
            func();
            delete to[name];
          }, delay);
        }
      }

      /**
       * Object representing the view of the autoclickandbuyMod.
       * @typedef {Object} View
       * @property {Controller} ctrl - The controller for the view.
       * @property {Object.<string, string>} actions - The key-value pairs of keyboard shortcuts and their corresponding actions.
       */
      const view = {
        ctrl: new Controller(),
        actions: {
          KeyA: "autobuy",
          KeyZ: "ascendluck",
          KeyG: "gold",
          KeyF: "frenzy",
          KeyM: "main",
          KeyN: "fortune",
          KeyS: "status",
          KeyP: "protect",
          KeyW: "wrinklers",
        },
      };

      /**
       * Event listener for the `keydown` event.
       * @listens keydown
       * @param {Event} e - The event object.
       * @returns {void}
       */
      document.addEventListener("keydown", (e) => {
        if (ACABM.settings.hotkeys) {
          const action = view.actions[e.code];
          if (action) {
            if (e.code === "KeyS") {
              view.ctrl.toggle_action(action);
              return;
            }
            const value = ACABM.settings[action];
            const { values } = ACABMmenuDictionary[action];
            const newValue = (value + 1) % Object.entries(values).length;
            ACABM.settings[action] = newValue;
            Game.UpdateMenu();
          }
          if (e.shiftKey) {
            if (e.which == 49) {
              view.ctrl.delay_speed("main", "add");
            }
            if (e.which == 50) {
              view.ctrl.delay_speed("main", "sub");
            }
          }
        }
      });
    },
    /**
     * Loads the settings from a string.
     * @param {*} str
     * @returns {void}
     */
    load: function (str) {
      if (str && str.length > 0) {
        const saveData = JSON.parse(str);
    
        // Check if the data is in the old format
        const isOldData = !('wrinklersmax' in saveData);
    
        ACABMsettingsKeys.forEach((key) => {
          if (isOldData) {
            // Handle old format: Convert boolean values to numeric for non-array properties
            if (typeof saveData[key] === 'boolean' && !Array.isArray(ACABMdefaultSettings[key])) {
              this.settings[key] = saveData[key] ? 1 : 0;
            } else if (key in ACABMdefaultSettings) {
              // Use default value for missing fields or array fields
              this.settings[key] = ACABMdefaultSettings[key];
            }
          } else {
            // Handle new format: Assign array or numeric values as they are
            this.settings[key] = Array.isArray(saveData[key])
              ? [...saveData[key]]
              : +saveData[key] || 0;
          }
    
          // Add new fields with default values if they are missing
          // removed: isOldData && 
          if (!(key in this.settings)) {
            this.settings[key] = ACABMdefaultSettings[key];
          }
        });
      }
    },        
    /**
     * Saves the settings to a string.
     * @returns {string} The settings string.
     */
    save: function () {
      const saveData = {};
      ACABMsettingsKeys.forEach((key) => {
        saveData[key] = Array.isArray(this.settings[key])
          ? [...this.settings[key]]
          : this.settings[key];
      });
      return JSON.stringify(saveData);
    },
    /**
     * Resets the settings to their default values.
     */
    settings: ACABMdefaultSettings,
    /**
     * AutoBuy status message.
     * @type {string}
     * @memberof ACABM
     */
    abmessage: {},
    /**
     * Adds the mod's menu to the game's preferences menu.
     * Only adds the menu if the current menu is the preferences menu.
     * @memberof ACABM
     */
    addMenu() {
      if (Game.onMenu === "prefs") {
        const newBlock = this.createMenu();
        const menu = document.getElementById("menu");
        const titleSection = menu.querySelector(".section");
        menu.insertBefore(
          newBlock,
          titleSection.nextSibling.nextSibling.nextSibling
        );
      }
    },
    /**
     * Creates the mod's menu in the game's preferences menu.
     * @returns {HTMLDivElement} The created menu block.
     * @memberof ACABM
     */
    createMenu() {
      const block = document.createElement("div");
      block.className = "block";
      block.style.padding = "0px";
      block.style.margin = "8px 4px";

      const subsection = document.createElement("div");
      subsection.className = "subsection";
      subsection.style.padding = "0px";
      block.appendChild(subsection);

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = "Auto Click and Buy Mod";
      subsection.appendChild(title);

      //   "autobuymaxWait",
      const skipSetting = [
        "mainspeed",
        "wrinklersmax",
        "upgradevault",
        "buildingvault",
        "options",
      ];

      for (const key of ACABMsettingsKeys) {
        if (!skipSetting.includes(key)) {
          const listing = this.createMenuListing(key);
          subsection.appendChild(listing);
        }
      }

      return block;
    },
    /**
     * Creates a menu listing for the mod's menu in the game's preferences menu.
     * @param {string} id - The ID of the menu listing to create.
     * @memberof ACABM
     */
    createMenuListing(id) {
      const ACABM = this;
      const { settings } = ACABM;
      const { name, description, values } = ACABMmenuDictionary[id];
      /**
       * Static Upgrade IDs need to move this to the settings options.
       * Add a comma separated list of upgrade IDs to UUPids array.
       * @type {Array}
       */
      const UPPids = [227];

      /**
       * Toggles the specified value in the given array.
       * If the value is already in the array, it is removed.
       * If the value is not in the array, it is added.
       * @param {Array} array - The array to toggle the value in.
       * @param {*} value - The value to toggle in the array.
       */
      function toggleOption(array, value) {
        const index = array.indexOf(value);
        if (index !== -1) {
          array.splice(index, 1);
        } else {
          array.push(value);
        }
      }

      /**
       * Creates a slider HTML element with specified properties.
       *
       * @param {string} slider - The ID of the slider element.
       * @param {string} leftText - The text to display on the left side of the slider.
       * @param {string} rightText - The text to display on the right side of the slider.
       * @param {Function} startValueFunction - A function that returns the starting value of the slider.
       * @param {number} minVal - The minimum value of the slider.
       * @param {number} maxVal - The maximum value of the slider.
       * @param {number} stepVal - The step value of the slider.
       * @param {string} [callback=""] - The function to call when the slider value changes.
       * @returns {string} The HTML code for the slider element.
       */
      function createSlider(
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
      }

      /**
       * Creates a button element with the given title, setting key, and label.
       * @param {string} title - The title of the button.
       * @param {string} settingKey - The key of the setting associated with the button.
       * @param {string} [label] - The label to display next to the button.
       */
      function createButton(title, settingKey, label) {
        const div = document.createElement("div");
        const a = document.createElement("a");
        const optionIndex = settings.options.indexOf(settingKey);

        a.className = `smallFancyButton prefButton option ${
          optionIndex !== -1 ? "" : "off"
        }`;
        a.innerText = `${title} ${optionIndex !== -1 ? `${ACABMTranslate('optionOn')}` : `${ACABMTranslate('optionOff')}`}`;
        a.onclick = function () {
          toggleOption(settings.options, settingKey);
          PlaySound("snd/tick.mp3");
          Game.UpdateMenu();
        };

        div.appendChild(a);

        if (label) {
          const labelElement = document.createElement("label");
          labelElement.innerText = label;
          div.appendChild(labelElement);
        }

        listing.appendChild(div);
      }

      const listing = document.createElement("div");
      listing.className = "listing";

      let a = document.createElement("a");
      const smallFancyButtonClass = "smallFancyButton";
      const prefButtonClass = "prefButton";

      a.className = `${smallFancyButtonClass} ${prefButtonClass} option${
        settings[id] > 0 ? "" : " off"
      }`;
      a.innerText = `${name} ${values[settings[id]]}`;
      a.onclick = function () {
        const newValue = (settings[id] + 1) % Object.entries(values).length;
        settings[id] = newValue;

        if (
          id === "autobuy" &&
          settings[id] &&
          settings.options.indexOf("ABExpand") == -1
        ) {
          settings.options.push("ABExpand");
        } else if (
          id === "wrinklers" &&
          settings[id] &&
          settings.options.indexOf("AWExpand") == -1
        ) {
          settings.options.push("AWExpand");
        } else if (
          id === "gold" &&
          settings[id] &&
          settings.options.indexOf("AGExpand") == -1
        ) {
          settings.options.push("AGExpand");
        }

        PlaySound("snd/tick.mp3");
        Game.UpdateMenu();
      };

      listing.appendChild(a);

      if (id === "autobuy") {
        let a = document.createElement("a");
        a.className = `smallFancyButton`;
        a.innerText = `${
          settings.options.indexOf("ABExpand") != -1
            ? ACABMTranslate("optionCollapse")
            : ACABMTranslate("optionExpand")
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

      if (id === "wrinklers") {
        let a = document.createElement("a");
        a.className = `smallFancyButton`;
        a.innerText = `${
          settings.options.indexOf("AWExpand") != -1
            ? ACABMTranslate("optionCollapse")
            : ACABMTranslate("optionExpand")
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

      if (id === "gold") {
        let a = document.createElement("a");
        a.className = `smallFancyButton`;
        a.innerText = `${
          settings.options.indexOf("AGExpand") != -1
            ? ACABMTranslate("optionCollapse")
            : ACABMTranslate("optionExpand")
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

      if (id === "autobuy" && settings[id]) {
        var labelabmsg = document.createElement("div");
        labelabmsg.innerHTML = `<p><h2 style="font-size:1em;">${ACABM.abmessage["buy"]}</h2></p>`;
        listing.appendChild(labelabmsg);
        let a = document.createElement("a");
        a.className = `smallFancyButton`;
        a.innerText = `${ACABMTranslate('autobuyMR')}`;
        a.onclick = function () {
          PlaySound("snd/tick.mp3");
          Game.UpdateMenu();
        };
        listing.appendChild(a);
        var label = document.createElement("label");
        label.innerText = `( ${ACABMTranslate('autobuyMRDescription')} )`;
        listing.appendChild(label);
      }

      if (id === "ascendluck" && ACABM.abmessage["ALmsg"]) {
        var labelalmsg = document.createElement("div");
        labelalmsg.innerHTML = `<p><h2 style="font-size:1em;">${ACABM.abmessage["ALmsg"]}</h2></p>`;
        listing.appendChild(labelalmsg);
      }

      if (id === "krumblor" && ACABM.abmessage["AKmsg"]) {
        var labelakmsg = document.createElement("div");
        labelakmsg.innerHTML = `<p><h2 style="font-size:1em;">${ACABM.abmessage["AKmsg"]}</h2></p>`;
        listing.appendChild(labelakmsg);
      }

      if (
        (id === "autobuy" &&
          settings[id] &&
          settings.options.indexOf("ABExpand") != -1) ||
        (id === "autobuy" && settings.options.indexOf("ABExpand") != -1)
      ) {
        var labelupgrades = document.createElement("div");
        labelupgrades.innerHTML = `<p></p><p><div style="font-size:1em;">${ACABMTranslate('autobuyVUName')} <label>${ACABMTranslate('autobuyVUDescription')}</label></div></p>`;
        for (var i = 0; i < UPPids.length; i++) {
          let UUP = Game.UpgradesById[UPPids[i]];
          let a = document.createElement("a");
          a.className = `smallFancyButton prefButton option${
            settings.upgradevault.indexOf(UUP.id) != -1 ? "" : " off"
          }`;
          a.innerText = `${UUP.name} ${
            settings.upgradevault.indexOf(UUP.id) != -1 ? `${ACABMTranslate('optionOn')}` : ` ${ACABMTranslate('optionOff')}`
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
        labeltech.innerHTML = `<p></p><p><div style="font-size:1em;">${ACABMTranslate('autobuyVTUName')} <label>${ACABMTranslate('autobuyVTUDescription')}</label></div></p>`;
        for (var i = 0; i < Game.UpgradesByPool["tech"].length; i++) {
          let UBP = Game.UpgradesByPool["tech"][i];
          let a = document.createElement("a");
          a.className = `smallFancyButton prefButton option${
            settings.upgradevault.indexOf(UBP.id) != -1 ? "" : " off"
          }`;
          a.innerText = `${UBP.name} ${
            settings.upgradevault.indexOf(UBP.id) != -1 ? `${ACABMTranslate('optionOn')}` : ` ${ACABMTranslate('optionOff')}`
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
        labelbuildings.innerHTML = `<p></p><p><div style="font-size:1em;">${ACABMTranslate('autobuyVBName')} <label>${ACABMTranslate('autobuyVBDescription')}</label></div></p>`;
        for (var i = 0; i < Game.ObjectsById.length; i++) {
          let UBI = Game.ObjectsById[i];
          let a = document.createElement("a");
          a.className = `smallFancyButton prefButton option ${
            settings.buildingvault.indexOf(UBI.id) != -1 ? "" : " off"
          }`;
          a.innerText = `${UBI.name} ${
            settings.buildingvault.indexOf(UBI.id) != -1 ? `${ACABMTranslate('optionOn')}` : ` ${ACABMTranslate('optionOff')}`
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
      } else if (id === "hotkeys" && settings[id]) {
        const labelhotkeys = document.createElement("div");
        const h4 = document.createElement("h4");
        h4.style.fontSize = "1.25em";
        h4.innerText = `${ACABMTranslate('hotkeysmenuTitle')}`;
        labelhotkeys.appendChild(h4);

        const p1 = document.createElement("p");
        p1.innerHTML = `M (${ACABMTranslate('mainName')}) <label>${ACABMTranslate('mainDescription')}</label>`;
        labelhotkeys.appendChild(p1);

        const div1 = document.createElement("div");
        div1.className = "listing";
        const p2 = document.createElement("p");
        p2.innerHTML = `Shift + 1 <label>${ACABMTranslate('mainhotkeyIncrease')}</label>`;
        const p3 = document.createElement("p");
        p3.innerHTML = `Shift + 2 <label>${ACABMTranslate('mainhotkeyDecrease')}</label>`;
        div1.appendChild(p2);
        div1.appendChild(p3);
        labelhotkeys.appendChild(div1);

        const p4 = document.createElement("p");
        p4.innerHTML = `G (${ACABMTranslate('goldName')}) <label>${ACABMTranslate('goldDescription')}</label>`;
        labelhotkeys.appendChild(p4);

        const p5 = document.createElement("p");
        p5.innerHTML = `F (${ACABMTranslate('frenzyName')}) <label>${ACABMTranslate('frenzyDescription')}</label>`;
        labelhotkeys.appendChild(p5);

        const p6 = document.createElement("p");
        p6.innerHTML = `A (${ACABMTranslate('autobuyName')}) <label>${ACABMTranslate('autobuyDescription')}</label>`;
        labelhotkeys.appendChild(p6);

        const p8 = document.createElement("p");
        p8.innerHTML = `P (${ACABMTranslate('protectName')}) <label>${ACABMTranslate('protectDescription')}</label>`;
        labelhotkeys.appendChild(p8);

        const p7 = document.createElement("p");
        p7.innerHTML = `S (${ACABMTranslate('statusName')}) <label>${ACABMTranslate('statusDescription')}</label>`;
        labelhotkeys.appendChild(p7);

        const p9 = document.createElement("p");
        p9.innerHTML = `N (${ACABMTranslate('fortuneName')}) <label>${ACABMTranslate('fortuneDescription')}</label>`;
        labelhotkeys.appendChild(p9);

        const p10 = document.createElement("p");
        p10.innerHTML = `W (${ACABMTranslate('wrinklersName')}) <label>${ACABMTranslate('wrinklersDescription')}</label>`;
        labelhotkeys.appendChild(p10);

        const p11 = document.createElement("p");
        p11.innerHTML = `Z (${ACABMTranslate('ascendluckName')}) <label>${ACABMTranslate('ascendluckDescription')}</label>`;
        labelhotkeys.appendChild(p11);

        listing.appendChild(labelhotkeys);
      } else if (id === "main" && settings[id]) {
        var labelautoclick = document.createElement("div");
        var slider = createSlider(
          "ACABMClickSlider",
          loc(ACABMTranslate('mainSDescription')),
          "[$]/ms",
          function () {
            return ACABM.settings["mainspeed"];
          },
          50,
          3000,
          50,
          "Game.mods['Auto click and buy Mod'].settings.mainspeed=Number(l('ACABMClickSlider').value);l('ACABMClickSliderRightText').innerHTML=l('ACABMClickSlider').value + '/ms';"
        );
        labelautoclick.innerHTML = slider;
        listing.appendChild(labelautoclick);
      } else if (
        (id === "wrinklers" &&
          settings[id] &&
          settings.options.indexOf("AWExpand") != -1) ||
        (id === "wrinklers" && settings.options.indexOf("AWExpand") != -1)
      ) {
        if (
          settings.wrinklersmax == -1 ||
          settings.wrinklersmax > Game.getWrinklersMax() - 1
        ) {
          settings.wrinklersmax = Game.getWrinklersMax() - 1;
        }
        var labelwrinklers = document.createElement("div");
        var slider = createSlider(
          "ACABMWrinklersSlider",
          loc(ACABMTranslate('wrinklersSDescription')),
          "[$]",
          function () {
            return ACABM.settings["wrinklersmax"];
          },
          0,
          Game.getWrinklersMax() - 1,
          1,
          "Game.mods['Auto click and buy Mod'].settings.wrinklersmax=Number(l('ACABMWrinklersSlider').value);l('ACABMWrinklersSliderRightText').innerHTML=l('ACABMWrinklersSlider').value;"
        );
        labelwrinklers.innerHTML = slider;
        listing.appendChild(labelwrinklers);

        createButton(
          ACABMTranslate('popSWName'),
          "popSW",
          `( ${ACABMTranslate('popSWDescription')} )`
        );
      } else if (
        (id === "gold" &&
          settings[id] &&
          settings.options.indexOf("AGExpand") != -1) ||
        (id === "gold" && settings.options.indexOf("AGExpand") != -1)
      ) {
        createButton(
          ACABMTranslate('goldenACName'),
          "goldenAC",
          `( ${ACABMTranslate('goldenACDescription')} )`
        );
        createButton(
          ACABMTranslate('wrathACName'),
          "wrathAC",
          `( ${ACABMTranslate('wrathACDescription')} )`
        );
        createButton(
          ACABMTranslate('wrathACSName'),
          "wrathACS",
          `( ${ACABMTranslate('wrathACSDescription')} )`
        );
        createButton(
          ACABMTranslate('reindeerACName'),
          "reindeerAC",
          `( ${ACABMTranslate('reindeerACDescription')} )`
        );
      }
      return listing;
    },
  };

  /**
   * Register the mod to Cookie Clicker
   */
  Game.registerMod("Auto click and buy Mod", ACABM);
})();
