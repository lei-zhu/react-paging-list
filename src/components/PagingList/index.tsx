/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useLayoutEffect, useRef,
} from 'react';
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
  scrollingAutoLoadThreshold?: number; // 距离底部的高度为多少时自动加载
  enablePullDownToRefresh?: boolean; // 是否启用下拉刷新
  pullDownToRefreshThreshold?: number; // 从容器顶部下拉高度多少时刷新数据
}

const PagingList: React.FC<IPagingListProps> = (props: IPagingListProps) => {
  const {
    layoutType, pageSize, requestData, renderItem,
    listViewOptions, loadMoreOptions,
    enableScrollingAutoLoad, scrollingAutoLoadThreshold,
    enablePullDownToRefresh, pullDownToRefreshThreshold,
  } = props;

  const [pageNum, setPageNum] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataLoadingSuccess, setDataLoadingSuccess] = useState(false);
  const [pagedResult, setPagedResult] = useState<any>(null);
  const [dataListPerPage, setDataListPerPage] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const pageListWrapRef = useRef<HTMLDivElement>(null);
  const pullDownRefereshStatusRef = useRef<HTMLDivElement>(null);
  const [startPositionY, setStartPositionY] = useState<number>(0);
  const [listRefreshing, setListRefreshing] = useState(false);
  const [listRefreshingSuccess, setListRefreshingSuccess] = useState(false);
  const [listRefreshingCallbackSuccess, setListRefreshingCallbackSuccess] = useState(false);

  const loadNextPageData = (pageNumber: number) => {
    if (listRefreshing === false) {
      if (totalPages !== 0 && pageNum >= totalPages) {
        return;
      }
    }

    // console.log(`pageNumber: ${pageNumber}`);
    // console.log(`listRefreshing: ${listRefreshing}`);
    // console.log(`totalPages: ${totalPages}`);

    // setPagedResult(null);
    // setDataListPerPage(null);

    setDataLoading(true);
    setTimeout(() => {
      const result = requestData({ pageSize, pageNumber });
      setPagedResult(result);
      setPageNum(pageNumber);
      setDataLoading(false);

      if (listRefreshing === true && pageNumber === 1) {
        setListRefreshingSuccess(true);
      }
    }, 2000);
  };

  const setDataResult = () => {
    const { dataList, total } = pagedResult;
    const totalPages2 = Math.floor((total % pageSize === 0)
      ? (total / pageSize)
      : (total / pageSize + 1));

    setDataListPerPage(dataList);
    setTotalCount(total);
    setTotalPages(totalPages2);
  };

  const pageListWrapScroll = () => {
    let pageListWrap: HTMLDivElement | undefined;
    if (pageListWrapRef && pageListWrapRef.current) {
      pageListWrap = pageListWrapRef.current;
    }

    if (pageListWrap) {
      let parentWrapOrScreenHeight = pageListWrap.parentElement?.clientHeight;
      if (!parentWrapOrScreenHeight) {
        parentWrapOrScreenHeight = document.body.clientHeight || window.screen.height;
      }

      const wrapScrollTop = pageListWrap.scrollTop;
      const wrapScrollHeight = pageListWrap.scrollHeight;

      const temp1 = scrollingAutoLoadThreshold ?? 160;
      if (wrapScrollTop + parentWrapOrScreenHeight >= wrapScrollHeight - temp1) {
        loadNextPageData(pageNum + 1);
      }
    }
  };

  const pageListWrapTouchStart = (e: any) => {
    let pageListWrap: HTMLDivElement | undefined;
    if (pageListWrapRef && pageListWrapRef.current) {
      pageListWrap = pageListWrapRef.current;
    }

    if (pageListWrap && dataLoading === false) {
      const touchData = e.touches[0];
      const startY = touchData.pageY;
      setStartPositionY(startY);

      pageListWrap.style.transition = 'transform 0s';
    }
  };

  const pageListWrapTouchMove = (e: any) => {
    let pageListWrap: HTMLDivElement | undefined;
    if (pageListWrapRef && pageListWrapRef.current) {
      pageListWrap = pageListWrapRef.current;
    }

    let pullDownRefereshStatus: HTMLDivElement | undefined;
    if (pullDownRefereshStatusRef && pullDownRefereshStatusRef.current) {
      pullDownRefereshStatus = pullDownRefereshStatusRef.current;
    }

    if (pageListWrap && pullDownRefereshStatus && dataLoading === false) {
      const touchData = e.touches[0];
      const currentY = touchData.pageY;

      if (startPositionY > 0) {
        const pullDownHeight = currentY - startPositionY;
        const threshold = pullDownToRefreshThreshold ?? 60;
        if (pullDownHeight > 0 && pullDownHeight < threshold) {
          pullDownRefereshStatus.style.display = 'flex';
          pageListWrap.style.transform = `translateY(${pullDownHeight / 10}px)`;

          if (pullDownHeight > (threshold / 2)) {
            pullDownRefereshStatus.children[0].innerHTML = '松开立即刷新';
          }
        }
      }
    }
  };

  const pageListWrapTouchEnd = (e: any) => {
    let pageListWrap: HTMLDivElement | undefined;
    if (pageListWrapRef && pageListWrapRef.current) {
      pageListWrap = pageListWrapRef.current;
    }

    let pullDownRefereshStatus: HTMLDivElement | undefined;
    if (pullDownRefereshStatusRef && pullDownRefereshStatusRef.current) {
      pullDownRefereshStatus = pullDownRefereshStatusRef.current;
    }

    if (pageListWrap && pullDownRefereshStatus && dataLoading === false) {
      const statusText = pullDownRefereshStatus.children[0].innerHTML;
      if (statusText === '松开立即刷新') {
        pullDownRefereshStatus.children[0].innerHTML = '刷新中...';
        setListRefreshing(true);
      }
    }
  };

  const dataLoadingSuccessCallback = () => {
    if (dataLoadingSuccess === true) {
      setDataLoadingSuccess(false);
    }
  };

  const listRefreshingSuccessCallback = () => {
    if (listRefreshingSuccess === true) {
      let pageListWrap: HTMLDivElement | undefined;
      if (pageListWrapRef && pageListWrapRef.current) {
        pageListWrap = pageListWrapRef.current;
      }

      let pullDownRefereshStatus: HTMLDivElement | undefined;
      if (pullDownRefereshStatusRef && pullDownRefereshStatusRef.current) {
        pullDownRefereshStatus = pullDownRefereshStatusRef.current;
      }

      if (pageListWrap && pullDownRefereshStatus) {
        pullDownRefereshStatus.children[0].innerHTML = '完成刷新';
        setTimeout(() => {
          if (pageListWrap && pullDownRefereshStatus) {
            pageListWrap.style.transition = 'transform 0.5s ease 1s';
            pageListWrap.style.transform = 'translateY(0px)';
            pullDownRefereshStatus.style.display = 'none';
            pullDownRefereshStatus.children[0].innerHTML = '下拉刷新';
          }
        }, 300);
      }

      setListRefreshingSuccess(false);
      setListRefreshingCallbackSuccess(true);
    }
  };

  // 初始加载，请求第一页数据
  useEffect(() => {
    // console.log('1、初始加载，请求第一页数据');
    loadNextPageData(pageNum);
  }, []);

  // 容器的 scroll 滚动事件的订阅及取消
  useLayoutEffect(() => {
    let pageListWrap: HTMLDivElement | undefined;
    if (pageListWrapRef && pageListWrapRef.current) {
      pageListWrap = pageListWrapRef.current;
    }

    if (enableScrollingAutoLoad === true && dataLoading === false) {
      // console.log('2、容器的 scroll 滚动事件（订阅）');
      if (pageListWrap) {
        pageListWrap.addEventListener('scroll', pageListWrapScroll);
      }
    }

    return () => {
      if (enableScrollingAutoLoad === true && dataLoading === false) {
        // console.log('2、容器的 scroll 滚动事件（取消）');
        if (pageListWrap) {
          pageListWrap.removeEventListener('scroll', pageListWrapScroll);
        }
      }
    };
  }, [dataLoading]);

  // 容器的 touchstart、touchmove 及 touchend 事件的订阅及取消
  useLayoutEffect(() => {
    let pageListWrap: HTMLDivElement | undefined;
    if (pageListWrapRef && pageListWrapRef.current) {
      pageListWrap = pageListWrapRef.current;
    }

    if (enablePullDownToRefresh === true) {
      // console.log('3、容器的 touchstart、touchmove 及 touchend 事件（订阅）');
      if (pageListWrap) {
        pageListWrap.addEventListener('touchstart', pageListWrapTouchStart);
        pageListWrap.addEventListener('touchmove', pageListWrapTouchMove);
        pageListWrap.addEventListener('touchend', pageListWrapTouchEnd);
      }
    }

    return () => {
      if (enablePullDownToRefresh === true) {
        // console.log('3、容器的 touchstart、touchmove 及 touchend 事件（取消）');
        if (pageListWrap) {
          pageListWrap.removeEventListener('touchstart', pageListWrapTouchStart);
          pageListWrap.removeEventListener('touchmove', pageListWrapTouchMove);
          pageListWrap.removeEventListener('touchend', pageListWrapTouchEnd);
        }
      }
    };
  });

  // 执行列表下拉刷新操作
  useLayoutEffect(() => {
    if (listRefreshing === true) {
      // console.log('4、执行列表下拉刷新操作');
      loadNextPageData(1);
    }
  }, [listRefreshing]);

  // 处理数据请求返回的结果
  useLayoutEffect(() => {
    if ((dataLoading === false || (listRefreshing === true && listRefreshingSuccess === true))
      && pagedResult) {
      // console.log('5、处理数据请求返回的结果');
      setDataResult();
      setDataLoadingSuccess(true);
    }
  }, [dataLoading, listRefreshingSuccess, pagedResult]);

  // 重置下拉刷新的状态
  useLayoutEffect(() => {
    if (listRefreshing === true
      && listRefreshingSuccess === false
      && listRefreshingCallbackSuccess === true) {
      // console.log('6、重置下拉刷新的状态');
      setListRefreshing(false);
      setListRefreshingCallbackSuccess(false);
    }
  }, [listRefreshing, listRefreshingSuccess, listRefreshingCallbackSuccess]);

  // console.log('----------------------------------------------');
  // console.log(`pageNum: ${pageNum}`);
  // console.log(`dataLoading: ${dataLoading}`);
  // console.log(`pagedResult: ${pagedResult}`);
  // console.log(`dataListPerPage: ${dataListPerPage}`);
  // console.log(`totalCount: ${totalCount}`);
  // console.log(`totalPages: ${totalPages}`);
  // console.log(`startPositionY: ${startPositionY}`);
  // console.log(`listRefreshing: ${listRefreshing}`);
  // console.log(`listRefreshingSuccess: ${listRefreshingSuccess}`);
  // console.log('----------------------------------------------');

  return (
    <div className="paging_list" ref={pageListWrapRef}>
      <div
        className="pull_down_refresh_status"
        ref={pullDownRefereshStatusRef}
        style={{ minHeight: `${pullDownToRefreshThreshold}px` }}
      >
        <span>下拉刷新</span>
      </div>

      <ListView
        layoutType={layoutType ?? 'ROW'}
        pageNumber={pageNum}
        pageSize={pageSize}
        dataLoadingSuccess={dataLoadingSuccess}
        dataLoadingSuccessCallback={dataLoadingSuccessCallback}
        dataListPerPage={dataListPerPage}
        totalCount={totalCount}
        listRefreshingSuccess={listRefreshingSuccess}
        listRefreshingSuccessCallback={listRefreshingSuccessCallback}
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
  scrollingAutoLoadThreshold: 160,
  enablePullDownToRefresh: false,
  pullDownToRefreshThreshold: 40,
};

export default PagingList;
