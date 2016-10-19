// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ElectronWindowActions from 'app/shared/electronActions/window.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import Toolbar from 'app/renderer/menubar/modules/Toolbar/Toolbar.jsx'
import cloudProject   from 'app/renderer/assets/images/pure-vectors/cloud-project.svg';
import Button  from 'app/renderer/main/components/Buttons/Button/Button.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { AuthActions, auth } = this.props

    return (
      <div className="layout-column flex">
        <Toolbar></Toolbar>
        <div className="flex layout-column layout-align-center-center text-center" style={{padding: '15px'}}>
          <img src={cloudProject}/>
          <div className="text-title-4"
          style={{fontWeight: '500'}}>
            Connect to STEMN
          </div>
          <div style={{margin: '15px 0'}}
          className="text-subtitle-1">
            Access revision history, file previews<br/>and STEMN collaboration tools.
          </div>
          <Button style={{marginBottom: '40px'}}
          onClick={ElectronWindowActions.windowMainOpen}
          className="primary">
            Get started
          </Button>
        </div>
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);