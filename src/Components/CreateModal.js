import { css } from "@emotion/css";
import { DatePicker, Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const CreateModal = (props) => {
  const { visible, onCreate, onClose } = props;
  const [category, setCategory] = useState("Shopping");
  const [date, setDate] = useState();
  const [amount, setAmount] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setCategory("Shopping");
    setDate();
    setAmount();
  }, [visible]);

  return (
    <Modal
      
      destroyOnClose
      title="Create Transaction"
      visible={visible}
      onOk={() => {
        const incomeCategory = ["Salary"];
        const type = incomeCategory.includes(category) ? "income" : "expense";
        const newTx = {
          type,
          title,
          category,
          date,
          imageUrl,
          amount: type === "expense" ? amount * -1 : amount,
        };
        onCreate(newTx);
      }}
      onCancel={() => {
        onClose();
      }}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          height: 200px;
          justify-content: space-between;
        `}
      >
        <Select
          placeholder="Select your category"
          value={category}
          onChange={(e) => {
            setCategory(e);
          }}
        >
          <Select.Option value="Shopping">Shopping</Select.Option>
          <Select.Option value="Salary">Salary</Select.Option>
        </Select>
        <DatePicker
          onChange={(e) => {
            setDate(e.format("DD MMM YYYY"));
          }}
        />
        <Input
          value={title}
          placeholder="Title"
          type="text"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          value={amount}
          placeholder="Input Amount"
          type="number"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const storageRef = ref(storage, "images/" + file.name);
            message.loading({ content: "uploading image", key: "image" });
            uploadBytes(storageRef, file).then((result) => {
              getDownloadURL(result.ref).then((url) => {
                message.success({ content: "upload success", key: "image" });
                setImageUrl(url);
              });
            });
          }}
        />
      </div>
    </Modal>
  );
};
