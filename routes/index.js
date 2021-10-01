var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const htmlparser2 = require("htmlparser2");
const app = express();
let url =
  "https://www.daraz.pk/catalog/?spm=a2a0e.home.search.1.35e34937TZorTD&q=roku&_keyori=ss&from=search_history&sugg=roku_0_1";

/* GET home page. */
router.post("/", async function (req, res, next) {
  console.log("-----working----");
  url = req.body.url;
  try {
    let response = await axios(url);
    const html = response.data;
    const dom = htmlparser2.parseDocument(html, {
      xmlMode: true,
      decodeEntities: true,
    });
    let json;
    const $ = cheerio.load(dom);
    console.log(html);
    let scripts = [];
    $("script").each(function () {
      if ($(this).text().includes("window.pageData")) {
        scripts.push($(this).text().slice(16));
        json = JSON.parse($(this).text().slice(16), undefined, 2);
        // console.log("json----->", json);
      }
    });

    let listItems = json.mods.listItems;
    // console.log(listItems);

    res.json(listItems).send();
  } catch (err) {
    console.log("err-->", err);
    res.status(400).send();
  }
});

module.exports = router;
