/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import ListView, { IListViewOptions } from '../ListView';
import LoadMore, { ILoadMoreOptions } from '../LoadMore';
import './style.less';

export interface IPageRequestParams {
  pageNumber: number;
  pageSize: number;
}

export interface IPagedResult {
  dataList: Array<any>;
  total: number;
}

export interface IPagingListProps {
  layoutType?: string; // 布局类型，可选值: ROW, GRID
  pageSize: number; // 每页数量
  requestData: (params: IPageRequestParams) => IPagedResult; // 请求页面数据的回调函数
  renderItem: (item: any) => React.ReactNode; // 渲染列表项的回调函数
  listViewOptions?: IListViewOptions;
  loadMoreOptions?: ILoadMoreOptions;
}

const PagingList: React.FC<IPagingListProps> = (props: IPagingListProps) => {
  const {
    layoutType, pageSize, requestData, renderItem,
    listViewOptions, loadMoreOptions,
  } = props;

  const [pageNum, setPageNum] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const [pagedResult, setPagedResult] = useState<any>(null);
  const [dataListPerPage, setDataListPerPage] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<any>(0);

  const loadNextPageData = (pageNumber: number) => {
    setDataLoading(true);

    setTimeout(() => {
      const result = requestData({ pageSize, pageNumber });
      setPagedResult(result);

      setPageNum(pageNumber);
      setDataLoading(false);
    }, 3000);
  };

  useEffect(() => {
    loadNextPageData(pageNum);
  }, []);

  useEffect(() => {
    if (pagedResult) {
      const { dataList, total } = pagedResult;
      setDataListPerPage(dataList);
      setTotalCount(total);
    }
  }, [pageNum, dataLoading]);

  return (
    <div className="paging_list">
      <ListView
        layoutType={layoutType ?? 'ROW'}
        pageNumber={pageNum}
        pageSize={pageSize}
        dataLoading={dataLoading}
        dataListPerPage={dataListPerPage}
        totalCount={totalCount}
        options={{
          firstLoadingText: listViewOptions?.firstLoadingText,
          listEmptyText: listViewOptions?.listEmptyText,
        }}
        renderItem={renderItem}
      />
      <LoadMore
        pageNumber={pageNum}
        pageSize={pageSize}
        totalCount={totalCount}
        dataLoading={dataLoading}
        options={{
          loadingText: loadMoreOptions?.loadingText,
          loadBtnText: loadMoreOptions?.loadBtnText,
          noMoreText: loadMoreOptions?.noMoreText,
        }}
        onLoadBtnClick={() => {
          loadNextPageData(pageNum + 1);
        }}
      />
    </div>
  );
};

PagingList.defaultProps = {
  layoutType: 'ROW',
  pageSize: 10,
  listViewOptions: {
    firstLoadingText: '正在努力加载哟',
    listEmptyText: '矮油，什么都没有耶',
  },
  loadMoreOptions: {
    loadingText: '加载中...',
    loadBtnText: '加载更多',
    noMoreText: '没有了',
  },
};

export default PagingList;
