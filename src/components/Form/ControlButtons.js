import { Button, Card, Space } from "antd";

const ControlButtons = ({ handleRun, runLoading, handleClear }) => (
    <Card bordered={false} className="criclebox h-full card-center">
        <Space direction="horizontal">
            <Button type="primary" onClick={handleRun} loading={runLoading}>
                {runLoading ? "Loading" : "Run"}
            </Button>
            <Button type="primary" danger onClick={handleClear}>
                Clear Terminal
            </Button>
        </Space>
    </Card>
);
export default ControlButtons