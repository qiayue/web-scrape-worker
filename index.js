//const url = "https://example.com"
const cheerio = require("cheerio")

async function crawlPage(response) {
  const {
      headers
  } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
      return JSON.stringify(await response.json())
  } else if (contentType.includes("application/text")) {
      return response.text()
  } else if (contentType.includes("text/html")) {
      return response.text()
  } else {
      return response.text()
  }
}


addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})


async function handleRequest(request) {
  const body = await request.json()
  const json = JSON.stringify(body)
  const json_parse = JSON.parse(json)
  const init = {
    headers: {
        "content-type": "text/html;charset=UTF-8",
    },
  }
  const site = json_parse.site


  if (site == "ebay") {
    if (json_parse.page > 0)  {
      var page = json_parse.page
    }
    else {
      var page = 1
    }

    var gen_url = "https://www.ebay.co.uk/sch/i.html?&_nkw=" + json_parse.search + "&_pgn=" + page + "&_ipg=200"
    //var gen_url = "https://httpbin.org/ip?json"
    var genned_success = "True"
  }
  else if (site == "amazon_uk")  {
    if (json_parse.page > 0)  {
      var page = json_parse.page
    }
    else {
      var page = 1
    }

    var gen_url = "https://www.amazon.co.uk/s?k=" + json_parse.search + "&page=" + page
    //var gen_url = "https://httpbin.org/ip?json"
    var genned_success = "True"
  }
  else {
    var genned_success = "False"
  }


  if (genned_success == "False") {
    var obj_fail = {"error": "Please put a valid site preset"};
    var json_output = JSON.stringify(obj_fail);
    var real_output = json_output;
  }
  else {
    var response = await fetch(gen_url, init) 
    var results = await crawlPage(response)
    //console.log(results)
    var $ = cheerio.load(results);
  }


  if (site == "ebay") {
    var obj = {
      ebay_list: []
    };

    $('.s-item').each((i, el) => {
      $('.LIGHT_HIGHLIGHT').remove();

      const titles = $(el)
      .find(".s-item__title")
      .text()
      .replace(/,/,' ')
      //.replace(remove, '')

      const price = $(el)
      .find('.s-item__price')
      .eq(0)
      .text()
      .replace(/\s\s+/g, '')
      .replace(/,/,' ');

      if (titles !== "") {
        obj.ebay_list.push({"title": titles, "price": price});
      }
    });
    var json_output = JSON.stringify(obj);
    var real_output = json_output;
  }
  else if (site == "amazon_uk")  {
    var obj = {
      amazon_list: []
    };

    $('.s-result-item').each((i, el) => {

      $('.a-text-price').remove();

      const titles = $(el)
      .find(".a-size-medium")
      .text()
      .replace(/,/,' ')

      const prices = $(el)
      .find(".a-offscreen")
      .text()
  
      if (prices !== "") {
          obj.amazon_list.push({"title": titles, "price": prices});
      }
    });
    var json_output = JSON.stringify(obj);
    var real_output = json_output;
  }
  
  
  obj = {
    item_list: []
  };


  return new Response(real_output, {
    headers: { 'content-type': 'text/plain' },
  })

  
}

//curl -H "Content-type: application/json" -d '{"url": "https://www.ebay.co.uk/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313&_nkw=car&_sacat=0&LH_TitleDesc=0&_odkw=playstation+1&_osacat=0"}' http://127.0.0.1:8787/