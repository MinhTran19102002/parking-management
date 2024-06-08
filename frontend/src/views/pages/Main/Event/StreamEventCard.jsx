import React, {useState} from "react";
import {Button, Input, Typography} from "antd";
import {useQuery} from "@tanstack/react-query";
import {MediaServerApi} from "~/api";

export const StreamEventCard = () => {
    const [stream, setStream] = useState();
    const {data, refetch} = useQuery({
        queryKey: ['Get', 'Data', 'FromStream'], queryFn: async () => {
            let rs;
            try {
                const [data1, data2] = await Promise.all(MediaServerApi.getLicensesFromStream(), MediaServerApi.captureImageFromStream(),);
                console.log(data1, data2);
                rs = {
                    licenses: data1.result || [],
                }
            } catch {

            }
            return rs;
        }
    })

    return (<div className={'w-100'}>
        <img width={400} src={stream}
             alt={'No Img'}/>
        <Typography.Title level={5}>Stream: {stream}</Typography.Title>
        <Input value={stream} onChange={(e) => setStream(e.target.value)}/>
        <Button onClick={() => refetch()}>Cắt hình</Button>
    </div>)
}
