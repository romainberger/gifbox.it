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
            })
        }
    })

    var login = document.querySelector('#login')

    window.fbAsyncInit = function() {
        FB.init({
            appId :  facebookAppId,
            xfbml:   true,
            version: 'v2.0'
        })

        React.renderComponent(LoginButton(null ), login)
    }

}(React);
