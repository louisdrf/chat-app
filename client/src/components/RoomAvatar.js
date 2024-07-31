import { Avatar } from 'antd'
import { minidenticon } from 'minidenticons'


export const RoomAvatar = ({ roomName, size }) => {
    return <Avatar
            style={{ backgroundColor: 'rgba(128, 128, 128, 0.1)' }}
            size={ size ? size : 42 }
            shape="circle"
            src={`data:image/svg+xml;base64,${btoa(minidenticon(roomName, 80, 50))}`}
        />
}