import React, { PureComponent } from 'react';
import ListView from '../components/ListView';
import LoadMore from '../components/LoadMore';

import './App.less';

export default class App extends PureComponent {
  render() {
    return (
      <div className="app">
        <ListView
          pageNumber={1}
          pageSize={10}
          dataLoading={false}
          dataListPerPage={[]}
          totalCount={0}
          renderItem={() => {}}
          firstLoadingText="正在努力加载哟"
          listEmptyText="矮油，什么都没有耶"
        />
        <LoadMore
          pageNumber={1}
          pageSize={10}
          totalCount={0}
          dataLoading={false}
          onLoadBtnClick={() => {}}
        />
      </div>
    );
  }
}
