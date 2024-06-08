import {Card, Col, Input, Row, Typography} from 'antd';
import React, {useState} from 'react';
import {StreamEventCard} from "./StreamEventCard";

function StreamEvents({}) {
    const [streamIn, setStreamIn] = useState();
    const [streamOut, setStreamOut] = useState();


    const getLicensesFromStream = () => {

    }

    return (
        <Row gutter={16}>
            <Col span={24} xl={12}>
                <Card title="Nhập xe">
                    <StreamEventCard/>
                </Card>
            </Col>
            <Col span={24} xl={12}>
                <Card title="Xuất xe">
                    <img width={400} src={streamOut}/>
                    <Typography.Title level={5}>Stream: {streamOut}</Typography.Title>
                    <Input value={streamOut} onChange={(e) => setStreamOut(e.target.value)}/>
                </Card>
            </Col>
        </Row>
    );
}

export default StreamEvents;
