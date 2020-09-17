import React, { PureComponent } from 'react';
import PagingList, { IPageRequestParams, IPagedResult } from '../components/PagingList';

import './App.less';

interface IDataObj {
  id: string;
  name: string;
  age: number;
  birthday: string;
}

export default class App extends PureComponent {
  item: IDataObj = {
    id: 'A001',
    name: 'zhuziyu',
    age: 6,
    birthday: '2015-02-09',
  };

  requestData = (params: IPageRequestParams) => {
    const { item } = this;
    const { pageNumber, pageSize } = params;

    const dataList: Array<IDataObj> = [];
    for (let i = 1; i <= 5; i++) {
      const newItem = { ...item };

      const id = `${item.id}-${pageNumber}-${pageSize}-${i}`;
      newItem.id = id;

      dataList.push(newItem);
    }

    const result: IPagedResult = {
      total: 5,
      dataList,
    };

    return result;
  }

  render() {
    return (
      <div className="app">
        <PagingList
          layoutType="GRID"
          pageSize={5}
          requestData={this.requestData}
          renderItem={(item: IDataObj) => {
            const {
              id, name, age, birthday,
            } = item;
            return (
              <div key={item.id} className="list_item center border">
                <div>{id}</div>
                <div>{name}</div>
                <div>{age}</div>
                <div>{birthday}</div>
              </div>
            );
          }}
          enableScrollingAutoLoad
          scrollingAutoLoadThreshold={480}
          enablePullDownToRefresh
          pullDownToRefreshThreshold={60}
        />
      </div>
    );
  }
}
