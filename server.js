var connect = require('connect')
  , serveStatic = require('serve-static')
  , app = connect()

app.use(serveStatic('./', {'index': ['index.html']}))
app.listen(process.env.PORT || 8000)
