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
        React.DOM.div(null, collections)
      )
    }
  })

  var CollectionPreview = React.createClass({displayName: 'CollectionPreview',
    render: function() {
      return (
        React.DOM.div(null, 
          React.DOM.a( {href:"/#/collection/" + this.props.collection.id}, this.props.collection.name)
        )
      )
    }
  })

  var Collection = React.createClass({displayName: 'Collection',
    render: function() {
      return (
        React.DOM.div(null, "Collection")
      )
    }
  })

  var Gif = React.createClass({displayName: 'Gif',
    render: function() {
      return (
        React.DOM.div(null, "Gif")
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
      React.renderComponent(Collection(null ), app)
    },
    gif: function(idGif) {
      React.renderComponent(Gif(null ), app)
    }
  })

  new AppRouter()

  Backbone.history.start()

}(React);
