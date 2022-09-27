import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { css } from "@emotion/css";
import { Modal, Button, Input, Select, DatePicker, message } from "antd";
import { TransactionRow } from "./Components/TransactionRow";
import { useEffect, useState } from "react";
import { CreateModal } from "./Components/CreateModal";
import styled from "@emotion/styled";
import axios from "axios";
import { app, googleProvider, db } from "./firebase";
import {
  getDoc,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

axios.defaults.baseURL = "https://backend-expressjs-real.herokuapp.com";

const PageContainer = styled.div`
  background-color: aliceblue;
  height: 100vh;
  width: 100vw;
  padding-top: 100px;
`;

const PageContent = styled.div`
  width: 80%;
  margin: auto;
  max-width: 500px;
`;

const FlexBox = styled.div`
  display: flex;
`;

const getTokenHeader = (token) => {
  return {
    headers: {
      authorization: "Bearer " + token,
    },
  };
};

function App() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [search, setSearch] = useState("");
  const [token, setToken] = useState();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [user, setUser] = useState();

  const createTransactions = async (tx) => {
    let transaction = {
      ownerId: user.uid,
      ...tx,
    };
    const response = await addDoc(collection(db, "transactions"), transaction);
  };

  const fetchTransactions = async () => {
    const response = await axios.get(
      "/api/transactions",
      getTokenHeader(token)
    );

    setTransactions(response.data.transactions);
  };
  // const fetchTransaction = async () => {
  //   let transactions = [];
  //   const querySnapshot = getDocs(collection(db, "transactions"));

  //   (await querySnapshot).forEach((doc) => {
  //     const txran = {id:doc.id, ... doc.data()}
  //     transactions.push(txran);
  //   });
  //   setTransactions(transactions);
  // };

  useEffect(() => {
    if (user) {
      const queryDB = query(
        collection(db, "transactions"),
        where("ownerId", "==", user.uid)
      );
      onSnapshot(queryDB, (querySnapshot) => {
        let transactions = [];

        querySnapshot.forEach((doc) => {
          const txran = { id: doc.id, ...doc.data() };
          transactions.push(txran);
        });
        setTransactions(transactions);
      });
    }
  }, [user]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    // fetchTransaction();
  }, []);

  useEffect(() => {
    const oldToken = localStorage.getItem("token");
    if (oldToken) {
      setToken(oldToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const onDeleteItem = async (_id) => {
    const deleteResponse = await deleteDoc(doc(db, "transactions", _id));
    setTransactions(transactions.filter((tx) => tx.id !== _id));
  };

  const filteredTransaction = transactions.filter((tx) => {
    if(tx.title){
      return tx.category.includes(search) ||  tx.title.includes(search) ; 
    }
    return tx.category.includes(search) ;
  });
  return (
    <PageContainer>
      <div
        className={css`
          display: flex;
          width: 100%;
          background-color: white;
          position: fixed;
          top: 0;
          justify-content: flex-end;
          padding: 16px;
        `}
      >
        {user ? (
          <div>
            {user.displayName}{" "}
            <Button
              onClick={async () => {
                const auth = getAuth();
                const response = await signOut(auth);
                setUser();
                window.location.reload();
              }}
            >
              SignOut
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              setLoginModalVisible(true);
            }}
          >
            Login
          </Button>
        )}
      </div>
      <PageContent>
        <Modal
          title="Login"
          visible={loginModalVisible}
          onOk={() => {
            setLoginModalVisible(false);
          }}
          onCancel={() => {
            setLoginModalVisible(false);
          }}
        >
          <Button
            onClick={async () => {
              try {
                const auth = getAuth();
                const data = await signInWithPopup(auth, googleProvider);
                setUser(data.user);
                setLoginModalVisible(false);
                message.success("Login success!", 1);
              } catch (err) {
                alert("FOUND ERROR :", err);
              }
            }}
          >
            Login by Gmail
          </Button>
        </Modal>
        <FlexBox>
          <Input
            placeholder="Search by text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button onClick={() => setCreateModalVisible(true)}>Create</Button>
        </FlexBox>
        {transactions.length === 0 ? (
          <FlexBox
            className={css`
              padding-top: 3rem;
              justify-content: center;
            `}
          >
            <h1>No data</h1>
          </FlexBox>
        ) : (
          ""
        )}
        {filteredTransaction.map((tx) => (
          <TransactionRow tx={tx} onDeleteItem={onDeleteItem} />
        ))}
      </PageContent>
      <CreateModal
        visible={createModalVisible}
        onCreate={async (tx) => {
          await createTransactions(tx);
          message.success("Create transaction success");
          setTransactions([tx, ...transactions]);
          setCreateModalVisible(false);
        }}
        onClose={() => setCreateModalVisible(false)}
      />
    </PageContainer>
  );
}

export default App;
