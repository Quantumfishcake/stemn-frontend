// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SystemActions           from 'stemn-shared/desktop/System/System.actions.js';
import { clearState }               from 'stemn-shared/misc/State/State.actions.js';
import * as ModalActions            from 'stemn-shared/misc/Modal/Modal.actions.js';
import * as AutoLaunchActions       from 'stemn-shared/desktop/AutoLaunch/AutoLaunch.actions.js';
import * as AutoUpdateActions       from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.actions.js';
import * as ElectronWindowsActions  from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from 'electron/app/renderer/main/pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import { Link } from 'react-router';
import Toggle             from 'stemn-shared/misc/Input/Toggle/Toggle'
import ProgressButton     from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton.jsx'
import FileSelectInputElectron from 'stemn-shared/misc/FileSelectInput/FileSelectInputElectron.jsx'
import Checkbox           from 'stemn-shared/misc/Input/Checkbox/Checkbox';
import SimpleTable        from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable.jsx';
import Banner             from 'stemn-shared/misc/Banner/Banner.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////



const inputStyles = {
  textTransform: 'capitalize',
  padding: '0 10px',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.03)',
  borderRight: '1px solid rgb(234, 234, 234)',
  minWidth: '80px'
}
const toggleStyle = {
  margin: '8px 10px 8px 0'
};


export const Component = React.createClass({
  componentDidMount() {
    this.props.autoLaunchActions.getStatus();
  },
  confirmReset() {
    this.props.modalActions.showConfirm({
      message: 'This will clear all data and reset the application back to factory settings. This can be useful if some data has been corrupted.',
      modalConfirm: clearState()
    })
  },
  showReleaseModal() {
    this.props.modalActions.showModal({
      modalType: 'RELEASE_NOTES'
    })
  },
  render() {
    const { system, autoLaunch, autoUpdate, autoLaunchActions, autoUpdateActions, systemActions, electronWindowsActions } = this.props;


    const autoUpdateMessage = () => {
      if(autoUpdate.checkingForUpdate){
        return <span>Checking for update...</span>
      }
      else if(autoUpdate.updateDownloaded){
        return <span>Download complete. <a style={{marginLeft: '20px'}} className="link-primary" onClick={autoUpdateActions.installUpdate}>Update and restart</a></span>
      }
      else if(autoUpdate.updateAvailable){
        return <span>Downloading update...</span>
      }
      else if(autoUpdate.updateNotAvailable){
        return <span>You are up-to-date.<a style={{marginLeft: '20px'}} className="link-primary" onClick={autoUpdateActions.checkForUpdates}>Check again</a></span>
      }
      else{
        return (
          <span>
            <a className="link-primary" onClick={autoUpdateActions.checkForUpdates}>Check for updates</a>
            { autoUpdate.updateError ? <span style={{marginLeft: '20px'}}>Error: {autoUpdate.updateError}</span> : null }
          </span>
        )
      }
    }

    return (
      <div>
        { !system.installed && process.platform == 'linux' ? <Banner type="warn" style={{marginBottom: '15px'}}>Stemn Desktop is not properly installed and integrated with your Operating System. Some features will not work until you properly install the AppImage. Please restart Stemn Desktop and follow the prompts.</Banner> : null }
        <div className={classes.panel}>
          <h3>Cloud Providers</h3>
          <p>Stemn Desktop relies on Dropbox and Drive to track changes to your files. You should have the desktop client for at least one of these installed.</p>
          <p><a className="link-primary" onClick={systemActions.getProviderPath}>Locate providers automatically</a></p>
          <div style={{marginBottom: '10px'}}>
            <FileSelectInputElectron
              title="Select Dropbox Location"
              model="system.providerPath.dropbox"
              value={system.providerPath.dropbox}
              placeholder="Could not be located">
              <div className="layout-column layout-align-center-center" style={inputStyles}>Dropbox</div>
            </FileSelectInputElectron>
          </div>
          <div style={{marginBottom: '10px'}}>
            <FileSelectInputElectron
              title="Select Drive Location"
              model="system.providerPath.drive"
              value={system.providerPath.drive}
              placeholder="Could not be located">
              <div className="layout-column layout-align-center-center" style={inputStyles}>Drive</div>
            </FileSelectInputElectron>
          </div>
        </div>
        <div className={classes.panel}>
          <h3>Other options</h3>
          <div className="layout-row layout-align-start-center">
            <p className="flex" style={toggleStyle}>Start Stemn Desktop on system startup.</p>
            <Toggle changeAction={autoLaunchActions.toggle} value={autoLaunch.status}/>
          </div>
          <div className="layout-row layout-align-start-center">
            <p className="flex" style={toggleStyle}>Help improve Stemn by sending usage data.</p>
            <Toggle model="system.settings.usageData" value={system.settings.usageData}/>
          </div>
          <div className="layout-row layout-align-start-center">
            <p className="flex" style={toggleStyle} title="When auto-update is on, Stemn Desktop will check for updates (and begin downloading any updates) whenever the application starts.">Auto-update Stemn Desktop.</p>
            <Toggle model="system.settings.autoUpdate" value={system.settings.autoUpdate}/>
          </div>
          <div className="layout-row layout-align-start-center">
            <p className="flex" style={toggleStyle} title="Debug mode will cause info to be logged in the debug console. Press F11 or Ctrl+Shift+I to open the console.">Debug mode (requires <a className="link-primary" onClick={electronWindowsActions.relaunch}>restart</a>)</p>
            <Toggle model="system.settings.debug" value={system.settings.debug}/>
          </div>
        </div>
        <div className={classes.panel}>
          <h3>Application info</h3>
          <p>Stemn Desktop is currently in alpha. Please report any bugs and they will be fixed ASAP.</p>
          {autoUpdate.currentVersion
          ? <SimpleTable>
              <tr><td>Stream</td><td>alpha</td></tr>
              <tr><td>Version</td><td>{autoUpdate.currentVersion}</td></tr>
              <tr><td>Release Notes</td><td><a className="link-primary" onClick={this.showReleaseModal}>View release notes</a></td></tr>
              <tr><td>Update</td><td>{autoUpdateMessage()}</td></tr>
            </SimpleTable>
          : null}
        </div>

        <div className={classes.panel}>
          <h3>Report a bug</h3>
          <p>Found a problem with Stemn Desktop? Report it and we'll fix it ASAP!</p>
          <div className="layout-row layout-align-end">
            <ProgressButton className="primary" href="https://github.com/Stemn/Stemn-Desktop/issues">
              Report Bug
            </ProgressButton>
          </div>
        </div>

        <div className={classes.panel}>
          <h3>Reset application</h3>
          <p>If something goes wrong, this button will clear all cached data and reset the application.</p>
          <div className="layout-row layout-align-end">
            <ProgressButton className="warn" onClick={this.confirmReset}>
              Clear data
            </ProgressButton>
          </div>
        </div>
      </div>
    );
  }
});



///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({users, system, autoLaunch, autoUpdate}, {params}) {
  return {
    system,
    autoLaunch,
    autoUpdate
  };
}

function mapDispatchToProps(dispatch) {
  return {
    systemActions: bindActionCreators(SystemActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
    autoLaunchActions: bindActionCreators(AutoLaunchActions, dispatch),
    autoUpdateActions: bindActionCreators(AutoUpdateActions, dispatch),
    electronWindowsActions: bindActionCreators(ElectronWindowsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
