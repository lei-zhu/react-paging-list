import React, { PureComponent } from 'react';
import './style.less';

import SVG_CAT from '../../assets/cat.svg';
import SVG_PANDA from '../../assets/panda.svg';

export interface IListViewOptions {
  firstLoadingText?: string; // 第一次加载时显示的文本
  listEmptyText?: string; // 列表为空时显示的文本
}

export interface IListViewProps<T> {
  layoutType: string; // 布局类型，可选值: ROW, GRID
  pageNumber: number; // 当前页码
  pageSize: number; // 每页数量
  dataLoading: boolean; // 数据加载中
  dataListPerPage: Array<T>; // 每页数据集
  totalCount: number; // 总记录数
  options: IListViewOptions;
  renderItem: Function; // 渲染每一项的回调函数
}

export interface IListViewState<T> {
  dataList: Array<T>; // 已加载数据集
  totalPages: Number; // 总页数
}

class ListView<T> extends PureComponent<IListViewProps<T>, IListViewState<T>> {
  constructor(props: IListViewProps<T>) {
    super(props);

    this.state = {
      dataList: [],
      totalPages: -1,
    };
  }

  static getDerivedStateFromProps(props: any, state: any) {
    const {
      pageNumber, pageSize,
      dataLoading, dataListPerPage,
      totalCount, // 总记录数
    } = props;

    if (dataLoading === false
      && (dataListPerPage && dataListPerPage.length === 0)
      && totalCount === 0) {
      return {
        totalPages: 0,
      };
    }

    if (dataLoading === false
      && (dataListPerPage && dataListPerPage.length > 0)
      && totalCount > 0) {
      const { dataList } = state;

      const loadedCount = dataList.length; // 已加载的记录数
      const afterLoadCount = pageNumber * pageSize; // 本次加载后的记录数

      // 总页数
      const totalPages = Math.floor((totalCount % pageSize === 0)
        ? (totalCount / pageSize)
        : (totalCount / pageSize + 1));

      if (loadedCount < afterLoadCount && loadedCount < totalCount) {
        const newDataList = dataList.concat(dataListPerPage);
        return {
          dataList: newDataList,
          totalPages,
        };
      }

      return {
        totalPages,
      };
    }

    return null;
  }

  renderFirstLoading = () => {
    const { options } = this.props;
    const { firstLoadingText } = options;
    return (
      <div className="list_loading">
        <img src={SVG_PANDA} alt="" />
        <br />
        <span>{firstLoadingText}</span>
      </div>
    );
  }

  renderListNothing = () => {
    const { options } = this.props;
    const { listEmptyText } = options;
    return (
      <div className="list_nothing">
        <img src={SVG_CAT} alt="" />
        <br />
        <span>{listEmptyText}</span>
      </div>
    );
  }

  render() {
    const { totalPages, dataList } = this.state;
    const { layoutType, dataLoading, renderItem } = this.props;

    if (totalPages === -1) {
      return (
        <div className="rpl_list_view_2">
          {this.renderFirstLoading()}
        </div>
      );
    }

    if (totalPages === 0 && dataLoading === false) {
      return (
        <div className="rpl_list_view_2">
          {this.renderListNothing()}
        </div>
      );
    }

    if (layoutType === 'GRID') {
      const content = dataList.map((item: T) => renderItem(item));
      return (
        <div className="rpl_list_view grid_layout">
          {content}
        </div>
      );
    }

    const content = dataList.map((item: T) => renderItem(item));
    return (
      <div className="rpl_list_view">
        {content}
      </div>
    );
  }
}

export default ListView;
