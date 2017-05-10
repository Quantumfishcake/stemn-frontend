import React, { Component, PropTypes } from 'react'
import { has, omit, orderBy, get } from 'lodash'
import classNames from 'classnames';
import classes from './FileList.css'
import FileBreadCrumbs from './components/FileBreadCrumbs'
import FileRow from './components/FileRow'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import MdRefresh from 'react-icons/md/refresh'
import MdHome from 'react-icons/md/home'
import MdSearch from 'react-icons/md/search'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import SearchInput from 'stemn-shared/misc/Search/SearchInput'
import { ContextMenuLayer } from "react-contextmenu"
import ContextMenu from 'stemn-shared/misc/ContextMenu/ContextMenu.jsx'
import FileListMenu from './FileList.menu.js'

const contextIdentifier = 'FileListCm';
const FileRowContext = ContextMenuLayer(contextIdentifier, props => props.file)(FileRow)

///////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  projectId       : PropTypes.string,             // Optional: The project id (this is used if we are not exploring a provider)
  path            : PropTypes.string,             // The current fileId: This folder will be opened when the modal inits.
  singleClickFn   : PropTypes.func,               // When a file is single clicked
  doubleClickFn   : PropTypes.func,               // When a file is double clicked
  crumbClickFn    : PropTypes.func,               // When a crumb is clicked
  selected        : PropTypes.object,             // The currently selected file
  contentStyle    : PropTypes.object,             // Styles for the content section
  crumbPopup      : React.PropTypes.bool,         // Optional: Should we show a popup on the crumbs?
  search          : React.PropTypes.bool,         // Optional: Should search be enabled
  options         : React.PropTypes.shape({
    allowFolder   : React.PropTypes.bool,
    foldersOnly   : React.PropTypes.bool,
    showMenu      : React.PropTypes.bool,
    explore       : React.PropTypes.string,       // Optional: 'dropbox' || 'drive' - The provider
  }),
  dispatch        : PropTypes.func,               // Actions
  fileList         : PropTypes.object,           // Store
};


export default class FileList extends Component {
  static propTypes = propTypesObject
  refresh = () => {
    const { getFiles, options, path, projectId } = this.props;
    getFiles({
      path,
      provider: options.explore,
      projectId,
    })
  }

  goHome = () => {
    const { crumbClickFn, projectId } = this.props
    crumbClickFn({
      file: {
        fileId: '',
        project: {
          _id: projectId
        }
      }
    })
  }
  renderResults = () => {
    const { fileList, options, selected, singleClickFn, doubleClickFn } = this.props
    const filesNormal = get(fileList, 'entries', [])
    const filesFiltered = options.foldersOnly
      ? filesNormal.filter(file => file.type === 'folder')
      : filesNormal
    const filesOrdered  = orderBy(filesFiltered, ['type', 'name'], ['desc', 'asc'])

    if (filesOrdered && filesOrdered.length > 0) {
      return filesOrdered.map(file => (
        <FileRowContext
          key={ file.fileId }
          file={ file }
          singleClick={ singleClickFn }
          doubleClick={ doubleClickFn }
          isActive= {selected && selected.fileId == file.fileId }
        />
      ))
    } else if(fileList && !fileList.loading){
      return <div style={ { padding: '15px' } }>No results</div>
    }
    return null
  }
  renderSearchResults = () => {
    const { fileList, options, selected, singleClickFn, doubleClickFn } = this.props
    const filesNormal = get(fileList, 'search', [])
    const filesFiltered = options.foldersOnly
      ? filesNormal.filter(file => file.type === 'folder')
      : filesNormal
    const filesOrdered  = orderBy(filesFiltered, ['type', 'name'], ['desc', 'asc'])

    if (filesOrdered && filesOrdered.length > 0) {
      return filesOrdered.map(file => (
        <FileRowContext
          key={ file.fileId }
          query={ fileList.query }
          file={ file }
          singleClick={ singleClickFn }
          doubleClick={ doubleClickFn }
          isActive= {selected && selected.fileId == file.fileId }
        />
      ))
    } else if(fileList && !fileList.loading){
      return <div style={ { padding: '15px' } }>No results</div>
    }
    return null
  }
  render() {
    const { fileList, fileListCacheKey, search, contentStyle, singleClickFn, doubleClickFn, crumbClickFn, selected, options, path, projectId, crumbPopup, dispatch, ...otherProps } = this.props;

    const isLoading = !fileList || fileList.loading;

    return (
      <div { ...otherProps }>
        <div className={classes.breadcrumbs + ' layout-row layout-align-start-center'}>
          <FileBreadCrumbs
            className="flex"
            meta={ get(fileList, 'folder', '') }
            clickFn={ crumbClickFn }
            popup={ crumbPopup }
          />
          <SimpleIconButton
            onClick={ this.goHome }
            title="Home"
          >
            <MdHome size={ 22 } />
          </SimpleIconButton>
          <SimpleIconButton
            onClick={ this.refresh }
            title="Refresh"
          >
            <MdRefresh size={ 22 } />
          </SimpleIconButton>
          { search
          ? <SearchInput
              value={ fileList.query }
              model={ `fileList.${fileListCacheKey}.query` }
              className={ classNames(classes.search, 'hide-xs') }
              placeholder="Search Files"
            />
          : null }

        </div>
        <div
          className="rel-box"
          style={ contentStyle }
        >
          <LoadingOverlay
            show={ isLoading }
            linear
            hideBg
            noOverlay
          />
          { get(fileList, 'query', '').length > 0
            ? this.renderSearchResults()
            : this.renderResults() }

          { options.showMenu
          ? <ContextMenu
              identifier={ contextIdentifier }
              menu={ FileListMenu(dispatch) }
            />
          : null }
        </div>
      </div>
    )
  }
}
