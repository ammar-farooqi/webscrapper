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
  let response = await axios(url);
  const html = response.data;
  try {
    const dom = htmlparser2.parseDocument(html, {
      xmlMode: true,
      decodeEntities: true,
    });
    let json;
    const $ = cheerio.load(dom);
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

    res.status(201).send(listItems);
  } catch (err) {
    console.log("html---->", html);
    console.log("err-->", err);
    res.status(400).send(err);
  }
});

module.exports = router;
