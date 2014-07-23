/** @jsx React.DOM */

!function(React) {

  'use strict';

  var LoginButton = React.createClass({
    getInitialState: function() {
      var self = this
      FB.getLoginStatus(function(res) {
        if (res.status === 'connected') {
          self.getInfos()
          self.setState({connected: true})
        }
        else {
          self.setState({connected: false})
        }
      })

      return {}
    },
    render: function() {
      if (this.state.connected && this.state.user) {
        return (
          <span>Welcome {this.state.user.name}</span>
        )
      }
      else {
        return (
          <button className="btn btn-default" onClick={this.loginFacebook}>Login with Facebook</button>
        )
      }
    },
    loginFacebook: function() {
      var self = this

      FB.getLoginStatus(function(res) {
        if (res.status === 'connected') {
          self.setState({connected: true})
          self.getInfos()
        }
        else {
          FB.login(function(res) {
            if (res.status === 'connected') {
              self.setState({connected: true})
              self.getInfos()
            }
          })
        }
      })
    },
    getInfos: function() {
      var self = this
      FB.api('/me', function(res) {
        self.setState({user: res})
        Event.emit('user:login')
      })
    }
  })

  var CollectionList = React.createClass({
    render: function() {
      var collections = FIXTURES.collections.map(function(collection) {
        return <CollectionPreview collection={collection} />
      })

      return (
        <div className="col-md-12">
          <div className="row">
            <h2 className="col-md-12">My collections</h2>
          </div>
          {collections}
        </div>
      )
    }
  })

  var CollectionPreview = React.createClass({
    render: function() {
      return (
        <div className="row">
          <div className="col-md-12">
            <a href={"/#/collection/" + this.props.collection.id}>{this.props.collection.name}</a>
          </div>
        </div>
      )
    }
  })

  var Collection = React.createClass({
    render: function() {
      var gifs = this.props.gifs.map(function(gif) {
        return <GifPreview gif={gif} />
      })

      return (
        <div className="col-md-12">
          <div className="row">
            <h2 className="col-md-12">Collection / {this.props.collection.name}</h2>
          </div>
          {gifs}
        </div>
      )
    }
  })

  var GifPreview = React.createClass({
    render: function() {
      return (
        <div className="row gif-preview">
          <div className="col-md-12">
            <a href={"/#/gif/" + this.props.gif.id}>
              <img src={this.props.gif.url} />
            </a>
          </div>
        </div>
      )
    }
  })

  var Gif = React.createClass({
    render: function() {
      return (
        <div>
          <div>
            Collection: <a href={"/#/collection/" + this.props.collection.id}>{this.props.collection.name}</a></div>
          <div>
            <img src={this.props.gif.url} />
          </div>
        </div>
      )
    }
  })

  var login = document.querySelector('#login')
    , app   = document.querySelector('#app')

  window.fbAsyncInit = function() {
    FB.init({
      appId :  facebookAppId,
      xfbml:   true,
      version: 'v2.0'
    })

    React.renderComponent(<LoginButton />, login)
  }

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'collection/:id_collection': 'collection',
      'gif/:id_gif': 'gif'
    },
    index: function() {
      // Event.on('user:login', function() {
      //   React.renderComponent(<CollectionList />, app)
      // })

      React.renderComponent(<CollectionList />, app)
    },
    collection: function(idCollection) {
      var collection = _.find(FIXTURES.collections, {id: parseInt(idCollection)})
        , gifs = _.filter(FIXTURES.gifs, {id_collection: parseInt(idCollection)})

      React.renderComponent(<Collection collection={collection} gifs={gifs} />, app)
    },
    gif: function(idGif) {
      var gif = _.find(FIXTURES.gifs, {id: parseInt(idGif)})
        , collection = _.find(FIXTURES.collections, {id: gif.id_collection})
      React.renderComponent(<Gif gif={gif} collection={collection} />, app)
    }
  })

  new AppRouter()

  Backbone.history.start()

}(React);
