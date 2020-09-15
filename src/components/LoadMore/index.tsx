import React from 'react';
import './style.less';

export interface ILoadMoreProps {
  pageNumber: Number; // 当前页
  totalPages: Number; // 总页数
  dataLoading: Boolean; // 数据加载中
  loadingText?: String; // 加载时显示的文本
  loadBtnText?: String; // 加载下一页按钮的文本
  noMoreText?: String; // 所有页数据均已加载的提示文本
  onLoadBtnClick: Function; // 加载下一页按钮的回调函数
}

const LoadMore: React.FC<ILoadMoreProps> = (props: ILoadMoreProps) => {
  const {
    pageNumber, totalPages, dataLoading,
    loadingText, loadBtnText, noMoreText,
    onLoadBtnClick,
  } = props;

  let content;

  if (dataLoading === true) {
    content = (
      <div className="load_status_text">
        <span>{loadingText}</span>
      </div>
    );
  }

  if (dataLoading === false && pageNumber < totalPages) {
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
