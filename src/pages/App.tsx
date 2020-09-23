/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import React, { PureComponent } from 'react';
import axios from 'axios';
import PagingList, { IPageRequestParams, IPagedResult } from '../components/PagingList';

import './App.less';

interface IDataObj {
  title: string;
  catalog: string;
  tags: string;
  sub1: string;
  sub2: string;
  img: string;
  reading: string;
  online: string;
  bytime: string;
}

interface QueryBookInfoListParams {
  key: string; // 在个人中心 -> 我的数据，接口名称上方查看
  catalog_id: string; // 目录编号
  pn: number; // 数据返回起始
  rn: number; // 数据返回条数，最大30
  // dtype: string; // 返回数据的格式, xml或json, 默认json
}

const API_ADDRESS = 'http://apis.juhe.cn/goodbook/query';

// 本地运行程序后，调用聚合数据接口存在跨域问题，无法正常调用；
// 为了临时可以调用接口获取数据，可以使用 Chrome 浏览器的 --disable-web-security 模式进行访问；
// 执行以下命令（MacOS）：
// open -n /Applications/Google\ Chrome.app/ --args --disable-web-security --user-data-dir=Volumes/Transcend/Zhulei/WorkSpace/GitHub
// 注意：--user-data-dir 参数是你项目所在的本地路径。

export default class App extends PureComponent {
  requestData = async (params: IPageRequestParams) => {
    const { pageNumber, pageSize } = params;
    const start = (pageNumber - 1) * pageSize;
    const queryParams: QueryBookInfoListParams = {
      key: 'b2a2d1c0283d9f8e3c2e16f78fd2507a',
      catalog_id: '242',
      pn: start,
      rn: pageSize,
    };

    const {
      key, catalog_id, pn, rn,
    } = queryParams;

    let pagedResult: IPagedResult = {
      total: 0,
      dataList: [],
    };

    const url = `${API_ADDRESS}?key=${key}&catalog_id=${catalog_id}&pn=${pn}&rn=${rn}`;
    await axios({ withCredentials: false, method: 'get', url }).then((response: any) => {
      const { result } = response.data;
      const { data, totalNum } = result;
      pagedResult = {
        total: totalNum,
        dataList: data,
      };

      return pagedResult;
    }).catch((error) => {
      if (error) {
        console.log(error);
      }
    });

    return pagedResult;
  };

  render() {
    return (
      <div className="app">
        <PagingList
          layoutType="GRID"
          pageSize={16}
          requestData={this.requestData}
          renderItem={(item: IDataObj) => {
            const {
              title, catalog, tags, sub1, sub2, img, reading, online, bytime,
            } = item;
            return (
              <div key={title} className="list_item center border">
                <img src={img} style={{ width: '100%' }} alt={title} />
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
