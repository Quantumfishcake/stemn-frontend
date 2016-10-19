// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import SidebarTimelineRow from './SidebarTimelineRow'
import FileChangeTitleRow from 'app/renderer/main/modules/Changes/CommitChanges/FileChangeTitleRow';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import { MdMoreHoriz } from 'react-icons/lib/md';
import { every } from 'lodash';
import StringFilterMenu from 'app/renderer/main/modules/StringFilter/StringFilterMenu.jsx';


const eventFilter = [{
  text: 'Filter: Revisions',
  value: 'event:revision',
},{
  text: 'Filter: Commits',
  value: 'event:commit',
},{
  text: 'Filter: All',
  value: ''
}];

///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  filterItems(items, fullQuery){
    const fullQueryArray = fullQuery ? fullQuery.split(' ') : [];
    return items.filter(item => every(fullQueryArray, queryString => this.queryByString(item, queryString)))
  },
  queryByString(item, queryString){
    if     (queryString == 'event:revision'){
      return item.event == 'revision'
    }
    else if(queryString == 'event:commit'){
      return item.event == 'commit'
    }
    // Filter by the string itself (case independent)
    else if(queryString && queryString.length > 0){
      return new RegExp(queryString, 'i').test(item.data.name)
    }
    else{
      return true;
    }
  },
  render() {
    const { selected, items, loading, onSelect, query, queryModel, refresh } = this.props;
    const filteredItems = this.filterItems(items, query);
    return (
      <div className="layout-column flex">
        <FileChangeTitleRow text="Recent Events">
          <PopoverMenu preferPlace="below">
            <SimpleIconButton>
              <MdMoreHoriz size="20px" />
            </SimpleIconButton>
            <div className="PopoverMenu">
              <StringFilterMenu filter={eventFilter} model={queryModel} value={query}/>
              <div className="divider"></div>
              <a onClick={refresh}>Refresh</a>
            </div>
          </PopoverMenu>
        </FileChangeTitleRow>
        <div className="scroll-box flex rel-box">
          {
            filteredItems && filteredItems.length > 0
            ? filteredItems.map((item)=>
              <SidebarTimelineRow
                item={item}
                key={item._id}
                isActive={item._id == selected}
                clickFn={()=>onSelect(item)} />
              )
            : <div className="layout-column layout-align-center-center flex" style={{height: '100%'}}>
                <div className="text-center text-title-4">No Feed items yet</div>
              </div>
          }
          <LoadingOverlay show={loading} />
        </div>
      </div>
    )
  }
});