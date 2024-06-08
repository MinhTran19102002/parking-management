import React, {useState} from "react";
import {Button, Divider, Input, Radio, Typography} from "antd";
import {useQuery} from "@tanstack/react-query";
import {MediaServerApi} from "~/api";

export const StreamEventCard = () => {
    const [stream, setStream] = useState();
    const {data: {licenses = [], image}, refetch} = useQuery({
        initialData: {}, queryKey: ['Get', 'Data', 'FromStream'], queryFn: async () => {
            let rs;
            try {
                const [data1, data2] = await Promise.allSettled(MediaServerApi.getLicensesFromStream(), MediaServerApi.captureImageFromStream(),);
                console.log(data1, data2);
                rs = {
                    licenses: data1.result || [], image: data2,
                }
            } catch {

            }
            return rs;
        }
    });

    return (<div className={'w-100'}>
        <img width={400} src={stream}
             alt={'No Img'}/>
        <Typography.Title level={5}>Stream đã nhập: {stream}</Typography.Title>
        <Input value={stream} onChange={(e) => setStream(e.target.value)}/>
        <Divider/>
        <Button onClick={() => refetch()}>Cắt hình</Button>
        <Divider/>
        <Typography.Title level={5}>Các biển số xe được nhận diện:</Typography.Title>
        <Radio.Group options={licenses.map(el => {
            return {
                label: el, value: el,
            }
        })}/>
    </div>)
}
