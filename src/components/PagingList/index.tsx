/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
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
  enableScrollingAutoLoad?: boolean; // 是否启用滚动时自动加载下一页数据
  distanceHeightFromBottom?: number; // 距离底部的高度为多少时自动加载
}

const PagingList: React.FC<IPagingListProps> = (props: IPagingListProps) => {
  const {
    layoutType, pageSize, requestData, renderItem,
    listViewOptions, loadMoreOptions,
    enableScrollingAutoLoad, distanceHeightFromBottom
  } = props;

  const [pageNum, setPageNum] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const [pagedResult, setPagedResult] = useState<any>(null);
  const [dataListPerPage, setDataListPerPage] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const pageListWrapRef = useRef<HTMLDivElement>(null);

  const loadNextPageData = (pageNumber: number) => {
    if (totalPages !== 0 && pageNum >= totalPages) {
      return;
    }

    setDataLoading(true);

    setTimeout(() => {
      const result = requestData({ pageSize, pageNumber });
      setPagedResult(result);

      setPageNum(pageNumber);
      setDataLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadNextPageData(pageNum);
  }, []);

  useEffect(() => {
    if (pagedResult) {
      const { dataList, total } = pagedResult;
      const totalPages2 = Math.floor((total % pageSize === 0)
        ? (total / pageSize)
        : (total / pageSize + 1));

      setDataListPerPage(dataList);
      setTotalCount(total);
      setTotalPages(totalPages2);
    }
  }, [pageNum, dataLoading]);

  const pageListWrapScroll = () => {
    let pageListWrap: HTMLDivElement | undefined;
    if (pageListWrapRef && pageListWrapRef.current) {
      pageListWrap = pageListWrapRef.current;
    }

    if (pageListWrap) {
      let parentWrapOrScreenHeight = pageListWrap.parentElement?.clientHeight;
      if (!parentWrapOrScreenHeight) {
        parentWrapOrScreenHeight = window.screen.height;
      }

      const wrapScrollTop = pageListWrap.scrollTop;
      const wrapScrollHeight = pageListWrap.scrollHeight;

      const temp1 = distanceHeightFromBottom ?? 160;
      if (wrapScrollTop + parentWrapOrScreenHeight >= wrapScrollHeight - temp1) {
        loadNextPageData(pageNum + 1);
      }
    }
  };

  useEffect(() => {
    let pageListWrap: HTMLDivElement | undefined;
    if (pageListWrapRef && pageListWrapRef.current) {
      pageListWrap = pageListWrapRef.current;
    }

    if (enableScrollingAutoLoad === true) {
      if (pageListWrap) {
        pageListWrap.addEventListener('scroll', pageListWrapScroll);
      }
    }

    return () => {
      if (enableScrollingAutoLoad === true) {
        if (pageListWrap) {
          pageListWrap.removeEventListener('scroll', pageListWrapScroll);
        }
      }
    };
  }, [pageNum, dataLoading]);

  return (
    <div className="paging_list" ref={pageListWrapRef}>
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
        dataLoading={dataLoading}
        totalCount={totalCount}
        totalPages={totalPages}
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
  enableScrollingAutoLoad: true,
  distanceHeightFromBottom: 160,
};

export default PagingList;
