var express = require("express"),
    routes = require("./app/routes");
var app = express();

app.set("view engine", "jade");
app.set("views", __dirname + "/app/views");

app.use("/css", express.static(__dirname + "/app/views/css"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/scripts", express.static(__dirname + "/app/scripts"));
app.use("/client", express.static(__dirname + "/client/js"))

app.get("/", routes.index);
app.get("/partials/:name", routes.partials);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("nextcapital todo app listening at http://%s:%s", host, port);
});

app.get('*', routes.index);