const fs = require("fs");

const files = {
  "index.html": "de",
  "index.en.html": "en",
  "index.fr.html": "fr",
  "index.es.html": "es",
  "index.ru.html": "ru",
};

const imgs = ["analyse", "aether", "statistic"];

for (const [file, loc] of Object.entries(files)) {
  let h = fs.readFileSync(file, "utf8");
  let c = 0;

  for (const img of imgs) {
    // Match: <img\n                  src="assets/screenshots_new/analyse_de.jpg"\n  ...  />
    const re = new RegExp(
      '(<img\\s+\\n\\s+src="assets/screenshots_new/' +
        img +
        '_[a-z]{2}\\.jpg"\\s*\\n)((?:\\s+[^>]+\\n)*\\s*/>)',
      "",
    );
    const m = h.match(re);
    if (m) {
      const oldImg = m[0];
      const newSrc =
        '                  src="assets/screenshots_new/' +
        img +
        "_" +
        loc +
        '.jpg"\n';
      const webpSource =
        '                  <source srcset="assets/screenshots_new/' +
        img +
        "_" +
        loc +
        '.webp" type="image/webp" />\n';
      const rep =
        "<picture>\n" +
        webpSource +
        "                  <img\n" +
        "                    " +
        newSrc.trim() +
        "\n" +
        "                  " +
        m[2].trim() +
        "\n                </picture>";
      h = h.replace(oldImg, rep);
      c++;
    }
  }

  if (c > 0) {
    fs.writeFileSync(file, h);
    console.log(
      file + ": " + c + " imgs -> <picture> webp + locale(" + loc + ")",
    );
  } else {
    console.log(file + ": no matches found");
  }
}
