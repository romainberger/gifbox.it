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
        <div>{collections}</div>
      )
    }
  })

  var CollectionPreview = React.createClass({
    render: function() {
      return (
        <div>
          <a href={"/#/collection/" + this.props.collection.id}>{this.props.collection.name}</a>
        </div>
      )
    }
  })

  var Collection = React.createClass({
    render: function() {
      return (
        <div>Collection</div>
      )
    }
  })

  var Gif = React.createClass({
    render: function() {
      return (
        <div>Gif</div>
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
      React.renderComponent(<Collection />, app)
    },
    gif: function(idGif) {
      React.renderComponent(<Gif />, app)
    }
  })

  new AppRouter()

  Backbone.history.start()

}(React);
