// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as UsersActions from 'app/shared/actions/users';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import { Link } from 'react-router';
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Header from 'app/renderer/main/modules/Header/Header.jsx'



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    this.props.UsersActions.getUser({userId: this.props.auth.user._id});
  },
  render() {
    return (
      <div className="layout-column flex">
        <Header>Settings</Header>
        <Tabs size="lg">
          <Link activeClassName="active" to="/settings/application">Application</Link>
          <Link activeClassName="active" to="/settings/account">Account</Link>
        </Tabs>
        <div className="layout-column flex">
          {this.props.children}
        </div>
      </div>
    );

  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({auth}, {params}) {
  return {
    auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    UsersActions: bindActionCreators(UsersActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
