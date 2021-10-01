var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const htmlparser2 = require("htmlparser2");
const app = express();
const url =
  "https://www.daraz.pk/catalog/?spm=a2a0e.home.search.1.35e34937TZorTD&q=roku&_keyori=ss&from=search_history&sugg=roku_0_1";

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render("index", { title: "Express" });

  axios(url).then((response) => {
    const html = response.data;
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
    // let help = $(".c2prKC");
    // let help = $(".c2prKC", html).each(function () {
    //   const title = $(this).text();
    //   console.log("--->", title);
    // });
    let listItems = json.mods.listItems;
    console.log(listItems);
  });
  res.status(200).send();
});

module.exports = router;
