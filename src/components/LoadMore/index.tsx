import React from 'react';
import './style.less';

export interface ILoadMoreProps {
  pageNumber: number; // 当前页
  pageSize: number; // 每页记录数
  dataLoading: boolean; // 数据加载中
  totalCount: number; // 总记录数
  loadingText?: string; // 加载时显示的文本
  loadBtnText?: string; // 加载下一页按钮的文本
  noMoreText?: string; // 所有页数据均已加载的提示文本
  onLoadBtnClick: Function; // 加载下一页按钮的回调函数
}

const LoadMore: React.FC<ILoadMoreProps> = (props: ILoadMoreProps) => {
  const {
    pageNumber, pageSize, dataLoading, totalCount,
    loadingText, loadBtnText, noMoreText,
    onLoadBtnClick,
  } = props;

  const totalPages = Math.floor((totalCount % pageSize === 0)
    ? (totalCount / pageSize)
    : (totalCount / pageSize + 1));

  let content;
  if (dataLoading === true) {
    return (
      <div className="rpl_load_more">
        <div className="load_status_text">
          <span>{loadingText}</span>
        </div>
      </div>
    );
  }

  if (dataLoading === false && totalCount === 0) {
    return (
      <div className="rpl_load_more">
        <></>
      </div>
    );
  }

  if (dataLoading === false
    && totalCount > 0
    && pageNumber < totalPages) {
    content = (
      <div
        className="load_btn"
        role="button"
        tabIndex={0}
        onClick={() => onLoadBtnClick()}
        onKeyDown={() => onLoadBtnClick()}
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
  loadingText: '加载中...',
  loadBtnText: '加载更多',
  noMoreText: '没有了',
};

export default LoadMore;
