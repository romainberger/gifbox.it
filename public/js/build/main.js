/** @jsx React.DOM */

!function(React) {

  'use strict';

  var LoginButton = React.createClass({displayName: 'LoginButton',
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
          React.DOM.span(null, "Welcome ", this.state.user.name)
        )
      }
      else {
        return (
          React.DOM.button( {className:"btn btn-default", onClick:this.loginFacebook}, "Login with Facebook")
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

  var CollectionList = React.createClass({displayName: 'CollectionList',
    render: function() {
      var collections = FIXTURES.collections.map(function(collection) {
        return CollectionPreview( {collection:collection} )
      })

      return (
        React.DOM.div( {className:"col-md-12"}, 
          React.DOM.div( {className:"row"}, 
            React.DOM.h2( {className:"col-md-12"}, "My collections")
          ),
          collections
        )
      )
    }
  })

  var CollectionPreview = React.createClass({displayName: 'CollectionPreview',
    render: function() {
      return (
        React.DOM.div( {className:"row"}, 
          React.DOM.div( {className:"col-md-12"}, 
            React.DOM.a( {href:"/#/collection/" + this.props.collection.id}, this.props.collection.name)
          )
        )
      )
    }
  })

  var Collection = React.createClass({displayName: 'Collection',
    render: function() {
      var gifs = this.props.gifs.map(function(gif) {
        return GifPreview( {gif:gif} )
      })

      return (
        React.DOM.div( {className:"col-md-12"}, 
          React.DOM.div( {className:"row"}, 
            React.DOM.h2( {className:"col-md-12"}, "Collection / ", this.props.collection.name)
          ),
          gifs
        )
      )
    }
  })

  var GifPreview = React.createClass({displayName: 'GifPreview',
    render: function() {
      return (
        React.DOM.div( {className:"row gif-preview"}, 
          React.DOM.div( {className:"col-md-12"}, 
            React.DOM.a( {href:"/#/gif/" + this.props.gif.id}, 
              React.DOM.img( {src:this.props.gif.url} )
            )
          )
        )
      )
    }
  })

  var Gif = React.createClass({displayName: 'Gif',
    render: function() {
      return (
        React.DOM.div(null, 
          React.DOM.div(null, 
            "Collection: ", React.DOM.a( {href:"/#/collection/" + this.props.collection.id}, this.props.collection.name)),
          React.DOM.div(null, 
            React.DOM.img( {src:this.props.gif.url} )
          )
        )
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

    React.renderComponent(LoginButton(null ), login)
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

      React.renderComponent(CollectionList(null ), app)
    },
    collection: function(idCollection) {
      var collection = _.find(FIXTURES.collections, {id: parseInt(idCollection)})
        , gifs = _.filter(FIXTURES.gifs, {id_collection: parseInt(idCollection)})

      React.renderComponent(Collection( {collection:collection, gifs:gifs} ), app)
    },
    gif: function(idGif) {
      var gif = _.find(FIXTURES.gifs, {id: parseInt(idGif)})
        , collection = _.find(FIXTURES.collections, {id: gif.id_collection})
      React.renderComponent(Gif( {gif:gif, collection:collection} ), app)
    }
  })

  new AppRouter()

  Backbone.history.start()

}(React);
