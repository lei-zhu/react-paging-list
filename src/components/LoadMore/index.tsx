import React from 'react';
import './style.less';

export interface ILoadMoreOptions {
  loadingText?: string; // 加载时显示的文本
  loadBtnText?: string; // 加载下一页按钮的文本
  noMoreText?: string; // 所有页数据均已加载的提示文本
}

export interface ILoadMoreProps {
  pageNumber: number; // 当前页码
  dataLoading: boolean; // 数据加载中
  totalCount: number; // 总记录数
  totalPages: number; // 总页数
  options: ILoadMoreOptions;
  onLoadBtnClick: Function; // 加载下一页按钮的回调函数
}

const LoadMore: React.FC<ILoadMoreProps> = (props: ILoadMoreProps) => {
  const {
    pageNumber, dataLoading, totalCount, totalPages,
    options, onLoadBtnClick,
  } = props;
  const { loadingText, loadBtnText, noMoreText } = options;

  if ((dataLoading === false && pageNumber === 1 && totalCount === 0 && totalPages === 0)
    || (dataLoading === true && pageNumber === 1 && totalCount === 0)) {
    return (
      <div className="rpl_load_more">
        <></>
      </div>
    );
  }

  if (dataLoading === true && pageNumber >= 1 && totalCount > 0) {
    return (
      <div className="rpl_load_more">
        <div className="load_status_text">
          <span>{loadingText}</span>
        </div>
      </div>
    );
  }

  let content;
  if (dataLoading === false
    && totalCount > 0
    && pageNumber < totalPages) {
    content = (
      <div
        className="load_btn"
        onClick={() => onLoadBtnClick()}
        aria-hidden="true"
      >
        <span>{loadBtnText}</span>
      </div>
    );
  } else {
    content = (
      <div className="load_status_text">
        <span>{noMoreText}</span>
      </div>
    );
  }

  return (
    <div className="rpl_load_more">{content}</div>
  );
};

LoadMore.defaultProps = {
  options: {
    loadingText: '加载中...',
    loadBtnText: '加载更多',
    noMoreText: '没有了',
  },
};

export default LoadMore;
