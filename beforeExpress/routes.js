const fs = require("fs");

function requestHandler(req, res) {
  const { url, method } = req;
  if (url === "/" && method == "GET") {
    res.write("<html>");
    res.write("<head><title>Hello World</title></head>");
    res.write(
      "<body><form method='POST' action='/message'><input type='text' name='message'><input type='Submit' value='Submit'></form></body>"
    );
    res.write("</html>");
    return res.end();
  } else if (url === "/about") {
    res.write("<html>");
    res.write("<body><h1>Hello World from /about</h1></body>");
    res.write("</html>");
    return res.end();
  } else if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", chunk => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFileSync("message.text", message);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
}

module.exports = {
  handler: requestHandler,
  text: "Hello world"
};
