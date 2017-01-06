import React from 'react';

// Styles
import styles from './ContentSidebar.css';
import DragResize      from 'electron/app/renderer/main/modules/DragResize/DragResize.jsx';

const Sidebar = (props) => {
  return (
    <DragResize side="right" width="450" widthRange={[0, 1000]} className="layout-column flex">
      <aside className={styles.contentSidebar + ' layout-column flex'}>
        { props.children }
      </aside>
    </DragResize>
  );
};

export default Sidebar
