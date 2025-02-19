import React, { useEffect, useState } from "react";
import { Input, Spin, Button, Modal, message, Card, Col, Table, Row, Tag } from "antd";
import ServiceHistory from "../service/serviceHistory";
import useAsync from "../hook/useAsync";
const { TextArea } = Input;

const HistoryNote = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 6,
    current: 1,
  });
  const [data, setData] = useState([]);
  const { data: dataHistory, loading: loadingHistory } = useAsync(() => ServiceHistory.getAllHistory())

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  
  useEffect(() => {
    setData(dataHistory)
  }, [dataHistory])
  console.log(data);

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Thời gian",
      dataIndex: "use_time",
      key: "use_time",

    },
    {
      title: "Người dùng",
      dataIndex: "user_gpon",
      key: "user_gpon",

    },
    {
      title: "Khai thác GPON",
      dataIndex: "gpon_type",
      key: "gpon_type",
      render: (gpon_type) => {
        return (
          <Tag
            color={gpon_type === "GPON ALU" ? "green" : gpon_type === "GPON HW" || gpon_type === "GPON MINI HW" ? "blue" : gpon_type === "GPON ZTE" || gpon_type === "GPON MINI ZTE" ? "yellow" : "red"}>
            {gpon_type}
          </Tag>
        )
      }
    },
    {
      title: "Sử dụng chức năng",
      dataIndex: "feature_gpon",
      key: "feature_gpon",
    },
    {
      title: "Ip thiết bị",
      dataIndex: "ip_gpon",
      key: "ip_gpon",
    },

  ]
  // Hàm gọi API để lấy dữ liệu lịch sử
  //   const fetchHistory = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await ServiceHistory.getAllHistory();
  //       console.log(response);

  //       // Chuyển danh sách lịch sử thành một chuỗi
  //       const historyText = response.map((item) => item.history).join("\n");
  //       setHistory(historyText);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy dữ liệu lịch sử:", error);
  //       setHistory("Không thể tải lịch sử!");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // Hàm gọi API để xóa lịch sử
  const deleteHistory = async () => {
    try {
      const response = await ServiceHistory.deleteAllHistory()
      console.log(response);

      if (response.detail.msg === "success") {
        message.success("Xóa lịch sử thành công!");
        setData(response.detail.data); // Xóa lịch sử trên giao diện
      } else {
        message.error("Lỗi khi xóa lịch sử!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử:", error);
      message.error("Lỗi kết nối đến máy chủ!");
    } finally {
      setIsModalVisible(false); // Ẩn modal sau khi xóa
    }
  };

  // Gọi API khi component được render
  //   useEffect(() => {
  //     fetchHistory();
  //   }, []);

  return (


    <div className="layout-content">
      <Row gutter={[24, 0]}>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full" title="Chức năng">
            <Button type="danger" onClick={() => setIsModalVisible(true)}> Xóa lịch sử</Button>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Table pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ["5", "6", "10", "20", "50", "100"],
          }}
            onChange={handleTableChange}
            loading={loadingHistory}
            dataSource={data}
            columns={columns} />
        </Col>
      </Row>
      <Modal
        title="Xác nhận xóa lịch sử"
        visible={isModalVisible}
        onOk={deleteHistory}
        onCancel={() => setIsModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa toàn bộ lịch sử?</p>
      </Modal>
    </div>

  );
};

export default HistoryNote;
