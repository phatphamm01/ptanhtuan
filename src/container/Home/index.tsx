import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Container from "designs/Container";
import { FC, useEffect, useState } from "react";
import fetchProduct from "services/product";
import styled from "styled-components";
import tw from "twin.macro";
import EditableCell, { Item } from "./components/EditableCell";

const { Search } = Input;

const ActionBox = styled.div`
  ${tw`flex justify-between lg:mx-4 gap-2 `}
`;
const Header = styled.div`
  ${tw`bg-red-400 py-3 px-4 font-bold text-xl text-white`}
`;
const SearchBox = styled.div`
  ${tw`my-5`}
`;
const CreateButton = styled.div`
  ${tw`mb-4 flex justify-end`}
`;
const TableBox = styled.div`
  ${tw``}
  * {
    ${tw`lg:text-2xl text-lg`}
  }

  .ant-table-content {
    overflow-x: auto;
  }

  .ant-table-thead .ant-table-cell {
    text-align: center;
  }
`;

const numberToMoney = (num: any) => {
  if (num === 0) {
    return 0;
  }
  if (num) {
    return (((num as number).toFixed(0) + "") as string).replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      "$1,"
    );
  }
};

function removeAccents(str: string) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

function titleCase(str: string) {
  let sentence = str.trim().toLowerCase().split(" ");

  let newString: string[] = [];

  for (var item of sentence) {
    let it = item[0].toUpperCase() + item.slice(1);
    newString.push(it);
  }

  return newString.join(" ");
}

const searchText = (item: any, value: string) => {
  for (let key in item) {
    if (item[key] == null) {
      continue;
    }

    let value1 = removeAccents(item[key].toString().toUpperCase());
    let value2 = removeAccents(value.toString().toUpperCase());

    if (value1.indexOf(value2) !== -1) {
      return true;
    }
  }
};

const wildCardSearch = (list: any, input: any) => {
  list = list.filter((item: any) => searchText(item, input));
  return list;
};

const Home = () => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [list, setList] = useState<any>([]);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    handleGetAllProduct();
  }, []);

  useEffect(() => {
    setList(data);
  }, [data]);

  const handleGetAllProduct = async () => {
    const data = await getAllProductApi();

    setData(data);
  };

  const getAllProductApi = async () => {
    const { data } = await fetchProduct.get();
    return data;
  };

  const deleteProductByIdApi = async (id: string) => {
    const { data } = await fetchProduct.delete(id);
    return data;
  };

  const addProductApi = async (payload: any) => {
    const { data } = await fetchProduct.post(payload);
    return data;
  };

  const updateProductApi = async (id: string, payload: any) => {
    const { data } = await fetchProduct.patch(id, payload);
    return data;
  };

  const onDelete = async (id: string) => {
    try {
      await deleteProductByIdApi(id);
      handleGetAllProduct();
      message.success("Xóa thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const isEditing = (record: Item) => record._id === editingKey;

  const edit = (record: Partial<Item> & { _id: React.Key }) => {
    form1.setFieldsValue({ name: "", priceIn: "", priceOut: "", ...record });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (record: any) => {
    try {
      const row = (await form1.validateFields()) as Item;
      await handleUpdate(record._id, row);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await addProductApi(values);
      handleGetAllProduct();
      message.success("Thêm thành công");
      form2.resetFields();
      handleOk();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id: string, values: any) => {
    try {
      await updateProductApi(id, values);
      message.success("Cập nhập thành công");
      handleGetAllProduct();
      handleOk();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      editable: true,
      sorter: (a: any, b: any) =>
        a.name[0].charCodeAt(0) - b.name[0].charCodeAt(0),
      render: (_: any, record: Item) => {
        return <span>{record.name ? titleCase(String(record.name)) : ""}</span>;
      },
    },
    {
      title: "Giá mua vô",
      dataIndex: "priceIn",
      width: "20%",
      editable: true,
      sorter: (a: any, b: any) => a.priceIn - b.priceIn,
      render: (_: any, record: Item) => {
        return <span>{record.priceIn}</span>;
      },
    },
    {
      title: "Giá bán ra",
      dataIndex: "priceOut",
      width: "20%",
      editable: true,
      sorter: (a: any, b: any) => a.priceOut - b.priceOut,
      render: (_: any, record: Item) => {
        return <span>{record.priceOut}</span>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "operation",
      width: "15%",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <ActionBox>
            <Typography.Link onClick={() => save(record)}>
              <SaveOutlined />
              Lưu
            </Typography.Link>
            <Popconfirm title="Bạn có chắc chắn muốn thoát" onConfirm={cancel}>
              <Typography.Link style={{ color: "gray" }}>
                <CloseCircleOutlined />
                Hủy
              </Typography.Link>
            </Popconfirm>
          </ActionBox>
        ) : (
          <ActionBox>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <EditOutlined />
              Sửa
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => onDelete(record._id)}
              style={{ color: "red" }}
            >
              <DeleteOutlined />
              Xóa
            </Typography.Link>
          </ActionBox>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onSearch = (e: any) => {
    const value = e.currentTarget.value;

    const dataNew = wildCardSearch(data, value);

    setList(dataNew);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Header>Cửa hàng phụ tùng Anh Tuấn</Header>
      <Container>
        <SearchBox>
          <Search
            placeholder="Tìm kiếm sản phẩm"
            size="large"
            onChange={(e) => onSearch(e)}
          />
        </SearchBox>
        <CreateButton>
          <Button type="primary" onClick={showModal}>
            Thêm sản phẩm
          </Button>
        </CreateButton>
        <TableBox>
          <Form form={form1} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={list}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
            />
          </Form>
        </TableBox>
      </Container>
      <Modal
        title="Thêm sản phẩm"
        visible={isModalVisible}
        onOk={form2.submit}
        onCancel={handleCancel}
      >
        <Form form={form2} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Bánh xe ..." />
          </Form.Item>
          <Form.Item
            label="Giá nhập vào"
            name="priceIn"
            rules={[{ required: true, message: "Vui lòng nhập giá nhập vào" }]}
          >
            <Input placeholder="100,000" />
          </Form.Item>
          <Form.Item
            label="Giá bán ra"
            name="priceOut"
            rules={[{ required: true, message: "Vui lòng nhập giá bán ra" }]}
          >
            <Input placeholder="200,000" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Home;
