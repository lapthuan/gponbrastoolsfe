import { Button, Card, Col, Form, InputNumber, Row, Space, Table } from 'antd';
import SubmitVlanIMS from '../components/submit/submitVlanIMS.js';


const VlanIms = () => {
    const {
        form,
        columns,
        dataTable,
        editTab,
        setEditTab,
        idEdit,
        loading,
        handleEdit,
        handleSubmit
    } = SubmitVlanIMS();

    return (
        <div className="layout-content">


            <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
                    {editTab === false ? (<Card title="Thêm dữ liệu" bordered={true}  >
                        <Form
                            form={form}
                            labelCol={{ span: 8 }}
                            initialValues={{
                                size: 'small',
                            }}
                            layout="horizontal"
                            size={'small'}
                            className='form-card'
                        >

                            <Form.Item label="Vlan IMS :" name="number" rules={[{ required: true, message: 'Vui lòng nhập Vlan IMS!' }]} className='select-item'>
                                <InputNumber type='number' />
                            </Form.Item>

                            <Button type='primary' onClick={handleSubmit}>Thêm</Button>
                        </Form>
                    </Card>) : (<Card title="Sửa dữ liệu" bordered={true}  >

                        <i>Sửa dữ liệu của id: {idEdit.slice(-6)}</i>
                        <Form
                            form={form}
                            labelCol={{ span: 8 }}
                            initialValues={{
                                size: 'small',
                            }}
                            layout="horizontal"
                            size={'small'}
                            className='form-card'
                        >
                            <Form.Item label="Vlan IMS :" name="number" rules={[{ required: true, message: 'Vui lòng nhập Vlan IMS!' }]} className='select-item'>
                                <InputNumber type='number' />
                            </Form.Item>
                            <Space size="middle">
                                <Button type='primary' onClick={handleEdit}>Sửa</Button>
                                <Button onClick={() => setEditTab(false)}>Trở về thêm</Button>

                            </Space>
                        </Form>
                    </Card>)}

                </Col>
                <Col xs={24} sm={24} md={12} lg={18} xl={18} className="mb-24">
                    <Card bordered={true}  >
                        <Table pagination={{ pageSize: 5 }} columns={columns} dataSource={dataTable.slice().reverse()} loading={loading} />
                    </Card>
                </Col>
            </Row>

        </div>


    );
}

export default VlanIms;