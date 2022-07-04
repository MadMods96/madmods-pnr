const createBrowserless = require("browserless");
const getHTML = require("html-get");
var HTMLParser = require("node-html-parser");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const browserlessFactory = createBrowserless();
console.log("Developed by Madmods !");
console.log("This is only for Study and experiment purpose !");
rl.question("Enter Your PRN Number? ", async function (pnr) {
  const get = getPNR(pnr);
  console.log("Getting your PNR Details ....");
  if (get === true) {
    rl.close();
  }
});

rl.on("close", function () {
  console.log("\nPNR checking tool created by MadMods!");
  process.exit(0);
});
const getPNR = async (PNR) => {
  const getContent = async (url) => {
    // create a browser context inside Chromium process
    const browserContext = browserlessFactory.createContext();
    const getBrowserless = () => browserContext;
    const result = await getHTML(url, { getBrowserless });
    // close the browser context after it's used
    await getBrowserless((browser) => browser.destroyContext());
    const root = HTMLParser.parse(result.html);
    let date_time = "";
    let train = "";
    let error = false;
    let boarding,
      journey_duration,
      destination,
      status,
      from,
      to,
      no_passengers,
      boarding_time_date,
      train_time_date,
      _class,
      destination_time,
      err_msg,
      gap;
    let passengers = [];

    root.getElementsByTagName("div").forEach((m) => {
      if (m.rawAttrs === `class="gXwZ" data-reactid="121"`) {
        error = true;
        err_msg = m.childNodes[0]._rawText;
      }

      if (m.classNames === "col-xs-5 _1z9W") {
        gap = parseInt(m.rawAttrs.split(`data-reactid="`)[1]);
      }

      if (m.rawAttrs === `class="_1w_t" data-reactid="124"`) {
        from = m.childNodes[0]._rawText;
      }

      if (m.rawAttrs === `class="JXaR" data-reactid="128"`) {
        journey_duration = m.childNodes[0]._rawText;
      }

      if (m.rawAttrs === `class="_1w_t" data-reactid="136"`) {
        to = m.childNodes[0]._rawText;
      }

      if (m.rawAttrs === `class="col-xs-7 _2bNc" data-reactid="137"`) {
        // no_passengers = m.childNodes.length - 1;
        let i = 1;
        while (i < m.childNodes.length) {
          let obj = {};
          let temp = m.childNodes[i];
          obj.name = temp.childNodes[0].childNodes[0].childNodes[0]._rawText;
          obj.number = temp.childNodes[1].childNodes[0].childNodes[0]._rawText;
          obj.status =
            temp.childNodes[3].childNodes[0].childNodes[0].childNodes[0]._rawText;
          passengers.push(obj);
          i++;
        }
        // console.log(m);
      }
    });

    root.getElementsByTagName("span").forEach((m) => {
      if (m.rawAttrs === `class="_1t1D" data-reactid="123"`) {
        date_time = m.childNodes[0]._rawText;
      }
      if (m.rawAttrs === `data-reactid="120"`) {
        train = m.childNodes[0]._rawText;
      }

      if (m.rawAttrs === `class="_1fIo" data-reactid="${gap + 4}"`) {
        boarding = m.childNodes[0]._rawText;
      }
      if (m.rawAttrs === `class="_1fIo" data-reactid="${gap + 7}"`) {
        boarding_time_date = m.childNodes[0]._rawText;
      }

      if (m.rawAttrs === `class="_1fIo" data-reactid="176"`) {
        train_time_date = m.childNodes[0]._rawText;
      }
      if (m.rawAttrs === `class="_1fIo" data-reactid="${gap + 10}"`) {
        _class = m.childNodes[0]._rawText;
      }

      if (m.rawAttrs === `class="_1t1D" data-reactid="131"`) {
        destination_time =
          m.childNodes[0]._rawText + " " + m.childNodes[2]._rawText;
      }
    });

    if (!error) {
      console.log(
        "Train : " +
          train +
          "\n" +
          "From : " +
          from +
          "\n" +
          "To : " +
          to +
          "\n" +
          "Time : " +
          date_time +
          "\n" +
          "Board at : " +
          boarding +
          "\n" +
          "Duration : " +
          journey_duration +
          "\n" +
          "Passengers : " +
          passengers +
          "\n" +
          "Boarding time and Date : " +
          boarding_time_date +
          "\n" +
          "Train time and Date : " +
          train_time_date +
          "\n" +
          "Class : " +
          _class +
          "\n" +
          "Destination Time : " +
          destination_time
      );
    } else {
      console.log("error : " + err_msg);
    }
  };
  getContent(`https://paytm.com/train-tickets/pnr-enquiry/${PNR}/-`)
    .then((content) => {
      // console.log(content);
      // console.log(process.env.URL);
      process.exit();
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

  return;
};
