import React from 'react';
import classes from './AutodeskViewer.css';
import autodeskViewerUtils from '../PreviewCadViewer.utils.js';

export default React.createClass({
  viewerInstance: null,
  // Mounting
  onMount (nextProps, prevProps) {
    if(!prevProps || nextProps.urn != prevProps.urn || nextProps.token != prevProps.token){
      setTimeout(this.init(nextProps), 1); // Timeout so refs can init
    }
  },
  componentDidMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  componentWillUnmount(){
    autodeskViewerUtils.deregister(this.viewerInstance);
  },
  init(props) {
    const { urn, token } = this.props;
    const loadDocument = (viewer, options) => {
      const onLoadCallback = (doc) => {
        // Get all the 3D and 2D views (but keep in separate arrays so we can differentiate in the UI)
        oViews3D = window.Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
          'type': 'geometry',
          'role': '3d'
        }, true);
        oViews2D = window.Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
          'type': 'geometry',
          'role': '2d'
        }, true);

        // Load up first a 3D view by default
        if (oViews3D.length > 0){
          this.viewerInstance.load(doc.getViewablePath(oViews3D[0]));
        }
        else if (oViews2D.length > 0){
          this.viewerInstance.load(doc.getViewablePath(oViews2D[0]));
        }
        else{
          // $mdToast.show($mdToast.simple().theme('warn').content('Error: No views found'));
        }
      }
      const onErrorCallback = (errorMsg) => {
  //          $mdToast.show($mdToast.simple().theme('warn').content('Error: '+errorMsg));
      }

      if (options.document.substring(0, 4) === 'urn:'){
        options.document = options.document.substring(4);
      }
      window.Autodesk.Viewing.Document.load('urn:' + options.document, onLoadCallback, onErrorCallback);
    }

    const center = () => {
      if(this.viewerInstance){
        this.viewerInstance.resize()
      }
    }

    var viewerEl = this.refs.cadCanvas;
    var oDocument = null;

    var oViewables = null,
      oViews3D = null,
      oViews2D = null;

    var options = {
      'document': urn,
      'accessToken': token,
      'env': 'AutodeskProduction'
    };

    this.viewerInstance = autodeskViewerUtils.register(viewerEl); // With toolbar

    window.Autodesk.Viewing.Initializer(options, () => {
      this.viewerInstance.initialize();
      loadDocument(this.viewerInstance, options);
    });
  },
  render() {
    return <div className={classes.preview + ' flex rel-box'} ref="cadCanvas"></div>
  }
});
