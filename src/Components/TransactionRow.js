import { css } from "@emotion/css";
import { message } from "antd";

export const TransactionRow = (props) => {
  const { tx, onDeleteItem } = props;
  return (
    <div
      className={css`
        display: flex;
        background-color: white;
        /* height: 60px; */
        width: 100%;
        margin-top: 24px;
        border-radius: 8px;
        padding: 16px;
        align-items: center;
        h2,
        h4 {
          margin: 0;
        }
      `}
    >
      <div
        style={{backgroundColor: "green", marginRight: "16px",borderRadius: "50%",overflow:"hidden", width: "80px", flexShrink: 0 }}
      >
        <img src={tx.imageUrl} alt="txImage" style={{width: "80px",height: "80px"}} />
      </div>
      <div
        className={css`
          flex-shrink: 0;
        `}
      >
        <h2>{tx.category}</h2>
        <h3>{tx?.title}</h3>
        <h4>{tx.date}</h4>
      </div>
      <div
        className={css`
          display: flex;
          justify-content: flex-end;
          width: 100%;
          color: ${tx.amount > 0 ? "green" : "red"};
        `}
      >
        {tx.amount.toLocaleString()}
      </div>
      <div
        className={css`
          margin-left: 16px;
        `}
      >
        <div
          className={css`
            width: 32px;
            height: 32px;
            background-color: gray;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          `}
          onClick={async () => {
            await onDeleteItem(tx.id);
            message.success("Delete item :" + tx.id);
          }}
        >
          X
        </div>
      </div>
    </div>
  );
};
